"use client";

import { useState, useEffect } from "react";
import { MapPin, X, Navigation, AlertCircle } from "lucide-react";
import { useLocation } from "./LocationProvider";

interface GeolocationPromptProps {
  onLocationReceived?: (location: { latitude: number; longitude: number }) => void;
}

export default function GeolocationPrompt({ onLocationReceived }: GeolocationPromptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { requestLocation, isLoadingLocation, userLocation } = useLocation();

  useEffect(() => {
    // Check if user has already answered
    const hasAnswered = localStorage.getItem("geolocation-answered");
    if (!hasAnswered) {
      // Wait a bit after page load to show the prompt
      setTimeout(() => setIsOpen(true), 1500);
    }
  }, []);

  // Close prompt and notify when location is received
  useEffect(() => {
    if (userLocation && isOpen) {
      onLocationReceived?.(userLocation);
      setIsOpen(false);
    }
  }, [userLocation, isOpen, onLocationReceived]);

  const handleAllow = async () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Votre navigateur ne supporte pas la géolocalisation");
      return;
    }

    try {
      // Use the LocationProvider's requestLocation which will start tracking
      requestLocation();
    } catch (err) {
      setError("Impossible d'obtenir votre position. Vérifiez les paramètres de votre navigateur.");
    }
  };

  const handleDeny = () => {
    localStorage.setItem("geolocation-answered", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideIn">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-ocean-dark via-ocean to-ocean-dark p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <div className="relative flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Navigation size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Activer la localisation ?</h2>
              <p className="text-ocean-light text-sm mt-1">Pour une meilleure expérience</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Trouver les spots près de vous
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Découvrez les meilleurs spots de SUP à proximité de votre position
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Météo en temps réel
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consultez les conditions météo actuelles de votre zone
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Recommandations personnalisées
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notre IA vous suggère les meilleurs spots selon votre position
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDeny}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Plus tard
            </button>
            <button
              onClick={handleAllow}
              disabled={isLoadingLocation}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-ocean-dark to-ocean text-white rounded-lg font-semibold hover:from-ocean hover:to-ocean-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoadingLocation ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <Navigation size={18} />
                  <span>Autoriser</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            🔒 Vos données de localisation restent privées et sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}
