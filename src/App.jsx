import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Wand2, Download, Sparkles, Clock, Palette, BookOpen, Globe, ArrowLeft, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Onboarding from './Onboarding';
import { useImageGeneration } from './hooks/useImageGeneration';
import { STYLE_TEMPLATES } from './utils/constants';
import { validateFileSize, validateFileType, resizeImage, downloadImage, captureFromCamera } from './utils/imageUtils';
import { isApiKeyConfigured } from './services/geminiService';

function App() {
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAppVisible, setIsAppVisible] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Use the custom hook for image generation
  const {
    generateImage,
    isGenerating,
    generatedImage,
    error: generationError,
    progress,
    reset: resetGeneration
  } = useImageGeneration();

  // Check if user has seen onboarding before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
      setIsAppVisible(true);
    }
    
    // Check API key configuration
    if (!isApiKeyConfigured()) {
      setApiKeyError(true);
    }
  }, []);

  // Language switching function
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Onboarding handlers
  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    setIsAppVisible(true);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    setIsAppVisible(true);
  };

  const handleBackToOnboarding = () => {
    setShowOnboarding(true);
    setIsAppVisible(false);
  };

  // Dosya seçme işlemi
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file type and size
      validateFileType(file);
      validateFileSize(file);

      // Resize image if needed
      const resizedImage = await resizeImage(file);
      setSelectedImage(resizedImage);
      resetGeneration();
    } catch (error) {
      alert(error.message);
    }
  };

  // Kamera ile fotoğraf çekme
  const handleCameraCapture = async () => {
    try {
      const imageData = await captureFromCamera();
      setSelectedImage(imageData);
      resetGeneration();
    } catch (error) {
      alert(error.message);
    }
  };

  // Image generation
  const handleGenerateImage = async () => {
    if (!selectedImage) {
      alert(t('generate.selectPhotoFirst'));
      return;
    }

    if (!selectedStyle && !customPrompt.trim()) {
      alert(t('generate.selectStyleOrPrompt'));
      return;
    }

    if (!isApiKeyConfigured()) {
      alert('API key is not configured. Please check your environment setup.');
      return;
    }

    try {
      // Get the prompt based on selected style or custom prompt
      const prompt = selectedStyle 
        ? STYLE_TEMPLATES.find(template => template.id === selectedStyle)?.prompt
        : customPrompt;

      if (!prompt) {
        alert('Please select a style or enter a custom prompt');
        return;
      }

      await generateImage(selectedImage, prompt);
    } catch (error) {
      console.error('Image generation error:', error);
      alert(error.message || t('errors.imageGeneration'));
    }
  };

  // Batch generation for all styles
  const handleBatchGenerate = async () => {
    if (!selectedImage) {
      alert(t('generate.selectPhotoFirst'));
      return;
    }

    if (!isApiKeyConfigured()) {
      alert('API key is not configured. Please check your environment setup.');
      return;
    }

    setIsBatchGenerating(true);
    setGeneratedImages([]);

    try {
      const prompts = STYLE_TEMPLATES.map(template => template.prompt);
      const results = [];

      for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        const template = STYLE_TEMPLATES[i];
        
        try {
          const result = await generateImage(selectedImage, prompt);
          if (result.success) {
            results.push({
              ...template,
              imageUrl: result.imageUrl,
              success: true
            });
          } else {
            results.push({
              ...template,
              success: false,
              error: result.error
            });
          }
        } catch (error) {
          results.push({
            ...template,
            success: false,
            error: error.message
          });
        }
      }

      setGeneratedImages(results);
    } catch (error) {
      console.error('Batch generation error:', error);
      alert('Batch generation failed: ' + error.message);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // Download result
  const handleDownloadImage = () => {
    if (!generatedImage) return;
    downloadImage(generatedImage, 'styled-photo.jpg');
  };

  return (
    <>
      {/* Onboarding Screen */}
      {showOnboarding && (
        <Onboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Main App */}
      <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 transition-all duration-700 ${
        isAppVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          {/* API Key Error Display */}
          {apiKeyError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl backdrop-blur-lg">
              <div className="flex items-center gap-3 text-red-200">
                <AlertCircle className="w-6 h-6" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">API Key Required</h3>
                  <p className="text-sm">Please configure your Gemini API key. Check ENVIRONMENT_SETUP.md for instructions.</p>
                </div>
              </div>
            </div>
          )}

          {/* Back to Onboarding Button */}
          <div className="flex justify-start mb-6">
            <button
              onClick={handleBackToOnboarding}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-3 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">{t('onboarding.backToOnboarding')}</span>
            </button>
          </div>
          
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
                  onClick={handleCameraCapture}
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
                {STYLE_TEMPLATES.map((template) => {
                  // Map template categories to icons and gradients
                  const getTemplateIcon = (category) => {
                    switch (category) {
                      case 'historical': return <Clock className="w-5 h-5" />;
                      case 'fantasy': return <Sparkles className="w-5 h-5" />;
                      case 'art': return <Palette className="w-5 h-5" />;
                      case 'sci-fi': return <BookOpen className="w-5 h-5" />;
                      default: return <Palette className="w-5 h-5" />;
                    }
                  };

                  const getTemplateGradient = (category) => {
                    switch (category) {
                      case 'historical': return 'from-amber-500 to-orange-600';
                      case 'fantasy': return 'from-blue-500 to-cyan-600';
                      case 'art': return 'from-pink-500 to-red-600';
                      case 'sci-fi': return 'from-purple-500 to-indigo-600';
                      default: return 'from-gray-500 to-gray-600';
                    }
                  };

                  return (
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
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getTemplateGradient(template.category)} flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                        {getTemplateIcon(template.category)}
                      </div>
                      <div className="text-white text-sm font-semibold text-center">
                        {template.name}
                      </div>
                    </button>
                  );
                })}
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

            {/* Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                Generation Mode
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setBatchMode(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    !batchMode 
                      ? 'bg-white text-purple-900' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Single Style
                </button>
                <button
                  onClick={() => setBatchMode(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    batchMode 
                      ? 'bg-white text-purple-900' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All Styles
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={batchMode ? handleBatchGenerate : handleGenerateImage}
              disabled={isGenerating || isBatchGenerating || (!selectedImage) || apiKeyError}
              className={`w-full py-6 rounded-3xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl transform ${
                isGenerating || isBatchGenerating || (!selectedImage) || apiKeyError
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 hover:scale-105'
              } text-white`}
            >
              {isGenerating || isBatchGenerating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  {batchMode ? 'Generating All Styles...' : `${t('generate.generating')} (${progress}%)`}
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  {batchMode ? 'Generate All Styles' : t('generate.button')}
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-violet-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Error Display */}
            {generationError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold">Generation Error</p>
                    <p className="text-xs text-red-300 mt-1">{generationError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs text-red-200 underline hover:text-white mt-2"
                    >
                      Try refreshing the page
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {generatedImage && !generationError && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-2xl">
                <div className="flex items-center gap-2 text-green-200">
                  <Sparkles className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold">Image Generated Successfully!</p>
                    <p className="text-xs text-green-300 mt-1">Click download to save your creation</p>
                  </div>
                </div>
              </div>
            )}
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
              ) : batchMode ? (
                // Batch Results
                <div className="h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      All Style Results
                    </h3>
                    {generatedImages.length > 0 && (
                      <button
                        onClick={() => {
                          generatedImages.forEach((img, index) => {
                            if (img.success) {
                              downloadImage(img.imageUrl, `${img.name}-${index}.jpg`);
                            }
                          });
                        }}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Download className="w-5 h-5" />
                        Download All
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto">
                    {generatedImages.map((result, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="text-lg font-semibold text-white text-center">
                          {result.name}
                        </h4>
                        <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden shadow-xl">
                          {result.success ? (
                            <img
                              src={result.imageUrl}
                              alt={result.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-red-500/50">
                              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                              <p className="text-red-400 text-sm text-center px-2">
                                {result.error || 'Generation failed'}
                              </p>
                            </div>
                          )}
                        </div>
                        {result.success && (
                          <button
                            onClick={() => downloadImage(result.imageUrl, `${result.name}.jpg`)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 font-semibold text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {generatedImages.length === 0 && !isBatchGenerating && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Sparkles className="w-16 h-16 text-white/30 mb-4" />
                      <p className="text-white/60 text-center text-lg font-semibold">
                        Click "Generate All Styles" to see results
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Single Style Results
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
                            onClick={handleDownloadImage}
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
    </>
  );
}

export default App;