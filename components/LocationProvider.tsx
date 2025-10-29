"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type LocationContextType = {
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  isLoadingLocation: boolean;
  requestLocation: () => void;
  isTrackingActive: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Start continuous tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsTrackingActive(true);

    // Watch position changes in real-time
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(location);
        localStorage.setItem("user-location", JSON.stringify(location));
      },
      (error) => {
        console.error("Geolocation tracking error:", error);
        setIsTrackingActive(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000, // Accept cached position up to 30 seconds old
        timeout: 27000 // Wait up to 27 seconds for position
      }
    );
  };

  // Load location from localStorage on mount and start tracking if accepted
  useEffect(() => {
    const savedLocation = localStorage.getItem("user-location");
    const geolocationAccepted = localStorage.getItem("geolocation-answered");

    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }

    // If user has accepted geolocation, start automatic tracking
    if (geolocationAccepted === "true" && navigator.geolocation) {
      startTracking();
    }

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Request geolocation (manual refresh or first-time activation)
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Votre navigateur ne supporte pas la géolocalisation");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(location);
        localStorage.setItem("user-location", JSON.stringify(location));
        localStorage.setItem("geolocation-answered", "true");
        setIsLoadingLocation(false);

        // Start tracking if not already active
        if (!isTrackingActive) {
          startTracking();
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Impossible d'obtenir votre position. Vérifiez les paramètres de votre navigateur.");
        setIsLoadingLocation(false);
      }
    );
  };

  const value = {
    userLocation,
    setUserLocation,
    isLoadingLocation,
    requestLocation,
    isTrackingActive,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
