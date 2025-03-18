"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import { UserRole } from "@/types";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, isLoading: authLoading } = useAuth();
  
  const [role, setRole] = useState<UserRole>("USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Kullanıcı zaten giriş yapmışsa, paneline yönlendir
  useEffect(() => {
    // Eğer kullanıcı yükleme tamamlandıysa ve kullanıcı varsa
    if (!authLoading && user) {
      console.log("Kullanıcı zaten giriş yapmış, yönlendiriliyor:", user.role);
      if (user.role === "USER") {
        router.push("/user");
      } else if (user.role === "PROVIDER") {
        router.push("/provider");
      }
    }
  }, [user, authLoading, router]);
  
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "provider") {
      setRole("PROVIDER");
    } else if (roleParam === "user") {
      setRole("USER");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Lütfen gerekli alanları doldurun.");
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Devam etmek için kullanım şartlarını kabul etmelisiniz.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name,
        email,
        role,
        phone,
        address: role === "PROVIDER" ? address : undefined
      };

      const success = await register(userData, password);
      
      if (success) {
        // Başarılı kayıt, kullanıcı rolüne göre yönlendir
        if (role === "USER") {
          router.push("/user");
        } else {
          router.push("/provider");
        }
      } else {
        setError("Bu e-posta adresi zaten kullanılıyor.");
      }
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    }

    setIsLoading(false);
  };

  // Eğer kullanıcı yükleniyor veya zaten giriş yapmışsa, yükleniyor göster
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-blue-600">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
              Yeni Hesap Oluşturun
            </h2>
            <p className="mt-2 text-center text-sm text-blue-600">
              Veya{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                mevcut hesabınıza giriş yapın
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`flex items-center px-4 py-2 rounded-md ${
                role === "USER"
                  ? "bg-blue-600 text-white"
                  : "bg-black text-white hover:bg-blue-900"
              }`}
            >
              <FaUser className="mr-2" />
              Araç Sahibi
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`flex items-center px-4 py-2 rounded-md ${
                role === "PROVIDER"
                  ? "bg-blue-600 text-white"
                  : "bg-black text-white hover:bg-blue-900"
              }`}
            >
              <FaUserTie className="mr-2" />
              Hizmet Sağlayıcı
            </button>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  Ad Soyad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-black placeholder-blue-500 text-blue-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email-address" className="sr-only">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-black placeholder-blue-500 text-blue-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="E-posta Adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-black placeholder-blue-500 text-blue-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="sr-only">
                  Telefon Numarası
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-black placeholder-blue-500 text-blue-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Telefon Numarası"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              {role === "PROVIDER" && (
                <div>
                  <label htmlFor="address" className="sr-only">
                    Adres
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-black placeholder-blue-500 text-blue-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Adres"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-black rounded"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-blue-600">
                <span>
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Kullanım Şartları
                  </Link>{" "}
                  ve{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum
                </span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 