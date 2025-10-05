interface CirclePreviewProps {
  type: "image" | "text";
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

export default function CirclePreview({
  type,
  imageUrl,
  title,
  subtitle,
}: CirclePreviewProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-[40mm] h-[40mm] relative bg-white border-2 border-gray-300 rounded-full overflow-hidden flex items-center justify-center print:border-black print:w-[40mm] print:h-[40mm]">
        {type === "image" && imageUrl ? (
          <img
            src={imageUrl}
            alt="Circle content"
            className="w-full h-full object-cover"
          />
        ) : type === "text" ? (
          <div className="text-center px-4 flex flex-col justify-center h-full">
            <div className="font-bold text-lg mb-1 leading-tight break-words">
              {title || ""}
            </div>
            <div className="text-sm leading-tight break-words">
              {subtitle || ""}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center px-4">
            <div className="text-sm">No image selected</div>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 text-center">40mm × 40mm</p>
    </div>
  );
}
