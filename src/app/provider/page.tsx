"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaCalendarAlt, FaCar, FaSprayCan, FaUsers, FaChartLine, FaCog, FaWater, FaShieldAlt, FaUser, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaBell, FaCheck, FaTimes, FaExclamationTriangle, FaDirections, FaCamera, FaCheckCircle, FaInfoCircle, FaStar, FaPhone, FaEnvelope, FaComments, FaRobot, FaPaperPlane, FaQuestionCircle, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import ChatBox from '@/components/ChatBox';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });

interface Appointment {
  id: string;
  customerName: string;
  service: string;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  carInfo: string;
  location: string;
  price: number;
  monthlyWashes?: number; // Müşterinin aylık yıkama sayısı
  cancelReason?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  photos?: {
    front: string;
    back: string;
    left: string;
    right: string;
    interior1: string;
    interior2: string;
  };
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Customer {
  id: string;
  name: string;
  carInfo: string;
  location: string;
  phone: string;
  email: string;
  lastService: string;
  monthlyWashes: number; // Aylık yıkama sayısı için yeni alan
  serviceHistory: {
    date: string;
    service: string;
    price: number;
  }[];
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

// Örnek randevuları güncelle
const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "Ahmet Yılmaz",
    service: "Detaylı Yıkama",
    date: new Date(),
    carInfo: "BMW 3.20i - 34ABC123",
    location: "Kadıköy, İstanbul",
    price: 250,
    status: "pending",
    monthlyWashes: 7, // Gümüş seviye
    coordinates: {
      lat: 40.9862,
      lng: 29.0282
    }
  },
  {
    id: "2",
    customerName: "Ayşe Demir",
    service: "Motor Yıkama",
    date: new Date(),
    carInfo: "Mercedes C200 - 34XYZ789",
    location: "Beşiktaş, İstanbul",
    price: 200,
    status: "confirmed",
    monthlyWashes: 12, // Altın seviye
    coordinates: {
      lat: 41.0422,
      lng: 29.0083
    }
  },
  {
    id: "3",
    customerName: "Mehmet Kaya",
    service: "İç Temizlik",
    date: new Date(),
    carInfo: "Audi A3 - 34DEF456",
    location: "Üsküdar, İstanbul",
    price: 150,
    status: "completed",
    monthlyWashes: 4, // Bronz seviye
    coordinates: {
      lat: 41.0233,
      lng: 29.0151
    }
  }
];

const monthlyData = [
  { name: 'Ocak', gelir: 4000, randevu: 24 },
  { name: 'Şubat', gelir: 3000, randevu: 18 },
  { name: 'Mart', gelir: 5000, randevu: 29 },
  { name: 'Nisan', gelir: 2780, randevu: 15 },
  { name: 'Mayıs', gelir: 4890, randevu: 28 },
  { name: 'Haziran', gelir: 3390, randevu: 20 },
];

const serviceData = [
  { name: 'Premium Yıkama', value: 45 },
  { name: 'İç-Dış Yıkama', value: 35 },
  { name: 'Dış Yıkama', value: 20 },
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'appointments' | 'chats' | 'services' | 'profile' | 'analytics'>('appointments');
  const [isWorking, setIsWorking] = useState(true);
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedAppointmentForPhoto, setSelectedAppointmentForPhoto] = useState<Appointment | null>(null);
  const [photos, setPhotos] = useState<{
    front: string;
    back: string;
    left: string;
    right: string;
    interior1: string;
    interior2: string;
  }>({
    front: "",
    back: "",
    left: "",
    right: "",
    interior1: "",
    interior2: "",
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: "new_appointment",
      title: "Yeni Randevu",
      message: "Ahmet Yılmaz yeni bir randevu oluşturdu",
      time: "5 dakika önce",
      read: false
    },
    {
      id: 2,
      type: "payment",
      title: "Ödeme Alındı",
      message: "Mehmet Demir'in ödemesi başarıyla alındı",
      time: "1 saat önce",
      read: false
    },
    {
      id: 3,
      type: "completed",
      title: "Randevu Tamamlandı",
      message: "Ayşe Kaya'nın randevusu başarıyla tamamlandı",
      time: "2 saat önce",
      read: true
    },
    {
      id: 4,
      type: "system",
      title: "Sistem Bildirimi",
      message: "Yeni güncellemeler mevcut. Lütfen uygulamayı güncelleyin",
      time: "1 gün önce",
      read: true
    }
  ]);
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Dış Yıkama",
      price: 200,
      description: "Dış yıkama ve kurulama"
    },
    {
      id: "2",
      name: "İç-Dış Yıkama",
      price: 300,
      description: "İç ve dış detaylı temizlik"
    },
    {
      id: "3",
      name: "Premium Yıkama",
      price: 500,
      description: "Detaylı iç-dış yıkama ve koruma"
    }
  ]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Service>({
    id: "",
    name: "",
    price: 0,
    description: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Ahmet Yılmaz",
      carInfo: "BMW 3.20i - 34ABC123",
      location: "Kadıköy, İstanbul",
      phone: "+90 555 123 4567",
      email: "ahmet@example.com",
      lastService: "2024-02-15",
      monthlyWashes: 7, // Gümüş seviye
      serviceHistory: [
        { date: "2024-02-15", service: "Detaylı Yıkama", price: 250 },
        { date: "2024-02-01", service: "İç Temizlik", price: 150 }
      ]
    },
    {
      id: "2",
      name: "Ayşe Demir",
      carInfo: "Mercedes C200 - 34XYZ789",
      location: "Beşiktaş, İstanbul",
      phone: "+90 555 987 6543",
      email: "ayse@example.com",
      lastService: "2024-02-10",
      monthlyWashes: 12, // Altın seviye
      serviceHistory: [
        { date: "2024-02-10", service: "Detaylı Yıkama", price: 250 },
        { date: "2024-02-05", service: "Motor Yıkama", price: 200 }
      ]
    }
  ]);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showChat, setShowChat] = useState(false); 
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Takvim için gerekli state'leri ekleyelim
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilityStatus, setAvailabilityStatus] = useState<'active' | 'busy' | 'offline'>('active');
  const [weeklySchedule, setWeeklySchedule] = useState<{
    [key: string]: {
      [key: string]: {
        status: 'available' | 'booked' | 'offline';
        appointment?: {
          customerName: string;
          service: string;
        };
      };
    };
  }>({
    monday: {
      '09:00': { status: 'available' },
      '09:30': { status: 'available' },
      '10:00': { status: 'booked', appointment: { customerName: 'Ahmet Yılmaz', service: 'Detaylı Yıkama' } },
      '10:30': { status: 'booked', appointment: { customerName: 'Ahmet Yılmaz', service: 'Detaylı Yıkama' } },
      '11:00': { status: 'available' },
      '11:30': { status: 'available' },
      '12:00': { status: 'offline' },
      '12:30': { status: 'offline' },
      '13:00': { status: 'available' },
      '13:30': { status: 'available' },
      '14:00': { status: 'booked', appointment: { customerName: 'Mehmet Demir', service: 'Standart Yıkama' } },
      '14:30': { status: 'booked', appointment: { customerName: 'Mehmet Demir', service: 'Standart Yıkama' } },
      '15:00': { status: 'available' },
      '15:30': { status: 'available' },
      '16:00': { status: 'available' },
      '16:30': { status: 'available' },
      '17:00': { status: 'offline' },
      '17:30': { status: 'offline' }
    },
    tuesday: {
      '09:00': { status: 'available' },
      '09:30': { status: 'available' },
      '10:00': { status: 'available' },
      '10:30': { status: 'available' },
      '11:00': { status: 'booked', appointment: { customerName: 'Ayşe Kaya', service: 'İç Temizlik' } },
      '11:30': { status: 'booked', appointment: { customerName: 'Ayşe Kaya', service: 'İç Temizlik' } },
      '12:00': { status: 'available' },
      '12:30': { status: 'available' },
      '13:00': { status: 'offline' },
      '13:30': { status: 'offline' },
      '14:00': { status: 'available' },
      '14:30': { status: 'available' },
      '15:00': { status: 'available' },
      '15:30': { status: 'available' },
      '16:00': { status: 'booked', appointment: { customerName: 'Can Yıldız', service: 'Detaylı Yıkama' } },
      '16:30': { status: 'booked', appointment: { customerName: 'Can Yıldız', service: 'Detaylı Yıkama' } },
      '17:00': { status: 'available' },
      '17:30': { status: 'available' }
    }
  });

  const faqItems = [
    {
      question: "Mavina nedir?",
      answer: "Mavina, hizmet veren oto yıkamacılarla müşterileri buluşturan çevrimiçi bir platformdur. Hem mobil yıkamacılar hem de marina çevresindeki hizmet sağlayıcılar burada yer alabilir."
    },
    {
      question: "Hizmet almak için üyelik zorunlu mu?",
      answer: "Evet, hizmet talebi oluşturmak için kayıtlı kullanıcı olmanız gerekir. Bu sayede hizmet geçmişinize erişebilir ve favori yıkamacılarınızı takip edebilirsiniz."
    },
    {
      question: "Ödeme nasıl yapılıyor?",
      answer: "Şu anlık ödeme, müşteri ve yıkamacı arasında gerçekleşmektedir. Ancak sistem üzerinde 'Ödeme Yapıldı' ve 'İşlem Tamamlandı' onaylarıyla süreç güvenli şekilde ilerler."
    },
    {
      question: "Randevu aldığım hizmeti iptal edebilir miyim?",
      answer: "Evet, randevu saatinden en az 1 saat öncesine kadar iptal edebilirsiniz."
    },
    {
      question: "Mavina'da kimler hizmet verebilir?",
      answer: "Mobil oto yıkamacılar, marina temizlik hizmeti verenler ve alanında yetkin bireysel veya kurumsal firmalar hizmet sağlayıcı olarak platforma katılabilir."
    },
    {
      question: "Hizmet verenlerin güvenilirliği nasıl sağlanıyor?",
      answer: "Her hizmet veren telefon numarası ve kimlik doğrulamasından geçmektedir. Ayrıca sistemde geçmiş müşteri yorumları ve puanlamalar görünür durumdadır."
    },
    {
      question: "Yorum ve değerlendirme yapabilir miyim?",
      answer: "Evet. Hizmet tamamlandıktan sonra, aldığınız hizmete puan verebilir ve yorum yazabilirsiniz."
    },
    {
      question: "Mavina hangi şehirlerde hizmet veriyor?",
      answer: "Başlangıçta İzmir ve çevresinde hizmet vermeye başladık, ancak platform Türkiye genelinde yaygınlaşmaktadır."
    }
  ];

  // Yeni state ekleyelim
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [locationAlertMessage, setLocationAlertMessage] = useState("");

  // Eğer kullanıcı giriş yapmamışsa veya provider değilse, login sayfasına yönlendir
  if (!user || user.role !== "PROVIDER") {
    router.push("/login");
    return null;
  }

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "confirmed":
        return "Onaylandı";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  const handleAppointmentAction = (id: string, action: "confirm" | "cancel") => {
    if (action === "confirm") {
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: "confirmed" } : app
      ));
    } else if (action === "cancel") {
      const appointment = appointments.find(app => app.id === id);
      if (appointment) {
        setSelectedAppointment(appointment);
        setShowCancelModal(true);
      }
    }
  };

  const handleCancelConfirm = () => {
    if (selectedAppointment && cancelReason.trim()) {
      setAppointments(appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: "cancelled", cancelReason: cancelReason.trim() } 
          : app
      ));
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason("");
    }
  };

  const handleDirections = (coordinates?: { lat: number; lng: number }) => {
    if (coordinates) {
      // Google Maps yol tarifi URL'i
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      // Konum yoksa uyarı göster
      setLocationAlertMessage("Bu randevu için konum bilgisi bulunmuyor.");
      setShowLocationAlert(true);
    }
  };

  const handleCompleteAppointment = (appointment: Appointment) => {
    setSelectedAppointmentForPhoto(appointment);
    setShowPhotoModal(true);
  };

  const handlePhotoUpload = (type: keyof typeof photos) => {
    // Burada gerçek bir fotoğraf yükleme işlemi yapılacak
    // Şimdilik örnek olarak bir URL kullanıyoruz
    setPhotos(prev => ({
      ...prev,
      [type]: "https://example.com/photo.jpg"
    }));
  };

  const handleCompleteConfirm = () => {
    if (selectedAppointmentForPhoto) {
      setAppointments(appointments.map(app => 
        app.id === selectedAppointmentForPhoto.id 
          ? { ...app, status: "completed", photos } 
          : app
      ));
      setShowPhotoModal(false);
      setSelectedAppointmentForPhoto(null);
      setPhotos({
        front: "",
        back: "",
        left: "",
        right: "",
        interior1: "",
        interior2: "",
      });
    }
  };

  const isPhotosComplete = () => {
    return photos.front && photos.back && photos.left && photos.right;
  };

  const handleAddService = () => {
    setSelectedService(null);
    setServiceForm({
      id: "",
      name: "",
      price: 0,
      description: ""
    });
    setShowServiceModal(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setServiceForm(service);
    setShowServiceModal(true);
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const handleServiceSubmit = () => {
    if (serviceForm.name && serviceForm.price > 0) {
      if (selectedService) {
        // Güncelleme
        setServices(services.map(s => 
          s.id === selectedService.id ? { ...serviceForm } : s
        ));
      } else {
        // Yeni ekleme
        setServices([...services, { ...serviceForm, id: Date.now().toString() }]);
      }
      setShowServiceModal(false);
      setSelectedService(null);
      setServiceForm({
        id: "",
        name: "",
        price: 0,
        description: ""
      });
    }
  };

  const handleShowCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const calculateTotalRevenue = (history: { price: number }[]) => {
    return history.reduce((total, service) => total + service.price, 0);
  };

  const handleContact = (type: "phone" | "email", contact: string) => {
    if (type === "phone") {
      window.location.href = `tel:${contact}`;
    } else {
      window.location.href = `mailto:${contact}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 10) {
      setNewPhone(value);
      if (value.length === 10) {
        setShowPhoneVerification(true);
        setCountdown(60);
        // Burada SMS gönderme işlemi yapılacak
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  const handleVerifyCode = () => {
    // Burada doğrulama kodu kontrolü yapılacak
    if (verificationCode === "123456") { // Örnek doğrulama kodu
      setIsPhoneVerified(true);
      setShowPhoneVerification(false);
      // Burada telefon numarası güncelleme işlemi yapılacak
    }
  };

  const handleResendCode = () => {
    setCountdown(60);
    // Burada SMS gönderme işlemi tekrar yapılacak
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Sekme değiştirme fonksiyonu
  const handleTabChange = (tab: 'appointments' | 'chats' | 'services' | 'profile' | 'analytics') => {
    setActiveTab(tab);
  };

  const handleOpenChat = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowChat(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex-grow flex">
        {/* Sol Menü */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-white shadow-lg"
        >
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">Hizmet Sağlayıcı</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Çalışma Durumu</span>
                <button
                  onClick={() => setIsWorking(!isWorking)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isWorking ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isWorking ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {isWorking ? "Şu anda çalışıyorsunuz" : "Şu anda çalışmıyorsunuz"}
              </p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => handleTabChange('appointments')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'appointments'
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaCalendarAlt className="mr-3" />
                Randevular
              </button>
              
              <button
                onClick={() => handleTabChange('chats')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'chats'
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaComments className="mr-3" />
                Sohbetlerim
              </button>
              
              <button
                onClick={() => handleTabChange('services')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'services'
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaSprayCan className="mr-3" />
                Hizmetler
              </button>
              
              <button
                onClick={() => handleTabChange('analytics')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'analytics'
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaChartLine className="mr-3" />
                Analitik
              </button>
              
              <button 
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-blue-600 hover:bg-gray-50"
                }`}
              >
                <FaUser className="mr-3" />
                Profil
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Ana İçerik */}
        <motion.main 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow p-8"
        >
          {/* Üst Bilgi Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bugünkü Randevular</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">3</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <FaCalendarAlt className="text-blue-500 text-xl" />
              </div>
            </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Aktif Müşteriler</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <FaUsers className="text-green-500 text-xl" />
              </div>
            </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Hizmet Bölgeleri</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">5</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-purple-500 text-xl" />
              </div>
            </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bu Ay Gelir</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">₺8,540</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                  <FaMoneyBillWave className="text-yellow-500 text-xl" />
              </div>
            </div>
            </motion.div>
          </div>

          {/* Sekme İçerikleri */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {activeTab === 'appointments' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Randevular</h2>
                  <div className="flex items-center space-x-4">
                    <motion.button 
                      onClick={() => setShowNotifications(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors relative"
                    >
                      <FaBell className="inline-block mr-2" />
                      Bildirimler
                      {notifications.some(n => !n.read) && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </motion.button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <motion.div 
                      key={appointment.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors w-full h-32 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start w-full">
              <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">{appointment.customerName}</h3>
                            {appointment.monthlyWashes && (
                              <div className={`${getUserBadge(appointment.monthlyWashes)?.color} px-1 py-0.5 rounded-full text-xs flex items-center gap-1`}>
                                <span>{getUserBadge(appointment.monthlyWashes)?.icon}</span>
                                <span className="font-medium">{getUserBadge(appointment.monthlyWashes)?.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 text-sm text-gray-600 mt-0.5">
                            <span>{appointment.service}</span>
                            <span>•</span>
                            <span>{appointment.date.toLocaleDateString('tr-TR')}</span>
                            <span>•</span>
                            <span>{appointment.price}₺</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
        </div>
                
                      <div className="grid grid-cols-3 gap-4 text-sm mt-auto">
                        <div className="flex items-center text-gray-500">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {new Date(appointment.date).toLocaleString("tr-TR", {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })}
                            </div>
                        <div className="flex items-center text-gray-500">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          {appointment.location}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <FaCar className="mr-2 text-gray-400" />
                              {appointment.carInfo}
                            </div>
                            </div>

                      {appointment.status === "cancelled" && appointment.cancelReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 text-xs">
                          <div className="flex items-start">
                            <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-red-800">İptal Nedeni:</p>
                              <p className="text-red-600 mt-0.5">{appointment.cancelReason}</p>
                            </div>
                            </div>
                        </div>
                      )}

                      {appointment.status === "pending" && (
                        <div className="mt-2 flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAppointmentAction(appointment.id, "confirm")}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center"
                          >
                            <FaCheck className="mr-1" />
                            Onayla
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAppointmentAction(appointment.id, "cancel")}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                          >
                            <FaTimes className="mr-1" />
                            İptal Et
                          </motion.button>
                        </div>
                      )}

                      {appointment.status === "confirmed" && (
                        <div className="mt-2 flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDirections(appointment.coordinates)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                          >
                            <FaDirections className="mr-1" />
                            Yol Tarifi
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCompleteAppointment(appointment)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center"
                          >
                            <FaCheckCircle className="mr-1" />
                            Tamamla
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* İptal Modalı */}
                <AnimatePresence>
                  {showCancelModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                            <FaExclamationTriangle className="text-red-500 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Randevuyu İptal Et</h3>
                            <p className="text-sm text-gray-500">
                              {selectedAppointment?.customerName} için olan randevuyu iptal etmek istediğinize emin misiniz?
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İptal Nedeni
                          </label>
                          <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="İptal nedenini belirtiniz..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowCancelModal(false);
                              setSelectedAppointment(null);
                              setCancelReason("");
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Vazgeç
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancelConfirm}
                            disabled={!cancelReason.trim()}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              cancelReason.trim()
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            İptal Et
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'chats' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Sohbetlerim</h2>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Müşteri ara..."
                        className="w-64 px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <FaSearch />
                      </div>
                    </div>
                    <select
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                    >
                      <option value="all">Tüm Sohbetler</option>
                      <option value="unread">Okunmamışlar</option>
                      <option value="today">Bugünkü</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Bugün</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                              {appointment.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800">{appointment.customerName}</h3>
                                {appointment.monthlyWashes && getUserBadge(appointment.monthlyWashes) && (
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getUserBadge(appointment.monthlyWashes)?.color}`}>
                                    {getUserBadge(appointment.monthlyWashes)?.icon} {getUserBadge(appointment.monthlyWashes)?.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{appointment.service} - {new Date(appointment.date).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</p>
                              <p className="text-xs text-gray-500 mt-1">{appointment.carInfo}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-xs text-gray-500">
                            Son mesaj: 5 dakika önce
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenChat(appointment)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
                          >
                            <FaComments className="text-xs" />
                            <span>Sohbeti Aç</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Son 7 Gün</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                              {appointment.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800">{appointment.customerName}</h3>
                                {appointment.monthlyWashes && getUserBadge(appointment.monthlyWashes) && (
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getUserBadge(appointment.monthlyWashes)?.color}`}>
                                    {getUserBadge(appointment.monthlyWashes)?.icon} {getUserBadge(appointment.monthlyWashes)?.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{appointment.service} - {new Date(appointment.date).toLocaleDateString('tr-TR')}</p>
                              <p className="text-xs text-gray-500 mt-1">{appointment.carInfo}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-xs text-gray-500">
                            Son mesaj: {appointment.id === "1" ? "Dün" : appointment.id === "2" ? "3 gün önce" : "5 gün önce"}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenChat(appointment)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
                          >
                            <FaComments className="text-xs" />
                            <span>Sohbeti Aç</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Geçmiş Sohbetler</h3>
                  <div className="flex flex-col space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={`archived-${i}`}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                              {["M", "S", "E"][i]}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{["Murat Aydın", "Selin Yılmaz", "Emre Kaya"][i]}</h3>
                              <p className="text-xs text-gray-500">Son görüşme: {["10.02.2024", "05.02.2024", "01.02.2024"][i]}</p>
                            </div>
                          </div>
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            Arşivden Çıkar
                            </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Hizmetleriniz</h2>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddService}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Yeni Hizmet Ekle
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <motion.div 
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-800">{service.name}</h3>
                        <span className="text-blue-600 font-medium">₺{service.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                      <div className="flex justify-end space-x-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditService(service)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          Düzenle
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteService(service)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          Sil
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Hizmet Ekleme/Düzenleme Modalı */}
                <AnimatePresence>
                  {showServiceModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {selectedService ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
                          </h3>
                          <button
                            onClick={() => setShowServiceModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FaTimes className="text-xl" />
                          </button>
                        </div>

                        <div className="space-y-4">
              <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hizmet Adı
                            </label>
                            <input
                              type="text"
                              value={serviceForm.name}
                              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Örn: Premium Yıkama"
                            />
                    </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fiyat (₺)
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={serviceForm.price === 0 ? "" : serviceForm.price}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                setServiceForm({ ...serviceForm, price: value ? parseInt(value) : 0 });
                              }}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              placeholder="Örn: 300"
                            />
                  </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Açıklama
                            </label>
                            <textarea
                              value={serviceForm.description}
                              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900"
                              placeholder="Örn: Detaylı iç-dış yıkama ve koruma"
                            />
                    </div>
                  </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={() => setShowServiceModal(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Vazgeç
                          </button>
                          <button
                            onClick={handleServiceSubmit}
                            disabled={!serviceForm.name || serviceForm.price <= 0}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              serviceForm.name && serviceForm.price > 0
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {selectedService ? "Güncelle" : "Ekle"}
                          </button>
                    </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hizmet Silme Modalı */}
                <AnimatePresence>
                  {showDeleteModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                            <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Hizmeti Sil</h3>
                            <p className="text-sm text-gray-500">
                              "{serviceToDelete?.name}" hizmetini silmek istediğinize emin misiniz?
                            </p>
                </div>
          </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setShowDeleteModal(false);
                              setServiceToDelete(null);
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Vazgeç
                          </button>
                          <button
                            onClick={handleDeleteConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Performans Analizi</h2>
                  <div className="flex space-x-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">Aylık</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">Haftalık</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">Yıllık</motion.button>
                  </div>
                </div>

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
              <div>
                        <p className="text-sm text-gray-500">Toplam Gelir</p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-2xl font-bold text-gray-800">₺23.060</p>
                          <span className="ml-2 text-xs font-semibold text-green-600">+12%</span>
                  </div>
                        <p className="text-xs text-gray-500 mt-1">Geçen aya göre</p>
                  </div>
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                        <FaMoneyBillWave className="text-green-500 text-xl" />
                  </div>
                </div>
                  </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Toplam Randevu</p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-2xl font-bold text-gray-800">134</p>
                          <span className="ml-2 text-xs font-semibold text-green-600">+8%</span>
              </div>
                        <p className="text-xs text-gray-500 mt-1">Geçen aya göre</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <FaCalendarAlt className="text-blue-500 text-xl" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
              <div>
                        <p className="text-sm text-gray-500">Ortalama Puan</p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-2xl font-bold text-gray-800">4.8/5</p>
                          <span className="ml-2 text-xs font-semibold text-green-600">+0.2</span>
                    </div>
                        <p className="text-xs text-gray-500 mt-1">Geçen aya göre</p>
                  </div>
                      <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                        <FaStar className="text-yellow-500 text-xl" />
                    </div>
                  </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Aktif Müşteriler</p>
                        <div className="flex items-baseline mt-1">
                          <p className="text-2xl font-bold text-gray-800">45</p>
                          <span className="ml-2 text-xs font-semibold text-green-600">+15%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Geçen aya göre</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                        <FaUsers className="text-purple-500 text-xl" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* En Çok Tercih Edilen Hizmetler ve En Aktif Bölgeler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-4">En Çok Tercih Edilen Hizmetler</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Premium Yıkama</span>
                          <span className="text-sm font-medium text-gray-700">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="bg-blue-600 h-2 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">İç-Dış Yıkama</span>
                          <span className="text-sm font-medium text-gray-700">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '35%' }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="bg-blue-600 h-2 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Dış Yıkama</span>
                          <span className="text-sm font-medium text-gray-700">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '20%' }}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="bg-blue-600 h-2 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* En Aktif Bölgeler */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-4">En Aktif Bölgeler</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-700">Kadıköy</h4>
                            <span className="text-sm text-gray-500">32 randevu</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '80%' }}
                              transition={{ duration: 1, delay: 0.7 }}
                              className="bg-blue-600 h-2 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-700">Üsküdar</h4>
                            <span className="text-sm text-gray-500">28 randevu</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '70%' }}
                              transition={{ duration: 1, delay: 0.8 }}
                              className="bg-blue-600 h-2 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-700">Beşiktaş</h4>
                            <span className="text-sm text-gray-500">25 randevu</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '62%' }}
                              transition={{ duration: 1, delay: 0.9 }}
                              className="bg-blue-600 h-2 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profil Bilgileri</h2>
              <button 
                    onClick={() => {}}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                    Profili Güncelle
              </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-4">Kişisel Bilgiler</h3>
                    <div className="space-y-4">
              <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          disabled
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          E-posta
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="tel"
                            value={newPhone || user.phone || ""}
                            onChange={handlePhoneChange}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="5XX XXX XX XX"
                          />
                          {isPhoneVerified && (
                            <div className="absolute right-3 text-green-500">
                              <FaCheckCircle />
                            </div>
                          )}
                          {(newPhone || user.phone) && (
                            <button
                              onClick={() => {
                                setNewPhone("");
                                setIsPhoneVerified(false);
                              }}
                              className="absolute right-3 text-gray-400 hover:text-gray-600"
                            >
                              <FaTimes />
                            </button>
                          )}
          </div>
        </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-4">Hizmet Bölgeleri</h3>
                <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Kadıköy</p>
                          <p className="text-sm text-gray-500">Merkez ve çevresi</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700">
                          <FaTimes />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Üsküdar</p>
                          <p className="text-sm text-gray-500">Kuzey bölgesi</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700">
                          <FaTimes />
                        </button>
                      </div>
                      <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors">
                        + Yeni Bölge Ekle
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-4">Çalışma Saatleri</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Pazartesi - Cuma</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value="09:00"
                            disabled
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value="18:00"
                            disabled
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Cumartesi</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value="10:00"
                            disabled
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value="16:00"
                            disabled
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Pazar</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value="10:00"
                            disabled
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value="16:00"
                            disabled
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-4">Hesap Güvenliği</h3>
                    <div className="space-y-4">
                      <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left">
                        Şifre Değiştir
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left">
                        İki Faktörlü Doğrulama
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left">
                        Hesabı Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.main>
      </div>
      
      <Footer />

      {/* Fotoğraf Yükleme Modalı */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Randevuyu Tamamla</h3>
                  <p className="text-sm text-gray-500">
                    {selectedAppointmentForPhoto?.customerName} için olan randevuyu tamamlamak için fotoğrafları yükleyin
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPhotoModal(false);
                    setSelectedAppointmentForPhoto(null);
                    setPhotos({
                      front: "",
                      back: "",
                      left: "",
                      right: "",
                      interior1: "",
                      interior2: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
          </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ön Görünüm</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photos.front ? (
                      <img src={photos.front} alt="Ön Görünüm" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("front")}
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                      >
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-sm">Fotoğraf Yükle</span>
                      </button>
                    )}
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Arka Görünüm</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photos.back ? (
                      <img src={photos.back} alt="Arka Görünüm" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("back")}
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                      >
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-sm">Fotoğraf Yükle</span>
                    </button>
                    )}
                  </div>
                </div>

                    <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sol Görünüm</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photos.left ? (
                      <img src={photos.left} alt="Sol Görünüm" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("left")}
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                      >
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-sm">Fotoğraf Yükle</span>
                      </button>
                    )}
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sağ Görünüm</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photos.right ? (
                      <img src={photos.right} alt="Sağ Görünüm" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("right")}
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                      >
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-sm">Fotoğraf Yükle</span>
                    </button>
                    )}
                  </div>
                </div>

                    <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">İç Görünüm 1</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photos.interior1 ? (
                      <img src={photos.interior1} alt="İç Görünüm 1" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("interior1")}
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                      >
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-sm">Fotoğraf Yükle</span>
                      </button>
                    )}
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">İç Görünüm 2</label>
                  <div className="relative h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photos.interior2 ? (
                      <img src={photos.interior2} alt="İç Görünüm 2" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <button
                        onClick={() => handlePhotoUpload("interior2")}
                        className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                      >
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-sm">Fotoğraf Yükle</span>
                    </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPhotoModal(false);
                    setSelectedAppointmentForPhoto(null);
                    setPhotos({
                      front: "",
                      back: "",
                      left: "",
                      right: "",
                      interior1: "",
                      interior2: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleCompleteConfirm}
                  disabled={!isPhotosComplete()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isPhotosComplete()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Tamamla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bildirimler Modalı */}
      <AnimatePresence>
        {showNotifications && (
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Bildirimler</h3>
                  <p className="text-sm text-gray-500">
                    {notifications.filter(n => !n.read).length} okunmamış bildirim
                  </p>
          </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
        </div>
      
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${
                      notification.read ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        notification.read ? "bg-gray-100" : "bg-blue-100"
                      }`}>
                        {notification.type === "new_appointment" && <FaCalendarAlt className="text-blue-500" />}
                        {notification.type === "payment" && <FaMoneyBillWave className="text-green-500" />}
                        {notification.type === "completed" && <FaCheckCircle className="text-green-500" />}
                        {notification.type === "system" && <FaInfoCircle className="text-gray-500" />}
                </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            notification.read ? "text-gray-800" : "text-blue-800"
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? "text-gray-600" : "text-blue-600"
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
              </motion.div>
            ))}
          </div>

              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <FaBell className="text-gray-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-500">Henüz bildiriminiz bulunmuyor</p>
        </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telefon Doğrulama Modalı */}
      <AnimatePresence>
        {showPhoneVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FaPhone className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Telefon Doğrulama</h3>
                  <p className="text-sm text-gray-500">
                    {newPhone} numaralı telefonunuza gönderilen 6 haneli doğrulama kodunu giriniz
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="Doğrulama Kodu"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className={`text-sm ${
                    countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  {countdown > 0 ? `${countdown} saniye sonra tekrar gönder` : "Kodu Tekrar Gönder"}
                </button>
          </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPhoneVerification(false);
                    setNewPhone("");
                    setVerificationCode("");
                    setIsPhoneVerified(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    verificationCode.length === 6
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Doğrula
                </button>
        </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sohbet Modalı */}
      <AnimatePresence>
        {showChat && selectedAppointment && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black">Sohbet</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBox
                  appointmentId={selectedAppointment.id}
                  customerName={selectedAppointment.customerName}
                  providerName="Servis Sağlayıcı"
                  userRole="PROVIDER"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konum Uyarı Modalı */}
      <AnimatePresence>
        {showLocationAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <FaExclamationTriangle className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Konum Bilgisi</h3>
                  <p className="text-sm text-gray-500">
                    {locationAlertMessage}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLocationAlert(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tamam
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}