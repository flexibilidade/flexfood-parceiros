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

function DeliverymanLocationContent() {
  const searchParams = useSearchParams();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deliverymanLat = parseFloat(searchParams.get("deliverymanLat") || "0");
  const deliverymanLng = parseFloat(searchParams.get("deliverymanLng") || "0");
  const deliverymanName = searchParams.get("deliverymanName") || "Entregador";
  const deliverymanPhone = searchParams.get("deliverymanPhone") || "";
  const availability = searchParams.get("availability") || "OFFLINE";

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

  // Validate coordinates
  if (
    !deliverymanLat ||
    !deliverymanLng ||
    deliverymanLat === 0 ||
    deliverymanLng === 0
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-lg mb-4">📍</div>
          <h1 className="text-lg font-bold text-gray-800 mb-2">
            Localização não disponível
          </h1>
          <p className="text-gray-600">Não foi possível obter a localização.</p>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor();

  const deliverymanIcon = isLoaded ? {
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
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: deliverymanLat, lng: deliverymanLng }}
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
        {/* Deliveryman Marker */}
        <Marker
          position={{ lat: deliverymanLat, lng: deliverymanLng }}
          icon={deliverymanIcon}
          title={deliverymanName}
          onClick={() => setShowInfo(true)}
        />

        {/* Info Window */}
        {showInfo && (
          <InfoWindow
            position={{ lat: deliverymanLat, lng: deliverymanLng }}
            onCloseClick={() => setShowInfo(false)}
          >
            <div style={{ padding: "12px", maxWidth: "280px" }}>
              <div style={{ fontSize: "32px", textAlign: "center", marginBottom: "8px" }}>🏍️</div>
              <p style={{ fontWeight: 600, color: "#1f2937", margin: "0 0 4px 0", textAlign: "center", fontSize: "16px" }}>
                {deliverymanName}
              </p>
              {deliverymanPhone && (
                <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", textAlign: "center" }}>
                  📞 {deliverymanPhone}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: statusColor }}></div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: statusColor }}>{getStatusText()}</span>
              </div>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, textAlign: "center" }}>
                {deliverymanLat.toFixed(6)}, {deliverymanLng.toFixed(6)}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
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
