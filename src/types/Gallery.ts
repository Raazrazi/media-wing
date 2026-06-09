export interface GalleryItem {
  _id?: string;
  title: string;
  description?: string;
  category: "Posters" | "Posts" | "Videos";
  thumbnail?: string;
  mediaFile?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: string;
}
