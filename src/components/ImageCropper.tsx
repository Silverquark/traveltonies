import React, { useState, useRef, useCallback } from "react";
import { Upload, Move, RotateCcw } from "lucide-react";

interface ImageCropperProps {
  onImageChange: (croppedImageUrl: string) => void;
}

interface ImagePosition {
  x: number;
  y: number;
  scale: number;
}

export default function ImageCropper({ onImageChange }: ImageCropperProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState<ImagePosition>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setImagePosition({ x: 0, y: 0, scale: 1 });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCroppedImage = useCallback(() => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas to circle size (151px = 40mm at 96 DPI)
      canvas.width = 151;
      canvas.height = 151;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        0,
        Math.PI * 2,
      );
      ctx.clip();

      // Calculate image dimensions and position
      const { x, y, scale } = imagePosition;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Center the image and apply user positioning
      const centerX = (canvas.width - scaledWidth) / 2 + x;
      const centerY = (canvas.height - scaledHeight) / 2 + y;

      // Draw the image
      ctx.drawImage(img, centerX, centerY, scaledWidth, scaledHeight);
      ctx.restore();

      // Convert to data URL and notify parent
      const croppedImageUrl = canvas.toDataURL("image/png");
      onImageChange(croppedImageUrl);
    };
    img.src = selectedImage;
  }, [selectedImage, imagePosition, onImageChange]);

  React.useEffect(() => {
    generateCroppedImage();
  }, [generateCroppedImage]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!selectedImage) return;
    setIsDragging(true);
    setDragStart({
      x: event.clientX - imagePosition.x,
      y: event.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    setImagePosition((prev) => ({
      ...prev,
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (newScale: number) => {
    setImagePosition((prev) => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, newScale)),
    }));
  };

  const resetPosition = () => {
    setImagePosition({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} />
          Choose Image
        </button>
        {selectedImage && (
          <button
            type="button"
            onClick={resetPosition}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedImage && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Scale:</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={imagePosition.scale}
              onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">
              {imagePosition.scale.toFixed(1)}x
            </span>
          </div>

          <div className="relative">
            <div
              className="relative mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-full cursor-move overflow-hidden"
              style={{ width: "200px", height: "200px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {selectedImage && (
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Crop preview"
                  className="absolute pointer-events-none select-none"
                  style={{
                    width: `${200 * imagePosition.scale}px`,
                    height: "auto",
                    left: `${100 + imagePosition.x - (200 * imagePosition.scale) / 2}px`,
                    top: `${100 + imagePosition.y}px`,
                    transform: "translateY(-50%)",
                  }}
                  draggable={false}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Move size={20} className="text-gray-400 opacity-50" />
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Drag to position • Use slider to scale
            </p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
