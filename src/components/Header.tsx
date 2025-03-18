"use client";

import Link from "next/link";
import { FaUser, FaSignOutAlt, FaCog, FaQuestionCircle, FaTag, FaStore } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isLoggedIn?: boolean;
  userRole?: 'USER' | 'PROVIDER';
}

export default function Header({ isLoggedIn: propIsLoggedIn, userRole: propUserRole }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Context'ten gelen kullanıcı bilgisini kullan, yoksa prop'ları kullan
  const isLoggedIn = user ? true : propIsLoggedIn;
  const userRole = user?.role || propUserRole;
  
  const handleLogout = () => {
    console.log("Çıkış yapılıyor...");
    logout();
    // Yönlendirme işlemi logout fonksiyonu içinde yapılıyor
    setShowUserMenu(false);
  };
  
  // Hesap ayarlarına git
  const goToAccountSettings = () => {
    router.push("/profile");
    setShowUserMenu(false);
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

  return (
    <header>
      <div className="bg-gray-800 text-white py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-bold text-white">Mavina</span>
              <span className="text-sm text-blue-400">Mobil Araç Yıkama Hizmetleri</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-white">Merhaba, {user?.name || "Kullanıcı"}</span>
                
                {/* Kullanıcı menüsü */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-label="Kullanıcı menüsü"
                  >
                    <span className="text-xl">👤</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 animate-fadeIn">
                      {/* Kullanıcı bilgileri */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.name?.charAt(0) || 'K'}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-blue-600">{user?.name || 'Kullanıcı'}</p>
                            <p className="text-sm text-blue-600 truncate">{user?.email || 'kullanici@example.com'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hızlı erişim butonları */}
                      <div className="grid grid-cols-2 gap-1 p-2 border-b border-gray-100">
                        <button 
                          className="flex items-center justify-center space-x-1 p-2 rounded-md hover:bg-gray-100 text-blue-600"
                          onClick={() => router.push('/help')}
                        >
                          <FaQuestionCircle className="text-blue-600" />
                          <span className="text-sm">Yardım</span>
                        </button>
                        
                        <button 
                          className="flex items-center justify-center space-x-1 p-2 rounded-md hover:bg-gray-100 text-blue-600"
                          onClick={() => router.push('/profile')}
                        >
                          <FaUser className="text-blue-600" />
                          <span className="text-sm">Profil</span>
                        </button>
                      </div>
                      
                      {/* Menü öğeleri */}
                      <div className="py-1">
                        <button 
                          className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left flex items-center"
                          onClick={() => router.push('/profile')}
                        >
                          <FaUser className="mr-2 text-blue-600" />
                          Hesap Ayarları
                        </button>
                        
                        {user?.role === 'PROVIDER' && (
                          <button 
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left flex items-center"
                            onClick={() => router.push('/provider')}
                          >
                            <FaStore className="mr-2 text-blue-600" />
                            Sağlayıcı Paneli
                          </button>
                        )}
                        
                        <button 
                          className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="mr-2 text-red-600" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-white hover:text-blue-300"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white shadow-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Buraya gerekirse menü öğeleri eklenebilir */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Buraya gerekirse ek menü öğeleri eklenebilir */}
          </div>
        </div>
      </div>
      
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
    </header>
  );
} 