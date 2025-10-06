import React, { useEffect, useRef } from 'react';
import { TShirtView } from '@/store/canvasStore';
import tshirtFront from '@/assets/tshirt-front.png';
import tshirtBack from '@/assets/tshirt-back.png';

interface TShirtMockupProps {
  view: TShirtView;
  color: string;
  width?: number;
  height?: number;
}

export const TShirtMockup: React.FC<TShirtMockupProps> = ({ 
  view, 
  color, 
  width = 500, 
  height = 600 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Select the correct image based on view
  const getImageForView = (viewType: TShirtView) => {
    switch(viewType) {
      case 'front':
      case 'left':
        return tshirtFront;
      case 'back':
      case 'right':
        return tshirtBack;
      default:
        return tshirtFront;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = getImageForView(view);

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate scaling to fit
      const scale = Math.min(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;

      if (color === '#FFFFFF') {
        // For white, just draw the image
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // Draw the t-shirt image first
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Apply color overlay
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Draw original image with multiply blend for texture
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.7;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();

        // Add highlights
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.15;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();
      }
    };

    img.onerror = () => {
      console.error('Failed to load t-shirt image for view:', view);
    };
  }, [color, width, height, view]);

  return (
    <div
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      />
    </div>
  );
};
