import { useState, useRef, useEffect } from 'react';

const ImageComparison = ({ originalImage, generatedImage, styleName }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!originalImage || !generatedImage) return null;

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-col-resize"
        onMouseDown={handleMouseDown}
      >
        {/* Original Image */}
        <div className="absolute inset-0">
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Generated Image with Clip Path */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <img
            src={generatedImage}
            alt={`${styleName} Style`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          Original
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          {styleName}
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
