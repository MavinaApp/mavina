"use client";

import { useState } from 'react';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaCar } from 'react-icons/fa';
import Link from 'next/link';

interface ServiceProviderCardProps {
  provider: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    distance: number;
    services: string[];
    price: number;
    image: string;
    isAvailable: boolean;
  };
}

export default function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={provider.image} 
          alt={provider.name}
          className="w-full h-48 object-cover"
        />
        {provider.isAvailable ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
            Müsait
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            Meşgul
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-600">{provider.rating}</span>
            <span className="text-gray-400 ml-1">({provider.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-2" />
          <span>{provider.distance} km uzaklıkta</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <FaClock className="mr-2" />
          <span>Ortalama 30-45 dk</span>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Sunduğu Hizmetler:</h4>
          <div className="flex flex-wrap gap-2">
            {provider.services.map((service, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-blue-600">
            {provider.price}₺'den başlayan fiyatlarla
          </div>
          <Link 
            href={`/provider/${provider.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Profile Git
          </Link>
        </div>
      </div>
    </div>
  );
} 