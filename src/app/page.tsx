"use client";

import Link from "next/link";
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaArrowRight, FaCheck, FaShieldAlt, FaMobileAlt, FaUserFriends, FaCookieBite, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

// Animasyon varyantları
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Animasyonlu bileşen için tip tanımlaması
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Animasyonlu bileşen
const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Özellik kartı bileşeni
const FeatureCard = ({ icon, title, description }: { icon: ReactNode, title: string, description: string }) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
      variants={scaleIn}
      whileHover={{ y: -10 }}
    >
      <div className="bg-blue-50 p-4 rounded-full inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Testimonial bileşeni
const Testimonial = ({ name, role, quote }: { name: string, role: string, quote: string }) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-2xl shadow-md"
      variants={fadeIn}
      whileHover={{ scale: 1.03 }}
    >
      <p className="text-gray-600 italic mb-4">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 font-bold">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("bireysel");
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  // Çerez bildirimini kontrol et
  useEffect(() => {
    // localStorage'dan çerez onayını kontrol et
    const cookieConsent = localStorage.getItem("cookieConsent");
    
    // Eğer daha önce onay verilmemişse bildirimi göster
    if (!cookieConsent) {
      // Sayfanın yüklenmesinden 2 saniye sonra bildirimi göster
      const timer = setTimeout(() => {
        setShowCookieConsent(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Çerez onayını kaydet
  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookieConsent(false);
  };

  // Çerez bildirimini kapat (reddetme durumu)
  const closeCookieConsent = () => {
    setShowCookieConsent(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-600">
      {/* Header */}
      <motion.header 
        className="bg-blue-700 shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <motion.h1 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Mavina
            </motion.h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="#features" className="text-white hover:text-blue-200">Özellikler</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="#how-it-works" className="text-white hover:text-blue-200">Nasıl Çalışır</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="#testimonials" className="text-white hover:text-blue-200">Yorumlar</Link>
            </motion.div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/login" 
                className="px-4 py-2 text-white hover:text-blue-200 font-medium"
              >
                Giriş Yap
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/register" 
                className="px-4 py-2 bg-white text-blue-700 rounded-full hover:bg-blue-100 font-medium"
              >
                Kayıt Ol
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Araç Yıkama Hizmeti Alın veya Sağlayın
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-xl mb-8"
            >
              Mavina ile araç yıkama hizmeti almak veya vermek artık çok kolay!
            </motion.p>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/become-provider" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center">
                Hizmet Sağlayıcı Ol
                <FaArrowRight className="ml-2" />
              </Link>
              <Link href="/register" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300">
                Müşteri Olarak Katıl
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Kime Hizmet Veriyoruz?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mavina, hem bireysel araç sahiplerine hem de hizmet sağlayıcılara özel çözümler sunar.
            </p>
          </AnimatedSection>
          
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 p-1 rounded-full inline-flex">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "bireysel" ? "bg-blue-600 shadow-md text-white" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("bireysel")}
              >
                Bireysel Kullanıcılar
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "provider" ? "bg-blue-600 shadow-md text-white" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("provider")}
              >
                Hizmet Sağlayıcılar
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            {activeTab === "bireysel" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <FeatureCard 
                  icon={<FaMapMarkerAlt className="text-blue-600 text-2xl" />}
                  title="Konum Bazlı Arama"
                  description="Bulunduğunuz konuma en yakın araç yıkama hizmetlerini kolayca bulun."
                />
                <FeatureCard 
                  icon={<FaCalendarAlt className="text-blue-600 text-2xl" />}
                  title="Kolay Randevu"
                  description="Birkaç tıklama ile size uygun zamanda randevu oluşturun."
                />
                <FeatureCard 
                  icon={<FaShieldAlt className="text-blue-600 text-2xl" />}
                  title="Güvenli Ödeme"
                  description="Hizmet tamamlandıktan sonra güvenli bir şekilde ödeme yapın."
                />
              </motion.div>
            )}
            
            {activeTab === "provider" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <FeatureCard 
                  icon={<FaUserFriends className="text-blue-600 text-2xl" />}
                  title="Müşteri Yönetimi"
                  description="Tüm müşterilerinizi ve randevularınızı tek bir yerden yönetin."
                />
                <FeatureCard 
                  icon={<FaMobileAlt className="text-blue-600 text-2xl" />}
                  title="Mobil Bildirimler"
                  description="Yeni randevular ve ödemeler hakkında anında bildirim alın."
                />
                <FeatureCard 
                  icon={<FaCar className="text-blue-600 text-2xl" />}
                  title="Hizmet Yönetimi"
                  description="Sunduğunuz hizmetleri ve fiyatlandırmayı kolayca düzenleyin."
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-blue-700 text-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Nasıl Çalışır?</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Mavina ile araç yıkama hizmeti almak çok kolay. Sadece üç adımda aracınızın bakımını tamamlayın.
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={fadeIn}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 relative">
                <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Konumunuzu Belirleyin</h3>
              <p className="text-blue-100 max-w-xs">
                Harita üzerinde konumunuzu belirleyin ve çevrenizdeki mobil araç yıkama hizmetlerini görün.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={fadeIn}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 relative">
                <FaCar className="text-blue-600 text-2xl" />
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Hizmet Seçin</h3>
              <p className="text-blue-100 max-w-xs">
                Size en uygun hizmet sağlayıcıyı seçin ve sunulan hizmetleri inceleyin.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={fadeIn}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 relative">
                <FaCalendarAlt className="text-blue-600 text-2xl" />
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Randevu Alın</h3>
              <p className="text-blue-100 max-w-xs">
                Size uygun bir zaman dilimi seçin ve aracınızın yıkanması için randevu oluşturun.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Çevre Dostu Bölümü */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Çevre Dostu Yaklaşım</h2>
            <p className="text-blue-600 max-w-3xl mx-auto">
              Mavina ile mobil araç yıkama hizmeti alarak çevreyi korumaya katkıda bulunun.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaCheck className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">%60 Daha Az Su Tüketimi</h3>
                  <p className="text-blue-600">
                    Geleneksel oto yıkama merkezleri ortalama 150-200 litre su kullanırken, mobil oto yıkama hizmetlerimiz özel ekipmanlar ve yöntemlerle sadece 60-80 litre su kullanır.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaCheck className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">Özel Ekipmanlar</h3>
                  <p className="text-blue-600">
                    Yüksek basınçlı ve düşük akışlı ekipmanlarımız sayesinde daha az su ile daha etkili temizlik sağlıyoruz.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaCheck className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">Çevre Dostu Ürünler</h3>
                  <p className="text-blue-600">
                    Kullandığımız tüm temizlik ürünleri biyolojik olarak parçalanabilir ve çevre dostudur.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-[400px] bg-blue-100 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-4">60%</div>
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">Daha Az Su Tüketimi</h3>
                    <p className="text-blue-600">
                      Mavina ile her araç yıkamasında ortalama 90-120 litre su tasarrufu sağlayın ve çevreyi korumaya yardımcı olun.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white" id="testimonials">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Kullanıcılarımız Ne Diyor?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mavina'yı kullanan binlerce kullanıcının deneyimlerini keşfedin.
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Testimonial 
              name="Ahmet Yılmaz"
              role="Araç Sahibi"
              quote="Mavina sayesinde artık araç yıkama için zaman kaybetmiyorum. Birkaç tıklama ile randevu alıyorum ve aracım bulunduğum yerde yıkanıyor."
            />
            <Testimonial 
              name="Ayşe Kaya"
              role="Araç Sahibi"
              quote="Çok pratik bir uygulama. Hizmet kalitesi ve fiyat performans açısından çok memnunum. Kesinlikle tavsiye ediyorum."
            />
            <Testimonial 
              name="Mehmet Demir"
              role="Hizmet Sağlayıcı"
              quote="Mavina ile müşteri portföyümü genişlettim ve işlerimi daha düzenli hale getirdim. Randevu ve ödeme takibi çok kolay."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection className="mb-6">
            <h2 className="text-4xl font-bold">Hemen Başlayın</h2>
          </AnimatedSection>
          <AnimatedSection className="mb-8" delay={0.2}>
            <p className="text-xl max-w-2xl mx-auto">
              Mavina ile araç yıkama hizmetlerine erişmek hiç bu kadar kolay olmamıştı.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.4} className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                href="/register" 
                className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-blue-50 font-medium"
              >
                Şimdi Kaydol
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <motion.h2 
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Mavina
              </motion.h2>
              <motion.p 
                className="text-blue-200 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Mobil Araç Yıkama Hizmetleri
              </motion.p>
              <p className="text-blue-300 text-sm">
                &copy; {new Date().getFullYear()} Mavina. <br />Tüm hakları saklıdır.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Hizmetler</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Araç Yıkama</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">İç Temizlik</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Detaylı Temizlik</Link></li>
                <li><Link href="#" className="text-blue-200 hover:text-white transition-colors">Cilalama</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="/kariyer" className="text-blue-200 hover:text-white transition-colors">Kariyer</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-blue-200 hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-blue-200 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="text-blue-200 hover:text-white transition-colors">Kullanım Şartları</Link></li>
                <li><Link href="/cookies" className="text-blue-200 hover:text-white transition-colors">Çerez Politikası</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Çerez Bildirimi */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 border-t-4 border-blue-600"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <FaCookieBite className="text-blue-600 text-2xl mr-3" />
                  <div>
                    <h3 className="text-black font-bold text-lg">Çerez Bildirimi</h3>
                    <p className="text-gray-600 max-w-2xl">
                      Bu web sitesi, size en iyi deneyimi sunmak için çerezleri kullanmaktadır. 
                      Sitemizi kullanmaya devam ederek, çerez politikamızı kabul etmiş olursunuz.
                      <Link href="/cookies" className="text-blue-600 hover:underline ml-1">
                        Daha fazla bilgi
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={closeCookieConsent}
                    className="px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 flex items-center"
                  >
                    <FaTimes className="mr-1" /> Reddet
                  </button>
                  <button 
                    onClick={acceptCookies}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center"
                  >
                    <FaCheck className="mr-1" /> Kabul Et
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