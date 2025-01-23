import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface ImageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  isLoading?: boolean;
}

export function ImageContainer({ 
  src, 
  isLoading, 
  className,
  ...props 
}: ImageContainerProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsImageLoading(false);
      return () => {
        img.onload = null;
        setIsImageLoading(true);
      };
    }
  }, [src]);

  if (isLoading || isImageLoading) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)} {...props}>
        <Skeleton className="w-full h-full absolute inset-0" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)} {...props}>
      <img
        src={src}
        alt="Random cat"
        className="w-full h-full object-cover transition-opacity duration-300"
      />
    </div>
  );
}
