import { makeCloudinaryAPI } from "@imaxis/cloudinary-convex";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Export all API functions - uses environment variables automatically
export const {
  upload,
  transform,
  deleteAsset,
  listAssets,
  getAsset,
  updateAsset,
  generateUploadCredentials,
  finalizeUpload,
  createPendingUpload,
  updateUploadStatus,
  getUploadsByStatus,
  deletePendingUpload,
} = makeCloudinaryAPI(components.cloudinary);

// Helper to check if configuration is set
export const checkConfig = query({
  args: {},
  returns: v.boolean(),
  handler: async () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    return !!(cloudName && apiKey && apiSecret);
  },
});
