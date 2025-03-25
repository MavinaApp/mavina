"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";

// Leaflet varsayılan ikon sorunu için çözüm
const icon = L.divIcon({
  className: "custom-icon",
  html: `<div class="bg-blue-600 p-1 rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="20" height="20">
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
          </svg>
        </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const providerIcon = L.divIcon({
  className: "custom-icon",
  html: `<div class="bg-green-600 p-1 rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="20" height="20">
            <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
          </svg>
        </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Kullanıcının konumunu takip eden bileşen
function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e: L.LocationEvent) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>Konumunuz</Popup>
    </Marker>
  );
}

// Harita merkezini güncelleyen bileşen
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

// Örnek hizmet sağlayıcılar
const providers = [
  {
    id: 1,
    name: "Mobil Yıkama Servisi 1",
    position: [41.015137, 28.979530], // İstanbul
    rating: 4.5,
    services: [
      { name: "Standart Yıkama", price: 150 },
      { name: "Detaylı Yıkama", price: 250 },
    ],
  },
  {
    id: 2,
    name: "Mobil Yıkama Servisi 2",
    position: [41.021137, 28.976530], // İstanbul yakını
    rating: 4.2,
    services: [
      { name: "Standart Yıkama", price: 140 },
      { name: "Detaylı Yıkama", price: 240 },
    ],
  },
  {
    id: 3,
    name: "Mobil Yıkama Servisi 3",
    position: [41.011137, 28.982530], // İstanbul yakını
    rating: 4.7,
    services: [
      { name: "Standart Yıkama", price: 160 },
      { name: "Detaylı Yıkama", price: 260 },
    ],
  },
];

// Hizmet bölgesi çemberini gösteren bileşen
interface ServiceAreaProps {
  position: [number, number];
  radius: number;
}

function ServiceArea({ position, radius }: ServiceAreaProps) {
  return (
    <Circle
      center={position}
      radius={radius * 1000} // km'yi metreye çeviriyoruz
      pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
    />
  );
}

interface MapProps {
  showServiceArea?: boolean;
  serviceRadius?: number;
  providerMode?: boolean;
  userPosition?: [number, number]; // Kullanıcının konumu için yeni prop
}

export default function DynamicMap({ showServiceArea = false, serviceRadius = 5, providerMode = false, userPosition }: MapProps) {
  const defaultPosition: [number, number] = [41.015137, 28.979530]; // İstanbul
  const [localUserPosition, setLocalUserPosition] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Kullanıcının konumunu almak için
  useEffect(() => {
    // Eğer userPosition prop'u verilmişse, onu kullan
    if (userPosition) {
      setLocalUserPosition(userPosition);
      return;
    }
    
    // Değilse, tarayıcıdan konum almaya çalış
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          setLocalUserPosition(newPosition);
          
          // Harita referansı varsa, görünümü güncelle
          if (mapRef.current) {
            mapRef.current.setView(newPosition, mapRef.current.getZoom());
          }
        },
        (error) => {
          console.error("Konum alınamadı:", error);
          setLocalUserPosition(defaultPosition); // Varsayılan konum
        },
        { 
          enableHighAccuracy: true, // Yüksek doğruluk için
          timeout: 10000, // 10 saniye zaman aşımı
          maximumAge: 0 // Her zaman güncel konum
        }
      );
    } else {
      setLocalUserPosition(defaultPosition); // Varsayılan konum
    }
  }, [userPosition]);

  // Haritanın merkez konumunu belirle
  const mapCenter = userPosition || localUserPosition || defaultPosition;

  // Harita referansını kaydetmek için fonksiyon
  const saveMapRef = (map: L.Map) => {
    mapRef.current = map;
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={saveMapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Harita merkezini güncelleyen bileşen */}
      <MapUpdater center={mapCenter} />
      
      {!providerMode && <LocationMarker />}
      
      {providerMode && (userPosition || localUserPosition) && (
        <>
          <Marker position={userPosition || localUserPosition || defaultPosition} icon={providerIcon}>
            <Popup>Konumunuz</Popup>
          </Marker>
          {showServiceArea && (
            <ServiceArea position={userPosition || localUserPosition || defaultPosition} radius={serviceRadius} />
          )}
        </>
      )}
      
      {!providerMode && providers.map((provider) => (
        <Marker 
          key={provider.id} 
          position={provider.position as [number, number]} 
          icon={providerIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{provider.name}</h3>
              <div className="flex items-center mt-1 mb-2">
                <FaMapMarkerAlt className="text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">2.{provider.id} km uzaklıkta</span>
              </div>
              <div className="border-t pt-2">
                <p className="text-sm font-medium">Hizmetler:</p>
                {provider.services.map((service, index) => (
                  <p key={index} className="text-sm text-blue-700">
                    {service.name}: {service.price}₺
                  </p>
                ))}
              </div>
              <button className="mt-2 w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Randevu Al
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 