import { useState, useRef, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  uploadDirectToCloudinary,
  isLargeFile,
  type UploadCredentials,
} from "../utils/cloudinary";

// --- TYPES (Kept same as before) ---
type CloudinaryImage = {
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
};

interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string | number;
  format?: string;
  effect?: string;
  radius?: number | string;
  overlay?: string;
  underlay?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  gamma?: number;
  filter?: string;
  art?: string;
  cartoonify?: number;
  oilPaint?: number;
  sketch?: string;
  text?: string;
  textColor?: string;
  textSize?: number;
  textFont?: string;
  angle?: number;
  flip?: string;
  rotation?: number;
  zoom?: number;
  background?: string;
  removeBackground?: boolean;
  generateBackground?: string;
  responsive?: boolean;
  auto?: string;
  fetchFormat?: string;
}

type PresetCategory =
  | "resize"
  | "shape"
  | "color"
  | "artistic"
  | "adjustments"
  | "blur"
  | "transform";

interface PresetDefinition {
  name: string;
  settings: Partial<TransformationOptions>;
  category: PresetCategory;
  description?: string;
  exclusive?: string;
}

// --- DATA (Kept same as before) ---
const PRESET_DEFINITIONS: PresetDefinition[] = [
  {
    name: "Basic Resize",
    settings: { width: 300, height: 300, crop: "fill" },
    category: "resize",
    description: "300x300 fill",
  },
  {
    name: "Square Thumbnail",
    settings: { width: 150, height: 150, crop: "thumb", gravity: "face" },
    category: "resize",
    description: "150x150 face-focused",
  },
  {
    name: "Landscape",
    settings: { width: 800, height: 400, crop: "fill" },
    category: "resize",
    description: "800x400",
  },
  {
    name: "Portrait",
    settings: { width: 400, height: 600, crop: "fill" },
    category: "resize",
    description: "400x600",
  },
  {
    name: "Circle",
    settings: { width: 200, height: 200, crop: "fill", radius: "max" },
    category: "shape",
    description: "Circular crop",
  },
  {
    name: "Rounded Corners",
    settings: { width: 300, height: 300, crop: "fill", radius: 20 },
    category: "shape",
    description: "20px radius",
  },
  {
    name: "Black & White",
    settings: { effect: "blackwhite" },
    category: "color",
    description: "Monochrome",
    exclusive: "color-effect",
  },
  {
    name: "Sepia",
    settings: { effect: "sepia" },
    category: "color",
    description: "Vintage brown",
    exclusive: "color-effect",
  },
  {
    name: "Grayscale",
    settings: { effect: "grayscale" },
    category: "color",
    description: "Gray tones",
    exclusive: "color-effect",
  },
  {
    name: "Invert",
    settings: { effect: "negate" },
    category: "color",
    description: "Negative colors",
    exclusive: "color-effect",
  },
  {
    name: "Vintage (Audrey)",
    settings: { effect: "art:audrey" },
    category: "artistic",
    description: "Classic film look",
    exclusive: "artistic-filter",
  },
  {
    name: "Zorro",
    settings: { effect: "art:zorro" },
    category: "artistic",
    description: "High contrast",
    exclusive: "artistic-filter",
  },
  {
    name: "Aurora",
    settings: { effect: "art:aurora" },
    category: "artistic",
    description: "Ethereal glow",
    exclusive: "artistic-filter",
  },
  {
    name: "Oil Painting",
    settings: { effect: "oil_paint:6" },
    category: "artistic",
    description: "Painted effect",
    exclusive: "artistic-filter",
  },
  {
    name: "Sketch",
    settings: { effect: "sketch" },
    category: "artistic",
    description: "Pencil drawing",
    exclusive: "artistic-filter",
  },
  {
    name: "Cartoon",
    settings: { effect: "cartoonify:70" },
    category: "artistic",
    description: "Cartoon style",
    exclusive: "artistic-filter",
  },
  {
    name: "Brightness +20",
    settings: { brightness: 20 },
    category: "adjustments",
    description: "Lighten",
  },
  {
    name: "Contrast +20",
    settings: { contrast: 20 },
    category: "adjustments",
    description: "More contrast",
  },
  {
    name: "Saturation -50",
    settings: { saturation: -50 },
    category: "adjustments",
    description: "Desaturate",
  },
  {
    name: "High Contrast",
    settings: { contrast: 50, brightness: 10 },
    category: "adjustments",
    description: "Bold look",
  },
  {
    name: "Warm Tone",
    settings: { saturation: 30, hue: 20 },
    category: "adjustments",
    description: "Warmer colors",
  },
  {
    name: "Cool Tone",
    settings: { saturation: 30, hue: -20 },
    category: "adjustments",
    description: "Cooler colors",
  },
  {
    name: "Dramatic",
    settings: { contrast: 40, brightness: -10, saturation: 20 },
    category: "adjustments",
    description: "Intense mood",
  },
  {
    name: "Blur",
    settings: { effect: "blur:300" },
    category: "blur",
    description: "Soft blur",
    exclusive: "blur-sharpen",
  },
  {
    name: "Sharpen",
    settings: { effect: "sharpen" },
    category: "blur",
    description: "Crisp edges",
    exclusive: "blur-sharpen",
  },
  {
    name: "Pixelate",
    settings: { effect: "pixelate:15" },
    category: "blur",
    description: "Pixel art",
    exclusive: "blur-sharpen",
  },
  {
    name: "Rotate 90°",
    settings: { angle: 90 },
    category: "transform",
    description: "Turn right",
  },
  {
    name: "Rotate 180°",
    settings: { angle: 180 },
    category: "transform",
    description: "Flip upside down",
  },
  {
    name: "Rotate 270°",
    settings: { angle: 270 },
    category: "transform",
    description: "Turn left",
  },
  {
    name: "Flip Horizontal",
    settings: { flip: "horizontal" },
    category: "transform",
    description: "Mirror",
  },
  {
    name: "Flip Vertical",
    settings: { flip: "vertical" },
    category: "transform",
    description: "Flip",
  },
  {
    name: "Zoom 2x",
    settings: { zoom: 2 },
    category: "transform",
    description: "Enlarge",
  },
  {
    name: "Zoom 0.5x",
    settings: { zoom: 0.5 },
    category: "transform",
    description: "Shrink",
  },
];

const CATEGORY_INFO: Record<
  PresetCategory,
  { label: string; icon: string; description: string }
> = {
  resize: { label: "Resize", icon: "📐", description: "Dimensions & Crop" },
  shape: { label: "Shape", icon: "⭕", description: "Corners & Masks" },
  color: { label: "Color", icon: "🎨", description: "Filters & Grading" },
  artistic: { label: "Artistic", icon: "🖌️", description: "Stylized Effects" },
  adjustments: { label: "Tune", icon: "🎚️", description: "Light & Color" },
  blur: { label: "Blur", icon: "💧", description: "Focus & Sharpness" },
  transform: { label: "Transform", icon: "🔄", description: "Orient & Zoom" },
};

export function ImageStudio() {
  const images = useQuery(api.images.getImages);
  const isConfigured = useQuery(api.images.checkConfig);

  const uploadImage = useAction(api.images.uploadImage);
  const deleteImage = useAction(api.images.deleteImage);
  const getUploadCredentials = useAction(api.images.getUploadCredentials);
  const finalizeUpload = useAction(api.images.finalizeUpload);

  // State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedImageForTransform, setSelectedImageForTransform] =
    useState<CloudinaryImage | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedFilePreview, setStagedFilePreview] = useState<string | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transformation State
  const [transformSettings, setTransformSettings] =
    useState<TransformationOptions>({});
  const [activeCategory, setActiveCategory] =
    useState<PresetCategory>("resize");

  // Query for transformed URL
  const getTransformedUrl = useQuery(
    api.images.getTransformedUrl,
    selectedImageForTransform &&
      images?.some((img) => img.publicId === selectedImageForTransform.publicId)
      ? {
          publicId: selectedImageForTransform.publicId,
          transformation: {
            ...transformSettings,
            quality:
              typeof transformSettings.quality === "number"
                ? String(transformSettings.quality)
                : transformSettings.quality,
          },
        }
      : "skip",
  );

  const previewUrl =
    getTransformedUrl?.transformedUrl || selectedImageForTransform?.secureUrl;

  // Deselect if deleted
  useEffect(() => {
    if (selectedImageForTransform && images) {
      if (
        !images.some(
          (img) => img.publicId === selectedImageForTransform.publicId,
        )
      ) {
        setSelectedImageForTransform(null);
      }
    }
  }, [images, selectedImageForTransform]);

  // Handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (stagedFilePreview) URL.revokeObjectURL(stagedFilePreview);
    setStagedFile(file);
    setStagedFilePreview(URL.createObjectURL(file));
    setShowUploadModal(true);
  };

  const clearStagedFile = () => {
    if (stagedFilePreview) URL.revokeObjectURL(stagedFilePreview);
    setStagedFile(null);
    setStagedFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const performUpload = async (method: "base64" | "direct" | "auto") => {
    if (!stagedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    let finalMethod = method;
    if (method === "auto") {
      finalMethod = isLargeFile(stagedFile, 5 * 1024 * 1024)
        ? "direct"
        : "base64";
    }

    try {
      if (finalMethod === "direct") {
        // Direct Upload
        const credentials = await getUploadCredentials({
          filename: stagedFile.name,
          folder: "direct-uploads",
        });
        const uploadResult = await uploadDirectToCloudinary(
          stagedFile,
          credentials as UploadCredentials,
          (progress) => setUploadProgress(progress),
        );
        await finalizeUpload({
          publicId: uploadResult.public_id,
          uploadResult,
          userId: "user-initiated",
        });
      } else {
        // Base64 Upload
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(stagedFile);
        });
        setUploadProgress(50);
        await uploadImage({
          base64Data,
          filename: stagedFile.name,
          folder: "base64-uploads",
        });
        setUploadProgress(100);
      }
      clearStagedFile();
      setShowUploadModal(false);
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this image?")) {
      try {
        await deleteImage({ publicId });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const applyPreset = (preset: PresetDefinition) => {
    setTransformSettings((prev) => ({ ...prev, ...preset.settings }));
  };

  // Renderers
  if (isConfigured === false)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Setup Required
          </h2>
          <p className="text-slate-500 mb-6">
            Configure your Cloudinary credentials in Convex.
          </p>
          <code className="block bg-slate-900 text-slate-50 p-4 rounded-lg text-left text-xs font-mono">
            npx convex env set CLOUDINARY_CLOUD_NAME ...
          </code>
        </div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* --- APP HEADER --- */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-none z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="font-bold text-slate-800 tracking-tight">
            Studio<span className="text-indigo-600">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://cloudinary.com"
            target="_blank"
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Powered by Cloudinary
          </a>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* 1. LIBRARY SIDEBAR */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col flex-none z-10">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Library
            </h3>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {images?.length || 0}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all cursor-pointer group h-32"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                ☁️
              </span>
              <span className="text-xs font-bold">Upload New</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {images?.map((img: any) => (
              <div
                key={img.publicId}
                onClick={() => setSelectedImageForTransform(img)}
                className={`group relative rounded-lg overflow-hidden aspect-square cursor-pointer border-2 transition-all ${selectedImageForTransform?.publicId === img.publicId ? "border-indigo-600 ring-2 ring-indigo-600/20" : "border-transparent hover:border-slate-200"}`}
              >
                <img
                  src={img.secureUrl}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                  <button
                    onClick={(e) => void handleDelete(img.publicId, e)}
                    className="text-white hover:text-red-400 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                {selectedImageForTransform?.publicId === img.publicId && (
                  <div className="absolute inset-0 ring-inset ring-2 ring-indigo-600 pointer-events-none rounded-lg"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. CANVAS (Center) */}
        <div className="flex-1 bg-slate-50 relative flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="h-12 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 flex-none">
            <span className="text-xs font-medium text-slate-500">
              {selectedImageForTransform
                ? selectedImageForTransform.originalFilename
                : "No image selected"}
            </span>
            {selectedImageForTransform && (
              <div className="flex gap-2">
                <button
                  onClick={() => setTransformSettings({})}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Reset
                </button>
                <a
                  href={previewUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Download
                </a>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden pattern-grid">
            {selectedImageForTransform ? (
              <div className="relative shadow-2xl shadow-slate-300/50 rounded-lg overflow-hidden max-h-full max-w-full transition-all duration-500">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[calc(100vh-160px)] max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="text-slate-300 flex flex-col items-center">
                <span className="text-6xl mb-4 opacity-50">🖼️</span>
                <p className="font-medium">Select an image to edit</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. INSPECTOR (Right) */}
        {selectedImageForTransform && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col flex-none animate-fade-in z-10">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Inspector
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Category Tabs */}
              <div className="flex overflow-x-auto p-2 space-x-1 no-scrollbar border-b border-slate-50">
                {(Object.keys(CATEGORY_INFO) as PresetCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-none px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeCategory === cat ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    <span className="mr-1.5">{CATEGORY_INFO[cat].icon}</span>
                    {CATEGORY_INFO[cat].label}
                  </button>
                ))}
              </div>

              {/* Presets List */}
              <div className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_DEFINITIONS.filter(
                    (p) => p.category === activeCategory,
                  ).map((preset) => {
                    const isActive = Object.entries(preset.settings).every(
                      ([k, v]) => (transformSettings as any)[k] === v,
                    );
                    return (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all border ${isActive ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700"}`}
                      >
                        <div className="font-medium flex justify-between items-center">
                          {preset.name}
                          {isActive && (
                            <span className="text-indigo-600">✓</span>
                          )}
                        </div>
                        {preset.description && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {preset.description}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders for Adjustments */}
              {activeCategory === "adjustments" && (
                <div className="p-4 border-t border-slate-50 space-y-6">
                  {["brightness", "contrast", "saturation"].map((metric) => (
                    <div key={metric}>
                      <div className="flex justify-between text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                        <span>{metric}</span>
                        <span>{(transformSettings as any)[metric] || 0}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={(transformSettings as any)[metric] || 0}
                        onChange={(e) =>
                          setTransformSettings((prev) => ({
                            ...prev,
                            [metric]: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- UPLOAD MODAL --- */}
      {showUploadModal && stagedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden m-4">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Upload Image</h3>
              <button
                onClick={clearStagedFile}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {stagedFilePreview && (
                  <img
                    src={stagedFilePreview}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                    alt="preview"
                  />
                )}
                <div>
                  <p className="font-bold text-slate-700 truncate max-w-[200px]">
                    {stagedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(stagedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  <button
                    onClick={() => void performUpload("auto")}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    Upload Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
