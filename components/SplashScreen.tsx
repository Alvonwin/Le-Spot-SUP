"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500); // Duration of fade out animation
  };

  const handleVideoEnd = () => {
    handleComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  useEffect(() => {
    // Prevent scrolling while splash screen is visible
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-ocean-dark flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src="/splash-screen.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-full transition-colors"
      >
        Passer
      </button>
    </div>
  );
}
