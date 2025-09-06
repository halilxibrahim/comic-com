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
    const { imageData, prompt } = req.body;

    if (!imageData || !prompt) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Rate limiting - simple implementation
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // You could implement more sophisticated rate limiting here

    // Call Gemini API with server-side API key
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          { text: `Transform the provided image according to this description: ${prompt}. Make sure the transformation is clear, artistic, and maintains the original composition while applying the new style.` },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(',')[1]
            }
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Extract image from response
    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData) {
        return res.status(200).json({
          success: true,
          imageUrl: `data:image/jpeg;base64,${part.inlineData.data}`,
          prompt: prompt
        });
      }
    }

    throw new Error('No image generated');

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate image' 
    });
  }
}
