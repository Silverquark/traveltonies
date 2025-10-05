interface TextEditorProps {
  title: string;
  subtitle: string;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
}

export default function TextEditor({
  title,
  subtitle,
  onTitleChange,
  onSubtitleChange,
}: TextEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">
            {title.length}/20 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <textarea
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Enter subtitle..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {subtitle.length}/50 characters
          </p>
        </div>
      </div>
    </div>
  );
}
