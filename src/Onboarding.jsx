import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  Wand2, 
  Camera, 
  Palette, 
  Zap, 
  Star, 
  ArrowRight,
  X,
  Globe
} from 'lucide-react';

const Onboarding = ({ onComplete, onSkip }) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('onboarding.features.ai.title'),
      description: t('onboarding.features.ai.description'),
      gradient: 'from-yellow-400 to-orange-500',
      delay: 'delay-100'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: t('onboarding.features.styles.title'),
      description: t('onboarding.features.styles.description'),
      gradient: 'from-pink-400 to-purple-500',
      delay: 'delay-200'
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: t('onboarding.features.easy.title'),
      description: t('onboarding.features.easy.description'),
      gradient: 'from-blue-400 to-cyan-500',
      delay: 'delay-300'
    }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleGetStarted = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-700 overflow-hidden ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Full Background Layer */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        {/* Floating particles */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Gradient orbs - Single screen coverage */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-between px-4 py-4">
        
        {/* Language Switcher */}
        <div className="absolute top-8 right-8">
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

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-8 left-8 text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          {t('onboarding.skip')}
        </button>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto flex-1 flex flex-col justify-center">
          
          {/* Welcome Animation */}
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full blur-lg opacity-75 animate-pulse" />
                <div className="relative bg-gradient-to-r from-pink-500 to-violet-600 rounded-full p-1">
                  <div className="bg-white/10 backdrop-blur-lg rounded-full p-3">
                    <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('onboarding.welcome')}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t('onboarding.title')}
            </h2>
            <p className="text-lg md:text-xl text-purple-200 mb-6 max-w-3xl mx-auto leading-relaxed">
              {t('onboarding.subtitle')}
            </p>
          </div>

          {/* Features */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              {t('onboarding.features.title')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 ${feature.delay} ${
                    isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                  }`}
                >
                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-purple-200 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-2 text-xs text-white/60 group-hover:text-white transition-colors duration-300">
                      {t('onboarding.clickToStart')}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="group relative px-8 py-3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  {t('onboarding.getStarted')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </div>

          {/* Floating Elements - Compact distribution */}
          <div className="absolute top-1/4 left-8 animate-bounce" style={{ animationDuration: '3s' }}>
            <Star className="w-6 h-6 text-yellow-400/60" />
          </div>
          <div className="absolute top-1/3 right-12 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <Star className="w-4 h-4 text-pink-400/60" />
          </div>
          <div className="absolute bottom-1/4 left-16 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
            <Star className="w-5 h-5 text-blue-400/60" />
          </div>
          <div className="absolute bottom-1/3 right-20 animate-bounce" style={{ animationDuration: '6s', animationDelay: '3s' }}>
            <Star className="w-4 h-4 text-purple-400/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
