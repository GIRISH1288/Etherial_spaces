'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  fallbackSrc = '/images/premium_hero_interior.png', 
  alt, 
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>('/images/premium_hero_interior.png');

  useEffect(() => {
    if (src) {
      setImgSrc(src);
    }
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'Ethereal Spaces'}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
