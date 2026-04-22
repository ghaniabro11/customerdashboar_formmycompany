"use client";

import Image, { ImageProps } from "next/image";
import React, { useState, useEffect } from "react";

interface FallBackImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt?: string;
  fallbackSrc?: string;
}

const FallBackImage: React.FC<FallBackImageProps> = ({
  src,
  alt = "Image",
  fallbackSrc = "/placeholder.svg", // Default fallback
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const checkImageUrl = async () => {
      try {
        // Check if the URL is valid (basic check)
        const response = await fetch(src, { method: "HEAD" });
        if (!response.ok) {
          throw new Error("Image URL is not valid");
        }
      } catch {
        setError(true);
        setImgSrc(fallbackSrc);
      }
    };

    checkImageUrl();
  }, [src, fallbackSrc]);

  const handleImageError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {/* Add a custom loading placeholder */}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleImageError}
        onLoadingComplete={handleImageLoad}
      />
    </>
  );
};

export default FallBackImage;
