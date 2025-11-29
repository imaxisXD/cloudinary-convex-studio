export interface UploadCredentials {
  uploadUrl: string;
  uploadParams: Record<string, string | number | boolean>;
}

export type UploadProgressCallback = (progress: number) => void;

/**
 * Checks if a file is larger than the specified threshold (default 10MB)
 */
export function isLargeFile(file: File, thresholdBytes: number = 10 * 1024 * 1024): boolean {
  return file.size > thresholdBytes;
}

/**
 * Uploads a file directly to Cloudinary using signed credentials
 */
export function uploadDirectToCloudinary(
  file: File,
  credentials: UploadCredentials,
  onProgress?: UploadProgressCallback
): Promise<any> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Append all signed params
    if (credentials.uploadParams) {
      Object.entries(credentials.uploadParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.open("POST", credentials.uploadUrl);
    xhr.send(formData);
  });
}

