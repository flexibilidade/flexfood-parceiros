"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function DeliverymanLocationContent() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deliverymanLat = parseFloat(searchParams.get("deliverymanLat") || "0");
  const deliverymanLng = parseFloat(searchParams.get("deliverymanLng") || "0");
  const deliverymanName = searchParams.get("deliverymanName") || "Entregador";
  const deliverymanPhone = searchParams.get("deliverymanPhone") || "";
  const availability = searchParams.get("availability") || "OFFLINE";

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
      console.log("Coordinates:", { deliverymanLat, deliverymanLng });

      if (!mapRef.current) {
        console.log("⏳ Map ref not ready, retrying in 100ms...");
        setTimeout(() => initMap(), 100);
        return;
      }

      // Validate coordinates
      if (
        !deliverymanLat ||
        !deliverymanLng ||
        deliverymanLat === 0 ||
        deliverymanLng === 0
      ) {
        console.log("❌ Invalid coordinates");
        setError("Coordenadas inválidas");
        setLoading(false);
        return;
      }

      console.log("✅ Creating map...");
      try {
        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: deliverymanLat, lng: deliverymanLng },
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

        // Get status color based on availability
        const getStatusColor = () => {
          switch (availability) {
            case "AVAILABLE":
              return "#10b981"; // green
            case "BUSY":
              return "#f59e0b"; // orange
            case "OFFLINE":
            default:
              return "#ef4444"; // red
          }
        };

        const getStatusText = () => {
          switch (availability) {
            case "AVAILABLE":
              return "Disponível";
            case "BUSY":
              return "Ocupado";
            case "OFFLINE":
            default:
              return "Offline";
          }
        };

        const statusColor = getStatusColor();

        // Custom deliveryman marker icon (SVG) - Motorcycle icon with status color
        const deliverymanIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill="${statusColor}" fill-opacity="0.2"/>
              <circle cx="30" cy="30" r="18" fill="${statusColor}" stroke="white" stroke-width="3"/>
              <text x="30" y="38" font-size="24" text-anchor="middle" fill="white">🏍️</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30),
        };

        // Deliveryman marker
        const marker = new google.maps.Marker({
          position: { lat: deliverymanLat, lng: deliverymanLng },
          map: map,
          title: deliverymanName,
          icon: deliverymanIcon,
          animation: google.maps.Animation.DROP,
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 280px;">
              <div style="font-size: 32px; text-align: center; margin-bottom: 8px;">🏍️</div>
              <p style="font-weight: 600; color: #1f2937; margin: 0 0 4px 0; text-align: center; font-size: 16px;">${deliverymanName}</p>
              ${
                deliverymanPhone
                  ? `<p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0; text-align: center;">📞 ${deliverymanPhone}</p>`
                  : ""
              }
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${statusColor};"></div>
                <span style="font-size: 14px; font-weight: 600; color: ${statusColor};">${getStatusText()}</span>
              </div>
              <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
                ${deliverymanLat.toFixed(6)}, ${deliverymanLng.toFixed(6)}
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
  }, [deliverymanLat, deliverymanLng, deliverymanName, availability]);

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

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

export default function DeliverymanLocationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DeliverymanLocationContent />
    </Suspense>
  );
}
