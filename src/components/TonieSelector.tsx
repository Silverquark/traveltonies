// Updated: Using TanStack Query for data fetching
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Settings } from "lucide-react";
import TonieSettings from "./TonieSettings";

export interface Tonie {
  no: string;
  model: string;
  audio_id: string[];
  hash: string[];
  title: string;
  series: string;
  episodes: string;
  tracks: string[];
  release: string;
  language: string;
  category: string;
  pic: string;
}

interface TonieSelectorProps {
  onTonieSelect: (tonie: Tonie) => void;
}

export const DEFAULT_TONIES_URL =
  "https://raw.githubusercontent.com/toniebox-reverse-engineering/teddycloud/refs/heads/master/contrib/config/tonies.json";

// Fetch function for tonies
const fetchTonies = async (url: string): Promise<Tonie[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load tonies: ${response.statusText}`);
  }
  const data = await response.json();

  // Validate that the data is an array
  if (!Array.isArray(data)) {
    throw new Error("Invalid tonies data format - expected an array");
  }

  return data;
};

export default function TonieSelector({ onTonieSelect }: TonieSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeUrl, setActiveUrl] = useState(DEFAULT_TONIES_URL);
  const [customUrl, setCustomUrl] = useState(DEFAULT_TONIES_URL);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch tonies using TanStack Query
  const {
    data: tonies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tonies", activeUrl],
    queryFn: () => fetchTonies(activeUrl),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Filter tonies based on search query
  // React Compiler will automatically memoize this
  const query = searchQuery.trim().toLowerCase();
  const filteredTonies =
    query === ""
      ? []
      : tonies
          .filter((tonie) => {
            const title = (tonie.title || "").toLowerCase();
            const series = (tonie.series || "").toLowerCase();
            const episodes = (tonie.episodes || "").toLowerCase();
            return (
              title.includes(query) ||
              series.includes(query) ||
              episodes.includes(query)
            );
          })
          .slice(0, 50); // Limit to 50 results

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Validate the data
        if (!Array.isArray(json)) {
          throw new Error("Invalid JSON file - expected an array");
        }
        // Set the data directly in the query cache for the current URL
        queryClient.setQueryData(["tonies", activeUrl], json);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        alert(err instanceof Error ? err.message : "Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleTonieSelect = (tonie: Tonie) => {
    setSearchQuery(tonie.title);
    setShowDropdown(false);
    onTonieSelect(tonie);
  };

  const handleLoadFromUrl = () => {
    if (customUrl.trim()) {
      setActiveUrl(customUrl.trim());
    }
  };

  const handleResetToDefault = () => {
    setCustomUrl(DEFAULT_TONIES_URL);
    setActiveUrl(DEFAULT_TONIES_URL);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative" ref={dropdownRef}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() !== "") {
                  setShowDropdown(true);
                } else {
                  setShowDropdown(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim() !== "") setShowDropdown(true);
              }}
              placeholder="Search for a Tonie (e.g., Janosch, Olchis)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && filteredTonies.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {filteredTonies.map((tonie, index) => (
                <button
                  key={`${tonie.model}-${index}`}
                  onClick={() => handleTonieSelect(tonie)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                >
                  {tonie.pic && (
                    <img
                      src={tonie.pic}
                      alt={tonie.title}
                      className="w-8 h-8 object-cover rounded flex-shrink-0"
                      style={{
                        maxWidth: "32px",
                        maxHeight: "32px",
                        minWidth: "32px",
                        minHeight: "32px",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {tonie.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {tonie.series} • {tonie.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          title="Data source settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Settings Modal */}
      <TonieSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        customUrl={customUrl}
        onCustomUrlChange={setCustomUrl}
        onLoadFromUrl={handleLoadFromUrl}
        onFileUpload={handleFileUpload}
        onResetToDefault={handleResetToDefault}
      />

      {/* Status Messages */}
      {isLoading && (
        <p className="text-sm text-gray-500">Loading tonies database...</p>
      )}
      {error && (
        <p className="text-sm text-red-600">
          {error instanceof Error
            ? `${error.message} (Check CORS or URL format)`
            : "Failed to load tonies"}
        </p>
      )}
      {!isLoading && !error && tonies.length > 0 && (
        <p className="text-sm text-gray-500">
          {tonies.length} tonies loaded. Start typing to search.
        </p>
      )}
    </div>
  );
}
