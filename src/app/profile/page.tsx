"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaCamera } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  
  // Kullanıcı bilgilerini form verilerine yükle
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);
  
  // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
  if (!isLoading && !user) {
    router.push("/login");
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifre değişikliği kontrolü
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setNotification({
          type: "error",
          message: "Yeni şifre ve şifre onayı eşleşmiyor."
        });
        return;
      }
      
      if (!formData.currentPassword) {
        setNotification({
          type: "error",
          message: "Mevcut şifrenizi girmelisiniz."
        });
        return;
      }
    }
    
    // Başarılı güncelleme simülasyonu
    setTimeout(() => {
      setNotification({
        type: "success",
        message: "Profil bilgileriniz başarıyla güncellendi."
      });
      
      // Şifre alanlarını temizle
      setFormData(prevData => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      // 3 saniye sonra bildirimi kaldır
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }, 1000);
  };
  
  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
          // Başarılı bildirim göster
          setNotification({
            type: "success",
            message: "Profil fotoğrafı başarıyla güncellendi."
          });
          
          // 3 saniye sonra bildirimi kaldır
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 text-black">Hesap Ayarları</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            {notification && (
              <div className={`mb-6 p-4 rounded-md ${
                notification.type === "success" 
                  ? "bg-green-100 text-green-700 border-l-4 border-green-500" 
                  : "bg-red-100 text-red-700 border-l-4 border-red-500"
              }`}>
                {notification.message}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profil Fotoğrafı */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 relative mb-4 overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-bold">{user?.name?.charAt(0) || "K"}</span>
                  )}
                  <button 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 z-10"
                    onClick={handleProfileImageClick}
                  >
                    <FaCamera />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
                  onClick={handleProfileImageClick}
                >
                  <FaCamera className="mr-2 text-lg" size={20} />
                  Profil fotoğrafını değiştir
                </button>
              </div>
              
              {/* Form */}
              <div className="flex-1">
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ad Soyad */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                        Ad Soyad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-blue-600" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                          placeholder="Ad Soyad"
                        />
                      </div>
                    </div>
                    
                    {/* E-posta */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                        E-posta
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-blue-600" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                          placeholder="E-posta"
                        />
                      </div>
                    </div>
                    
                    {/* Telefon */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                        Telefon
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-blue-600" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                          placeholder="Telefon"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-black mb-4">Şifre Değiştir</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Mevcut Şifre */}
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-black mb-1">
                          Mevcut Şifre
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-blue-600" />
                          </div>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            placeholder="Mevcut Şifre"
                          />
                        </div>
                      </div>
                      
                      {/* Yeni Şifre */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-black mb-1">
                          Yeni Şifre
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-blue-600" />
                          </div>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            placeholder="Yeni Şifre"
                          />
                        </div>
                      </div>
                      
                      {/* Şifre Onayı */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                          Şifre Onayı
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-blue-600" />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-black"
                            placeholder="Şifre Onayı"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaSave className="mr-2" />
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 