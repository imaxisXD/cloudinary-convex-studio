/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as images from "../images.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  images: typeof images;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  cloudinary: {
    lib: {
      deleteAsset: FunctionReference<
        "action",
        "internal",
        {
          config: { apiKey: string; apiSecret: string; cloudName: string };
          publicId: string;
        },
        { error?: string; success: boolean }
      >;
      finalizeUpload: FunctionReference<
        "mutation",
        "internal",
        {
          folder?: string;
          publicId: string;
          uploadResult: {
            access_mode?: string;
            api_key?: string;
            asset_id?: string;
            bytes?: number;
            created_at?: string;
            etag?: string;
            existing?: boolean;
            folder?: string;
            format: string;
            height?: number;
            original_filename?: string;
            placeholder?: boolean;
            public_id: string;
            resource_type?: string;
            secure_url: string;
            signature?: string;
            tags?: Array<string>;
            type?: string;
            url: string;
            version?: number;
            version_id?: string;
            width?: number;
          };
          userId?: string;
        },
        string
      >;
      generateUploadCredentials: FunctionReference<
        "action",
        "internal",
        {
          config: { apiKey: string; apiSecret: string; cloudName: string };
          filename?: string;
          folder?: string;
          publicId?: string;
          tags?: Array<string>;
          transformation?: {
            crop?: string;
            effect?: string;
            format?: string;
            gravity?: string;
            height?: number;
            overlay?: string;
            quality?: string;
            radius?: number | string;
            width?: number;
          };
          userId?: string;
        },
        {
          uploadParams: {
            api_key: string;
            folder?: string;
            public_id?: string;
            signature: string;
            tags?: string;
            timestamp: string;
            transformation?: string;
          };
          uploadUrl: string;
        }
      >;
      getAsset: FunctionReference<
        "query",
        "internal",
        {
          config: { apiKey: string; apiSecret: string; cloudName: string };
          publicId: string;
        },
        {
          _creationTime: number;
          _id: string;
          bytes?: number;
          cloudinaryUrl: string;
          folder?: string;
          format: string;
          height?: number;
          metadata?: any;
          originalFilename?: string;
          publicId: string;
          secureUrl: string;
          tags?: Array<string>;
          transformations?: Array<any>;
          updatedAt: number;
          uploadedAt: number;
          userId?: string;
          width?: number;
        } | null
      >;
      listAssets: FunctionReference<
        "query",
        "internal",
        {
          config: { apiKey: string; apiSecret: string; cloudName: string };
          folder?: string;
          limit?: number;
          order?: "asc" | "desc";
          orderBy?: "uploadedAt" | "updatedAt";
          tags?: Array<string>;
          userId?: string;
        },
        Array<{
          _creationTime: number;
          _id: string;
          bytes?: number;
          cloudinaryUrl: string;
          folder?: string;
          format: string;
          height?: number;
          metadata?: any;
          originalFilename?: string;
          publicId: string;
          secureUrl: string;
          tags?: Array<string>;
          transformations?: Array<any>;
          updatedAt: number;
          uploadedAt: number;
          userId?: string;
          width?: number;
        }>
      >;
      transform: FunctionReference<
        "query",
        "internal",
        {
          config: { apiKey: string; apiSecret: string; cloudName: string };
          publicId: string;
          transformation: {
            crop?: string;
            effect?: string;
            format?: string;
            gravity?: string;
            height?: number;
            overlay?: string;
            quality?: string;
            radius?: number | string;
            width?: number;
          };
        },
        { secureUrl: string; transformedUrl: string }
      >;
      updateAsset: FunctionReference<
        "mutation",
        "internal",
        { metadata?: any; publicId: string; tags?: Array<string> },
        {
          _creationTime: number;
          _id: string;
          bytes?: number;
          cloudinaryUrl: string;
          folder?: string;
          format: string;
          height?: number;
          metadata?: any;
          originalFilename?: string;
          publicId: string;
          secureUrl: string;
          tags?: Array<string>;
          transformations?: Array<any>;
          updatedAt: number;
          uploadedAt: number;
          userId?: string;
          width?: number;
        } | null
      >;
      upload: FunctionReference<
        "action",
        "internal",
        {
          base64Data: string;
          config: { apiKey: string; apiSecret: string; cloudName: string };
          filename?: string;
          folder?: string;
          publicId?: string;
          tags?: Array<string>;
          transformation?: {
            crop?: string;
            effect?: string;
            format?: string;
            gravity?: string;
            height?: number;
            overlay?: string;
            quality?: string;
            radius?: number | string;
            width?: number;
          };
          userId?: string;
        },
        {
          bytes?: number;
          error?: string;
          format?: string;
          height?: number;
          publicId?: string;
          secureUrl?: string;
          success: boolean;
          width?: number;
        }
      >;
    };
  };
};
