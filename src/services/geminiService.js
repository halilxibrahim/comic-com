import { GoogleGenAI, Modality } from '@google/genai';
import { dataURLtoBlob } from '../utils/imageUtils';

// Lazy initialization of Gemini AI - only when needed and API key is available
let ai = null;

function getGeminiAI() {
  if (!ai && import.meta.env.VITE_GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    });
  }
  return ai;
}

/**
 * Generate styled image using Gemini API (Text-and-Image-to-Image)
 * Uses backend proxy for security in production
 */
export async function generateStyledImage(imageData, prompt, options = {}) {
  try {
    const isProduction = import.meta.env.PROD || !import.meta.env.VITE_GEMINI_API_KEY;
    
    console.log('Generation mode:', { 
      isProduction, 
      PROD: import.meta.env.PROD, 
      hasViteKey: !!import.meta.env.VITE_GEMINI_API_KEY 
    });
    
    if (isProduction) {
      // Production mode - use backend proxy
      console.log('Using production backend proxy...');
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
      console.log('Backend response:', { status: response.status, result });
      
      if (!response.ok) {
        // Better error handling for production
        const errorMessage = result.error || 'Failed to generate image';
        console.error('Backend error:', { status: response.status, error: errorMessage, details: result.details });
        throw new Error(errorMessage);
      }

      return result;
    } else {
      // Development mode - direct API call
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
      }

      // Extract base64 data from data URL
      const base64Image = imageData.split(',')[1];

      // Create the prompt for image transformation using the correct format
      const fullPrompt = `Transform the provided image according to this description: ${prompt}. Make sure the transformation is clear, artistic, and maintains the original composition while applying the new style.`;

      // Use the correct API format for text-and-image-to-image
      const aiInstance = getGeminiAI();
      if (!aiInstance) {
        throw new Error('Gemini AI not properly initialized');
      }
      
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          { 
            parts: [
              { text: fullPrompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              }
            ]
          }
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

    const aiInstance = getGeminiAI();
    if (!aiInstance) {
      throw new Error('Gemini AI not properly initialized');
    }
    
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
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
    const aiInstance = getGeminiAI();
    if (!aiInstance) {
      throw new Error('Gemini AI not properly initialized');
    }
    
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [
        {
          parts: [
            { text: "Hello, test message" }
          ]
        }
      ],
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
