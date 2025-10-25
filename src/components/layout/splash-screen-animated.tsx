'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasShown, setHasShown] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splash_shown');

    if (splashShown) {
      setIsVisible(false);
      setHasShown(true);
      return;
    }

    // Début du fade out après 3.5 secondes
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    // Masquage complet après 4 secondes
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setHasShown(true);
      sessionStorage.setItem('splash_shown', 'true');
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setHasShown(true);
      sessionStorage.setItem('splash_shown', 'true');
    }, 500);
  };

  if (!isVisible || hasShown) return null;

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer overflow-hidden ${
        fadeOut ? 'animate-fadeOut' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #0a1929 0%, #1a365d 50%, #0f172a 100%)'
      }}
    >
      {/* Effet de vagues animées en arrière-plan */}
      <div className="absolute inset-0 opacity-30">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Contenu central */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-slideUp">
        {/* Logo avec animation de pulse */}
        <div className="relative animate-pulse-slow">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 animate-ping-slow"></div>
          <Image
            src="/logo.ico"
            alt="Le Spot SUP"
            width={120}
            height={120}
            className="relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* Texte principal avec animation */}
        <div className="text-center animate-fadeInUp">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Le Spot SUP
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 font-light tracking-wide">
            Trouvez votre spot idéal
          </p>
        </div>

        {/* Barre de chargement animée */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 animate-loading"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(0%) translateY(0%) rotate(0deg);
          }
          25% {
            transform: translateX(5%) translateY(-5%) rotate(1deg);
          }
          50% {
            transform: translateX(-5%) translateY(0%) rotate(-1deg);
          }
          75% {
            transform: translateX(3%) translateY(5%) rotate(0.5deg);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes pingSlow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-loading {
          animation: loading 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: pingSlow 2s ease-in-out infinite;
        }

        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            ellipse at center,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 70%
          );
          animation: wave 10s ease-in-out infinite;
        }

        .wave1 {
          top: -50%;
          left: -50%;
          animation-delay: 0s;
        }

        .wave2 {
          top: -30%;
          left: -30%;
          animation-delay: -3s;
          animation-duration: 12s;
        }

        .wave3 {
          top: -40%;
          left: -40%;
          animation-delay: -6s;
          animation-duration: 15s;
        }
      `}</style>
    </div>
  );
}
