"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MapPage() {
  const searchParams = useSearchParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  // Get params from URL
  const userLat = parseFloat(searchParams.get("userLat") || "0");
  const userLng = parseFloat(searchParams.get("userLng") || "0");
  const userAddress = searchParams.get("userAddress") || "";
  const partnerLat = parseFloat(searchParams.get("partnerLat") || "0");
  const partnerLng = parseFloat(searchParams.get("partnerLng") || "0");
  const partnerAddress = searchParams.get("partnerAddress") || "";
  const partnerId = searchParams.get("partnerId") || "";
  const partnerName = searchParams.get("partnerName") || "Restaurante";
  const showRoute = searchParams.get("showRoute") === "true";

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
      if (!mapRef.current) return;

      try {
        // Calculate center point
        const centerLat = (userLat + partnerLat) / 2;
        const centerLng = (userLng + partnerLng) / 2;

        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 14,
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
        });

        // Custom user marker icon (SVG) - Simple blue circle
        const userIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="#4285F4" stroke="white" stroke-width="3"/>
              <circle cx="20" cy="20" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        };

        // Custom partner marker icon (SVG) - Simple red circle
        const partnerIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="#EA1D2C" stroke="white" stroke-width="3"/>
              <circle cx="20" cy="20" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        };

        // User marker
        new google.maps.Marker({
          position: { lat: userLat, lng: userLng },
          map: map,
          title: "Você está aqui",
          icon: userIcon,
          animation: google.maps.Animation.DROP,
        });

        // Partner marker
        new google.maps.Marker({
          position: { lat: partnerLat, lng: partnerLng },
          map: map,
          title: partnerName,
          icon: partnerIcon,
          animation: google.maps.Animation.DROP,
        });

        // Draw route if requested
        if (showRoute) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true, // We already have custom markers
            polylineOptions: {
              strokeColor: "#EA1D2C",
              strokeWeight: 6,
              strokeOpacity: 0.9,
            },
            preserveViewport: true, // Don't auto-zoom, we'll handle it
          });

          console.log("Requesting route from:", { partnerLat, partnerLng }, "to:", { userLat, userLng });

          directionsService.route(
            {
              origin: { lat: partnerLat, lng: partnerLng },
              destination: { lat: userLat, lng: userLng },
              travelMode: google.maps.TravelMode.DRIVING, // Use DRIVING for better routes
              provideRouteAlternatives: false,
            },
            (response, status) => {
              console.log("Directions response:", status, response);
              
              if (status === "OK" && response) {
                directionsRenderer.setDirections(response);

                // Get distance and duration
                const route = response.routes[0];
                if (route && route.legs[0]) {
                  setDistance(route.legs[0].distance?.text || "");
                  setDuration(route.legs[0].duration?.text || "");
                  console.log("Route found:", {
                    distance: route.legs[0].distance?.text,
                    duration: route.legs[0].duration?.text,
                  });
                }
              } else {
                console.error("Directions request failed:", status);
                // Draw straight line as fallback
                const line = new google.maps.Polyline({
                  path: [
                    { lat: partnerLat, lng: partnerLng },
                    { lat: userLat, lng: userLng },
                  ],
                  geodesic: true,
                  strokeColor: "#EA1D2C",
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
                  map: map,
                });

                console.log("Drew fallback line");

                // Calculate straight line distance
                const straightDistance =
                  google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(partnerLat, partnerLng),
                    new google.maps.LatLng(userLat, userLng)
                  );
                setDistance(`~${(straightDistance / 1000).toFixed(1)} km`);
              }
            }
          );
        }

        // Fit bounds to show both markers with good zoom
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: userLat, lng: userLng });
        bounds.extend({ lat: partnerLat, lng: partnerLng });
        
        // Add padding for better view
        const padding = { top: 80, right: 80, bottom: 80, left: 80 };
        map.fitBounds(bounds, padding);
        
        // Ensure minimum zoom level for better visibility
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          const currentZoom = map.getZoom();
          if (currentZoom && currentZoom > 16) {
            map.setZoom(16);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Erro ao inicializar o mapa");
        setLoading(false);
      }
    };

    loadGoogleMaps();
  }, [
    userLat,
    userLng,
    partnerLat,
    partnerLng,
    partnerName,
    showRoute,
  ]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#EA1D2C] mx-auto mb-2" />
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
