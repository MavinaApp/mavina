"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaHome, FaPhone, FaMapMarkerAlt, FaUserAlt } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function TrackingPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(15);
  const [carPosition, setCarPosition] = useState({ x: 50, y: 50 });

  const steps = [
    { key: 'departed', label: 'Yola Çıktı' },
    { key: 'approaching', label: 'Yaklaşıyor' },
    { key: 'started', label: 'Başladı' },
    { key: 'completed', label: 'Tamamlandı' }
  ];

  // Araba animasyonu için
  useEffect(() => {
    const interval = setInterval(() => {
      setCarPosition(prev => {
        // Random hareket ile yolu simüle ediyoruz
        const newX = prev.x + (Math.random() * 4 - 2);
        const newY = prev.y + (Math.random() * 4 - 2);
        
        // Sınırlar içinde tutuyoruz
        return {
          x: Math.min(Math.max(newX, 10), 90),
          y: Math.min(Math.max(newY, 10), 90)
        };
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Süre hesaplama
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      setRemainingMinutes(prev => Math.max(prev - 0.2, 0));
      
      // İlerleme çubuğunu güncelleme
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.5, 100);
        
        // Adımları güncelleme
        if (newProgress >= 25 && currentStep === 0) {
          setCurrentStep(1);
        } else if (newProgress >= 50 && currentStep === 1) {
          setCurrentStep(2);
        } else if (newProgress >= 90 && currentStep === 2) {
          setCurrentStep(3);
        }
        
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <FaCar size={24} />
              <span className="font-semibold text-lg">Mavina</span>
            </Link>
            <Link href="/user" className="p-2 rounded-full hover:bg-blue-500">
              <FaUserAlt />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col">
        {/* Durum Bilgisi */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="bg-blue-100 rounded-full p-3 mb-3">
              <FaCar className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              Yıkamacı yola çıktı!
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Tahmini varış süresi: {Math.ceil(remainingMinutes)} dakika
            </p>
          </motion.div>
        </div>

        {/* Harita */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex-grow relative overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Canlı Konum</h2>
          
          <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg relative overflow-hidden">
            {/* Harita arka planı (örnek) */}
            <div className="absolute inset-0 opacity-70" style={{
              backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=41.0082,28.9784&zoom=13&size=600x400&maptype=roadmap')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>

            {/* Yer tutucu harita görseli */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Yollar */}
              <path d="M10,50 L90,50" stroke="#5c6bc0" strokeWidth="2" fill="none" />
              <path d="M50,10 L50,90" stroke="#5c6bc0" strokeWidth="2" fill="none" />
              <path d="M20,20 C40,40 60,60 80,80" stroke="#5c6bc0" strokeWidth="2" fill="none" />
              <path d="M20,80 C40,60 60,40 80,20" stroke="#5c6bc0" strokeWidth="2" fill="none" />
              
              {/* Müşteri konumu */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <circle cx="80" cy="70" r="3" fill="#e53935" />
                <circle cx="80" cy="70" r="6" fill="#e53935" fillOpacity="0.3" />
                <text x="82" y="71" fontSize="4" fill="#000">Müşteri</text>
              </motion.g>
              
              {/* Hizmet veren araba */}
              <motion.g
                style={{ x: `${carPosition.x}%`, y: `${carPosition.y}%` }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <circle cx="0" cy="0" r="3" fill="#1e88e5" />
                <FaCar x="-2" y="-2" size="4" color="#1e88e5" />
                <text x="2" y="1" fontSize="3" fill="#000">Yıkamacı</text>
              </motion.g>
            </svg>
          </div>
        </div>
        
        {/* Butonlar */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            className="py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition-colors"
            disabled
          >
            <FaMapMarkerAlt />
            Canlı Konumu Gör
          </button>
          <button
            className="py-3 px-4 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-green-700 transition-colors"
          >
            <FaPhone />
            İletişim Kur
          </button>
        </div>
        
        {/* İlerleme çubuğu */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">İşlem Durumu</h2>
          
          <div className="relative h-2 bg-gray-200 rounded-full mb-6">
            <motion.div 
              className="absolute h-full bg-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 
                  ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {index < currentStep ? (
                    '✓'
                  ) : (
                    index === 0 ? <FaCar /> : 
                    index === 1 ? <IoLocationSharp /> : 
                    index === 2 ? <FaCar /> : 
                    '✓'
                  )}
                </div>
                <span className={`text-xs font-medium text-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 