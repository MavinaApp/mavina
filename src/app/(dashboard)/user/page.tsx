"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaMapMarkerAlt, FaCalendarAlt, FaHistory, FaStar, FaClock, FaUser, FaCog, FaSignOutAlt, FaMoneyBillWave, FaCheck, FaTimes, FaComments, FaQuestion, FaArrowRight } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TransactionList from "@/components/TransactionList";
import AnimatedSection from "@/components/AnimatedSection";
import Map from '@/components/Map';
import PaymentList from "@/components/PaymentList";
import AppointmentList from '@/components/AppointmentList';
import Link from 'next/link';
import VehicleSelector from '@/components/VehicleSelector';
import ChatBox from '@/components/ChatBox';

// Harita bileşenini istemci tarafında dinamik olarak yüklüyoruz
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

// Vehicle interface'ini ekleyelim
interface Vehicle {
  id: string;
  model: string;
  licensePlate: string;
}

// Rozet sistemi için interface ve helper fonksiyonlar
interface Badge {
  type: 'bronze' | 'silver' | 'gold';
  name: string;
  icon: string;
  requirement: string;
  color: string;
}

const badges: Badge[] = [
  {
    type: 'bronze',
    name: 'Bronz Müşteri',
    icon: '🏅',
    requirement: 'Aylık 3+ yıkama',
    color: 'bg-amber-100 text-amber-800'
  },
  {
    type: 'silver',
    name: 'Gümüş Müşteri',
    icon: '🥈',
    requirement: 'Aylık 5+ yıkama',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    type: 'gold',
    name: 'Altın Müşteri',
    icon: '💎',
    requirement: 'Aylık 10+ yıkama',
    color: 'bg-yellow-100 text-yellow-800'
  }
];

// Kullanıcının rozetini belirleyen fonksiyon
const getUserBadge = (monthlyWashes: number): Badge | null => {
  if (monthlyWashes >= 10) return badges.find(b => b.type === 'gold') || null;
  if (monthlyWashes >= 5) return badges.find(b => b.type === 'silver') || null;
  if (monthlyWashes >= 3) return badges.find(b => b.type === 'bronze') || null;
  return null;
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
      rating: 3.8, 
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
  
  // Randevu alma fonksiyonu
  const handleBookAppointment = (providerId: number) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;
    setSelectedProviderForBooking(provider);
    setShowAppointmentModal(true);
  };
  
  // Randevu oluşturma fonksiyonu
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  
  // Yarım saatlik aralıklarla saat seçeneklerini oluştur
  const generateTimeSlots = (workingHours: any) => {
    const slots = [];
    const today = getDayOfWeek();
    const dayHours = workingHours[today];
    
    if (!dayHours.active) return [];

    const [startHour, startMinute] = dayHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayHours.endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    
    return slots;
  };
  
  // Randevu oluşturma fonksiyonunu güncelle
  const createAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedServiceForBooking || !selectedProviderForBooking || !location || !selectedVehicle) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    const selectedServiceDetails = selectedProviderForBooking.services.find(
      (s: any) => s.name === selectedServiceForBooking
    );

    const newAppointment = {
      id: appointments.length + 1,
      serviceName: selectedProviderForBooking.name,
      date: new Date(`${selectedDate}T${selectedTime}`),
      address: location,
      service: selectedServiceForBooking,
      price: selectedServiceDetails.price,
      status: "Onay Bekliyor",
      carModel: selectedVehicle.model,
      licensePlate: selectedVehicle.licensePlate
    };

    setAppointments([...appointments, newAppointment]);
    setShowAppointmentModal(false);
    setSelectedProviderForBooking(null);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedServiceForBooking("");
    setLocation("");
    setSelectedVehicle(null);
    alert("Randevunuz başarıyla oluşturuldu! Servis sağlayıcının onayı bekleniyor.");
  };
  
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
  
  // Servis sağlayıcılar bölümü için ref ekleyelim
  const providersRef = useRef<HTMLDivElement>(null);

  // handleServiceSelect fonksiyonunu güncelleyelim
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    
    // Servis sağlayıcıları puana göre sırala
    const sortedProviders = [...providers].sort((a, b) => b.rating - a.rating);
    setProviders(sortedProviders);

    // Servis sağlayıcılar bölümüne kaydır
    setTimeout(() => {
      providersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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

  // Randevular state'i
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      serviceName: "Mobil Yıkama Servisi 1",
      date: new Date(),
      address: "Örnek Mahallesi, Örnek Sokak No:1, İstanbul",
      service: "Detaylı Yıkama",
      price: 250,
      status: "Onaylandı"
    },
    {
      id: 2,
      serviceName: "Mobil Yıkama Servisi 2",
      date: new Date(),
      address: "Örnek Mahallesi, Örnek Sokak No:2, İstanbul",
      service: "Detaylı Yıkama",
      price: 250,
      status: "Onaylandı"
    }
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelNotification, setShowCancelNotification] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);
  const [canceledProvider, setCanceledProvider] = useState<string>("");

  // Randevu iptal etme fonksiyonunu güncelle
  const handleCancelAppointment = (appointment: any) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  // İptal onaylama fonksiyonu
  const confirmCancelAppointment = () => {
    if (!appointmentToCancel) return;

      const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentToCancel.id) {
          return { ...appointment, status: "İptal Edildi" };
        }
        return appointment;
      });
      
      setAppointments(updatedAppointments);
    setShowCancelModal(false);

    // Hizmet sağlayıcıya bildirim gönder
    const provider = providers.find(p => p.name === appointmentToCancel.serviceName);
    if (provider) {
      setCanceledProvider(provider.name);
      setShowCancelNotification(true);
    }

    setAppointmentToCancel(null);
  };

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<any>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>("");

  const [showLocationMap, setShowLocationMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = async (lat: number, lng: number) => {
    try {
      setSelectedLocation({ lat, lng }); // Önce konumu seçili olarak işaretle
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=tr`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Adres bileşenlerini ayır
        const addressComponents = data.results[0].address_components;
        const formattedAddress = {
          street: addressComponents.find((c: any) => c.types.includes('route'))?.long_name || '',
          neighborhood: addressComponents.find((c: any) => c.types.includes('neighborhood'))?.long_name || '',
          district: addressComponents.find((c: any) => c.types.includes('sublocality'))?.long_name || '',
          city: addressComponents.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name || '',
        };

        // Adresi formatla
        const addressParts = [];
        if (formattedAddress.neighborhood) addressParts.push(`${formattedAddress.neighborhood} Mahallesi`);
        if (formattedAddress.street) addressParts.push(formattedAddress.street);
        if (formattedAddress.district) addressParts.push(formattedAddress.district);
        if (formattedAddress.city) addressParts.push(formattedAddress.city);

        const fullAddress = addressParts.join(', ');
        setLocation(fullAddress || data.results[0].formatted_address);
      } else {
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Adres dönüştürme hatası:', error);
      setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  const [showProviderDetailsModal, setShowProviderDetailsModal] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Değerlendirme yapılmamış hizmetler için state ekleyelim
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [unreviewedService, setUnreviewedService] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Değerlendirme yapılmamış hizmetleri kontrol et
  useEffect(() => {
    if (!isLoading && user) {
      // Örnek veri - gerçek uygulamada API'den gelecek
      const unreviewedServices = [
        {
          id: 1,
          serviceName: "Mobil Yıkama Servisi 1",
          service: "Detaylı Yıkama",
          date: new Date("2024-02-15"),
          price: 250
        }
      ];

      if (unreviewedServices.length > 0) {
        setUnreviewedService(unreviewedServices[0]);
        setShowReviewModal(true);
      }
    }
  }, [isLoading, user]);

  // Değerlendirme gönderme fonksiyonu
  const handleSubmitReview = () => {
    if (!reviewRating || !reviewComment) {
      alert("Lütfen puan ve yorum alanlarını doldurun");
      return;
    }

    // Burada API'ye değerlendirme gönderilecek
    console.log("Değerlendirme gönderildi:", {
      serviceId: unreviewedService.id,
      rating: reviewRating,
      comment: reviewComment
    });

    setShowReviewModal(false);
    setUnreviewedService(null);
    setReviewRating(0);
    setReviewComment("");
  };

  // Yeni state'leri ekleyelim
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [tempSelectedProvider, setTempSelectedProvider] = useState<any>(null);

  // Randevu alma butonuna tıklandığında önce hatırlatma modalını göster
  const handleAppointmentClick = (provider: any) => {
    setTempSelectedProvider(provider);
    setShowReminderModal(true);
  };

  // Hatırlatma modalından devam edildiğinde randevu modalını göster
  const handleReminderConfirm = () => {
    setShowReminderModal(false);
    setSelectedProviderForBooking(tempSelectedProvider);
    setSelectedServiceForBooking(selectedService);
    setShowAppointmentModal(true);
  };

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);

  // Randevu erteleme fonksiyonu
  const handleRescheduleAppointment = () => {
    if (!rescheduleDate || !rescheduleTime) {
      alert("Lütfen tarih ve saat seçin!");
      return;
    }

    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === currentAppointment?.id) {
        return {
          ...appointment,
          date: new Date(`${rescheduleDate}T${rescheduleTime}`),
          status: "Ertelendi"
        };
      }
      return appointment;
    });

    setAppointments(updatedAppointments);
    setShowRescheduleModal(false);
    setRescheduleDate("");
    setRescheduleTime("");
    setCurrentAppointment(null);
    alert("Randevunuz başarıyla ertelendi!");
  };

  // Örnek randevular için state ekleyelim
  const [bookedSlots, setBookedSlots] = useState<{[key: string]: string[]}>(() => {
    // Bugünün tarihini al
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    // Tarihleri YYYY-MM-DD formatına çevir
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

    return {
      [todayStr]: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
      [tomorrowStr]: ['09:00', '09:30', '13:00', '13:30', '16:00', '16:30'],
      [dayAfterTomorrowStr]: ['11:00', '11:30', '12:00', '15:00', '15:30', '16:00']
    };
  });

  // Müsaitlik durumunu kontrol eden fonksiyon
  const isSlotAvailable = (time: string) => {
    if (!selectedDate) return true;
    const bookedTimesForDate = bookedSlots[selectedDate] || [];
    return !bookedTimesForDate.includes(time);
  };

  // Çalışma saati kontrolü için fonksiyon
  const isWorkingHour = (provider: any, date: string) => {
    if (!date || !provider) return false;
    const dayOfWeek = new Date(date).getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[dayOfWeek];
    return provider.workingHours[dayName]?.active || false;
  };

  // Randevu detaylarını göstermek için fonksiyon
  const getAppointmentDetails = (time: string) => {
    if (!selectedDate) return null;
    const isBooked = bookedSlots[selectedDate]?.includes(time);
    if (!isBooked) return null;

    // Örnek randevu detayları
    return {
      customerName: "Örnek Müşteri",
      service: "Detaylı Yıkama",
      duration: "30 dakika"
    };
  };

  // Örnek olarak kullanıcının aylık yıkama sayısı (gerçek uygulamada API'den gelecek)
  const [monthlyWashes] = useState(7);
  const userBadge = getUserBadge(monthlyWashes);

  const [showChat, setShowChat] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Mevcut handleOpenChat fonksiyonunu düzeltiyorum
  const handleOpenChat = (appointment: any) => {
    setSelectedAppointmentForChat({
      appointmentId: appointment.id,
      customerName: user?.name || "Kullanıcı",
      providerName: appointment.serviceName,
      userRole: "USER"
    });
    setShowChat(true);
  };

  // AI chat için state değişkenleri
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
  }>>([]);
  const [newAiMessage, setNewAiMessage] = useState("");
  const aiChatRef = useRef<HTMLDivElement>(null);
  const [showFaqInChat, setShowFaqInChat] = useState(false);

  // AI sohbetine mesaj gönderme fonksiyonu
  const handleSendAiMessage = () => {
    if (newAiMessage.trim() === "") return;

    // Yeni kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now().toString(),
      text: newAiMessage,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setAiMessages(prev => [...prev, userMessage]);
    setNewAiMessage("");

    // AI'nın cevap vermesini simüle et
    setTimeout(() => {
      // Basit cevaplar
      let response = "Anlamadım, lütfen daha açık bir şekilde sorunuzu belirtir misiniz?";
      
      const lowerMsg = newAiMessage.toLowerCase();
      
      if (lowerMsg.includes("merhaba") || lowerMsg.includes("selam")) {
        response = "Merhaba! Size nasıl yardımcı olabilirim?";
      } else if (lowerMsg.includes("yıkama") || lowerMsg.includes("yikama")) {
        response = "Mavina'da farklı yıkama paketleri bulunmaktadır. Standart, detaylı ve premium yıkama seçeneklerimiz vardır. Haritada size en yakın hizmet sağlayıcılarını görebilirsiniz.";
      } else if (lowerMsg.includes("randevu") || lowerMsg.includes("rezervasyon")) {
        response = "Randevu almak için harita üzerinden bir hizmet sağlayıcı seçip 'Randevu Al' butonuna tıklayabilirsiniz.";
      } else if (lowerMsg.includes("fiyat") || lowerMsg.includes("ücret")) {
        response = "Fiyatlar hizmet sağlayıcılara ve seçtiğiniz yıkama paketine göre değişmektedir. Standart yıkama genellikle 150-200 TL, detaylı yıkama 250-300 TL arasındadır.";
      } else if (lowerMsg.includes("iptal")) {
        response = "Randevunuzu, randevu saatinden en az 2 saat önce iptal edebilirsiniz. Randevularım sekmesinden ilgili randevuyu seçip iptal işlemini gerçekleştirebilirsiniz.";
      } else if (lowerMsg.includes("ödeme") || lowerMsg.includes("odeme")) {
        response = "Ödemeler, hizmet tamamlandıktan sonra nakit veya kredi kartı ile yapılabilir. Bazı hizmet sağlayıcılar online ödeme de kabul etmektedir.";
      } else if (lowerMsg.includes("sorun") || lowerMsg.includes("şikayet")) {
        response = "Herhangi bir sorun yaşarsanız, profil sayfanızdan destek talebi oluşturabilirsiniz. En kısa sürede size dönüş yapılacaktır.";
      } else if (lowerMsg.includes("teşekkür") || lowerMsg.includes("tesekkur") || lowerMsg.includes("sağol")) {
        response = "Rica ederim! Başka bir sorunuz olursa yardımcı olmaktan memnuniyet duyarım.";
      }

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "ai" as const,
        timestamp: new Date(),
      };

      setAiMessages(prev => [...prev, aiResponse]);
      
      // Sohbeti en son mesaja kaydır
      if (aiChatRef.current) {
        setTimeout(() => {
          if (aiChatRef.current) {
            aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
          }
        }, 100);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
          <motion.h1 
            ref={titleRef}
              className="text-2xl font-bold text-black"
            initial={{ opacity: 0, x: -50 }}
            animate={titleInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            Kullanıcı Paneli
          </motion.h1>
          </div>
          
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
                    activeTab === "badges"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleTabChange("badges")}
                >
                  <FaStar className="mr-3 text-lg" />
                  Rozetlerim
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
                    activeTab === "payments"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-blue-600"
                  }`}
                  onClick={() => handleTabChange("payments")}
                >
                  <FaMoneyBillWave className="mr-3 text-lg" />
                  Ödemelerim
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
              </div>
            </motion.div>
            
            <motion.div 
              ref={contentRef}
              className="flex-1 bg-white rounded-lg shadow-md p-4 min-h-[600px]"
              initial={{ opacity: 0, y: 50 }}
              animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Yağmur Uyarı Kartı */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-blue-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-900">
                        Bugün yağmur bekleniyor
                      </h3>
                      <p className="text-blue-700 mt-1">
                        Randevunuzu ertelemek ister misiniz?
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      // Örnek bir randevu oluştur
                      const demoAppointment = {
                        id: 1,
                        serviceName: "Mobil Yıkama Servisi 1",
                        service: "Detaylı Yıkama",
                        date: new Date(),
                        address: "Örnek Mahallesi, Örnek Sokak No:1",
                        price: 250,
                        status: "Onaylandı"
                      };
                      setCurrentAppointment(demoAppointment);
                      setShowRescheduleModal(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-2"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <span>Randevuyu Ertele</span>
                  </motion.button>
                </div>
              </motion.div>

              {activeTab === "map" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Hizmetler
                    </h2>
                  
                  {/* Konum Seçimi */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Konum Seçin</h3>
                    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
                      <MapWithNoSSR />
                    </div>
                  </div>

                  {/* Servis Seçimi */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Servis Seçin</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableServices.map((service) => (
                        <button
                              key={service}
                          onClick={() => handleServiceSelect(service)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                selectedService === service 
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="font-medium text-gray-800">{service}</span>
                        </button>
                      ))}
                    </div>
                        </div>
                        
                  {/* Servis Sağlayıcılar */}
                  {selectedService && (
                    <div ref={providersRef} className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 text-gray-700">Size En Yakın Servis Sağlayıcılar</h3>
                      <div className="space-y-4">
                        {providers.map((provider) => (
                          <div key={provider.id}>
                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                                    {provider.rating >= 4.0 && (
                                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                                        <svg 
                                          className="w-4 h-4 text-blue-600 mr-1" 
                                          fill="currentColor" 
                                          viewBox="0 0 20 20"
                                        >
                                          <path 
                                            fillRule="evenodd" 
                                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                            clipRule="evenodd" 
                                          />
                                        </svg>
                                        <span className="text-sm font-medium text-blue-600">Güvenilir Hizmet Veren</span>
                        </div>
                                    )}
                    </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    <span className="mr-4">
                                      <FaMapMarkerAlt className="inline mr-1" />
                                      {provider.distance} km uzaklıkta
                                    </span>
                                    <span className={`flex items-center ${provider.rating >= 4.0 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                      <FaStar className="inline mr-1" />
                                      <span className="font-medium">{provider.rating}</span>
                                    </span>
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAppointmentClick(provider)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                                  >
                                    Randevu Al
                                  </button>
                                  <Link
                                    href={`/provider-profile/${provider.id}`}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
                                  >
                                    Profile Git
                                  </Link>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <FaClock className="inline mr-1" />
                                  {provider.currentlyWorking ? (
                                    <span className="text-green-500">Şu anda çalışıyor</span>
                                  ) : (
                                    <span className="text-red-500">Şu anda kapalı</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            {/* Seçilen hizmetin fiyat bilgisi */}
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  <span className="font-medium text-blue-600">{selectedService}</span> hizmeti için
                                </span>
                                <span className="text-lg font-semibold text-blue-600">
                                  {provider.services.find(s => s.name === selectedService)?.price.toLocaleString('tr-TR')} ₺
                                </span>
                    </div>
                            </div>
                          </div>
                        ))}
                              </div>
                              </div>
                          )}
                </div>
              )}
              
              {activeTab === "badges" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Rozetlerim</h2>
                    <div className="text-sm text-gray-600">
                      Bu ayki yıkama sayısı: <span className="font-semibold">{monthlyWashes}</span>
                    </div>
                              </div>
                              
                  {/* Mevcut Rozet */}
                  {userBadge && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-900">
                      <h3 className="text-lg font-semibold mb-4 text-black">Mevcut Rozetiniz</h3>
                      <div className={`flex items-center gap-4 p-4 rounded-lg ${userBadge.color}`}>
                        <span className="text-4xl">{userBadge.icon}</span>
                        <div>
                          <p className="text-lg font-semibold">{userBadge.name}</p>
                          <p className="text-sm opacity-75">{userBadge.requirement}</p>
                          <p className="mt-2 text-sm">
                            Tebrikler! {userBadge.name} rozetine sahipsiniz.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tüm Rozetler */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-black">Rozet Koleksiyonu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {badges.map((badge) => {
                        const isUnlocked = (
                          (badge.type === 'bronze' && monthlyWashes >= 3) ||
                          (badge.type === 'silver' && monthlyWashes >= 5) ||
                          (badge.type === 'gold' && monthlyWashes >= 10)
                        );

                        return (
                          <div
                            key={badge.type}
                            className={`p-4 rounded-lg border-2 ${
                              isUnlocked
                                ? `${badge.color} border-transparent`
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`text-3xl ${!isUnlocked && 'opacity-40'}`}>
                                {badge.icon}
                              </span>
                              <div>
                                <p className={`font-medium ${!isUnlocked && 'text-gray-500'}`}>
                                  {badge.name}
                                </p>
                                <p className="text-sm text-gray-600">{badge.requirement}</p>
                              </div>
                            </div>
                            {isUnlocked ? (
                              <div className="flex items-center text-green-600 text-sm">
                                <FaCheck className="mr-1" />
                                Kazanıldı
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                {badge.type === 'bronze' ? `${Math.max(0, 3 - monthlyWashes)} yıkama kaldı` :
                                 badge.type === 'silver' ? `${Math.max(0, 5 - monthlyWashes)} yıkama kaldı` :
                                 `${Math.max(0, 10 - monthlyWashes)} yıkama kaldı`}
                              </div>
                              )}
                            </div>
                        );
                      })}
                            </div>
                          </div>
                          
                  {/* Rozet Avantajları */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-black">Rozet Avantajları</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                        <span className="text-2xl">🏅</span>
                        <div>
                          <p className="font-medium text-amber-800">Bronz Müşteri Avantajları</p>
                          <p className="text-sm text-amber-700">Her 5. yıkamada %5 indirim</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🥈</span>
                        <div>
                          <p className="font-medium text-gray-800">Gümüş Müşteri Avantajları</p>
                          <p className="text-sm text-gray-700">Her 3. yıkamada %10 indirim</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-2xl">💎</span>
                        <div>
                          <p className="font-medium text-yellow-800">Altın Müşteri Avantajları</p>
                          <p className="text-sm text-yellow-700">Tüm yıkamalarda %15 indirim + Öncelikli Randevu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "appointments" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Randevularım</h2>
                  <AppointmentList 
                    userId={user?.id || ''} 
                    userRole="USER" 
                    onChatClick={handleOpenChat}
                  />
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Ödemelerim</h2>
                  <PaymentList userId={user?.id || ""} userRole="USER" />
                </div>
              )}
              
              {activeTab === "history" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Geçmiş Hizmetlerim</h2>
                  <TransactionList userId={user?.id || ''} userRole="USER" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* ... existing modals ... */}

      {/* Servis Sağlayıcı Detayları Modalı */}
      {showProviderDetailsModal && selectedProviderForBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedProviderForBooking.name}
              </h3>
              <button
                onClick={() => {
                  setShowProviderDetailsModal(false);
                  setSelectedProviderForBooking(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Hizmetler ve Fiyatlar</h4>
                <div className="space-y-2">
                  {selectedProviderForBooking.services.map((service: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="font-medium text-gray-800">{service.price} TL</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Çalışma Saatleri</h4>
                <div className="space-y-2">
                  {Object.entries(selectedProviderForBooking.workingHours).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-gray-600">{dayNames[day]}</span>
                      <span className="text-gray-800">
                        {hours.active ? `${hours.startTime} - ${hours.endTime}` : 'Kapalı'}
                                      </span>
                    </div>
                                  ))}
                              </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowProviderDetailsModal(false);
                    setShowAppointmentModal(true);
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                                >
                                  Randevu Al
                </button>
                              </div>
                        </div>
                  </div>
                </div>
              )}
              
      {/* Araç Hatırlatma Modalı */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Önemli Hatırlatma
              </h3>
              <button
                onClick={() => setShowReminderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Randevu almadan önce lütfen aracınızın:
                </p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Servis sağlayıcının rahatça çalışabileceği müsait bir yerde olduğundan;
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Park halinde ve erişilebilir durumda olduğundan;
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Belirttiğiniz adreste hazır olacağından emin olunuz.
                  </li>
                </ul>
                          </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowReminderModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleReminderConfirm}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Devam Et
                </button>
                          </div>
                        </div>
                        </div>
                      </div>
              )}
              
      {/* Randevu Alma Modalı */}
      {showAppointmentModal && selectedProviderForBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Randevu Al - {selectedProviderForBooking.name}
                </h3>
                {userBadge && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-2 ${userBadge.color}`}>
                    <span className="text-lg">{userBadge.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{userBadge.name}</p>
                      <p className="text-xs opacity-75">Bu ay: {monthlyWashes} yıkama</p>
                    </div>
                </div>
              )}
              </div>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setSelectedProviderForBooking(null);
                  setSelectedServiceForBooking("");
                  setSelectedVehicle(null);
                }}
                className="text-gray-700 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sol Taraf - Müsaitlik Durumu */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                          <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Müsait Saatler</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {generateTimeSlots(selectedProviderForBooking.workingHours).map((time) => {
                      const available = isSlotAvailable(time);
                      const working = isWorkingHour(selectedProviderForBooking, selectedDate);
                      const appointmentDetails = getAppointmentDetails(time);
                      
                      return (
                        <button
                          key={time}
                          onClick={() => available && working && setSelectedTime(time)}
                          disabled={!available || !working}
                          className={`p-2 rounded-lg text-sm font-medium transition-colors relative group ${
                            selectedTime === time
                              ? 'bg-blue-500 text-white'
                              : !available
                              ? 'bg-red-100 text-red-700 cursor-not-allowed'
                              : !working
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {time}
                          {appointmentDetails && (
                            <div className="absolute hidden group-hover:block z-10 bg-white border border-gray-200 shadow-lg rounded-lg p-2 w-48 text-left text-xs left-full ml-2">
                              <p className="font-medium text-gray-800">{appointmentDetails.customerName}</p>
                              <p className="text-gray-600">{appointmentDetails.service}</p>
                              <p className="text-gray-500">{appointmentDetails.duration}</p>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Not:</span> Seçilen tarihte dolu olan saatler kırmızı ile gösterilmektedir.
                      {!isWorkingHour(selectedProviderForBooking, selectedDate) && (
                        <span className="block mt-1 text-red-600">
                          Bu gün servis sağlayıcı çalışmamaktadır.
                        </span>
                      )}
                            </p>
                          </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Müsait</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Dolu</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span>Kapalı</span>
                  </div>
                </div>
              </div>

              {/* Sağ Taraf - Diğer Bilgiler */}
              <div className="space-y-4">
                          <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seçilen Servis
                  </label>
                  <p className="text-gray-800 font-medium">{selectedServiceForBooking}</p>
                          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Araç Bilgileri
                  </label>
                  <VehicleSelector
                    userId={user?.id || ''}
                    onSelect={setSelectedVehicle}
                    selectedVehicle={selectedVehicle}
                  />
                        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Mahalle"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Sokak"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {location && (
                    <p className="mt-2 text-sm text-gray-600">
                      Seçilen Konum: {location}
                    </p>
                  )}
                  
                  <button
                    onClick={() => setShowLocationMap(true)}
                    className="mt-3 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaMapMarkerAlt />
                    <span>Haritadan Konum Seç</span>
                  </button>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setShowAppointmentModal(false);
                      setSelectedProviderForBooking(null);
                      setSelectedServiceForBooking("");
                      setSelectedVehicle(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedVehicle) {
                        alert('Lütfen bir araç seçin veya yeni araç ekleyin');
                        return;
                      }
                      createAppointment();
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    Randevu Oluştur
                  </button>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              )}
              
      {/* Harita Modalı */}
      {showLocationMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Konum Seçin
              </h3>
              <button
                onClick={() => setShowLocationMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <MapWithNoSSR />
            </div>
          </div>
        </div>
      )}
      
      {/* Değerlendirme Modalı */}
      {showReviewModal && unreviewedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Hizmet Değerlendirmesi
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
                    </div>
                    
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">{unreviewedService.serviceName}</span> tarafından verilen
                  <span className="font-medium"> {unreviewedService.service}</span> hizmetini değerlendirin
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tarih: {unreviewedService.date.toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puanınız
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl ${
                        star <= reviewRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                      </div>
                  </div>
                    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yorumunuz
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Hizmet hakkında düşüncelerinizi yazın..."
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
                        </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Daha Sonra
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  Gönder
                </button>
                      </div>
            </div>
          </div>
                </div>
              )}
              
      {/* Randevu Erteleme Modalı */}
      {showRescheduleModal && currentAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Randevu Erteleme
              </h3>
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setCurrentAppointment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
          </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">{currentAppointment.serviceName}</span> servisinden
                  <span className="font-medium"> {currentAppointment.service}</span> hizmetini erteliyorsunuz
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Mevcut Randevu: {new Date(currentAppointment.date).toLocaleDateString('tr-TR')} {new Date(currentAppointment.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
        </div>
                    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yeni Tarih
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                    </div>
                    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yeni Saat
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Saat Seçin</option>
                  {generateTimeSlots(providers.find(p => p.name === currentAppointment.serviceName)?.workingHours || {}).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                      </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setCurrentAppointment(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleRescheduleAppointment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Randevuyu Ertele
                </button>
                  </div>
            </div>
            </motion.div>
          </div>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Sohbet</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <ChatBox
                appointmentId={selectedAppointment.id}
                customerName={selectedAppointment.customerName}
                providerName={selectedAppointment.providerName}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Bot Butonu */}
      <div className="fixed bottom-6 right-6 z-30">
        <button 
          onClick={() => setShowAIChat(!showAIChat)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all"
        >
          {showAIChat ? <FaTimes size={20} /> : <FaComments size={20} />}
        </button>
      </div>

      {/* AI Chat Box */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-30 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            style={{ maxHeight: "70vh" }}
          >
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaComments className="mr-2" />
                <h3 className="font-semibold">Mavina Asistan</h3>
              </div>
              <button onClick={() => setShowAIChat(false)} className="text-white hover:text-gray-300">
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={aiChatRef}
              className="p-4 overflow-y-auto flex flex-col space-y-4"
              style={{ height: "350px" }}
            >
              {/* Karşılama mesajı */}
              {aiMessages.length === 0 && (
                <div className="bg-blue-50 p-3 rounded-lg inline-block text-gray-700 self-start max-w-3/4 mb-2">
                  <p>Merhaba! Ben Mavina Asistan. Size nasıl yardımcı olabilirim?</p>
                </div>
              )}

              {/* Mesajlar */}
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${
                    msg.sender === "user"
                      ? "self-end bg-blue-600 text-white"
                      : "self-start bg-gray-100 text-gray-800"
                  } p-3 rounded-lg inline-block max-w-3/4`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-xs ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"} block mt-1`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* FAQs in Chat */}
            <AnimatePresence>
              {showFaqInChat && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 max-h-40 overflow-y-auto p-2 bg-gray-50"
                >
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setNewAiMessage("Yıkama paketleri nelerdir?");
                        setShowFaqInChat(false);
                        handleSendAiMessage();
                      }}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Yıkama paketleri nelerdir?
                    </button>
                    <button 
                      onClick={() => {
                        setNewAiMessage("Randevu nasıl alabilirim?");
                        setShowFaqInChat(false);
                        handleSendAiMessage();
                      }}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Randevu nasıl alabilirim?
                    </button>
                    <button 
                      onClick={() => {
                        setNewAiMessage("Fiyatlar ne kadar?");
                        setShowFaqInChat(false);
                        handleSendAiMessage();
                      }}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Fiyatlar ne kadar?
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={newAiMessage}
                  onChange={(e) => setNewAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendAiMessage()}
                  placeholder="Bir mesaj yazın..."
                  className="w-full p-2 pr-16 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <div className="absolute right-2 top-1 flex items-center space-x-1">
                  <button 
                    onClick={() => setShowFaqInChat(!showFaqInChat)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaQuestion size={16} />
                  </button>
                  <button
                    onClick={handleSendAiMessage}
                    disabled={newAiMessage.trim() === ""}
                    className="bg-blue-600 text-white p-1 w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 