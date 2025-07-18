'use client';

import { useState, useEffect } from 'react';

export interface TextFormatting {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  textDecoration?: 'none' | 'underline';
  direction?: 'ltr' | 'rtl';
  imageWidth?: string;
  imageHeight?: string;
}

interface RichTextEditorProps {
  content: string;
  formatting: TextFormatting;
  onChange: (content: string, formatting: TextFormatting) => void;
  placeholder?: string;
  rows?: number;
}

const fontFamilies = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Dancing Script', value: 'Dancing Script, cursive' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
];

const popularColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#FFD700', '#8B4513', '#2F4F4F',
  '#DC143C', '#00CED1', '#FF69B4', '#32CD32', '#BA55D3', '#F0E68C', '#FF6347', '#4169E1'
];

const popularBackgroundColors = [
  '', '#F3F4F6', '#FEF3C7', '#DBEAFE', '#F3E8FF', '#FCE7F3', '#D1FAE5', '#FED7D7',
  '#E0F2FE', '#F0F9FF', '#ECFDF5', '#FEF7CD', '#FECACA', '#FEF2E7', '#E0E7FF', '#F0FDF4'
];

// Utility functions for recently used colors
const getRecentColors = (type: 'text' | 'background'): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`recentColors_${type}`);
  return stored ? JSON.parse(stored) : [];
};

const addRecentColor = (color: string, type: 'text' | 'background') => {
  if (typeof window === 'undefined') return;
  const recent = getRecentColors(type);
  const filtered = recent.filter(c => c !== color);
  const updated = [color, ...filtered].slice(0, 8); // Keep only 8 recent colors
  localStorage.setItem(`recentColors_${type}`, JSON.stringify(updated));
};

export default function RichTextEditor({ 
  content, 
  formatting, 
  onChange, 
  placeholder = 'Enter your text...', 
  rows = 4 
}: RichTextEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const [localFormatting, setLocalFormatting] = useState<TextFormatting>(formatting);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [recentTextColors, setRecentTextColors] = useState<string[]>([]);
  const [recentBgColors, setRecentBgColors] = useState<string[]>([]);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    setLocalFormatting(formatting);
  }, [formatting]);

  useEffect(() => {
    setRecentTextColors(getRecentColors('text'));
    setRecentBgColors(getRecentColors('background'));
  }, []);

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent);
    onChange(newContent, localFormatting);
  };

  const handleFormattingChange = (newFormatting: Partial<TextFormatting>) => {
    const updatedFormatting = { ...localFormatting, ...newFormatting };

    setLocalFormatting(updatedFormatting);
    onChange(localContent, updatedFormatting);
  };

  const toggleBold = () => {
    handleFormattingChange({
      fontWeight: localFormatting.fontWeight === 'bold' ? 'normal' : 'bold'
    });
  };

  const toggleItalic = () => {
    handleFormattingChange({
      fontStyle: localFormatting.fontStyle === 'italic' ? 'normal' : 'italic'
    });
  };

  const toggleUnderline = () => {
    handleFormattingChange({
      textDecoration: localFormatting.textDecoration === 'underline' ? 'none' : 'underline'
    });
  };

  const handleColorChange = (color: string, type: 'text' | 'background') => {
    if (type === 'text') {
      handleFormattingChange({ color });
      addRecentColor(color, 'text');
      setRecentTextColors(getRecentColors('text'));
      setShowColorPicker(false);
    } else {
      handleFormattingChange({ backgroundColor: color });
      addRecentColor(color, 'background');
      setRecentBgColors(getRecentColors('background'));
      setShowBgColorPicker(false);
    }
  };

  const textStyle: React.CSSProperties = {
    fontFamily: localFormatting.fontFamily || 'Arial, sans-serif',
    fontSize: localFormatting.fontSize || 'inherit',
    color: localFormatting.color || 'inherit',
    backgroundColor: localFormatting.backgroundColor || 'transparent',
    fontWeight: localFormatting.fontWeight || 'normal',
    fontStyle: localFormatting.fontStyle || 'normal',
    textAlign: localFormatting.textAlign || 'left',
    textDecoration: localFormatting.textDecoration || 'none',
    direction: localFormatting.direction || 'ltr',
  };

  return (
    <div className="space-y-4">
      {/* Formatting Controls */}
      <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Text Formatting</div>
        
        {/* Font Family and Size */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
            <select
              value={localFormatting.fontFamily || ''}
              onChange={(e) => handleFormattingChange({ fontFamily: e.target.value })}
              className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
            <input
              type="text"
              value={localFormatting.fontSize || ''}
              onChange={(e) => handleFormattingChange({ fontSize: e.target.value })}
              placeholder="e.g. 16px, 1.2rem"
              className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Style Controls */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={toggleBold}
            className={`px-3 py-1 text-sm font-bold rounded ${
              localFormatting.fontWeight === 'bold'
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            className={`px-3 py-1 text-sm italic rounded ${
              localFormatting.fontStyle === 'italic'
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            I
          </button>
          <button
            type="button"
            onClick={toggleUnderline}
            className={`px-3 py-1 text-sm underline rounded ${
              localFormatting.textDecoration === 'underline'
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            U
          </button>
        </div>

        {/* Alignment Controls */}
        <div className="flex gap-2">
          <div className="text-xs font-medium text-gray-600 flex items-center mr-2">Align:</div>
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => handleFormattingChange({ textAlign: align as any })}
              className={`px-3 py-1 text-sm rounded capitalize ${
                localFormatting.textAlign === align
                  ? 'bg-primary-500 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {align}
            </button>
          ))}
        </div>

        {/* Text Direction Controls */}
        <div className="flex gap-2">
          <div className="text-xs font-medium text-gray-600 flex items-center mr-2">Direction:</div>
          {[
            { value: 'ltr', label: 'LTR' },
            { value: 'rtl', label: 'RTL' }
          ].map((dir) => (
            <button
              key={dir.value}
              type="button"
              onClick={() => handleFormattingChange({ direction: dir.value as any })}
              className={`px-3 py-1 text-sm rounded ${
                localFormatting.direction === dir.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {dir.label}
            </button>
          ))}
        </div>

        {/* Color Controls */}
        <div className="flex gap-4">
          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-16 h-8 rounded border border-gray-300 shadow-sm"
              style={{ backgroundColor: localFormatting.color || '#000000' }}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg p-3 shadow-lg w-80">
                {/* Recently Used Colors */}
                {recentTextColors.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">Recently Used</div>
                    <div className="flex gap-1 flex-wrap">
                      {recentTextColors.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleColorChange(color, 'text')}
                          className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Popular Colors */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">Popular Colors</div>
                  <div className="grid grid-cols-8 gap-1">
                    {popularColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color, 'text')}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Color Wheel */}
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">Custom Color</div>
                  <input
                    type="color"
                    value={localFormatting.color || '#000000'}
                    onChange={(e) => handleColorChange(e.target.value, 'text')}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-600 mb-1">Background</label>
            <button
              type="button"
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              className="w-16 h-8 rounded border border-gray-300 shadow-sm"
              style={{ backgroundColor: localFormatting.backgroundColor || 'transparent' }}
            />
            {showBgColorPicker && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg p-3 shadow-lg w-80">
                {/* Recently Used Colors */}
                {recentBgColors.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">Recently Used</div>
                    <div className="flex gap-1 flex-wrap">
                      {recentBgColors.map((color, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleColorChange(color, 'background')}
                          className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                          style={{ 
                            backgroundColor: color || 'transparent',
                            backgroundImage: !color ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none',
                            backgroundSize: '8px 8px',
                            backgroundPosition: '0 0, 4px 4px'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Popular Colors */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">Popular Colors</div>
                  <div className="grid grid-cols-8 gap-1">
                    {popularBackgroundColors.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleColorChange(color, 'background')}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        style={{ 
                          backgroundColor: color || 'transparent',
                          backgroundImage: !color ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none',
                          backgroundSize: '8px 8px',
                          backgroundPosition: '0 0, 4px 4px'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Color Wheel */}
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">Custom Color</div>
                  <input
                    type="color"
                    value={localFormatting.backgroundColor || '#ffffff'}
                    onChange={(e) => handleColorChange(e.target.value, 'background')}
                    className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text Input */}
      <textarea
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={textStyle}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none"
      />
    </div>
  );
} 