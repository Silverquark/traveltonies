import React from "react";
import { Upload, X } from "lucide-react";

interface TonieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  customUrl: string;
  onCustomUrlChange: (url: string) => void;
  onLoadFromUrl: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToDefault: () => void;
}

export default function TonieSettings({
  isOpen,
  onClose,
  customUrl,
  onCustomUrlChange,
  onLoadFromUrl,
  onFileUpload,
  onResetToDefault,
}: TonieSettingsProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Data Source Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Load from URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => onCustomUrlChange(e.target.value)}
                placeholder="Enter URL to tonies.json..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onLoadFromUrl();
                }}
              />
              <button
                onClick={onLoadFromUrl}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Load
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Options
            </label>
            <div className="flex flex-col gap-2">
              {/* Upload Custom JSON */}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload size={16} />
                <span>Upload JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onFileUpload}
                  className="hidden"
                />
              </label>

              {/* Reset to Default */}
              <button
                onClick={onResetToDefault}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
