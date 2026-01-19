"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react";
import { toast } from "sonner";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -15.1194, // Nampula, Moçambique
  lng: 39.2686,
};

export function LocationPicker({
  initialLat,
  initialLng,
  onLocationSelect,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );
  const [address, setAddress] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(position ? 15 : 12);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Zoom controls
  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 12;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 12;
      map.setZoom(currentZoom - 1);
      setZoom(currentZoom - 1);
    }
  };

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setPosition({ lat, lng });

        // Get address from coordinates
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.results && data.results[0]) {
            const formattedAddress = data.results[0].formatted_address;
            setAddress(formattedAddress);
            onLocationSelect(lat, lng, formattedAddress);
            toast.success("Localização obtida com sucesso!");
          }
        } catch (error) {
          console.error("Error getting address:", error);
          toast.error("Erro ao obter endereço");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Erro ao obter localização. Por favor, escolha no mapa.");
        setLoading(false);
      }
    );
  }, [apiKey, onLocationSelect]);

  // Handle map click or marker drag
  const handleLocationChange = useCallback(
    async (lat: number, lng: number) => {
      setPosition({ lat, lng });
      setLoading(true);

      // Get address from coordinates
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.results && data.results[0]) {
          const formattedAddress = data.results[0].formatted_address;
          setAddress(formattedAddress);
          onLocationSelect(lat, lng, formattedAddress);
        }
      } catch (error) {
        console.error("Error getting address:", error);
        toast.error("Erro ao obter endereço");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, onLocationSelect]
  );

  // Handle map click
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleLocationChange(lat, lng);
    },
    [handleLocationChange]
  );

  // Handle marker drag
  const handleMarkerDrag = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleLocationChange(lat, lng);
    },
    [handleLocationChange]
  );

  // Search address
  const handleAddressSearch = useCallback(
    async (searchAddress: string) => {
      if (!searchAddress.trim()) return;

      setLoading(true);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            searchAddress
          )}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.results && data.results[0]) {
          const location = data.results[0].geometry.location;
          const formattedAddress = data.results[0].formatted_address;

          setPosition({ lat: location.lat, lng: location.lng });
          setAddress(formattedAddress);
          onLocationSelect(location.lat, location.lng, formattedAddress);

          // Center map on new location
          if (map) {
            map.panTo(location);
          }

          toast.success("Localização encontrada!");
        } else {
          toast.error("Endereço não encontrado");
        }
      } catch (error) {
        console.error("Error searching address:", error);
        toast.error("Erro ao buscar endereço");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, map, onLocationSelect]
  );

  if (!apiKey) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">
            Google Maps API Key não configurada. Por favor, adicione
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no arquivo .env.local
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Obtendo localização...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 mr-2" />
              Usar Localização Atual
            </>
          )}
        </Button>
      </div>

      {/* Address Search */}
      <div className="space-y-2">
        <Label htmlFor="address-search">Ou busque um endereço</Label>
        <div className="flex gap-2">
          <Input
            id="address-search"
            placeholder="Digite um endereço..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddressSearch(address);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => handleAddressSearch(address)}
            disabled={loading || !address.trim()}
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map with Controls */}
      <div className="relative border rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position || defaultCenter}
            zoom={zoom}
            onClick={handleMapClick}
            onLoad={(map) => setMap(map)}
            onZoomChanged={() => {
              if (map) {
                const newZoom = map.getZoom();
                if (newZoom) setZoom(newZoom);
              }
            }}
            options={{
              zoomControl: false, // Disable default zoom controls
              streetViewControl: true, // Enable Street View (Pegman)
              streetViewControlOptions: {
                position: 6, // RIGHT_TOP
              },
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {position && (
              <Marker
                position={position}
                draggable={true}
                onDragEnd={handleMarkerDrag}
              />
            )}
          </GoogleMap>
        </LoadScript>

        {/* Custom Zoom Controls */}
        <div className="absolute right-3 top-20 flex flex-col gap-2 z-10">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleZoomIn}
            className="bg-white hover:bg-gray-100 shadow-md"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleZoomOut}
            className="bg-white hover:bg-gray-100 shadow-md"
            title="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Instructions Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10  w-[70%]">
          <Card className="bg-white/95 p-2 backdrop-blur">
            <CardContent className="p-2">
              <div className="flex items-start gap-2 text-sm">
                <Move className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Como usar o mapa:</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    <li>
                      • <strong>Clique</strong> no mapa para marcar a
                      localização
                    </li>
                    <li>
                      • <strong>Arraste o pin vermelho</strong> para ajustar a
                      posição exata
                    </li>
                    <li>
                      • Use os botões <strong>+ / -</strong> (à direita) para
                      zoom
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Location Info */}
      {position && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Localização Selecionada</p>
                  <p className="text-sm text-muted-foreground">{address}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lat: {position.lat.toFixed(6)}, Lng:{" "}
                    {position.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
