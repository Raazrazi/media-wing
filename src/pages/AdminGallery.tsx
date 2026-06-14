import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRequests } from "../context/RequestContext";
import { Trash2, Star, Plus, Image as ImageIcon, Play, Link as LinkIcon, Upload } from "lucide-react";

// ── Dual-input field: toggle between Browse File and Paste URL ──────────────
function DualInput({
  label,
  accept,
  urlValue,
  onUrlChange,
  onFileChange,
  onFilesChange,
  multiple = false,
  filesValue = [],
  placeholder,
}: {
  label: string;
  accept: string;
  urlValue: string;
  onUrlChange: (val: string) => void;
  onFileChange?: (objectUrl: string) => void;
  onFilesChange?: (files: { name: string; data: string }[]) => void;
  multiple?: boolean;
  filesValue?: { name: string; data: string }[];
  placeholder: string;
}) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (multiple && filesValue.length === 0) {
      setPreviews([]);
      setFileNames([]);
    } else if (!multiple && (!urlValue || urlValue === "")) {
      setPreview("");
      setFileName("");
    }
  }, [urlValue, filesValue, multiple]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      const fileList = Array.from(files);
      const objectUrls = fileList.map((file) => URL.createObjectURL(file));
      setPreviews(objectUrls);
      setFileNames(fileList.map((f) => f.name));

      const loadedData: { name: string; data: string }[] = [];
      let loadedCount = 0;

      fileList.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            loadedData[index] = { name: file.name, data: reader.result };
          }
          loadedCount++;
          if (loadedCount === fileList.length) {
            onFilesChange?.(loadedData.filter(Boolean));
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onFileChange?.(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isVideo = accept.includes("video");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
              mode === "url"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LinkIcon size={10} /> URL
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
              mode === "file"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Upload size={10} /> Browse
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          placeholder={placeholder}
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      ) : (
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition"
          >
            {multiple && previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 w-full max-h-48 overflow-y-auto p-1 custom-scrollbar">
                {previews.map((prev, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                    {isVideo ? (
                      <video src={prev} className="w-full h-full object-cover" />
                    ) : (
                      <img src={prev} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1">
                      <p className="text-[9px] text-white font-bold truncate max-w-full text-center">
                        {fileNames[idx]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : !multiple && preview ? (
              isVideo ? (
                <video src={preview} className="h-20 rounded-lg object-cover" controls />
              ) : (
                <img src={preview} alt="preview" className="h-20 rounded-lg object-cover" />
              )
            ) : (
              <>
                {isVideo ? <Play size={24} className="text-slate-400" /> : <ImageIcon size={24} className="text-slate-400" />}
                <p className="text-xs text-slate-400 font-medium">Click to browse {isVideo ? "video" : "image"}{multiple ? "s" : ""}</p>
              </>
            )}
            {!multiple && fileName && <p className="text-[10px] text-slate-500 truncate max-w-full">{fileName}</p>}
            {multiple && fileNames.length > 0 && (
              <p className="text-[10px] text-blue-600 font-bold">{fileNames.length} file(s) selected</p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleFile}
            multiple={multiple}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

export default function AdminGallery() {
  const contextData = useRequests();
  const galleryItems = Array.isArray(contextData?.galleryItems) ? contextData.galleryItems : [];
  const addGalleryItem = contextData?.addGalleryItem;
  const deleteGalleryItem = contextData?.deleteGalleryItem;
  const updateGalleryItem = contextData?.updateGalleryItem;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Posters" as "Posters" | "Posts" | "Videos",
    thumbnail: "",
    mediaFile: "",
    mediaFiles: [] as { name: string; data: string }[],
    isFeatured: false,
    isPublished: true,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const hasFiles = form.mediaFiles.length > 0;

    if (!form.title.trim() && !hasFiles) {
      alert("Please enter an asset title.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (hasFiles) {
        // Bulk upload mode
        for (let i = 0; i < form.mediaFiles.length; i++) {
          const file = form.mediaFiles[i];
          
          let computedTitle = form.title.trim();
          const cleanFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          if (computedTitle) {
            if (form.mediaFiles.length > 1) {
              computedTitle = `${computedTitle} - ${cleanFileName}`;
            }
          } else {
            computedTitle = cleanFileName;
          }

          const mediaFile = file.data;
          let thumbnail = form.thumbnail.trim();

          if (!thumbnail) {
            if (form.category === "Videos") {
              thumbnail = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60";
            } else {
              thumbnail = mediaFile;
            }
          }

          await addGalleryItem({
            title: computedTitle,
            description: form.description,
            category: form.category,
            thumbnail,
            mediaFile,
            isFeatured: form.isFeatured,
            isPublished: form.isPublished
          });
        }
      } else {
        // Single URL mode
        let thumbnail = form.thumbnail.trim();
        let mediaFile = form.mediaFile.trim();

        if (!thumbnail) {
          if (form.category === "Posters") {
            thumbnail = "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=60";
          } else if (form.category === "Posts") {
            thumbnail = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60";
          } else {
            thumbnail = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60";
          }
        }
        if (!mediaFile) {
          if (form.category === "Videos") {
            mediaFile = "https://www.w3schools.com/html/mov_bbb.mp4";
          } else {
            mediaFile = thumbnail;
          }
        }

        await addGalleryItem({
          title: form.title,
          description: form.description,
          category: form.category,
          thumbnail,
          mediaFile,
          isFeatured: form.isFeatured,
          isPublished: form.isPublished
        });
      }

      setForm({
        title: "",
        description: "",
        category: "Posters",
        thumbnail: "",
        mediaFile: "",
        mediaFiles: [],
        isFeatured: false,
        isPublished: true
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to upload some gallery assets.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Media Archive Admin
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage public gallery uploads, highlight feature banners, and reels.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer hover:shadow-glow-blue shrink-0"
        >
          <Plus size={16} /> Add Media Asset
        </button>
      </div>

      {/* Add Form Accordion */}
      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-scale-in">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2.5 border-slate-100">
            Upload New Media Asset
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Asset Title {form.mediaFiles.length <= 1 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder={form.mediaFiles.length > 1 ? "Optional base title (defaults to filenames)" : "e.g. Tree Plantation Drive Flyer"}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any, mediaFile: "", mediaFiles: [], thumbnail: "" })}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Posters">Posters (Design flex format)</option>
                  <option value="Posts">Posts (Social media feed size)</option>
                  <option value="Videos">Videos (Campaign reels / promos)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Provide brief details about this asset..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Switches */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Feature on Home</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Publish Immediately</span>
                </label>
              </div>
            </div>

            {/* Right column – dual inputs */}
            <div className="space-y-5">
              <DualInput
                label="Thumbnail (Optional)"
                accept="image/*"
                urlValue={form.thumbnail}
                onUrlChange={(val) => setForm({ ...form, thumbnail: val })}
                onFileChange={(url) => setForm({ ...form, thumbnail: url })}
                placeholder="Paste thumbnail image URL..."
              />

              <DualInput
                label={`Media File – ${form.category === "Videos" ? "Video" : "Image"} (Optional)`}
                accept={form.category === "Videos" ? "video/*" : "image/*"}
                urlValue={form.mediaFile}
                onUrlChange={(val) => setForm({ ...form, mediaFile: val, mediaFiles: [] })}
                onFileChange={(url) => setForm({ ...form, mediaFile: url, mediaFiles: [] })}
                onFilesChange={(files) => setForm({ ...form, mediaFiles: files, mediaFile: "" })}
                multiple={true}
                filesValue={form.mediaFiles}
                placeholder={form.category === "Videos" ? "Paste video URL..." : "Paste full-size image URL..."}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={isSubmitting}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer hover:shadow-glow-blue"
              >
                {isSubmitting ? "Registering..." : "Register Asset"}
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Media Assets Register table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Media Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Home Feature</th>
                <th className="px-6 py-4">Publish Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {galleryItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                    No media assets uploaded yet.
                  </td>
                </tr>
              ) : (
                galleryItems.map((item) => (
                  <tr key={item._id || item.title} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              {item.category === "Videos" ? <Play size={16} /> : <ImageIcon size={16} />}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 leading-normal">
                            {item.description || "No description."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-600 border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          item._id && updateGalleryItem(item._id, { isFeatured: !item.isFeatured })
                        }
                        className={`p-1.5 rounded-xl border transition cursor-pointer ${
                          item.isFeatured
                            ? "bg-amber-50 border-amber-200 text-amber-500"
                            : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                        }`}
                        title={item.isFeatured ? "Featured" : "Click to feature"}
                      >
                        <Star size={16} fill={item.isFeatured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          item._id && updateGalleryItem(item._id, { isPublished: !item.isPublished })
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          item.isPublished
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : "bg-rose-50 border-rose-200 text-rose-600"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => item._id && deleteGalleryItem(item._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
