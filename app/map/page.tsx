"use client";

import { useCallback, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const libraries: ("geometry" | "places")[] = ["geometry", "places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

function MapContent() {
  const searchParams = useSearchParams();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Get params from URL
  const userLat = parseFloat(searchParams.get("userLat") || "0");
  const userLng = parseFloat(searchParams.get("userLng") || "0");
  const partnerLat = parseFloat(searchParams.get("partnerLat") || "0");
  const partnerLng = parseFloat(searchParams.get("partnerLng") || "0");
  const partnerName = searchParams.get("partnerName") || "Restaurante";
  const showRoute = searchParams.get("showRoute") === "true";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Calculate center point
  const center = {
    lat: (userLat + partnerLat) / 2,
    lng: (userLng + partnerLng) / 2,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Fit bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: userLat, lng: userLng });
    bounds.extend({ lat: partnerLat, lng: partnerLng });
    
    const padding = { top: 80, right: 80, bottom: 80, left: 80 };
    map.fitBounds(bounds, padding);
    
    // Ensure minimum zoom level
    google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      const currentZoom = map.getZoom();
      if (currentZoom && currentZoom > 16) {
        map.setZoom(16);
      }
    });

    // Calculate route if requested
    if (showRoute) {
      const directionsService = new google.maps.DirectionsService();

      const request: google.maps.DirectionsRequest = {
        origin: { lat: partnerLat, lng: partnerLng },
        destination: { lat: userLat, lng: userLng },
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        unitSystem: google.maps.UnitSystem.METRIC,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          const route = result.routes[0];
          if (route && route.legs && route.legs[0]) {
            const leg = route.legs[0];
            setDistance(leg.distance?.text || "");
            setDuration(leg.duration?.text || "");
          }
        } else {
          console.error("Directions request failed:", status);
          setError("Não foi possível calcular a rota");
        }
      });
    }
  }, [userLat, userLng, partnerLat, partnerLng, showRoute]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Custom marker icons
  const userIcon = isLoaded ? {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="#4285F4" stroke="white" stroke-width="3"/>
        <circle cx="20" cy="20" r="6" fill="white"/>
      </svg>
    `),
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20),
  } : undefined;

  const partnerIcon = isLoaded ? {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="#EA1D2C" stroke="white" stroke-width="3"/>
        <circle cx="20" cy="20" r="6" fill="white"/>
      </svg>
    `),
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20),
  } : undefined;

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-lg mb-4">🗺️</div>
          <p className="text-gray-600 text-sm">Erro ao carregar mapa</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-lg mb-4">❌</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#EA1D2C] mx-auto mb-2" />
          <p className="text-sm text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* User Marker */}
        <Marker
          position={{ lat: userLat, lng: userLng }}
          icon={userIcon}
          title="Você está aqui"
        />

        {/* Partner Marker */}
        <Marker
          position={{ lat: partnerLat, lng: partnerLng }}
          icon={partnerIcon}
          title={partnerName}
        />

        {/* Directions Route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#EA1D2C",
                strokeWeight: 6,
                strokeOpacity: 0.9,
              },
              preserveViewport: true,
            }}
          />
        )}
      </GoogleMap>

      {/* Info Card */}
      {distance && duration && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-xs text-gray-600">Distância</p>
              <p className="text-sm font-bold text-gray-800">{distance}</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Tempo estimado</p>
              <p className="text-sm font-bold text-gray-800">{duration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-[#EA1D2C]" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
