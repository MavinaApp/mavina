"use client";

import { useEffect, useState, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, useLoadScript, Libraries } from '@react-google-maps/api';

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries: Libraries = ['places'];

export default function Map({ onLocationSelect }: MapProps) {
  const [defaultPosition, setDefaultPosition] = useState<{ lat: number; lng: number }>({
    lat: 41.0082,
    lng: 28.9784
  });
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Konum alınamadı, varsayılan konum kullanılıyor.');
        }
      );
    }
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && onLocationSelect) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPosition({ lat, lng });
      onLocationSelect(lat, lng);
    }
  };

  const mapOptions = useMemo(() => ({
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: true,
  }), []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-center p-4">
          <p>Harita yüklenirken bir hata oluştu. Lütfen API anahtarınızı kontrol edin.</p>
          <p className="text-sm mt-2">Hata: {loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultPosition}
      zoom={13}
      onClick={handleMapClick}
      options={mapOptions}
    >
      {selectedPosition && (
        <Marker
          position={selectedPosition}
        />
      )}
    </GoogleMap>
  );
} 