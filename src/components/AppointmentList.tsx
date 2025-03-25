"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaComments, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCar, FaUser, FaMapMarked } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appointment {
  id: number;
  serviceName: string;
  date: Date;
  address: string;
  service: string;
  price: number;
  status: string;
  carModel?: string;
  licensePlate?: string;
  customerName?: string; // For providers
  providerName?: string; // For chat functionality
}

interface AppointmentListProps {
  userId: string;
  userRole: 'USER' | 'PROVIDER';
  onChatClick?: (appointment: Appointment) => void;
}

export default function AppointmentList({ userId, userRole, onChatClick }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  // Örnek veri yükleme
  useEffect(() => {
    // Gerçek bir uygulamada, bu veri API'den gelecektir
    setTimeout(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const demoAppointments = [
        {
          id: 1,
          serviceName: "Mobil Yıkama Servisi 1",
          date: tomorrow,
          address: "Örnek Mahallesi, Örnek Sokak No:1, İstanbul",
          service: "Detaylı Yıkama",
          price: 250,
          status: "Onaylandı",
          carModel: "Toyota Corolla",
          licensePlate: "34 ABC 123",
          customerName: userRole === 'PROVIDER' ? "Ahmet Yılmaz" : undefined,
          providerName: "Servis Sağlayıcı 1"
        },
        {
          id: 2,
          serviceName: "Mobil Yıkama Servisi 2",
          date: today,
          address: "Örnek Mahallesi, Örnek Sokak No:2, İstanbul",
          service: "Standart Yıkama",
          price: 150,
          status: "Devam Ediyor",
          carModel: "Honda Civic",
          licensePlate: "34 XYZ 789",
          customerName: userRole === 'PROVIDER' ? "Mehmet Demir" : undefined,
          providerName: "Servis Sağlayıcı 2"
        },
        {
          id: 3,
          serviceName: "Mobil Yıkama Servisi 3",
          date: yesterday,
          address: "Örnek Mahallesi, Örnek Sokak No:3, İstanbul",
          service: "Motor Yıkama",
          price: 200,
          status: "Tamamlandı",
          carModel: "Volkswagen Golf",
          licensePlate: "34 DEF 456",
          customerName: userRole === 'PROVIDER' ? "Ayşe Kaya" : undefined,
          providerName: "Servis Sağlayıcı 3"
        },
        {
          id: 4,
          serviceName: "Mobil Yıkama Servisi 1",
          date: yesterday,
          address: "Örnek Mahallesi, Örnek Sokak No:4, İstanbul",
          service: "İç Temizlik",
          price: 180,
          status: "İptal Edildi",
          carModel: "BMW 320i",
          licensePlate: "34 MNO 321",
          customerName: userRole === 'PROVIDER' ? "Ali Veli" : undefined,
          providerName: "Servis Sağlayıcı 4"
        }
      ];

      setAppointments(demoAppointments);
      setIsLoading(false);
    }, 800);
  }, [userId, userRole]);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = () => {
    if (!selectedAppointment) return;

    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return { ...appointment, status: "İptal Edildi" };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    setShowCancelModal(false);
    setShowDetailModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Onaylandı':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Onaylandı</span>;
      case 'Onay Bekliyor':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Onay Bekliyor</span>;
      case 'Devam Ediyor':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Devam Ediyor</span>;
      case 'Tamamlandı':
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Tamamlandı</span>;
      case 'İptal Edildi':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">İptal Edildi</span>;
      case 'Ertelendi':
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Ertelendi</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const isTracking = (status: string) => {
    return status === 'Devam Ediyor' || status === 'Onaylandı';
  };

  const handleChatClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    if (onChatClick) {
      onChatClick(appointment);
    }
  };

  const handleTrackingClick = (e: React.MouseEvent, appointmentId: number) => {
    e.stopPropagation();
    router.push(`/tracking?id=${appointmentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-500 mb-4">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Henüz randevunuz bulunmuyor</h3>
        <p className="text-gray-500 mb-4">Yeni bir randevu oluşturmak için servis sağlayıcıları inceleyin.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Hizmet Ara
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleAppointmentClick(appointment)}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaCar className="text-blue-500" />
                <h3 className="font-medium text-gray-800">{appointment.serviceName}</h3>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-start gap-2">
                  <FaCalendarAlt className="mt-1 flex-shrink-0" />
                  <span>{appointment.date.toLocaleDateString('tr-TR')} - {appointment.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                  <span>{appointment.address}</span>
                </div>
                {userRole === 'PROVIDER' && appointment.customerName && (
                  <div className="flex items-start gap-2">
                    <FaUser className="mt-1 flex-shrink-0" />
                    <span>{appointment.customerName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {appointment.price.toLocaleString('tr-TR')} ₺
              </div>
              
              <div className="flex items-center gap-2">
                {isTracking(appointment.status) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleTrackingClick(e, appointment.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600 transition-colors"
                  >
                    <FaMapMarked />
                    <span>Canlı Takip</span>
                  </motion.button>
                )}
                
                {onChatClick && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleChatClick(e, appointment)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-200 transition-colors"
                  >
                    <FaComments />
                    <span>Mesaj</span>
                  </motion.button>
                )}
                
                {(appointment.status === 'Onaylandı' || appointment.status === 'Onay Bekliyor') && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelAppointment(appointment);
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1 hover:bg-red-200 transition-colors"
                  >
                    <FaTimes />
                    <span>İptal</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Detay Modalı */}
      <AnimatePresence>
        {showDetailModal && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-lg w-full mx-auto p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Randevu Detayları</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaCar className="text-blue-500" />
                    <span className="font-medium">{selectedAppointment.serviceName}</span>
                  </div>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Servis</div>
                    <div className="font-medium">{selectedAppointment.service}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tutar</div>
                    <div className="font-medium">{selectedAppointment.price.toLocaleString('tr-TR')} ₺</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tarih</div>
                    <div className="font-medium">{selectedAppointment.date.toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Saat</div>
                    <div className="font-medium">{selectedAppointment.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  {selectedAppointment.carModel && (
                    <div>
                      <div className="text-sm text-gray-500">Araç Modeli</div>
                      <div className="font-medium">{selectedAppointment.carModel}</div>
                    </div>
                  )}
                  {selectedAppointment.licensePlate && (
                    <div>
                      <div className="text-sm text-gray-500">Plaka</div>
                      <div className="font-medium">{selectedAppointment.licensePlate}</div>
                    </div>
                  )}
                  {userRole === 'PROVIDER' && selectedAppointment.customerName && (
                    <div>
                      <div className="text-sm text-gray-500">Müşteri</div>
                      <div className="font-medium">{selectedAppointment.customerName}</div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Adres</div>
                  <div className="font-medium">{selectedAppointment.address}</div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  {isTracking(selectedAppointment.status) && (
                    <Link
                      href={`/tracking?id=${selectedAppointment.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                      <FaMapMarked />
                      <span>Canlı Takip</span>
                    </Link>
                  )}
                  
                  {(selectedAppointment.status === 'Onaylandı' || selectedAppointment.status === 'Onay Bekliyor') && (
                    <button
                      onClick={() => handleCancelAppointment(selectedAppointment)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2 hover:bg-red-200 transition-colors"
                    >
                      <FaTimes />
                      <span>İptal</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* İptal Onay Modalı */}
      <AnimatePresence>
        {showCancelModal && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full mx-auto p-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <FaTimes className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Randevu İptali</h3>
                <p className="text-gray-500 mb-6">
                  {selectedAppointment.serviceName} için {selectedAppointment.date.toLocaleDateString('tr-TR')} tarihindeki randevunuzu iptal etmek istediğinize emin misiniz?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={confirmCancelAppointment}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    İptal Et
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 