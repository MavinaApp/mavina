"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaCalendarAlt, FaMapMarkerAlt, FaCog, FaHistory, FaCheck, FaTimes, FaClock, FaSave, FaEdit, FaTrash, FaMoneyBillWave, FaUser, FaStar, FaCamera, FaImage, FaPlus, FaEye, FaHeart, FaComment, FaCar, FaUsers, FaChartLine } from "react-icons/fa";
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

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState<"appointments" | "location" | "services" | "history" | "activity" | "transactions" | "profile">("appointments");
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [serviceRadius, setServiceRadius] = useState<number>(5);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showAddServiceForm, setShowAddServiceForm] = useState<boolean>(false);
  const [newService, setNewService] = useState<{name: string, price: string, duration: number}>({ name: "", price: "", duration: 30 });
  const [services, setServices] = useState([
    { id: 1, name: "Standart Yıkama", price: 150, duration: 30 },
    { id: 2, name: "Detaylı Yıkama", price: 250, duration: 60 },
    { id: 3, name: "İç Temizlik", price: 120, duration: 45 },
  ]);
  
  // Konum bilgisi için state
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, address: string}>({
    lat: 41.015137,
    lng: 28.979530,
    address: "İstanbul, Türkiye"
  });
  
  // Kullanıcının gerçek konumunu almak için
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Koordinatları adrese çevirmek için Nominatim API kullanıyoruz
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            // Adres bilgisini oluşturuyoruz
            let address = "Bilinmeyen Konum";
            if (data && data.display_name) {
              // Adres bilgisini daha okunabilir hale getiriyoruz
              if (data.address) {
                // Adres bileşenlerini kullanarak daha anlamlı bir adres oluşturuyoruz
                const parts = [];
                if (data.address.road) parts.push(data.address.road);
                if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
                if (data.address.suburb) parts.push(data.address.suburb);
                if (data.address.town) parts.push(data.address.town);
                if (data.address.city) parts.push(data.address.city);
                if (data.address.state) parts.push(data.address.state);
                
                address = parts.length > 0 ? parts.join(', ') : "Bilinmeyen Konum";
              } else {
                // Eğer adres detayları yoksa, display_name'i kullanıyoruz
                const addressParts = data.display_name.split(', ');
                // İlk 3 parçayı alıyoruz (sokak, mahalle, ilçe gibi)
                address = addressParts.slice(0, 3).join(', ');
              }
            }
            
            setCurrentLocation({
              lat,
              lng,
              address
            });
          } catch (error) {
            console.error("Adres bilgisi alınamadı:", error);
            setCurrentLocation({
              lat,
              lng,
              address: `Konum: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.error("Konum alınamadı:", error);
        },
        { 
          enableHighAccuracy: true, // Yüksek doğruluk için
          timeout: 10000, // 10 saniye zaman aşımı
          maximumAge: 0 // Her zaman güncel konum
        }
      );
    }
  }, []);
  
  // Randevular için state
  const [appointments, setAppointments] = useState([
    { id: 1, customer: "Müşteri 1", email: "musteri1@example.com", date: new Date().toLocaleDateString('tr-TR'), time: "14:01", service: "Standart Yıkama", price: "150₺", location: "Örnek Mahallesi, Örnek Sokak No:1, İstanbul", status: "Beklemede" },
    { id: 2, customer: "Müşteri 2", email: "musteri2@example.com", date: new Date().toLocaleDateString('tr-TR'), time: "14:02", service: "Detaylı Yıkama", price: "250₺", location: "Örnek Mahallesi, Örnek Sokak No:2, İstanbul", status: "Beklemede" },
    { id: 3, customer: "Müşteri 3", email: "musteri3@example.com", date: new Date().toLocaleDateString('tr-TR'), time: "14:03", service: "Standart Yıkama", price: "150₺", location: "Örnek Mahallesi, Örnek Sokak No:3, İstanbul", status: "Beklemede" },
  ]);
  
  // Aktiflik yönetimi için state'ler
  const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(true);
  const [tomorrowStartTime, setTomorrowStartTime] = useState<string>("09:00");
  const [tomorrowEndTime, setTomorrowEndTime] = useState<string>("18:00");
  const [selectedDay, setSelectedDay] = useState<string>("tomorrow");
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { active: true, startTime: "09:00", endTime: "18:00" },
    tuesday: { active: true, startTime: "09:00", endTime: "18:00" },
    wednesday: { active: true, startTime: "09:00", endTime: "18:00" },
    thursday: { active: true, startTime: "09:00", endTime: "18:00" },
    friday: { active: true, startTime: "09:00", endTime: "18:00" },
    saturday: { active: true, startTime: "10:00", endTime: "16:00" },
    sunday: { active: false, startTime: "10:00", endTime: "16:00" }
  });
  
  // Animasyonlar için görünürlük kontrolü
  const [titleRef, titleInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [sidebarRef, sidebarInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: false, threshold: 0.1 });
  
  // Profil için state'ler
  const [profilePhotos, setProfilePhotos] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1605164599901-7e001faa516d?q=80&w=2070&auto=format&fit=crop", likes: 24, comments: 5, description: "Detaylı araç yıkama hizmeti" },
    { id: 2, url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2071&auto=format&fit=crop", likes: 18, comments: 3, description: "İç temizlik hizmeti" },
    { id: 3, url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2071&auto=format&fit=crop", likes: 32, comments: 7, description: "Motor yıkama hizmeti" },
  ]);
  
  const [profileDescription, setProfileDescription] = useState("Profesyonel mobil araç yıkama hizmeti. 5 yıllık tecrübe ile hizmetinizdeyiz. Detaylı araç yıkama, iç temizlik, motor yıkama hizmetleri sunuyoruz.");
  const [profileStats, setProfileStats] = useState({
    followers: 128,
    following: 56,
    posts: 15,
    rating: 4.7,
    reviewCount: 42
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedDescription, setEditedDescription] = useState(profileDescription);
  
  // Kullanıcı giriş yapmamışsa veya hizmet sağlayıcı değilse ana sayfaya yönlendir
  useEffect(() => {
    if (!user || user.role !== "PROVIDER") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "PROVIDER") {
    return null;
  }

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceRadius(Number(e.target.value));
  };

  const toggleActiveStatus = () => {
    setIsActive(prevState => !prevState);
    // Gerçek bir uygulamada burada API çağrısı yapılabilir
    console.log("Aktiflik durumu değiştirildi:", !isActive);
  };

  const handleAddService = () => {
    // Burada gerçek bir API çağrısı yapılacak, şimdilik sadece formu gösterip gizliyoruz
    setShowAddServiceForm(true);
  };

  const handleCancelAddService = () => {
    setShowAddServiceForm(false);
    setNewService({ name: "", price: "", duration: 30 });
  };

  const handleSaveService = () => {
    // Fiyat değerini sayıya dönüştürüp kontrol edelim
    const price = newService.price === "" ? 0 : Number(newService.price);
    
    // Yeni hizmeti listeye ekle
    const newServiceItem = {
      id: services.length + 1,
      name: newService.name,
      price: price,
      duration: newService.duration
    };
    
    setServices([...services, newServiceItem]);
    
    // Formu gizle ve form verilerini sıfırla
    setShowAddServiceForm(false);
    setNewService({ name: "", price: "", duration: 30 });
    
    // Kullanıcıya bilgi ver
    alert(`Yeni hizmet eklendi: ${newService.name}, Fiyat: ${price}₺`);
  };

  const handleRemoveService = (id: number) => {
    // Hizmeti listeden kaldır
    setServices(services.filter(service => service.id !== id));
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      // Sadece sayısal değerlere izin ver
      if (value === "" || /^\d+$/.test(value)) {
        setNewService({
          ...newService,
          [name]: value
        });
      }
    } else if (name === "duration") {
      setNewService({
        ...newService,
        duration: value === "" ? 30 : Number(value)
      });
    } else {
      setNewService({
        ...newService,
        [name]: value
      });
    }
  };

  // Randevu onaylama fonksiyonu
  const handleApproveAppointment = (id: number) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id 
        ? {...appointment, status: "Onaylandı"} 
        : appointment
    ));
    alert(`${id} numaralı randevu onaylandı.`);
  };

  // Randevu iptal etme fonksiyonu
  const handleCancelAppointment = (id: number) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id 
        ? {...appointment, status: "İptal Edildi"} 
        : appointment
    ));
    alert(`${id} numaralı randevu iptal edildi.`);
  };

  const toggleCurrentlyWorking = () => {
    setCurrentlyWorking(prevState => !prevState);
    // Gerçek bir uygulamada burada API çağrısı yapılabilir
    console.log("Çalışma durumu değiştirildi:", !currentlyWorking);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedDay === "tomorrow") {
      if (name === "startTime") {
        setTomorrowStartTime(value);
      } else if (name === "endTime") {
        setTomorrowEndTime(value);
      }
    } else {
      // Haftalık program için
      const day = selectedDay as keyof typeof weeklySchedule;
      setWeeklySchedule(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [name === "startTime" ? "startTime" : "endTime"]: value
        }
      }));
    }
  };

  const toggleDayActive = (day: keyof typeof weeklySchedule) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active
      }
    }));
  };

  const saveWorkingHours = () => {
    // Gerçek bir uygulamada burada API çağrısı yapılabilir
    if (selectedDay === "tomorrow") {
      alert(`Yarınki çalışma saatleriniz kaydedildi: ${tomorrowStartTime} - ${tomorrowEndTime}`);
    } else {
      const day = selectedDay as keyof typeof weeklySchedule;
      const dayNames: Record<string, string> = {
        monday: "Pazartesi",
        tuesday: "Salı",
        wednesday: "Çarşamba",
        thursday: "Perşembe",
        friday: "Cuma",
        saturday: "Cumartesi",
        sunday: "Pazar"
      };
      
      alert(`${dayNames[day]} günü için çalışma saatleriniz kaydedildi: ${weeklySchedule[day].startTime} - ${weeklySchedule[day].endTime}`);
    }
  };

  const saveWeeklySchedule = () => {
    // Gerçek bir uygulamada burada API çağrısı yapılabilir
    alert("Haftalık çalışma programınız başarıyla kaydedildi!");
  };

  // Konum güncelleme fonksiyonu
  const updateLocation = () => {
    if (navigator.geolocation) {
      // Konum güncellenirken kullanıcıya bilgi ver
      alert("Konumunuz alınıyor, lütfen bekleyin...");
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Daha detaylı adres bilgisi almak için zoom seviyesini artırıyoruz
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            let address = "Bilinmeyen Konum";
            if (data && data.display_name) {
              // Adres bilgisini daha okunabilir hale getiriyoruz
              if (data.address) {
                // Adres bileşenlerini kullanarak daha anlamlı bir adres oluşturuyoruz
                const parts = [];
                if (data.address.road) parts.push(data.address.road);
                if (data.address.neighbourhood) parts.push(data.address.neighbourhood);
                if (data.address.suburb) parts.push(data.address.suburb);
                if (data.address.town) parts.push(data.address.town);
                if (data.address.city) parts.push(data.address.city);
                if (data.address.state) parts.push(data.address.state);
                
                address = parts.join(', ');
              } else {
                // Eğer adres detayları yoksa, display_name'i kullanıyoruz
                const addressParts = data.display_name.split(', ');
                // İlk 3 parçayı alıyoruz (sokak, mahalle, ilçe gibi)
                address = addressParts.slice(0, 3).join(', ');
              }
            }
            
            setCurrentLocation({
              lat,
              lng,
              address
            });
            
            alert("Konumunuz başarıyla güncellendi!");
          } catch (error) {
            console.error("Adres bilgisi alınamadı:", error);
            setCurrentLocation({
              lat,
              lng,
              address: `Konum: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
            });
            alert("Konumunuz güncellendi, ancak adres bilgisi alınamadı.");
          }
        },
        (error) => {
          console.error("Konum alınamadı:", error);
          let errorMessage = "Konumunuz alınamadı.";
          
          // Hata koduna göre daha açıklayıcı mesajlar
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += " Konum izni reddedildi.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += " Konum bilgisi kullanılamıyor.";
              break;
            case error.TIMEOUT:
              errorMessage += " Konum isteği zaman aşımına uğradı.";
              break;
            default:
              errorMessage += " Bilinmeyen bir hata oluştu.";
          }
          
          alert(errorMessage + " Lütfen konum izinlerinizi kontrol edin.");
        },
        { 
          enableHighAccuracy: true, // Yüksek doğruluk için
          timeout: 10000, // 10 saniye zaman aşımı
          maximumAge: 0 // Her zaman güncel konum
        }
      );
    } else {
      alert("Tarayıcınız konum hizmetlerini desteklemiyor.");
    }
  };

  // Profil düzenleme fonksiyonu
  const handleSaveProfile = () => {
    setProfileDescription(editedDescription);
    setIsEditingProfile(false);
    // Gerçek uygulamada burada API çağrısı yapılabilir
    alert("Profil bilgileriniz güncellendi!");
  };
  
  // Fotoğraf yükleme fonksiyonu
  const handlePhotoUpload = () => {
    // Gerçek uygulamada burada dosya seçme ve yükleme işlemi yapılacak
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Dosya seçildiğinde yapılacak işlemler
        alert("Fotoğraf yükleme başarılı! (Demo)");
        
        // Yeni fotoğrafı listeye ekle (gerçek uygulamada API'den dönen URL kullanılacak)
        const newPhoto = {
          id: profilePhotos.length + 1,
          url: "https://images.unsplash.com/photo-1600322305530-45714a0bc945?q=80&w=2070&auto=format&fit=crop",
          likes: 0,
          comments: 0,
          description: "Yeni yüklenen fotoğraf"
        };
        
        setProfilePhotos([newPhoto, ...profilePhotos]);
      }
    };
    fileInput.click();
  };

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalCustomers: 0,
    totalEarnings: 0,
  });

  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 1,
      customerName: "Ahmet Yılmaz",
      service: "İç Dış Yıkama",
      date: "2024-03-19 14:30",
      status: "onay bekliyor"
    },
    {
      id: 2,
      customerName: "Mehmet Demir",
      service: "Detaylı İç Temizlik",
      date: "2024-03-20 11:00",
      status: "onaylandı"
    }
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            ref={titleRef}
            className="text-2xl font-bold mb-6 text-black"
            initial={{ opacity: 0, x: -50 }}
            animate={titleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            Hizmet Sağlayıcı Paneli
          </motion.h1>
          
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <motion.div 
              ref={sidebarRef}
              className="w-full md:w-64 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={sidebarInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Menü</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaUser className="mr-3" />
                    Profilim
                  </button>
            <button
                    onClick={() => setActiveTab("appointments")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                activeTab === "appointments"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
              }`}
            >
                    <FaCalendarAlt className="mr-3" />
                    Randevularım
            </button>
            <button
                    onClick={() => setActiveTab("location")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                activeTab === "location"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
              }`}
            >
                    <FaMapMarkerAlt className="mr-3" />
              Konum Yönetimi
            </button>
            <button
                    onClick={() => setActiveTab("services")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                activeTab === "services"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
              }`}
            >
                    <FaCog className="mr-3" />
                    Hizmetlerim
            </button>
            <button
                    onClick={() => setActiveTab("history")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                activeTab === "history"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
              }`}
            >
                    <FaHistory className="mr-3" />
              Geçmiş Hizmetler
            </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                      activeTab === "activity"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaClock className="mr-3" />
                    Aktiflik Yönetimi
                  </button>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-md ${
                      activeTab === "transactions"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaMoneyBillWave className="mr-3" />
                    Ödeme İşlemleri
                  </button>
                </nav>
          </div>
            </motion.div>
            
            {/* Main content */}
            <motion.div 
              ref={contentRef}
              className="flex-1 md:ml-8"
              initial={{ opacity: 0, y: 50 }}
              animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === "appointments" && (
              <div>
                    <AnimatedSection>
                      <h2 className="text-xl font-semibold mb-6 text-blue-600">Randevularım</h2>
                    </AnimatedSection>
                    <AnimatedSection delay={0.2}>
                      <div className="space-y-6">
                        {appointments.map((appointment, index) => (
                          <motion.div 
                            key={appointment.id}
                            className="bg-white rounded-lg shadow-sm p-5 border border-blue-100 hover:shadow-md transition-all duration-300"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex flex-col md:flex-row justify-between">
                              <div className="mb-4 md:mb-0">
                                <h3 className="font-semibold text-lg text-blue-600">{appointment.customer}</h3>
                                <p className="text-sm text-blue-600">{appointment.email}</p>
                                <div className="mt-3 grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-blue-600 font-medium">Tarih/Saat</p>
                                    <p className="text-sm text-black">{appointment.date}, {appointment.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-blue-600 font-medium">Hizmet</p>
                                    <p className="text-sm text-black">{appointment.service} - {appointment.price}</p>
                                  </div>
                            </div>
                                <div className="mt-3">
                                  <p className="text-xs text-blue-600 font-medium">Konum</p>
                                  <p className="text-sm text-black">{appointment.location}</p>
                            </div>
                            </div>
                              <div className="flex flex-col items-end space-y-3">
                                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full 
                                  ${appointment.status === "Beklemede" ? "bg-yellow-100 text-yellow-800" : 
                                    appointment.status === "Onaylandı" ? "bg-green-100 text-green-800" : 
                                    "bg-red-100 text-red-800"}`}>
                                  {appointment.status}
                            </span>
                                
                                {appointment.status === "Beklemede" && (
                                  <div className="flex space-x-2 mt-2">
                                    <motion.button 
                                      className="text-green-600 hover:text-green-900 p-2 bg-green-100 rounded-full flex items-center"
                                      onClick={() => handleApproveAppointment(appointment.id)}
                                      title="Randevuyu Onayla"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <FaCheck className="mr-1" /> Onayla
                                    </motion.button>
                                    <motion.button 
                                      className="text-red-600 hover:text-red-900 p-2 bg-red-100 rounded-full flex items-center"
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                      title="Randevuyu İptal Et"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <FaTimes className="mr-1" /> İptal
                                    </motion.button>
                                  </div>
                                )}
                                {appointment.status !== "Beklemede" && (
                                  <span className="text-gray-500 text-sm mt-2">İşlem yapılamaz</span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                      ))}
                </div>
                    </AnimatedSection>
              </div>
            )}
            
            {activeTab === "location" && (
              <div>
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">Konum Yönetimi</h2>
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                      <h3 className="font-semibold mb-2">Mevcut Konum</h3>
                      <p className="text-blue-600 mb-4">
                        Şu anki hizmet verdiğiniz konum: <span className="font-medium">{currentLocation.address}</span>
                      </p>
                      
                      <div className="h-64 bg-gray-200 rounded-lg mb-4">
                        {/* Harita burada gösterilecek */}
                        <div className="h-full flex items-center justify-center">
                          <p className="text-blue-600">Harita Yükleniyor...</p>
                        </div>
                </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Hizmet Alanı</h4>
                        <p className="text-blue-600 mb-2">
                          Hizmet verdiğiniz alan: <span className="font-medium">{serviceRadius} km</span>
                        </p>
                        <input
                          type="range" 
                          min="1" 
                          max="50" 
                          value={serviceRadius} 
                          onChange={handleRadiusChange}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-black">
                          <span>1 km</span>
                          <span>25 km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                      
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={updateLocation}
                      >
                        Konum Bilgilerini Güncelle
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === "activity" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-black">Aktiflik Yönetimi</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Mevcut Çalışma Durumu */}
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4 text-black">Mevcut Çalışma Durumu</h3>
                        
                        <div className="flex items-center mb-6">
                          <span className="mr-4 text-blue-600 font-medium">Şu anda çalışıyor musunuz?</span>
                          <button 
                            onClick={toggleCurrentlyWorking}
                            className="relative inline-flex items-center cursor-pointer bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition-all duration-300"
                            aria-pressed={currentlyWorking}
                            aria-label={currentlyWorking ? "Çalışma durumunu kapat" : "Çalışma durumunu aç"}
                          >
                            <div className="relative w-16 h-8">
                              <span className={`absolute inset-0 rounded-full transition-all duration-500 ease-in-out ${currentlyWorking ? 'bg-blue-600' : 'bg-gray-400'}`}></span>
                              <span 
                                className={`absolute top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
                                  currentlyWorking 
                                    ? 'right-1' 
                                    : 'left-1'
                                }`}
                              >
                                <span 
                                  className={`absolute w-3 h-3 rounded-full transition-all duration-500 ease-in-out ${
                                    currentlyWorking 
                                      ? 'bg-blue-600' 
                                      : 'bg-gray-400'
                                  } left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                                ></span>
                              </span>
                            </div>
                          </button>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800">
                            <strong>Durum:</strong> {currentlyWorking ? 'Aktif (Çalışıyor)' : 'Pasif (Çalışmıyor)'}
                          </p>
                          <p className="text-sm text-blue-600 mt-2">
                            Bu durumu değiştirdiğinizde, müşteriler sizin çalışıp çalışmadığınızı görebilecek ve buna göre randevu alabileceklerdir.
                          </p>
                        </div>
                      </div>
                      
                      {/* Çalışma Saatleri */}
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4 text-black">Çalışma Saatleri</h3>
                        
                    <div className="mb-4">
                          <label className="block text-sm font-medium text-blue-600 mb-2">
                            Düzenlemek istediğiniz günü seçin:
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            <button 
                              onClick={() => setSelectedDay("tomorrow")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "tomorrow" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Yarın
                            </button>
                            <button 
                              onClick={() => setSelectedDay("monday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "monday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Pazartesi
                            </button>
                            <button 
                              onClick={() => setSelectedDay("tuesday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "tuesday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Salı
                            </button>
                            <button 
                              onClick={() => setSelectedDay("wednesday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "wednesday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Çarşamba
                            </button>
                            <button 
                              onClick={() => setSelectedDay("thursday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "thursday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Perşembe
                            </button>
                            <button 
                              onClick={() => setSelectedDay("friday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "friday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Cuma
                            </button>
                            <button 
                              onClick={() => setSelectedDay("saturday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "saturday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Cumartesi
                            </button>
                            <button 
                              onClick={() => setSelectedDay("sunday")}
                              className={`py-2 px-3 text-sm rounded-md ${selectedDay === "sunday" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                            >
                              Pazar
                            </button>
                          </div>
                        </div>
                        
                        {selectedDay === "tomorrow" ? (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="startTime" className="block text-sm font-medium text-blue-600 mb-1">
                                Başlangıç Saati
                              </label>
                              <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={tomorrowStartTime}
                                onChange={handleTimeChange}
                                className="w-full px-3 py-2 border border-black rounded-md"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="endTime" className="block text-sm font-medium text-blue-600 mb-1">
                                Bitiş Saati
                              </label>
                              <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                value={tomorrowEndTime}
                                onChange={handleTimeChange}
                                className="w-full px-3 py-2 border border-black rounded-md"
                              />
                            </div>
                            
                            <button 
                              onClick={saveWorkingHours}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
                            >
                              Yarınki Saatleri Kaydet
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center mb-4">
                              <span className="mr-4 text-blue-600 font-medium">Bu gün çalışacak mısınız?</span>
                              <button 
                                onClick={() => toggleDayActive(selectedDay as keyof typeof weeklySchedule)}
                                className="relative inline-flex items-center cursor-pointer bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition-all duration-300"
                                aria-pressed={weeklySchedule[selectedDay as keyof typeof weeklySchedule].active}
                              >
                                <div className="relative w-16 h-8">
                                  <span className={`absolute inset-0 rounded-full transition-all duration-500 ease-in-out ${weeklySchedule[selectedDay as keyof typeof weeklySchedule].active ? 'bg-blue-600' : 'bg-gray-400'}`}></span>
                                  <span 
                                    className={`absolute top-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
                                      weeklySchedule[selectedDay as keyof typeof weeklySchedule].active 
                                        ? 'right-1' 
                                        : 'left-1'
                                    }`}
                                  >
                                    <span 
                                      className={`absolute w-3 h-3 rounded-full transition-all duration-500 ease-in-out ${
                                        weeklySchedule[selectedDay as keyof typeof weeklySchedule].active 
                                          ? 'bg-blue-600' 
                                          : 'bg-gray-400'
                                      } left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
                                    ></span>
                                  </span>
                                </div>
                              </button>
                            </div>
                            
                            {weeklySchedule[selectedDay as keyof typeof weeklySchedule].active && (
                              <>
                                <div>
                                  <label htmlFor="startTime" className="block text-sm font-medium text-blue-600 mb-1">
                                    Başlangıç Saati
                                  </label>
                                  <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={weeklySchedule[selectedDay as keyof typeof weeklySchedule].startTime}
                                    onChange={handleTimeChange}
                                    className="w-full px-3 py-2 border border-black rounded-md"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="endTime" className="block text-sm font-medium text-blue-600 mb-1">
                                    Bitiş Saati
                      </label>
                      <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={weeklySchedule[selectedDay as keyof typeof weeklySchedule].endTime}
                                    onChange={handleTimeChange}
                                    className="w-full px-3 py-2 border border-black rounded-md"
                                  />
                                </div>
                              </>
                            )}
                            
                            <button 
                              onClick={saveWorkingHours}
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
                            >
                              Bu Günün Saatlerini Kaydet
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Haftalık Program Özeti */}
                    <div className="mt-6 border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4 text-black">Haftalık Çalışma Programı Özeti</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-black">
                          <thead className="bg-white">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                Gün
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                Durum
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                Başlangıç
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                                Bitiş
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-black">
                            {Object.entries(weeklySchedule).map(([day, schedule]) => {
                              const dayNames: Record<string, string> = {
                                monday: "Pazartesi",
                                tuesday: "Salı",
                                wednesday: "Çarşamba",
                                thursday: "Perşembe",
                                friday: "Cuma",
                                saturday: "Cumartesi",
                                sunday: "Pazar"
                              };
                              
                              return (
                                <tr key={day}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-blue-600">{dayNames[day]}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {schedule.active ? 'Çalışıyor' : 'Çalışmıyor'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    {schedule.active ? schedule.startTime : '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    {schedule.active ? schedule.endTime : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      <button 
                        onClick={saveWeeklySchedule}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto"
                      >
                        <FaSave className="mr-2" />
                        Tüm Programı Kaydet
                    </button>
                    </div>
                  </div>
                )}
                
                {activeTab === "profile" && (
                  <AnimatedSection>
                    <div className="bg-white rounded-lg">
                      {/* Profil Başlığı */}
                      <div className="flex flex-col md:flex-row items-center md:items-start mb-8 border-b pb-8">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-5xl mb-4 md:mb-0 md:mr-8 relative overflow-hidden border-4 border-blue-600">
                          {user?.name?.charAt(0) || 'S'}
                          <button 
                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                            onClick={handlePhotoUpload}
                            title="Profil fotoğrafı yükle"
                          >
                            <FaCamera />
                          </button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center mb-4">
                            <h2 className="text-2xl font-bold text-black mb-2 md:mb-0 md:mr-4">{user?.name || "Servis Sağlayıcı"}</h2>
                            <button 
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                              onClick={() => setIsEditingProfile(!isEditingProfile)}
                            >
                              {isEditingProfile ? "İptal" : "Profili Düzenle"}
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-6 mb-4 justify-center md:justify-start">
                            <div className="text-center">
                              <span className="font-bold text-black">{profileStats.posts}</span>
                              <p className="text-sm text-blue-600">Gönderi</p>
                            </div>
                            <div className="text-center">
                              <span className="font-bold text-black">{profileStats.followers}</span>
                              <p className="text-sm text-blue-600">Takipçi</p>
                            </div>
                            <div className="text-center">
                              <span className="font-bold text-black">{profileStats.following}</span>
                              <p className="text-sm text-blue-600">Takip</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center">
                                <span className="font-bold text-black mr-1">{profileStats.rating}</span>
                                <FaStar className="text-yellow-400" />
                              </div>
                              <p className="text-sm text-blue-600">{profileStats.reviewCount} Değerlendirme</p>
                            </div>
                          </div>
                          
                          {isEditingProfile ? (
                            <div className="mb-4">
                              <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full p-2 border border-blue-300 rounded-md"
                                rows={4}
                                placeholder="Profiliniz hakkında bilgi verin..."
                              />
                              <button 
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={handleSaveProfile}
                              >
                                Kaydet
                              </button>
                            </div>
                          ) : (
                            <p className="text-black">{profileDescription}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Fotoğraf Yükleme Butonu */}
                      <div className="mb-8">
                        <button 
                          className="w-full py-3 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center"
                          onClick={handlePhotoUpload}
                        >
                          <FaPlus className="mr-2" />
                          Yeni Fotoğraf Yükle
                        </button>
                      </div>
                      
                      {/* Fotoğraf Galerisi */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-black">Hizmet Fotoğraflarım</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {profilePhotos.map((photo) => (
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
                        <h3 className="text-xl font-semibold mb-4 text-black">Sunduğum Hizmetler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {services.map((service) => (
                            <motion.div 
                              key={service.id}
                              className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-black">{service.name}</h4>
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
                        <h3 className="text-xl font-semibold mb-4 text-black">Müşteri Değerlendirmeleri</h3>
                        <div className="space-y-4">
                          {[1, 2, 3].map((review) => (
                            <motion.div 
                              key={review}
                              className="border rounded-lg p-4"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                  M{review}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-semibold text-black">Müşteri {review}</h4>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar 
                                          key={i} 
                                          className={i < 5 - (review % 2) ? "text-yellow-400" : "text-blue-200"} 
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-blue-600 mt-1">
                                    {new Date(2023, 5 + review, 10).toLocaleDateString('tr-TR')}
                                  </p>
                                  <p className="mt-2 text-black">
                                    {review === 1 
                                      ? "Çok memnun kaldım, araç tertemiz oldu. Teşekkürler!" 
                                      : review === 2 
                                        ? "Hızlı ve kaliteli hizmet. Kesinlikle tavsiye ederim."
                                        : "Fiyat/performans açısından çok iyi. Tekrar tercih edeceğim."}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                  </div>
                </div>
              </div>
                  </AnimatedSection>
            )}
            
            {activeTab === "services" && (
              <div>
                    <h2 className="text-xl font-semibold mb-4 text-black">Hizmetlerim</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                              <h3 className="font-semibold text-black">{service.name}</h3>
                              <p className="text-sm text-black mt-1">Süre: {service.duration} dakika</p>
                        </div>
                        <div className="text-lg font-bold text-blue-600">{service.price}₺</div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded hover:bg-blue-200">
                          Düzenle
                        </button>
                            <button 
                              className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                              onClick={() => handleRemoveService(service.id)}
                            >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                    
                    {showAddServiceForm ? (
                      <div className="border rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-black mb-4">Yeni Hizmet Ekle</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                              Hizmet Adı
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={newService.name}
                              onChange={handleServiceInputChange}
                              className="w-full px-3 py-2 border border-black rounded-md"
                              placeholder="Örn: Detaylı Yıkama"
                            />
                          </div>
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-black mb-1">
                              Fiyat (₺)
                            </label>
                            <input
                              type="text"
                              id="price"
                              name="price"
                              value={newService.price}
                              onChange={handleServiceInputChange}
                              className="w-full px-3 py-2 border border-black rounded-md"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-black mb-1">
                              Süre (dakika)
                            </label>
                            <input
                              type="number"
                              id="duration"
                              name="duration"
                              value={newService.duration}
                              onChange={handleServiceInputChange}
                              className="w-full px-3 py-2 border border-black rounded-md"
                              min="5"
                              step="5"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={handleCancelAddService}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                              İptal
                            </button>
                            <button 
                              onClick={handleSaveService}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Kaydet
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={handleAddService}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                  Yeni Hizmet Ekle
                </button>
                    )}
              </div>
            )}
            
            {activeTab === "history" && (
              <div>
                    <AnimatedSection>
                      <h2 className="text-xl font-semibold mb-4 text-black">Geçmiş Hizmetler</h2>
                    </AnimatedSection>
                    
                    <div className="space-y-6">
                      {[1, 2, 3, 4, 5].map((history, index) => (
                        <AnimatedSection key={history} delay={0.2 + index * 0.1}>
                          <div className="bg-white rounded-lg shadow-sm p-5 border border-blue-100 hover:shadow-md transition-all duration-300 hover:bg-blue-50">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div className="mb-4 md:mb-0">
                                <h3 className="font-semibold text-lg text-blue-600">Müşteri {history}</h3>
                                <p className="text-sm text-blue-600 mt-2">
                                  <FaCalendarAlt className="inline mr-1" /> 
                              {new Date(2023, 5 + history, 10).toLocaleDateString('tr-TR')}
                                </p>
                                <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
                                  <p className="text-sm font-medium text-black">{history % 2 === 0 ? "Detaylı Yıkama" : "Standart Yıkama"}</p>
                                  <p className="text-sm text-blue-600">
                                    {history % 2 === 0 ? "250₺" : "150₺"}
                                  </p>
                                </div>
                            </div>
                              <div className="flex flex-col items-start md:items-end space-y-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                                  Tamamlandı
                                </span>
                                <div className="flex items-center mt-2">
                                  <p className="text-sm mr-2 text-black">Değerlendirme:</p>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                      <motion.div 
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                                      >
                                        <svg
                                          className={`h-5 w-5 mr-1 ${
                                            i < 5 - (history % 2) ? "text-yellow-400" : "text-blue-300"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                      </motion.div>
                              ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AnimatedSection>
                      ))}
                </div>
              </div>
            )}
                
                {activeTab === "transactions" && (
                  <AnimatedSection>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-blue-500" />
                        Ödeme İşlemleri
                      </h2>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                        <p className="text-blue-700">
                          Bu sayfada, müşterilerinize sağladığınız hizmetlerin ödeme durumlarını takip edebilir ve hizmet tamamlandığında onay verebilirsiniz.
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
                        <p className="text-yellow-700 flex items-center">
                          <FaCheck className="mr-2" />
                          Hizmet tamamlandığında "Hizmet Tamamlandı" butonuna tıklayarak müşteriyi bilgilendirebilirsiniz.
                        </p>
                      </div>
                      
                      {user && (
                        <div className="mt-4">
                          <TransactionList userId={user.id} userRole="PROVIDER" />
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 