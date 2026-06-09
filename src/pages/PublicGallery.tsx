import { useState } from "react";
import { useRequests } from "../context/RequestContext";
import { Search, Image as ImageIcon, Play, X } from "lucide-react";
import type { GalleryItem } from "../types/Gallery";

export default function PublicGallery() {
  const contextData = useRequests();
  const galleryItems = Array.isArray(contextData?.galleryItems) ? contextData.galleryItems : [];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Posters" | "Posts" | "Videos">("All");
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch && item.isPublished;
  });

  const categories: ("All" | "Posters" | "Posts" | "Videos")[] = ["All", "Posters", "Posts", "Videos"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Media Archive & Gallery
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Browse published posters, social media posts, and video reels.
          </p>
        </div>
      </div>

      {/* Filter controls row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search gallery archives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 border border-slate-200/50 rounded-2xl shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border rounded-3xl p-16 text-center text-slate-400 font-semibold">
          No media archives found matching the filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id || item.title}
              onClick={() => setActiveMedia(item)}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                ) : (
                  <div className="text-slate-500">
                    {item.category === "Videos" ? <Play size={40} /> : <ImageIcon size={40} />}
                  </div>
                )}
                {/* Media Indicator Icon Overlay */}
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition duration-200">
                    {item.category === "Videos" ? <Play size={18} className="ml-0.5" /> : <ImageIcon size={18} />}
                  </div>
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {item.category}
                </div>
              </div>

              <div className="p-5 space-y-1">
                <h3 className="font-extrabold text-slate-800 text-sm line-clamp-1 group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description || "No description provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal overlay */}
      {activeMedia && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-3xl w-full shadow-2xl relative overflow-hidden animate-scale-in flex flex-col">
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/50 hover:bg-slate-950/80 backdrop-blur-sm text-white rounded-full transition cursor-pointer z-50 shadow-md border border-white/10"
            >
              <X size={18} />
            </button>

            <div className="space-y-4">
              <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center relative">
                {activeMedia.category === "Videos" ? (
                  <video
                    src={activeMedia.mediaFile}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={activeMedia.mediaFile}
                    alt={activeMedia.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-extrabold uppercase tracking-wider px-2 py-0.5 border border-blue-100 rounded-md">
                    {activeMedia.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Added on {activeMedia.createdAt ? new Date(activeMedia.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {activeMedia.title}
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  {activeMedia.description || "No additional description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
