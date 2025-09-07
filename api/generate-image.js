// Vercel Serverless Function for secure API calls
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API request received:', { method: req.method, headers: req.headers['content-type'] });
    
    const { imageData, prompt } = req.body;
    console.log('Request body parsed:', { 
      hasImageData: !!imageData, 
      imageDataLength: imageData?.length,
      hasPrompt: !!prompt,
      promptLength: prompt?.length 
    });

    if (!imageData || !prompt) {
      console.error('Missing parameters:', { hasImageData: !!imageData, hasPrompt: !!prompt });
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Rate limiting - simple implementation
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', clientIP);

    // Extract base64 from data URL more safely
    let base64Data;
    try {
      if (imageData.includes(',')) {
        base64Data = imageData.split(',')[1];
      } else {
        base64Data = imageData;
      }
      console.log('Base64 data extracted, length:', base64Data?.length);
    } catch (err) {
      console.error('Error extracting base64 data:', err);
      return res.status(400).json({ error: 'Invalid image data format' });
    }

    // Call Gemini API with server-side API key - Using Nano Banana (Gemini 2.5 Flash Image Preview)
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';
    console.log('Calling Gemini API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          { 
            parts: [
              { text: `Transform the provided image according to this description: ${prompt}. Make sure the transformation is clear, artistic, and maintains the original composition while applying the new style.` },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ]
      })
    });

    console.log('API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('API response received:', { 
      hasCandidates: !!result.candidates, 
      candidatesLength: result.candidates?.length 
    });
    
    // Extract image from response
    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log('Image found in response');
          return res.status(200).json({
            success: true,
            imageUrl: `data:image/jpeg;base64,${part.inlineData.data}`,
            prompt: prompt
          });
        }
      }
    }

    console.error('No image generated in response:', result);
    throw new Error('No image generated');

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate image' 
    });
  }
}
