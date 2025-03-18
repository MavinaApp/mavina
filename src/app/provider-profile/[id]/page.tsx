"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaStar, FaHeart, FaComment, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Görünürlüğe göre animasyon yapan bileşen
const AnimatedSection = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
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

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;
  
  // Örnek veri - gerçek uygulamada API'den alınacak
  const [provider, setProvider] = useState({
    id: providerId,
    name: "Mobil Yıkama Servisi " + providerId,
    profileImage: null,
    description: "Profesyonel mobil araç yıkama hizmeti. 5 yıllık tecrübe ile hizmetinizdeyiz. Detaylı araç yıkama, iç temizlik, motor yıkama hizmetleri sunuyoruz.",
    rating: 4.7,
    reviewCount: 42,
    followers: 128,
    following: 56,
    posts: 15,
    location: "İstanbul, Türkiye",
    services: [
      { id: 1, name: "Standart Yıkama", price: 150, duration: 30 },
      { id: 2, name: "Detaylı Yıkama", price: 250, duration: 60 },
      { id: 3, name: "İç Temizlik", price: 120, duration: 45 },
    ],
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1605164599901-7e001faa516d?q=80&w=2070&auto=format&fit=crop", likes: 24, comments: 5, description: "Detaylı araç yıkama hizmeti" },
      { id: 2, url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2071&auto=format&fit=crop", likes: 18, comments: 3, description: "İç temizlik hizmeti" },
      { id: 3, url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2071&auto=format&fit=crop", likes: 32, comments: 7, description: "Motor yıkama hizmeti" },
    ],
    reviews: [
      { id: 1, userName: "Müşteri 1", userInitial: "M1", rating: 5, date: new Date(2023, 6, 10), comment: "Çok memnun kaldım, araç tertemiz oldu. Teşekkürler!" },
      { id: 2, userName: "Müşteri 2", userInitial: "M2", rating: 4, date: new Date(2023, 7, 15), comment: "Hızlı ve kaliteli hizmet. Kesinlikle tavsiye ederim." },
      { id: 3, userName: "Müşteri 3", userInitial: "M3", rating: 5, date: new Date(2023, 8, 20), comment: "Fiyat/performans açısından çok iyi. Tekrar tercih edeceğim." },
    ],
    workingHours: {
      monday: { active: true, startTime: "09:00", endTime: "18:00" },
      tuesday: { active: true, startTime: "09:00", endTime: "18:00" },
      wednesday: { active: true, startTime: "09:00", endTime: "18:00" },
      thursday: { active: true, startTime: "09:00", endTime: "18:00" },
      friday: { active: true, startTime: "09:00", endTime: "18:00" },
      saturday: { active: true, startTime: "10:00", endTime: "16:00" },
      sunday: { active: false, startTime: "10:00", endTime: "16:00" }
    },
    currentlyWorking: true
  });
  
  // Türkçe gün isimleri
  const dayNames: Record<string, string> = {
    monday: "Pazartesi",
    tuesday: "Salı",
    wednesday: "Çarşamba",
    thursday: "Perşembe",
    friday: "Cuma",
    saturday: "Cumartesi",
    sunday: "Pazar"
  };
  
  // Bugünün gününü belirle
  const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };
  
  // Animasyonlar için görünürlük kontrolü
  const [titleRef, titleInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            ref={titleRef}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profil Başlığı */}
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8 border-b pb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-5xl mb-4 md:mb-0 md:mr-8">
                {provider.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center mb-4">
                  <h1 className="text-2xl font-bold text-black mb-2 md:mb-0 md:mr-4">{provider.name}</h1>
                  <motion.button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/appointment/${provider.id}`)}
                  >
                    Randevu Al
                  </motion.button>
                </div>
                
                <div className="flex flex-wrap gap-6 mb-4 justify-center md:justify-start">
                  <div className="text-center">
                    <span className="font-bold text-black">{provider.posts}</span>
                    <p className="text-sm text-blue-600">Gönderi</p>
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-black">{provider.followers}</span>
                    <p className="text-sm text-blue-600">Takipçi</p>
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-black">{provider.following}</span>
                    <p className="text-sm text-blue-600">Takip</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center">
                      <span className="font-bold text-black mr-1">{provider.rating}</span>
                      <FaStar className="text-yellow-400" />
                    </div>
                    <p className="text-sm text-blue-600">{provider.reviewCount} Değerlendirme</p>
                  </div>
                </div>
                
                <p className="text-black">{provider.description}</p>
                
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                  <div className="flex items-center text-blue-600">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="text-sm">{provider.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-blue-600" />
                    <span className={`text-sm ${provider.currentlyWorking ? 'text-green-600' : 'text-red-600'}`}>
                      {provider.currentlyWorking ? 'Şu anda çalışıyor' : 'Şu anda çalışmıyor'}
                    </span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <FaCalendarAlt className="mr-1" />
                    <span className="text-sm">
                      {provider.workingHours[getDayOfWeek() as keyof typeof provider.workingHours].active 
                        ? `Bugün: ${provider.workingHours[getDayOfWeek() as keyof typeof provider.workingHours].startTime} - ${provider.workingHours[getDayOfWeek() as keyof typeof provider.workingHours].endTime}`
                        : "Bugün kapalı"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Çalışma Saatleri */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-black">Çalışma Saatleri</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(provider.workingHours).map(([day, hours]) => (
                  <div key={day} className="border rounded-lg p-3">
                    <h3 className="font-medium text-blue-600">{dayNames[day]}</h3>
                    <p className={hours.active ? "text-black" : "text-red-600"}>
                      {hours.active ? `${hours.startTime} - ${hours.endTime}` : "Kapalı"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={contentRef}
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Fotoğraf Galerisi */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-black">Hizmet Fotoğrafları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provider.photos.map((photo) => (
                  <motion.div 
                    key={photo.id}
                    className="border rounded-lg overflow-hidden"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="relative pb-[100%]">
                      <img 
                        src={photo.url} 
                        alt={`Hizmet fotoğrafı ${photo.id}`} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-black mb-2">{photo.description}</p>
                      <div className="flex justify-between text-blue-600">
                        <div className="flex items-center">
                          <FaHeart className="mr-1" />
                          <span className="text-sm">{photo.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <FaComment className="mr-1" />
                          <span className="text-sm">{photo.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <FaEye className="mr-1" />
                          <span className="text-sm">{photo.likes * 5 + photo.comments * 3}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Hizmetler Listesi */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-black">Sunulan Hizmetler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {provider.services.map((service) => (
                  <motion.div 
                    key={service.id}
                    className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-black">{service.name}</h3>
                        <p className="text-sm text-blue-600 mt-1">Süre: {service.duration} dakika</p>
                      </div>
                      <div className="text-lg font-bold text-blue-600">{service.price}₺</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Değerlendirmeler */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">Müşteri Değerlendirmeleri</h2>
              <div className="space-y-4">
                {provider.reviews.map((review) => (
                  <motion.div 
                    key={review.id}
                    className="border rounded-lg p-4"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                        {review.userInitial}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-black">{review.userName}</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < review.rating ? "text-yellow-400" : "text-blue-200"} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                          {review.date.toLocaleDateString('tr-TR')}
                        </p>
                        <p className="mt-2 text-black">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 