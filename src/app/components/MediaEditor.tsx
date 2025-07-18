'use client';

import { useState } from 'react';
import { TextFormatting } from './RichTextEditor';

interface MediaEditorProps {
  content: string;
  formatting: TextFormatting;
  onChange: (content: string, formatting: TextFormatting) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaEditor({ content, formatting, onChange, onFileChange }: MediaEditorProps) {
  const [localFormatting, setLocalFormatting] = useState<TextFormatting>(formatting);

  const handleFormattingChange = (newFormatting: Partial<TextFormatting>) => {
    const updatedFormatting = { ...localFormatting, ...newFormatting };
    setLocalFormatting(updatedFormatting);
    onChange(content, updatedFormatting);
  };

  const presetSizes = [
    { label: '25%', value: '25%' },
    { label: '50%', value: '50%' },
    { label: '75%', value: '75%' },
    { label: '100%', value: '100%' },
    { label: 'Small (200px)', value: '200px' },
    { label: 'Medium (400px)', value: '400px' },
    { label: 'Large (600px)', value: '600px' },
    { label: 'X-Large (800px)', value: '800px' },
  ];

  const getFileType = (url: string): 'image' | 'video' | 'audio' | null => {
    if (!url) return null;
    const extension = url.split('.').pop()?.toLowerCase();
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
    
    if (imageExtensions.includes(extension || '')) return 'image';
    if (videoExtensions.includes(extension || '')) return 'video';
    if (audioExtensions.includes(extension || '')) return 'audio';
    
    return null;
  };

  const renderMediaPreview = () => {
    if (!content) return null;
    
    const fileType = getFileType(content);
    const style = {
      width: localFormatting.imageWidth || 'auto',
      height: localFormatting.imageHeight || 'auto',
    };

    switch (fileType) {
      case 'image':
        return (
          <img
            src={content}
            alt="preview"
            className="max-h-40 rounded-md mx-auto"
            style={style}
          />
        );
      case 'video':
        return (
          <video
            src={content}
            controls
            className="max-h-40 rounded-md mx-auto"
            style={style}
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio
            src={content}
            controls
            className="w-full"
          >
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return (
          <div className="text-gray-500 text-center py-4">
            <p>Unsupported file type</p>
            <p className="text-sm">URL: {content}</p>
          </div>
        );
    }
  };

  const fileType = getFileType(content);
  const showSizeControls = fileType === 'image' || fileType === 'video';

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
        <input
          type="file"
          onChange={onFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
          accept="image/*,video/*,audio/*"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: Images (JPG, PNG, GIF, etc.), Videos (MP4, MOV, AVI, etc.), Audio (MP3, WAV, etc.)
        </p>
      </div>

      {/* Media Preview */}
      {content && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
          {renderMediaPreview()}
        </div>
      )}

      {/* Size Controls - Only for Images and Videos */}
      {content && showSizeControls && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <div className="text-sm font-medium text-gray-700">Media Size</div>
          
          {/* Preset Sizes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Quick Sizes</label>
            <div className="grid grid-cols-4 gap-2">
              {presetSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => handleFormattingChange({ imageWidth: size.value, imageHeight: 'auto' })}
                  className={`px-2 py-1 text-xs rounded border ${
                    localFormatting.imageWidth === size.value
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Size Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
              <input
                type="text"
                value={localFormatting.imageWidth || ''}
                onChange={(e) => handleFormattingChange({ imageWidth: e.target.value })}
                placeholder="e.g. 400px, 50%, auto"
                className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
              <input
                type="text"
                value={localFormatting.imageHeight || ''}
                onChange={(e) => handleFormattingChange({ imageHeight: e.target.value })}
                placeholder="e.g. 300px, auto"
                className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => handleFormattingChange({ imageWidth: '100%', imageHeight: 'auto' })}
            className="text-sm text-pink-600 hover:text-pink-800 font-medium"
          >
            Reset to Full Size
          </button>
        </div>
      )}
    </div>
  );
} 