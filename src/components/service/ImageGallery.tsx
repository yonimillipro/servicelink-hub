import { useState } from "react";
import type { ServiceImage } from "@/hooks/useServiceImages";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  mainImage: string | null;
  galleryImages: ServiceImage[];
}

export function ImageGallery({ mainImage, galleryImages }: ImageGalleryProps) {
  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...galleryImages.map((img) => img.image_url),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-muted">
        <img src="/placeholder.svg" alt="No image" className="h-56 w-full object-cover sm:h-72 md:h-96" />
      </div>
    );
  }

  const currentImage = allImages[selectedIndex] || allImages[0];

  return (
    <div>
      {/* Main image */}
      <div className="overflow-hidden rounded-xl border border-border">
        <img
          src={currentImage}
          alt="Service"
          className="h-56 w-full object-cover sm:h-72 md:h-96 transition-opacity duration-200"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20",
                i === selectedIndex
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border opacity-70 hover:opacity-100"
              )}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
