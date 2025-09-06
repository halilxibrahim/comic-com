# Comic-Com: AI-Powered Image Style Transformation

A cutting-edge web application that transforms your photos into various artistic styles using Google's Gemini 2.5 Flash Image Preview API. Built for the Nano Banana Hackathon 2025.

## 🚀 Features

- **Text-and-Image-to-Image Transformation**: Upload any photo and transform it with AI
- **12 Unique Art Styles**: From medieval knights to cyberpunk characters
- **Batch Generation**: Generate all styles at once for comparison
- **Real-time Camera Capture**: Take photos directly in the browser
- **Multilingual Support**: English and Turkish interface
- **Responsive Design**: Works on desktop and mobile devices
- **Secure API Handling**: Backend proxy for production deployment

## 🎨 Art Styles Available

- **Historical**: Medieval Knight, Renaissance Portrait, Film Noir
- **Fantasy**: Superhero, Steampunk, Pirate
- **Art**: Comic Book, Anime Character, Vintage Poster, Watercolor
- **Sci-Fi**: Cyberpunk, Space Explorer

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash Image Preview API
- **Deployment**: Vercel with serverless functions
- **Internationalization**: i18next
- **Icons**: Lucide React

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd comic-com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Production Deployment (Vercel)

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add `GEMINI_API_KEY` with your API key
   - The app will automatically use the backend proxy

## 🔧 API Configuration

### Getting Your API Key

1. Visit [Google AI Studio](https://ai.studio/banana)
2. Sign in with your Google account
3. Click "Get API key" in the left navigation
4. Create a new API key
5. Copy the key to your environment variables

### API Usage

- **Development**: Uses direct API calls with `VITE_GEMINI_API_KEY`
- **Production**: Uses secure backend proxy with `GEMINI_API_KEY`
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Comprehensive error messages and retry logic

## 📱 Usage

1. **Upload or Capture**: Choose a photo from your device or use the camera
2. **Select Style**: Pick from 12 predefined art styles or enter custom prompt
3. **Choose Mode**: Single style generation or batch generation of all styles
4. **Generate**: Click the generate button and wait for AI magic
5. **Download**: Save your transformed images

## 🎯 Hackathon Features

This project showcases the power of Gemini 2.5 Flash Image Preview through:

- **Dynamic Style Transfer**: Real-time image transformation
- **Batch Processing**: Multiple style generation in one go
- **Creative Workflow**: Streamlined user experience for artists
- **Multilingual Support**: Global accessibility
- **Mobile-First Design**: Works on any device

## 🔒 Security

- API keys are never exposed to the client in production
- Backend proxy handles all API communications
- Rate limiting prevents abuse
- Input validation and sanitization

## 📄 License

This project is created for the Nano Banana Hackathon 2025. All rights reserved.

## 🤝 Contributing

This is a hackathon project. For questions or suggestions, please open an issue.

## 📞 Support

For technical support or questions about the hackathon submission, please contact the development team.

---

**Built with ❤️ for the Nano Banana Hackathon 2025**