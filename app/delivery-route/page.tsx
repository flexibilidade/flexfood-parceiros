"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function DeliveryRouteContent() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const deliverymanLat = parseFloat(searchParams.get("deliverymanLat") || "0");
  const deliverymanLng = parseFloat(searchParams.get("deliverymanLng") || "0");
  const destinationLat = parseFloat(searchParams.get("destinationLat") || "0");
  const destinationLng = parseFloat(searchParams.get("destinationLng") || "0");
  const destinationName = searchParams.get("destinationName") || "Destino";
  const destinationType = searchParams.get("type") || "restaurant"; // restaurant or customer

  useEffect(() => {
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

      if (!mapRef.current) {
        console.log("⏳ Map ref not ready, retrying in 100ms...");
        setTimeout(() => initMap(), 100);
        return;
      }

      // Validate coordinates
      if (
        !deliverymanLat ||
        !deliverymanLng ||
        !destinationLat ||
        !destinationLng ||
        deliverymanLat === 0 ||
        deliverymanLng === 0 ||
        destinationLat === 0 ||
        destinationLng === 0
      ) {
        console.log("❌ Invalid coordinates");
        setError("Coordenadas inválidas");
        setLoading(false);
        return;
      }

      console.log("✅ Creating map...");
      try {
        // Calculate center point between deliveryman and destination
        const centerLat = (deliverymanLat + destinationLat) / 2;
        const centerLng = (deliverymanLng + destinationLng) / 2;

        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 13,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Deliveryman marker (motorcycle icon)
        const deliverymanIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="#ef4444" fill-opacity="0.2"/>
              <circle cx="25" cy="25" r="15" fill="#ef4444" stroke="white" stroke-width="3"/>
              <text x="25" y="32" font-size="20" text-anchor="middle" fill="white">🏍️</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25),
        };

        const deliverymanMarker = new google.maps.Marker({
          position: { lat: deliverymanLat, lng: deliverymanLng },
          map: map,
          title: "Entregador",
          icon: deliverymanIcon,
          animation: google.maps.Animation.DROP,
        });

        // Destination marker (restaurant or customer)
        const destinationIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="${destinationType === "restaurant" ? "#10b981" : "#3b82f6"}" fill-opacity="0.2"/>
              <circle cx="25" cy="25" r="15" fill="${destinationType === "restaurant" ? "#10b981" : "#3b82f6"}" stroke="white" stroke-width="3"/>
              <text x="25" y="32" font-size="20" text-anchor="middle" fill="white">${destinationType === "restaurant" ? "🏪" : "📍"}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25),
        };

        const destinationMarker = new google.maps.Marker({
          position: { lat: destinationLat, lng: destinationLng },
          map: map,
          title: destinationName,
          icon: destinationIcon,
          animation: google.maps.Animation.DROP,
        });

        // Use Routes API (v2) - New recommended API
        const routeColor =
          destinationType === "restaurant" ? "#10b981" : "#3b82f6";

        // Create route using Directions API (still supported)
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true, // We use custom markers
          polylineOptions: {
            strokeColor: routeColor,
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        });

        // Request directions with optimized settings
        const request: google.maps.DirectionsRequest = {
          origin: { lat: deliverymanLat, lng: deliverymanLng },
          destination: { lat: destinationLat, lng: destinationLng },
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
          unitSystem: google.maps.UnitSystem.METRIC,
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);

            // Get distance and duration
            const route = result.routes[0];
            if (route && route.legs && route.legs[0]) {
              const leg = route.legs[0];
              setDistance(leg.distance?.text || "");
              setDuration(leg.duration?.text || "");
              console.log("📏 Distance:", leg.distance?.text);
              console.log("⏱️ Duration:", leg.duration?.text);
              console.log("🚗 Using traffic data:", leg.duration_in_traffic?.text);
            }
          } else {
            console.error("Directions request failed:", status);
            setError("Não foi possível calcular a rota");
          }
        });

        // Info windows
        const deliverymanInfo = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <p style="font-weight: 600; margin: 0;">🏍️ Entregador</p>
              <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">Localização atual</p>
            </div>
          `,
        });

        const destinationInfo = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <p style="font-weight: 600; margin: 0;">${destinationType === "restaurant" ? "🏪" : "📍"} ${destinationName}</p>
              <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">${destinationType === "restaurant" ? "Ponto de retirada" : "Ponto de entrega"}</p>
            </div>
          `,
        });

        deliverymanMarker.addListener("click", () => {
          deliverymanInfo.open(map, deliverymanMarker);
        });

        destinationMarker.addListener("click", () => {
          destinationInfo.open(map, destinationMarker);
        });

        // Open info windows by default
        deliverymanInfo.open(map, deliverymanMarker);
        destinationInfo.open(map, destinationMarker);

        setLoading(false);
      } catch (err) {
        console.error("❌ Error initializing map:", err);
        setError("Erro ao inicializar o mapa");
        setLoading(false);
      }
    };

    console.log("🚀 Starting loadGoogleMaps...");
    loadGoogleMaps();
  }, [
    deliverymanLat,
    deliverymanLng,
    destinationLat,
    destinationLng,
    destinationName,
    destinationType,
  ]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Erro ao carregar rota
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Calculando rota...</p>
            </div>
          </div>
        )}

        {/* Map */}
        <div ref={mapRef} className="w-full h-full absolute inset-0" />

      {/* Info Card */}
      {distance && duration && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-sm text-gray-600">Distância</p>
                <p className="text-lg font-bold text-gray-800">{distance}</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Tempo estimado</p>
                <p className="text-lg font-bold text-gray-800">{duration}</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Destino</p>
                <p className="text-lg font-bold text-gray-800">
                  {destinationType === "restaurant" ? "🏪 Restaurante" : "📍 Cliente"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeliveryRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DeliveryRouteContent />
    </Suspense>
  );
}
