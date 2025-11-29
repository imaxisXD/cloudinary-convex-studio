import { action, query } from "./_generated/server";
import { components } from "./_generated/api";
import { CloudinaryClient } from "@imaxis/cloudinary-convex";
import {
  vAssetResponse,
  vCloudinaryUploadResponse,
  vTransformation,
} from "@imaxis/cloudinary-convex/lib";
import { v } from "convex/values";

// Helper to get environment variables
function getEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

// Check if configuration is set
export const checkConfig = query({
  args: {},
  returns: v.boolean(),
  handler: async () => {
    const env = getEnv();
    return !!env;
  },
});

// Create a client instance (helper)
function getClient() {
  const env = getEnv();
  if (!env) {
    throw new Error("Cloudinary environment variables not set");
  }

  return new CloudinaryClient(components.cloudinary, env);
}

// Upload an image (base64 - for files under ~10MB)
export const uploadImage = action({
  args: {
    base64Data: v.string(),
    filename: v.optional(v.string()),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cloudinary = getClient();
    return await cloudinary.upload(ctx, args.base64Data, {
      filename: args.filename,
      folder: args.folder || "uploads",
      tags: ["user-content"],
    });
  },
});

// Generate signed credentials for direct upload
export const getUploadCredentials = action({
  args: {
    filename: v.optional(v.string()),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cloudinary = getClient();
    return await cloudinary.generateUploadCredentials(ctx, {
      filename: args.filename,
      folder: args.folder || "large-uploads",
    });
  },
});

// Finalize direct upload and store metadata
export const finalizeUpload = action({
  args: {
    publicId: v.string(),
    uploadResult: vCloudinaryUploadResponse,
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // We can use the component's internal mutation via the client wrapper if available,
    // or call the component API directly. The docs show using `ctx.runMutation`
    // but the CloudinaryClient wrapper might not expose finalizeUpload directly in the same way
    // or it might be internal.
    // Checking docs:
    // "return await ctx.runMutation(components.cloudinary.lib.finalizeUpload, { ... });"
    // Let's use the raw call as shown in docs for "Direct Component Usage" or see if client has it.
    // The docs for "Direct Component Usage" use `ctx.runMutation(components.cloudinary.lib.finalizeUpload, ...)`

    // However, looking at the docs again: "Using CloudinaryClient (Recommended)" section doesn't explicitly show finalizeUpload method on the client instance for step 3 in the main example,
    // but the "Direct Component Usage" does.
    // Actually, looking at `node_modules/@imaxis/cloudinary-convex/README.md` content provided earlier:
    // It doesn't list `finalizeUpload` on `CloudinaryClient`.
    // But it does show `uploadDirect` which handles everything.
    // The plan asked for `getUploadCredentials` & `finalizeUpload` for manual control (implied by "implementing both...").
    // Let's stick to the manual flow for clarity and as requested in plan (split actions).

    return await ctx.runMutation(components.cloudinary.lib.finalizeUpload, {
      publicId: args.publicId,
      uploadResult: args.uploadResult,
      userId: args.userId,
    });
  },
});

// List images
export const getImages = query({
  args: {},
  returns: v.array(vAssetResponse),
  handler: async (ctx) => {
    // We can't use the client here because it requires env vars which might not be set during query if we used them for client init?
    // Actually getEnv() checks env vars.
    // Also, `list` is a query, but `CloudinaryClient` seems to wrap components.
    // The docs say: `return await cloudinary.list(ctx, ...);`
    // However, we need to be careful if we want to list images even if env vars are missing?
    // No, if env vars are missing we can't really list effectively if we need to sign things?
    // Wait, listing from DB doesn't need Cloudinary creds necessarily if it's just querying the convex table.
    // But the component might enforce it.
    // Let's try to instantiate client safe-ishly or just use the component query directly if possible.
    // Docs say: `const cloudinary = new CloudinaryClient(components.cloudinary, { ... });`
    // If I just want to list from DB, maybe I don't need creds?
    // But the constructor takes creds.

    // Let's try to use the client. If it fails, we return empty list or handle error in frontend.
    // But for `checkConfig` to work, we want to avoid crashing here.

    const env = getEnv();
    if (!env) {
      return [];
    }

    const cloudinary = new CloudinaryClient(components.cloudinary, env);

    return await cloudinary.list(ctx, {
      limit: 50,
      order: "desc",
    });
  },
});

// Generate transformation URL
export const getTransformedUrl = query({
  args: {
    publicId: v.string(),
    transformation: vTransformation,
  },
  handler: async (ctx, args) => {
    const env = getEnv();
    if (!env) {
      throw new Error("Cloudinary not configured");
    }
    const cloudinary = new CloudinaryClient(components.cloudinary, env);
    return await cloudinary.transform(ctx, args.publicId, args.transformation);
  },
});

// Delete image
export const deleteImage = action({
  args: {
    publicId: v.string(),
  },
  handler: async (ctx, args) => {
    const cloudinary = getClient();
    return await cloudinary.delete(ctx, args.publicId);
  },
});
