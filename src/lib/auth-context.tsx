"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Örnek kullanıcılar
const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Kullanıcı Demo",
    email: "user@example.com",
    role: "USER",
    phone: "555-123-4567"
  },
  {
    id: "2",
    name: "Hizmet Sağlayıcı Demo",
    email: "provider@example.com",
    role: "PROVIDER",
    phone: "555-987-6543",
    address: "İstanbul, Türkiye"
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgisini al
    const storedUser = localStorage.getItem("mavinaUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Kullanıcı bilgisi ayrıştırılamadı:", error);
        localStorage.removeItem("mavinaUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Demo amaçlı basit kimlik doğrulama
    // Gerçek uygulamada API çağrısı yapılır
    try {
      // Demo kullanıcıları kontrol et (şifre kontrolü yok)
      const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("mavinaUser", JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Giriş hatası:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Demo amaçlı basit kayıt
    // Gerçek uygulamada API çağrısı yapılır
    try {
      // E-posta zaten kullanılıyor mu kontrol et
      const emailExists = DEMO_USERS.some(u => u.email?.toLowerCase() === userData.email?.toLowerCase());
      
      if (emailExists) {
        setIsLoading(false);
        return false;
      }
      
      // Yeni kullanıcı oluştur
      const newUser: User = {
        id: `${DEMO_USERS.length + 1}`,
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "USER",
        phone: userData.phone,
        address: userData.address
      };
      
      // Demo kullanıcılar listesine ekle (gerçek uygulamada veritabanına kaydedilir)
      DEMO_USERS.push(newUser);
      
      // Kullanıcıyı oturum açmış olarak ayarla
      setUser(newUser);
      localStorage.setItem("mavinaUser", JSON.stringify(newUser));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log("Auth context: Çıkış yapılıyor...");
    
    // Önce kullanıcı bilgilerini temizle
    setUser(null);
    localStorage.removeItem("mavinaUser");
    
    // Tarayıcı önbelleğini temizlemek için sayfayı yeniden yükle
    if (typeof window !== 'undefined') {
      try {
        // Ana sayfaya yönlendir ve sayfayı yenile
        console.log("Ana sayfaya yönlendiriliyor...");
        window.location.href = '/';
      } catch (error) {
        console.error("Yönlendirme hatası:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 