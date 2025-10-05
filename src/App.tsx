import React, { useState } from "react";
import { Printer, Plus, Trash2, Edit } from "lucide-react";
import ImageCropper from "./components/ImageCropper";
import TextEditor from "./components/TextEditor";
import CirclePreview from "./components/CirclePreview";
import TonieSelector, { type Tonie } from "./components/TonieSelector";

interface SavedTonie {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

function App() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [savedTonies, setSavedTonies] = useState<SavedTonie[]>([]);

  const handleTonieSelect = (tonie: Tonie) => {
    // Set the title to series name and subtitle to episode name
    setTitle(tonie.series);
    setSubtitle(tonie.episodes);

    // Try to load the tonie image
    if (tonie.pic) {
      setImageUrl(tonie.pic);
    }
  };

  const handleAddToList = () => {
    const newTonie: SavedTonie = {
      id: Date.now().toString(),
      imageUrl,
      title,
      subtitle,
    };
    setSavedTonies([...savedTonies, newTonie]);

    // Clear current tonie for next creation
    setImageUrl("");
    setTitle("");
    setSubtitle("");
  };

  const handleRemoveTonie = (id: string) => {
    setSavedTonies(savedTonies.filter((tonie) => tonie.id !== id));
  };

  const handleEditTonie = (id: string) => {
    const tonieToEdit = savedTonies.find((tonie) => tonie.id === id);
    if (tonieToEdit) {
      setImageUrl(tonieToEdit.imageUrl);
      setTitle(tonieToEdit.title);
      setSubtitle(tonieToEdit.subtitle);
      setSavedTonies(savedTonies.filter((tonie) => tonie.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area,
          #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Travel Tonie Generator
          </h1>
          <p className="text-gray-600">
            Create printable 40mm circles with custom images and text
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-8 no-print">
            {/* Tonie Creation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-6">
                {/* Select Existing Tonie */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Select existing Tonie
                  </h2>
                  <TonieSelector onTonieSelect={handleTonieSelect} />
                </div>

                {/* Divider */}
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm text-gray-500">
                      or
                    </span>
                  </div>
                </div>

                {/* Create Custom Tonie */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Create Custom Tonie
                  </h2>

                  <div className="space-y-6">
                    {/* Image Section */}
                    <ImageCropper onImageChange={setImageUrl} />

                    {/* Text Section */}
                    <TextEditor
                      title={title}
                      subtitle={subtitle}
                      onTitleChange={setTitle}
                      onSubtitleChange={setSubtitle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 no-print">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Preview
              </h2>
              <div className="flex justify-center space-x-8 mb-6">
                <div className="text-center">
                  <CirclePreview type="image" imageUrl={imageUrl} />
                  <p className="text-sm text-gray-600 mt-2">Image Circle</p>
                </div>
                <div className="text-center">
                  <CirclePreview
                    type="text"
                    title={title}
                    subtitle={subtitle}
                  />
                  <p className="text-sm text-gray-600 mt-2">Text Circle</p>
                </div>
              </div>

              {/* Add to List Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleAddToList}
                  disabled={!title && !imageUrl}
                  className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Plus size={20} />
                  Add to List
                </button>
              </div>
            </div>

            {/* Saved Tonies List */}
            {savedTonies.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 no-print">
                <div className="flex items-center gap-2 justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Your Tonies ({savedTonies.length})
                  </h3>
                  <button
                    onClick={handlePrint}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Printer size={16} />
                    Print All
                  </button>
                </div>
                <div className="space-y-3">
                  {savedTonies.map((tonie) => (
                    <div
                      key={tonie.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      {/* Circles Row */}
                      <div className="flex justify-center space-x-8 mb-3">
                        <CirclePreview type="image" imageUrl={tonie.imageUrl} />
                        <CirclePreview
                          type="text"
                          title={tonie.title}
                          subtitle={tonie.subtitle}
                        />
                      </div>

                      {/* Info and Actions Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {tonie.title || "Untitled"}
                          </p>
                          {tonie.subtitle && (
                            <p className="text-sm text-gray-500 truncate">
                              {tonie.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTonie(tonie.id)}
                            className="flex cursor-pointer items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveTonie(tonie.id)}
                            className="flex cursor-pointer items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Print Area - Hidden on screen, visible only when printing */}
            <div id="print-area" className="hidden print:block bg-white p-8">
              <div className="grid grid-cols-4 gap-8">
                {savedTonies.map((tonie) => (
                  <React.Fragment key={tonie.id}>
                    <div className="flex flex-col items-center">
                      <CirclePreview type="image" imageUrl={tonie.imageUrl} />
                    </div>
                    <div className="flex flex-col items-center">
                      <CirclePreview
                        type="text"
                        title={tonie.title}
                        subtitle={tonie.subtitle}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 no-print">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Instructions
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>
              • Search for an existing Tonie from the database or create a
              custom one
            </li>
            <li>
              • Upload an image and enter title/subtitle for your custom tonie
            </li>
            <li>
              • Click "Add to List" to save the tonie and create another one
            </li>
            <li>• Repeat to create as many tonies as you need</li>
            <li>
              • Once you have all your tonies, click "Print All" to print them
              at exactly 40mm × 40mm
            </li>
            <li>
              • Make sure your printer is set to actual size (100%) for accurate
              40mm circles
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
