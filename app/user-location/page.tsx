"use client";

import { useCallback, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const libraries: ("geometry" | "places")[] = ["geometry", "places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

function UserLocationContent() {
  const searchParams = useSearchParams();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const userLat = parseFloat(searchParams.get("userLat") || "0");
  const userLng = parseFloat(searchParams.get("userLng") || "0");
  const userAddress = searchParams.get("userAddress") || "Sua localização";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Validate coordinates
  if (!userLat || !userLng || userLat === 0 || userLng === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-lg mb-4">📍</div>
          <h1 className="text-lg font-bold text-gray-800 mb-2">
            Localização não disponível
          </h1>
          <p className="text-gray-600">Não foi possível obter sua localização.</p>
        </div>
      </div>
    );
  }

  const userIcon = isLoaded ? {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="#4285F4" fill-opacity="0.2"/>
        <circle cx="25" cy="25" r="12" fill="#4285F4" stroke="white" stroke-width="3"/>
        <circle cx="25" cy="25" r="5" fill="white"/>
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
    <div className="relative h-screen w-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">📍</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800">
                Sua Localização
              </h1>
              <p className="text-sm text-gray-600">{userAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: userLat, lng: userLng }}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
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
        }}
      >
        {/* User Marker */}
        <Marker
          position={{ lat: userLat, lng: userLng }}
          icon={userIcon}
          title="Você está aqui"
          onClick={() => setShowInfo(true)}
        />

        {/* Info Window */}
        {showInfo && (
          <InfoWindow
            position={{ lat: userLat, lng: userLng }}
            onCloseClick={() => setShowInfo(false)}
          >
            <div style={{ padding: "12px", maxWidth: "250px" }}>
              <div style={{ fontSize: "24px", textAlign: "center", marginBottom: "8px" }}>📍</div>
              <p style={{ fontWeight: 600, color: "#1f2937", margin: "0 0 4px 0", textAlign: "center" }}>
                Você está aqui
              </p>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", textAlign: "center" }}>
                {userAddress}
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, textAlign: "center" }}>
                {userLat.toFixed(6)}, {userLng.toFixed(6)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Info Card */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">ℹ️</span>
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
