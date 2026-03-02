"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const libraries: ("geometry" | "places")[] = ["geometry", "places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

function DeliveryRouteContent() {
  const searchParams = useSearchParams();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const deliverymanLat = parseFloat(searchParams.get("deliverymanLat") || "0");
  const deliverymanLng = parseFloat(searchParams.get("deliverymanLng") || "0");
  const destinationLat = parseFloat(searchParams.get("destinationLat") || "0");
  const destinationLng = parseFloat(searchParams.get("destinationLng") || "0");
  const destinationName = searchParams.get("destinationName") || "Destino";
  const destinationType = searchParams.get("type") || "restaurant";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Calculate center point
  const center = {
    lat: (deliverymanLat + destinationLat) / 2,
    lng: (deliverymanLng + destinationLng) / 2,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate route when map is loaded
  useEffect(() => {
    if (!map || !isLoaded) return;

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
      setError("Coordenadas inválidas");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

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
        setDirections(result);

        const route = result.routes[0];
        if (route && route.legs && route.legs[0]) {
          const leg = route.legs[0];
          setDistance(leg.distance?.text || "");
          setDuration(leg.duration?.text || "");
        }
      } else {
        setError("Não foi possível calcular a rota");
      }
    });
  }, [map, isLoaded, deliverymanLat, deliverymanLng, destinationLat, destinationLng]);

  // Custom marker icons
  const routeColor = destinationType === "restaurant" ? "#10b981" : "#3b82f6";

  const deliverymanIcon = isLoaded ? {
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
  } : undefined;

  const destinationIcon = isLoaded ? {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="${routeColor}" fill-opacity="0.2"/>
          <circle cx="25" cy="25" r="15" fill="${routeColor}" stroke="white" stroke-width="3"/>
          <text x="25" y="32" font-size="20" text-anchor="middle" fill="white">${destinationType === "restaurant" ? "🏪" : "📍"}</text>
        </svg>
      `),
    scaledSize: new google.maps.Size(50, 50),
    anchor: new google.maps.Point(25, 25),
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
          <h1 className="text-lg font-bold text-gray-800 mb-2">Erro ao carregar rota</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Deliveryman Marker */}
        <Marker
          position={{ lat: deliverymanLat, lng: deliverymanLng }}
          icon={deliverymanIcon}
          title="Entregador"
        />

        {/* Destination Marker */}
        <Marker
          position={{ lat: destinationLat, lng: destinationLng }}
          icon={destinationIcon}
          title={destinationName}
        />

        {/* Directions Route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: routeColor,
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Info Card */}
      {distance && duration && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-sm text-gray-600">Distância</p>
                <p className="text-sm font-bold text-gray-800">{distance}</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Tempo estimado</p>
                <p className="text-sm font-bold text-gray-800">{duration}</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Destino</p>
                <p className="text-sm font-bold text-gray-800">
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
