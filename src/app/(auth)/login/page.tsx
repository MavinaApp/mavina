"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Lütfen e-posta ve şifre alanlarını doldurun.");
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      
      if (success) {
        // Başarılı giriş, kullanıcı rolüne göre yönlendir
        const user = JSON.parse(localStorage.getItem("mavinaUser") || "{}");
        if (user.role === "USER") {
          router.push("/user");
        } else {
          router.push("/provider");
        }
      } else {
        setError("Geçersiz e-posta veya şifre.");
      }
    } catch (err) {
      setError("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
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
              Hesabınıza Giriş Yapın
            </h2>
            <p className="mt-2 text-center text-sm text-blue-600">
              Veya{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                yeni bir hesap oluşturun
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
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
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-black placeholder-blue-500 text-blue-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-black rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-600">
                  Beni Hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifrenizi mi unuttunuz?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-600">
                Demo hesapları:
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Kullanıcı: user@example.com<br />
                Hizmet Sağlayıcı: provider@example.com<br />
                (Şifre alanına herhangi bir şey yazabilirsiniz)
              </p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 