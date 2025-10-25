'use client';

import { useState, useEffect } from 'react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if splash has already been shown in this session
    const splashShown = sessionStorage.getItem('splash_shown');

    if (splashShown) {
      setIsVisible(false);
      setHasShown(true);
      return;
    }

    // Hide splash after video duration (estimate 3-5 seconds) or on click
    const timer = setTimeout(() => {
      setIsVisible(false);
      setHasShown(true);
      sessionStorage.setItem('splash_shown', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsVisible(false);
    setHasShown(true);
    sessionStorage.setItem('splash_shown', 'true');
  };

  const handleVideoEnd = () => {
    setIsVisible(false);
    setHasShown(true);
    sessionStorage.setItem('splash_shown', 'true');
  };

  if (!isVisible || hasShown) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        cursor: 'pointer',
        animation: 'fadeOut 0.5s ease-out forwards',
        animationDelay: '4.5s',
        overflow: 'hidden'
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
          backgroundColor: '#0f172a'
        }}
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>

      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
}
