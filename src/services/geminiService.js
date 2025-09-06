import { GoogleGenAI, Modality } from '@google/genai';
import { dataURLtoBlob } from '../utils/imageUtils';

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

/**
 * Generate styled image using Gemini API (Text-and-Image-to-Image)
 * Uses backend proxy for security in production
 */
export async function generateStyledImage(imageData, prompt, options = {}) {
  try {
    // Check if we're in development mode (has API key) or production (uses proxy)
    const isDevelopment = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (isDevelopment) {
      // Development mode - direct API call
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
      }

      // Extract base64 data from data URL
      const base64Image = imageData.split(',')[1];

      // Create the prompt for image transformation using the correct format
      const fullPrompt = `Transform the provided image according to this description: ${prompt}. Make sure the transformation is clear, artistic, and maintains the original composition while applying the new style.`;

      // Use the correct API format for text-and-image-to-image
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          { 
            text: fullPrompt 
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      });

      // Process the response to extract generated image
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log('Generated text:', part.text);
        } else if (part.inlineData) {
          // Return the generated image as base64
          const imageDataUrl = `data:image/jpeg;base64,${part.inlineData.data}`;
          return {
            success: true,
            imageUrl: imageDataUrl,
            prompt: fullPrompt
          };
        }
      }

      // If no image found in response, return error
      throw new Error('No image was generated. Please try a different prompt or check your input image.');
    } else {
      // Production mode - use backend proxy
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          prompt
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate image');
      }

      return result;
    }

  } catch (error) {
    console.error('Error generating styled image:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate styled image'
    };
  }
}

/**
 * Generate multiple styled images with different prompts
 */
export async function generateMultipleStyledImages(imageData, prompts, options = {}) {
  const results = [];
  
  for (const prompt of prompts) {
    try {
      const result = await generateStyledImage(imageData, prompt, options);
      results.push({
        prompt,
        ...result
      });
    } catch (error) {
      results.push({
        prompt,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Generate text-to-image (without input image)
 */
export async function generateTextToImage(prompt, options = {}) {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
    });

    // Process the response to extract generated image
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log('Generated text:', part.text);
      } else if (part.inlineData) {
        // Return the generated image as base64
        const imageDataUrl = `data:image/jpeg;base64,${part.inlineData.data}`;
        return {
          success: true,
          imageUrl: imageDataUrl,
          prompt: prompt
        };
      }
    }

    throw new Error('No image was generated. Please try a different prompt.');

  } catch (error) {
    console.error('Error generating text-to-image:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate image from text'
    };
  }
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured() {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}

/**
 * Get API status
 */
export async function getApiStatus() {
  try {
    if (!isApiKeyConfigured()) {
      return {
        status: 'error',
        message: 'API key not configured'
      };
    }

    // Test API with a simple text generation request
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: "Hello, test message",
    });
    
    return {
      status: 'success',
      message: 'API is working correctly'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'API test failed'
    };
  }
}
