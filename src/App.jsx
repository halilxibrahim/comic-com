import { useState, useRef } from 'react';
import { Camera, Upload, Wand2, Download, Sparkles, Clock, Palette, BookOpen, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Predefined style templates
const STYLE_TEMPLATES = [
  {
    id: 'medieval',
    nameKey: 'styles.medieval',
    icon: <Clock className="w-5 h-5" />,
    prompt: 'Transform this person into a medieval knight in shining armor, standing in front of a majestic castle, epic fantasy style, cinematic lighting',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'renaissance',
    nameKey: 'styles.renaissance',
    icon: <Palette className="w-5 h-5" />,
    prompt: 'Transform this person into a Renaissance painting style portrait, noble clothing, classical background, oil painting technique',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'superhero',
    nameKey: 'styles.superhero',
    icon: <Sparkles className="w-5 h-5" />,
    prompt: 'Transform this person into a superhero with a colorful costume, cape, standing on a rooftop with city skyline, comic book style',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'comic',
    nameKey: 'styles.comic',
    icon: <BookOpen className="w-5 h-5" />,
    prompt: 'Transform this person into comic book character, bold outlines, vibrant colors, pop art style, speech bubble background',
    gradient: 'from-pink-500 to-red-600'
  }
];

function App() {
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Language switching function
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Dosya seçme işlemi
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Kamera ile fotoğraf çekme
  const captureFromCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Camera access error:', error);
      alert(t('errors.cameraAccess'));
    }
  };

  // Image generation
  const generateStyledImage = async () => {
    if (!selectedImage) {
      alert(t('generate.selectPhotoFirst'));
      return;
    }

    if (!selectedStyle && !customPrompt.trim()) {
      alert(t('generate.selectStyleOrPrompt'));
      return;
    }

    setIsGenerating(true);

    try {
      // Simulation - replace this section for real API integration
      setTimeout(() => {
        setGeneratedImage(selectedImage); // Show same image for demo
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Image generation error:', error);
      alert(t('errors.imageGeneration'));
      setIsGenerating(false);
    }
  };

  // Download result
  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = 'styled-photo.jpg';
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  i18n.language === 'en' 
                    ? 'bg-white text-purple-900 font-semibold' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('tr')}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  i18n.language === 'tr' 
                    ? 'bg-white text-purple-900 font-semibold' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                TR
              </button>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('app.title')}
          </h1>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto">
            {t('app.subtitle')}
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Photo Upload */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Camera className="w-6 h-6" />
                {t('upload.title')}
              </h2>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
              />
              
              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Upload className="w-5 h-5" />
                  {t('upload.selectFile')}
                </button>
                
                <button
                  onClick={captureFromCamera}
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Camera className="w-5 h-5" />
                  {t('upload.captureFromCamera')}
                </button>
              </div>
            </div>

            {/* Style Options */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('styles.title')}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {STYLE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedStyle(template.id);
                      setCustomPrompt('');
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedStyle === template.id
                        ? 'border-white bg-white/20 shadow-xl'
                        : 'border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${template.gradient} flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                      {template.icon}
                    </div>
                    <div className="text-white text-sm font-semibold text-center">
                      {t(template.nameKey)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('customPrompt.title')}
              </h2>
              
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  setSelectedStyle('');
                }}
                placeholder={t('customPrompt.placeholder')}
                className="w-full h-32 bg-white/10 border border-white/30 rounded-2xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateStyledImage}
              disabled={isGenerating || (!selectedImage)}
              className={`w-full py-6 rounded-3xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl transform ${
                isGenerating || (!selectedImage)
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 hover:scale-105'
              } text-white`}
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('generate.generating')}
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  {t('generate.button')}
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl h-full min-h-[600px]">
              
              {!selectedImage ? (
                // Placeholder
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Camera className="w-24 h-24 text-white/30 mb-8" />
                  <h3 className="text-3xl font-bold text-white mb-4">{t('upload.waitingForPhoto')}</h3>
                  <p className="text-xl text-white/60">
                    {t('upload.selectPhotoFromLeft')}
                  </p>
                </div>
              ) : (
                // Photo Comparison
                <div className="h-full">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
                    
                    {/* Original Photo */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        {t('preview.original')}
                      </h3>
                      <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <img
                          src={selectedImage}
                          alt="Original photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Result */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                          {t('preview.result')}
                        </h3>
                        {generatedImage && (
                          <button
                            onClick={downloadImage}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Download className="w-5 h-5" />
                            {t('preview.download')}
                          </button>
                        )}
                      </div>
                      
                      <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden shadow-xl">
                        {generatedImage ? (
                          <img
                            src={generatedImage}
                            alt="Generated photo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/20">
                            <Sparkles className="w-16 h-16 text-white/30 mb-4" />
                            <p className="text-white/60 text-center text-lg font-semibold">
                              {t('preview.resultWillAppearHere')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-lg">{t('footer.poweredBy')}</p>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default App;