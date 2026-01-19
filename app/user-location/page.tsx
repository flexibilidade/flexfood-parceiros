"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function UserLocationContent() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userLat = parseFloat(searchParams.get("userLat") || "0");
  const userLng = parseFloat(searchParams.get("userLng") || "0");
  const userAddress = searchParams.get("userAddress") || "Sua localização";

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (typeof window.google !== "undefined") {
        initMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      script.onerror = () => {
        setError("Erro ao carregar o mapa");
        setLoading(false);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      console.log("🎯 initMap called");
      console.log("mapRef.current:", mapRef.current);
      console.log("Coordinates:", { userLat, userLng });
      
      if (!mapRef.current) {
        console.log("⏳ Map ref not ready, retrying in 100ms...");
        setTimeout(() => initMap(), 100);
        return;
      }

      // Validate coordinates
      if (!userLat || !userLng || userLat === 0 || userLng === 0) {
        console.log("❌ Invalid coordinates");
        setError("Coordenadas inválidas");
        setLoading(false);
        return;
      }

      console.log("✅ Creating map...");
      try {
        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: userLat, lng: userLng },
          zoom: 16,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Custom user marker icon (SVG) - Blue pulsing circle
        const userIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="#4285F4" fill-opacity="0.2"/>
              <circle cx="25" cy="25" r="12" fill="#4285F4" stroke="white" stroke-width="3"/>
              <circle cx="25" cy="25" r="5" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25),
        };

        // User marker
        const marker = new google.maps.Marker({
          position: { lat: userLat, lng: userLng },
          map: map,
          title: "Você está aqui",
          icon: userIcon,
          animation: google.maps.Animation.DROP,
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 250px;">
              <div style="font-size: 24px; text-align: center; margin-bottom: 8px;">📍</div>
              <p style="font-weight: 600; color: #1f2937; margin: 0 0 4px 0; text-align: center;">Você está aqui</p>
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0; text-align: center;">${userAddress}</p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
                ${userLat.toFixed(6)}, ${userLng.toFixed(6)}
              </p>
            </div>
          `,
        });

        // Open info window on marker click
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // Auto-open info window
        setTimeout(() => {
          infoWindow.open(map, marker);
        }, 500);

        console.log("✅ Map initialized successfully");
        setLoading(false);
      } catch (err) {
        console.error("❌ Error initializing map:", err);
        setError("Erro ao inicializar o mapa");
        setLoading(false);
      }
    };

    console.log("🚀 Starting loadGoogleMaps...");
    loadGoogleMaps();
  }, [userLat, userLng, userAddress]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-6xl mb-4">📍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Localização não disponível
          </h1>
          <p className="text-gray-600">
            {error === "Coordenadas inválidas" 
              ? "Não foi possível obter sua localização."
              : error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Sua Localização
              </h1>
              <p className="text-sm text-gray-600">{userAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Info Card */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">
                Localização Atual
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Esta é a sua localização atual usada para encontrar restaurantes próximos e calcular o tempo de entrega.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>📌 Coordenadas:</span>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {userLat.toFixed(6)}, {userLng.toFixed(6)}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserLocationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <UserLocationContent />
    </Suspense>
  );
}
