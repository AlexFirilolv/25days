'use client';

import { TextFormatting } from './RichTextEditor';

type BlockType = 'title' | 'paragraph' | 'image' | 'media' | 'quote' | 'highlight';

export interface Block {
  id: string;
  block_type: BlockType;
  content: string;
  formatting?: TextFormatting;
}

export interface DisplaySettings {
    imageSize?: string;
    titleFontSize?: string;
    paragraphFontSize?: string;
    quoteFontSize?: string;
    highlightFontSize?: string;
}

export const BlockRenderer = ({ block, settings = {} }: { block: Block, settings?: DisplaySettings }) => {
    const style: React.CSSProperties = {};
    
    // Apply formatting if available
    if (block.formatting) {
      if (block.formatting.fontFamily) style.fontFamily = block.formatting.fontFamily;
      if (block.formatting.fontSize) style.fontSize = block.formatting.fontSize;
      if (block.formatting.color) style.color = block.formatting.color;
      if (block.formatting.backgroundColor) style.backgroundColor = block.formatting.backgroundColor;
      if (block.formatting.fontWeight) style.fontWeight = block.formatting.fontWeight;
      if (block.formatting.fontStyle) style.fontStyle = block.formatting.fontStyle;
      if (block.formatting.textAlign) style.textAlign = block.formatting.textAlign;
      if (block.formatting.textDecoration) style.textDecoration = block.formatting.textDecoration;
      if (block.formatting.direction) style.direction = block.formatting.direction;
    }

    // Apply display settings (these can override formatting)
    switch (block.block_type) {
      case 'title':
        if (settings.titleFontSize) style.fontSize = settings.titleFontSize;
        const titleDefaultStyle = {
          fontFamily: style.fontFamily || 'Arial, sans-serif',
          fontSize: style.fontSize || '3rem',
          fontWeight: style.fontWeight || 'bold',
          color: style.color || '#1f2937',
        };
        return (
          <h1 
            className="my-4" 
            style={{ ...titleDefaultStyle, ...style }}
          >
            {block.content}
          </h1>
        );
      
      case 'paragraph':
        if (settings.paragraphFontSize) style.fontSize = settings.paragraphFontSize;
        const paragraphDefaultStyle = {
          fontFamily: style.fontFamily || 'Arial, sans-serif',
          fontSize: style.fontSize || '1.25rem',
          color: style.color || '#374151',
          lineHeight: '1.75',
        };
        return (
          <p 
            className="my-4" 
            style={{ ...paragraphDefaultStyle, ...style }}
          >
            {block.content}
          </p>
        );
      
      case 'image':
      case 'media':
        if (settings.imageSize) style.width = settings.imageSize;
        if (block.formatting?.imageWidth) style.width = block.formatting.imageWidth;
        if (block.formatting?.imageHeight) style.height = block.formatting.imageHeight;
        
        // Determine media type from file extension
        const getMediaType = (url: string): 'image' | 'video' | 'audio' | null => {
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

        const mediaType = getMediaType(block.content);
        
        switch (mediaType) {
          case 'image':
            return (
              <img 
                src={block.content} 
                alt="Memory" 
                className="h-auto rounded-xl shadow-lg my-4 mx-auto" 
                style={style} 
              />
            );
          case 'video':
            return (
              <video 
                src={block.content} 
                controls
                className="h-auto rounded-xl shadow-lg my-4 mx-auto" 
                style={style}
              >
                Your browser does not support the video tag.
              </video>
            );
          case 'audio':
            return (
              <div className="my-4 mx-auto max-w-md">
                <audio 
                  src={block.content} 
                  controls
                  className="w-full"
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            );
          default:
            return (
              <div className="my-4 mx-auto max-w-md p-4 border border-gray-300 rounded-xl bg-gray-50 text-center">
                <p className="text-gray-600">Unsupported media type</p>
                <p className="text-sm text-gray-500">{block.content}</p>
              </div>
            );
        }
      
      case 'quote':
        if (settings.quoteFontSize) style.fontSize = settings.quoteFontSize;
        const quoteDefaultStyle = {
          fontFamily: style.fontFamily || 'Arial, sans-serif',
          fontSize: style.fontSize || '1.5rem',
          fontStyle: style.fontStyle || 'italic',
          textAlign: style.textAlign || 'center',
          color: style.color || '#4b5563',
        };
        return (
          <blockquote 
            className="border-l-4 border-primary-300 pl-4 my-6" 
            style={{ ...quoteDefaultStyle, ...style }}
          >
            {block.content}
          </blockquote>
        );
      
      case 'highlight':
        if (settings.highlightFontSize) style.fontSize = settings.highlightFontSize;
        const highlightDefaultStyle = {
          fontFamily: style.fontFamily || 'Arial, sans-serif',
          backgroundColor: style.backgroundColor || 'rgba(252, 165, 165, 0.3)',
          color: style.color || '#be185d',
          padding: '1rem',
          borderRadius: '0.5rem',
        };
        return (
          <div 
            className="my-4" 
            style={{ ...highlightDefaultStyle, ...style }}
          >
            {block.content}
          </div>
        );
      
      default:
        return null;
    }
}; 