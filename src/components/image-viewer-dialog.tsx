// src/components/image-viewer-dialog.tsx
"use client";

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ImageViewerDialogProps {
  images: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function ImageViewerDialog({ images, open, onOpenChange, productName }: ImageViewerDialogProps) {
  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem key={index}>
                <div className="flex aspect-square items-center justify-center">
                   <Image
                      src={img}
                      alt={`${productName} - imagen ampliada ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           {images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 text-white bg-black/30 hover:bg-black/50 hover:text-white" />
              <CarouselNext className="absolute right-2 text-white bg-black/30 hover:bg-black/50 hover:text-white" />
            </>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
