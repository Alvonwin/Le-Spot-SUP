"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Globe, Moon, Sun, User, LogIn, UserPlus, CloudRain, CloudSun, Cloud, Navigation } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "./LanguageProvider";
import { useLocation } from "./LocationProvider";
import WeatherInfo from "./WeatherInfo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { userLocation, isLoadingLocation, requestLocation, isTrackingActive } = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-gradient-to-r from-ocean-dark via-ocean to-ocean-dark text-white px-6 py-4 sticky top-0 z-50 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side - Logo and Menu */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <img
              src="/logo.ico"
              alt="Le Spot SUP Logo"
              className="w-10 h-10 rounded-full shadow-md group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-bold tracking-tight hidden sm:inline">Le Spot SUP</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all hover:scale-105"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Right Side - Icons */}
        <div className="flex items-center gap-2">
          {/* Geolocation Button - RED/PINK */}
          <button
            onClick={requestLocation}
            disabled={isLoadingLocation}
            className={`p-2.5 rounded-lg transition-all hover:scale-110 group relative ${
              userLocation
                ? "bg-green-500/20 hover:bg-green-500/30"
                : "hover:bg-red-500/20"
            }`}
            aria-label={
              isTrackingActive
                ? "Suivi GPS actif - Position en temps réel"
                : userLocation
                ? "Position activée - Cliquez pour actualiser"
                : "Activer la géolocalisation"
            }
            title={
              isTrackingActive
                ? "Suivi GPS actif - Position en temps réel"
                : userLocation
                ? "Position activée - Cliquez pour actualiser"
                : "Activer la géolocalisation"
            }
          >
            {isLoadingLocation ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Navigation
                size={22}
                className={`transition-colors drop-shadow-glow ${
                  userLocation
                    ? "text-green-400 group-hover:text-green-300"
                    : "text-red-400 group-hover:text-red-300"
                }`}
              />
            )}
            {userLocation && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-ocean-dark ${
                isTrackingActive ? "animate-pulse" : ""
              }`}></div>
            )}
          </button>

          {/* Weather Button - YELLOW/ORANGE */}
          <div className="relative">
            <button
              onClick={() => setIsWeatherOpen(!isWeatherOpen)}
              className="p-2.5 hover:bg-yellow-500/20 rounded-lg transition-all hover:scale-110 group"
              aria-label="Météo"
              title="Météo"
            >
              <CloudSun size={22} className="text-yellow-400 group-hover:text-yellow-300 transition-colors drop-shadow-glow" />
            </button>
            {isWeatherOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-3 px-4 text-gray-800 dark:text-white border border-ocean-light/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm">Météo Actuelle</h3>
                  <button onClick={() => setIsWeatherOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X size={16} />
                  </button>
                </div>
                {userLocation ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Navigation size={14} className="text-green-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
                      </span>
                    </div>
                    <WeatherInfo latitude={userLocation.latitude} longitude={userLocation.longitude} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Activez la géolocalisation pour voir la météo locale
                    </p>
                    <button
                      onClick={() => {
                        requestLocation();
                        setIsWeatherOpen(false);
                      }}
                      className="w-full py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs font-medium rounded-lg transition-all"
                    >
                      Activer maintenant
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Toggle - BLUE */}
          <button
            onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
            className="p-2.5 hover:bg-blue-500/20 rounded-lg transition-all hover:scale-110 group relative"
            aria-label="Changer de langue"
            title={language === "fr" ? "English" : "Français"}
          >
            <Globe size={22} className="text-blue-400 group-hover:text-blue-300 transition-colors drop-shadow-glow" />
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
              {language.toUpperCase()}
            </span>
          </button>

          {/* Theme Toggle - YELLOW/PURPLE */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2.5 hover:bg-purple-500/20 rounded-lg transition-all hover:scale-110 group"
              aria-label="Changer le thème"
              title="Thème"
            >
              {mounted && theme === "dark" ? (
                <Moon size={22} className="text-purple-400 group-hover:text-purple-300 transition-colors drop-shadow-glow" />
              ) : (
                <Sun size={22} className="text-amber-400 group-hover:text-amber-300 transition-colors drop-shadow-glow" />
              )}
            </button>
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 text-gray-800 dark:text-white border border-ocean-light/20 overflow-hidden">
                <button
                  onClick={() => {
                    setTheme("light");
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-ocean-light/10 transition-colors flex items-center gap-3 ${
                    theme === "light" ? "bg-ocean-light/20 font-semibold" : ""
                  }`}
                >
                  <Sun size={18} className="text-yellow-500" />
                  {language === "fr" ? "Thème Clair" : "Light Theme"}
                </button>
                <button
                  onClick={() => {
                    setTheme("dark");
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-ocean-light/10 transition-colors flex items-center gap-3 ${
                    theme === "dark" ? "bg-ocean-light/20 font-semibold" : ""
                  }`}
                >
                  <Moon size={18} className="text-blue-400" />
                  {language === "fr" ? "Thème Sombre" : "Dark Theme"}
                </button>
                <button
                  onClick={() => {
                    setTheme("system");
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-ocean-light/10 transition-colors flex items-center gap-3 ${
                    theme === "system" ? "bg-ocean-light/20 font-semibold" : ""
                  }`}
                >
                  <Cloud size={18} className="text-gray-400" />
                  {language === "fr" ? "Système" : "System"}
                </button>
              </div>
            )}
          </div>

          {/* User Menu - GREEN */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2.5 hover:bg-green-500/20 rounded-lg transition-all hover:scale-110 group"
              aria-label="Menu utilisateur"
              title="Profil"
            >
              <User size={22} className="text-green-400 group-hover:text-green-300 transition-colors drop-shadow-glow" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 text-gray-800 dark:text-white border border-ocean-light/20 overflow-hidden">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-ocean-light/10 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <LogIn size={18} className="text-ocean-light" />
                  <span className="font-medium">{t.nav.login}</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-ocean-light/10 transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <UserPlus size={18} className="text-ocean-light" />
                  <span className="font-medium">{t.nav.signup}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Animated Dropdown */}
      {isMenuOpen && (
        <nav className="mt-4 pb-4 border-t border-white/20 pt-4 animate-fadeIn">
          <Link
            href="/"
            className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-all mb-1 font-medium hover:translate-x-1"
            onClick={() => setIsMenuOpen(false)}
          >
            🏠 {language === "fr" ? "Accueil" : "Home"}
          </Link>
          <Link
            href="/map"
            className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-all mb-1 font-medium hover:translate-x-1"
            onClick={() => setIsMenuOpen(false)}
          >
            🗺️ {t.nav.map}
          </Link>
          <Link
            href="/guide"
            className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-all mb-1 font-medium hover:translate-x-1"
            onClick={() => setIsMenuOpen(false)}
          >
            📖 {t.nav.guide}
          </Link>
          <Link
            href="/sessions"
            className="block py-3 px-4 hover:bg-white/10 rounded-lg transition-all mb-1 font-medium hover:translate-x-1"
            onClick={() => setIsMenuOpen(false)}
          >
            🏄 {t.nav.sessions}
          </Link>
        </nav>
      )}
    </header>
  );
}
