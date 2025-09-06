import { useState, useCallback } from 'react';
import { generateStyledImage } from '../services/geminiService';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const generateImage = useCallback(async (imageData, prompt, options = {}) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Simüle edilmiş progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await generateStyledImage(imageData, prompt, options);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setGeneratedImage(result.imageUrl);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
    setProgress(0);
  }, []);

  return {
    generateImage,
    isGenerating,
    generatedImage,
    error,
    progress,
    reset
  };
}
