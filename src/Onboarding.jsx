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
    <div 
      className={`fixed inset-0 z-50 transition-all duration-700 overflow-y-auto overflow-x-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Full Background Layer - Fixed background that doesn't scroll */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pointer-events-none">
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

      {/* Content Container - Now scrollable at root level */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between px-4 py-4 md:py-8">
        
          {/* Fixed Header with Language Switcher and Skip Button */}
          <div className="w-full flex justify-between items-center p-4 md:p-8 relative z-20">
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
              {t('onboarding.skip')}
            </button>

            {/* Language Switcher */}
            <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-2xl p-1.5 md:p-2 border border-white/20">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-300 text-sm md:text-base ${
                  i18n.language === 'en' 
                    ? 'bg-white text-purple-900 font-semibold' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('tr')}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all duration-300 text-sm md:text-base ${
                  i18n.language === 'tr' 
                    ? 'bg-white text-purple-900 font-semibold' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                TR
              </button>
            </div>
          </div>

          {/* Main Content - Flex-1 to take available space */}
          <div className="text-center max-w-4xl mx-auto flex-1 flex flex-col justify-center py-8 md:py-16">
            
            {/* Welcome Animation */}
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="inline-block mb-6 md:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full blur-lg opacity-75 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-pink-500 to-violet-600 rounded-full p-1">
                    <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 md:p-3">
                      <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent px-4">
                {t('onboarding.welcome')}
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 px-4">
                {t('onboarding.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-purple-200 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                {t('onboarding.subtitle')}
              </p>
            </div>

            {/* Features */}
            <div className={`transform transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 px-4">
                {t('onboarding.features.title')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-700 ${feature.delay} ${
                      isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                    }`}
                  >
                    <button
                      onClick={handleGetStarted}
                      className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-white mb-2 md:mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-purple-200 text-xs md:text-sm leading-relaxed mb-2">
                        {feature.description}
                      </p>
                      <div className="text-xs text-white/60 group-hover:text-white transition-colors duration-300">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <button
                  onClick={handleGetStarted}
                  className="group relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold text-base md:text-lg rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4 md:w-5 md:h-5" />
                    {t('onboarding.getStarted')}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </div>
            </div>

            {/* Floating Elements - Responsive positioning */}
            <div className="hidden md:block absolute top-1/4 left-8 animate-bounce" style={{ animationDuration: '3s' }}>
              <Star className="w-6 h-6 text-yellow-400/60" />
            </div>
            <div className="hidden md:block absolute top-1/3 right-12 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <Star className="w-4 h-4 text-pink-400/60" />
            </div>
            <div className="hidden md:block absolute bottom-1/4 left-16 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
              <Star className="w-5 h-5 text-blue-400/60" />
            </div>
            <div className="hidden md:block absolute bottom-1/3 right-20 animate-bounce" style={{ animationDuration: '6s', animationDelay: '3s' }}>
              <Star className="w-4 h-4 text-purple-400/60" />
            </div>
          </div>

        {/* Bottom padding for scroll */}
        <div className="h-16 md:h-8 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default Onboarding;
