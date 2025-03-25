"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaCar, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection = ({ children, delay = 0, className = "" }: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function ProviderProfile() {
  const params = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    // Burada gerçek API çağrısı yapılacak
    // Şimdilik örnek veri kullanıyoruz
    const mockProvider = {
      id: params.id,
      name: "Mobil Yıkama Servisi 1",
      rating: 4.8,
      reviewCount: 156,
      distance: 2.5,
      services: ["Detaylı Yıkama", "İç Temizlik", "Cilalama", "Detaylı İç Temizlik"],
      price: 250,
      image: "/images/provider1.jpg",
      isAvailable: true,
      description: "10 yıllık tecrübemizle profesyonel araç yıkama hizmeti sunuyoruz. Müşteri memnuniyeti odaklı çalışıyoruz.",
      workingHours: "09:00 - 20:00",
      phone: "+90 555 123 45 67",
      address: "Örnek Mahallesi, Örnek Sokak No:1, İstanbul",
      reviews: [
        {
          id: 1,
          user: "Ahmet Y.",
          rating: 5,
          comment: "Çok memnun kaldım, araç pırıl pırıl oldu. Teşekkürler!",
          date: "2024-03-15"
        },
        {
          id: 2,
          user: "Ayşe K.",
          rating: 4,
          comment: "Hızlı ve kaliteli hizmet. Tekrar tercih edeceğim.",
          date: "2024-03-14"
        }
      ]
    };

    setTimeout(() => {
      setProvider(mockProvider);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Servis Sağlayıcı Bulunamadı</h2>
          <p className="text-gray-600">Aradığınız servis sağlayıcıya ulaşılamıyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{provider.rating}</span>
                    <span className="text-blue-200 ml-1">({provider.reviewCount} değerlendirme)</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{provider.distance} km uzaklıkta</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-2">{provider.price}₺'den başlayan fiyatlarla</div>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Randevu Al
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Hakkında</h2>
                <p className="text-gray-600">{provider.description}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Sunduğu Hizmetler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.services.map((service: string, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedService(service)}
                    >
                      <FaCar className="text-blue-600 mr-3" />
                      <span className="font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Değerlendirmeler</h2>
                <div className="space-y-4">
                  {provider.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="font-medium">{review.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">- {review.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sağ Kolon */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaPhone className="text-blue-600 mr-3" />
                    <a href={`tel:${provider.phone}`} className="text-gray-600 hover:text-blue-600">
                      {provider.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-blue-600 mr-3" />
                    <span className="text-gray-600">{provider.address}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-blue-600 mr-3" />
                    <span className="text-gray-600">{provider.workingHours}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Çalışma Saatleri</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pazartesi - Cuma</span>
                    <span className="font-medium">{provider.workingHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cumartesi</span>
                    <span className="font-medium">{provider.workingHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pazar</span>
                    <span className="font-medium">Kapalı</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </main>
    </div>
  );
} 