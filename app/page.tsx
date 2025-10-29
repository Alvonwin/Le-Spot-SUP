"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Bot, Waves, Activity } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import SplashScreen from "@/components/SplashScreen";
import GeolocationPrompt from "@/components/GeolocationPrompt";

export default function Home() {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationReceived = (location: { latitude: number; longitude: number }) => {
    setUserLocation(location);
    console.log("User location:", location);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && <GeolocationPrompt onLocationReceived={handleLocationReceived} />}

      <div className="min-h-screen">
        {/* Hero Section */}
      <section
        className="relative h-[50vh] min-h-[400px] sm:h-[60vh] sm:min-h-[500px] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto text-white z-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
            {t.home.hero.title}
          </h1>
          <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto">
            {t.home.hero.subtitle}
          </p>
          <Link
            href="/map"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg transition-colors"
          >
            {t.home.hero.cta}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <button className="mb-8 px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-full text-sm mx-auto block">
            {t.home.features.badge}
          </button>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            {t.home.features.title}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-16 text-lg">
            {t.home.features.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 - Interactive Map */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-ocean-light dark:bg-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-ocean-dark dark:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                {t.home.features.items[0].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t.home.features.items[0].description}
              </p>
            </div>

            {/* Feature 2 - AI Recommendations */}
            <div className="text-center">
              <div className="w-20 h-20 bg-ocean-light dark:bg-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-ocean-dark dark:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                {t.home.features.items[1].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t.home.features.items[1].description}
              </p>
            </div>

            {/* Feature 3 - Community Driven */}
            <div className="text-center">
              <div className="w-20 h-20 bg-ocean-light dark:bg-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 sm:w-10 sm:h-10 text-ocean-dark dark:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                {t.home.features.items[2].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t.home.features.items[2].description}
              </p>
            </div>

            {/* Feature 4 - Session Tracker */}
            <div className="text-center">
              <div className="w-20 h-20 bg-ocean-light dark:bg-ocean rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-ocean-dark dark:text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                {t.home.features.items[3].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t.home.features.items[3].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-ocean/10 to-ocean-light/10 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🏄‍♂️</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {t.about.title}
          </h2>
          <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            {t.about.description} <span className="font-bold text-ocean">{t.about.quebecSpots}</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">250+</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.about.stats.spots}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⛅</div>
              <h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">{t.about.stats.realtime}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.about.stats.weather}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">👥</div>
              <h3 className="text-xl sm:text-2xl font-bold text-ocean mb-1 sm:mb-2">{t.about.stats.community}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t.about.stats.worldwide}</p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/map"
              className="inline-block bg-ocean hover:bg-ocean-dark text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Découvrir les Spots
            </Link>
          </div>
        </div>
      </section>

        {/* Footer */}
        <footer className="bg-ocean-dark text-white py-6 sm:py-8 text-center">
          <p>{t.footer.copyright}</p>
        </footer>
      </div>
    </>
  );
}
