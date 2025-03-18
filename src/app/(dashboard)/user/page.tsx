"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaMapMarkerAlt, FaCalendarAlt, FaHistory, FaStar, FaClock, FaUser, FaCog, FaSignOutAlt, FaMoneyBillWave, FaCheck } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TransactionList from "@/components/TransactionList";

// Harita bileşenini istemci tarafında dinamik olarak yüklüyoruz
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

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

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<string>("map");
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showServicePopup, setShowServicePopup] = useState(true);
  const [selectedService, setSelectedService] = useState<string>("");
  const [availableServices, setAvailableServices] = useState([
    "Standart Yıkama",
    "Detaylı Yıkama",
    "İç Temizlik",
    "Motor Yıkama",
    "Cila",
    "Pasta"
  ]);
  
  // Örnek servis sağlayıcılar ve çalışma saatleri
  const [providers, setProviders] = useState([
    { 
      id: 1, 
      name: "Mobil Yıkama Servisi 1", 
      distance: 2.1, 
      rating: 4.1, 
      services: [
        { name: "Standart Yıkama", price: 150 },
        { name: "Detaylı Yıkama", price: 250 }
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
    },
    { 
      id: 2, 
      name: "Mobil Yıkama Servisi 2", 
      distance: 2.2, 
      rating: 4.2, 
      services: [
        { name: "Standart Yıkama", price: 150 },
        { name: "Detaylı Yıkama", price: 250 }
      ],
      workingHours: {
        monday: { active: true, startTime: "08:00", endTime: "17:00" },
        tuesday: { active: true, startTime: "08:00", endTime: "17:00" },
        wednesday: { active: true, startTime: "08:00", endTime: "17:00" },
        thursday: { active: true, startTime: "08:00", endTime: "17:00" },
        friday: { active: true, startTime: "08:00", endTime: "17:00" },
        saturday: { active: true, startTime: "09:00", endTime: "15:00" },
        sunday: { active: false, startTime: "10:00", endTime: "16:00" }
      },
      currentlyWorking: false
    },
    { 
      id: 3, 
      name: "Mobil Yıkama Servisi 3", 
      distance: 2.3, 
      rating: 4.3, 
      services: [
        { name: "Standart Yıkama", price: 150 },
        { name: "Detaylı Yıkama", price: 250 }
      ],
      workingHours: {
        monday: { active: true, startTime: "10:00", endTime: "19:00" },
        tuesday: { active: true, startTime: "10:00", endTime: "19:00" },
        wednesday: { active: true, startTime: "10:00", endTime: "19:00" },
        thursday: { active: true, startTime: "10:00", endTime: "19:00" },
        friday: { active: true, startTime: "10:00", endTime: "19:00" },
        saturday: { active: true, startTime: "11:00", endTime: "17:00" },
        sunday: { active: true, startTime: "11:00", endTime: "15:00" }
      },
      currentlyWorking: true
    }
  ]);
  
  // Seçilen servis sağlayıcı
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  
  // Bugünün gününü belirle
  const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };
  
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
  
  // Kullanıcı menüsünü dışarı tıklandığında kapatmak için
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Hizmet seçildiğinde çağrılacak fonksiyon
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    
    // Burada gerçek bir API çağrısı yapılabilir
    // Şimdilik sadece puana göre sıralama yapıyoruz
    const sortedProviders = [...providers].sort((a, b) => b.rating - a.rating);
    setProviders(sortedProviders);
  };
  
  // Hesap ayarlarına git
  const goToAccountSettings = () => {
    alert("Hesap ayarları sayfasına yönlendiriliyorsunuz.");
    setShowUserMenu(false);
  };
  
  // Çıkış yap
  const handleLogout = () => {
    alert("Çıkış yapılıyor...");
    // Gerçek uygulamada burada auth context'teki logout fonksiyonu çağrılacak
    router.push("/login");
  };
  
  // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }

  // Sekme değiştirme fonksiyonu
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowUserMenu(false);
  };

  // Animasyonlar için görünürlük kontrolü
  const [titleRef, titleInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [sidebarRef, sidebarInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white py-6">
        <div className="container mx-auto px-4">
          <motion.h1 
            ref={titleRef}
            className="text-2xl font-bold mb-6 text-black"
            initial={{ opacity: 0, x: -50 }}
            animate={titleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            Kullanıcı Paneli
          </motion.h1>
          
          <div className="flex flex-col md:flex-row">
            {/* Sekmeler - Sol tarafta dikey olarak sabit genişlikte */}
            <motion.div 
              ref={sidebarRef}
              className="w-full md:w-64 mb-6 md:mb-0 md:mr-6 flex-shrink-0"
              initial={{ opacity: 0, x: -50 }}
              animate={sidebarInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col border-r border-black h-full sticky top-6">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF", color: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, type: "tween" }}
                  className={`py-3 px-4 font-medium flex items-center text-left ${
                    activeTab === "map"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleTabChange("map")}
                >
                  <FaMapMarkerAlt className="mr-3 text-lg" />
                  Hizmetler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF", color: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, type: "tween" }}
                  className={`py-3 px-4 font-medium flex items-center text-left ${
                    activeTab === "appointments"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleTabChange("appointments")}
                >
                  <FaCalendarAlt className="mr-3 text-lg" />
                  Randevularım
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF", color: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, type: "tween" }}
                  className={`py-3 px-4 font-medium flex items-center text-left ${
                    activeTab === "history"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleTabChange("history")}
                >
                  <FaHistory className="mr-3 text-lg" />
                  Geçmiş Hizmetler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF", color: "#2563EB" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, type: "tween" }}
                  className={`py-3 px-4 font-medium flex items-center text-left ${
                    activeTab === "transactions"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleTabChange("transactions")}
                >
                  <FaMoneyBillWave className="mr-3 text-lg" />
                  Ödemelerim
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              ref={contentRef}
              className="flex-1 bg-white rounded-lg shadow-md p-4 min-h-[600px]"
              initial={{ opacity: 0, y: 50 }}
              animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {activeTab === "map" && (
                <div>
                  <AnimatedSection>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">
                      {selectedService ? `${selectedService} Hizmeti Sunan Sağlayıcılar` : "Hizmetler"}
                    </h2>
                  </AnimatedSection>
                  
                  {/* Hizmet Seçme Pop-up */}
                  {showServicePopup && (
                    <div className="relative mb-4">
                      <motion.div 
                        className="bg-white rounded-lg p-6 w-full shadow-xl border border-gray-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-xl font-semibold mb-4 text-black text-center">Hangi Hizmeti Almak İstiyorsunuz?</h2>
                        <p className="text-gray-800 mb-6 text-center">Size en uygun hizmet sağlayıcıları bulabilmemiz için lütfen almak istediğiniz hizmeti seçin.</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {availableServices.map((service, index) => (
                            <motion.button
                              key={service}
                              className={`py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                                selectedService === service 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-blue-50 text-black hover:bg-blue-100"
                              }`}
                              onClick={() => handleServiceSelect(service)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            >
                              {service}
                            </motion.button>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <motion.button
                            className="py-2 px-4 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                            onClick={() => setShowServicePopup(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Daha Sonra Seç
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  
                  <AnimatedSection delay={0.2}>
                    <div className="h-96 w-full rounded-lg overflow-hidden mb-4">
                      <MapWithNoSSR />
                    </div>
                  </AnimatedSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {/* Hizmet sağlayıcılar */}
                    {providers.map((provider, index) => (
                      <AnimatedSection key={provider.id} delay={0.2 + index * 0.1}>
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-black">{provider.name}</h3>
                              <p className="text-sm text-blue-600 mt-1">{provider.distance} km uzaklıkta</p>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar 
                                    key={i} 
                                    className={i < Math.floor(provider.rating) ? "text-yellow-400" : "text-blue-300"} 
                                  />
                                ))}
                                <span className="text-sm ml-1 text-black">({provider.rating})</span>
                              </div>
                              
                              {/* Çalışma durumu */}
                              <div className="mt-2 flex items-center">
                                <FaClock className="mr-1 text-blue-600" />
                                <span className={`text-sm ${provider.currentlyWorking ? 'text-green-600' : 'text-red-600'}`}>
                                  {provider.currentlyWorking ? 'Şu anda çalışıyor' : 'Şu anda çalışmıyor'}
                                </span>
                              </div>
                              
                              {/* Bugünün çalışma saatleri */}
                              {provider.workingHours[getDayOfWeek() as keyof typeof provider.workingHours].active ? (
                                <p className="text-sm text-blue-600 mt-1">
                                  Bugün: {provider.workingHours[getDayOfWeek() as keyof typeof provider.workingHours].startTime} - 
                                  {provider.workingHours[getDayOfWeek() as keyof typeof provider.workingHours].endTime}
                                </p>
                              ) : (
                                <p className="text-sm text-red-600 mt-1">
                                  Bugün kapalı
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <motion.button 
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                onClick={() => setSelectedProvider(selectedProvider === provider.id ? null : provider.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {selectedProvider === provider.id ? 'Kapat' : 'Detaylar'}
                              </motion.button>
                            </div>
                          </div>
                          
                          {/* Servis detayları */}
                          {selectedProvider === provider.id && (
                            <motion.div 
                              className="mt-4 border-t pt-4"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                            >
                              <h4 className="font-medium text-black mb-2">Sunulan Hizmetler</h4>
                              <ul className="space-y-2">
                                {provider.services.map((service, idx) => (
                                  <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    className="flex justify-between"
                                  >
                                    <span className="text-sm text-blue-600">{service.name}</span>
                                    <span className="text-sm font-medium text-black">{service.price}₺</span>
                                  </motion.li>
                                ))}
                              </ul>
                              <div className="mt-4">
                                <h4 className="font-medium text-black mb-2">Çalışma Saatleri</h4>
                                <ul className="space-y-1 text-sm">
                                  {Object.entries(provider.workingHours).map(([day, hours], idx) => (
                                    <motion.li 
                                      key={day}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                                      className="flex justify-between"
                                    >
                                      <span className="text-blue-600">{dayNames[day]}</span>
                                      <span className={hours.active ? "text-black" : "text-red-600"}>
                                        {hours.active ? `${hours.startTime} - ${hours.endTime}` : "Kapalı"}
                                      </span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <motion.button
                                  className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Randevu Al
                                </motion.button>
                                <motion.button
                                  className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => router.push(`/provider-profile/${provider.id}`)}
                                >
                                  Profili Görüntüle
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "appointments" && (
                <div>
                  <AnimatedSection>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Randevularım</h2>
                  </AnimatedSection>
                  {[1, 2].map((appointment, index) => (
                    <AnimatedSection key={appointment} delay={0.2 + index * 0.1}>
                      <div className="border-b pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-black text-lg">Mobil Yıkama Servisi {appointment}</h3>
                            <p className="text-sm text-blue-600 mt-2">
                              <FaCalendarAlt className="inline mr-1" /> 
                              {new Date().toLocaleDateString('tr-TR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-sm text-blue-600 mt-2">
                              <FaMapMarkerAlt className="inline mr-1" /> 
                              Örnek Mahallesi, Örnek Sokak No:{appointment}, İstanbul
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              Onaylandı
                            </span>
                            <motion.button 
                              className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              İptal Et
                            </motion.button>
                          </div>
                        </div>
                        <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm font-medium text-black">Detaylı Yıkama</p>
                          <p className="text-sm text-blue-600">
                            250₺
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
              
              {activeTab === "history" && (
                <div>
                  <AnimatedSection>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Geçmiş Hizmetler</h2>
                  </AnimatedSection>
                  {[1, 2, 3].map((history, index) => (
                    <AnimatedSection key={history} delay={0.2 + index * 0.1}>
                      <div className="border-b pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0 hover:bg-blue-50 p-4 rounded-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-black text-lg">Mobil Yıkama Servisi {history}</h3>
                            <p className="text-sm text-blue-600 mt-2">
                              <FaCalendarAlt className="inline mr-1" /> 
                              {new Date(2023, 5 + history, 10).toLocaleDateString('tr-TR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                              Tamamlandı
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm font-medium text-black">Standart Yıkama</p>
                          <p className="text-sm text-blue-600 mb-2">
                            150₺
                          </p>
                          <div className="flex items-center mt-2 border-t pt-2">
                            <p className="text-sm mr-2 text-black">Değerlendirmeniz:</p>
                            <div className="flex">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                              >
                                <FaStar className="text-yellow-400 mr-1" />
                              </motion.div>
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                              >
                                <FaStar className="text-yellow-400 mr-1" />
                              </motion.div>
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                              >
                                <FaStar className="text-yellow-400 mr-1" />
                              </motion.div>
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                              >
                                <FaStar className="text-yellow-400 mr-1" />
                              </motion.div>
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                              >
                                <FaStar className="text-blue-300" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
              
              {/* Ödemelerim Sekmesi */}
              {activeTab === "transactions" && (
                <AnimatedSection>
                  <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
                      <FaMoneyBillWave className="mr-2" />
                      Ödemelerim
                    </h2>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                      <p className="text-blue-700">
                        Bu sayfada, aldığınız hizmetlerin ödeme durumlarını takip edebilir ve ödeme yaptığınızda onay verebilirsiniz.
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
                      <p className="text-yellow-700 flex items-center">
                        <FaCheck className="mr-2" />
                        Ödeme yaptığınızda "Ödeme Yapıldı" butonuna tıklayarak hizmet sağlayıcıyı bilgilendirebilirsiniz.
                      </p>
                    </div>
                    
                    {user && (
                      <div className="mt-4">
                        <TransactionList userId={user.id} userRole="USER" />
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Animasyon için CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 