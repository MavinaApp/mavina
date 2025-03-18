"use client";

import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaLaptopCode, FaBullhorn, FaHeadset, FaCheckCircle, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

// Animasyon bileşeni için tip tanımlaması
interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Animasyon bileşeni
const AnimatedSection = ({ children, delay = 0, className = "" }: AnimatedSectionProps) => {
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

export default function KariyerPage() {
  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header */}
      <header className="bg-blue-700 shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white flex items-center hover:text-blue-200 transition-colors">
              <FaArrowLeft className="mr-2" />
              Ana Sayfaya Dön
            </Link>
            <h1 className="text-2xl font-bold text-white">Kariyer - Mavina</h1>
            <div className="w-24"></div> {/* Boşluk için */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-6">🚀 Mavina'da Kariyer Fırsatları</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Mavina, araç sahiplerini en güvenilir oto yıkamacılarla buluşturan yenilikçi bir platformdur. 
              <strong> İlk olarak İzmir ve çevresinde faaliyet göstermeye başladık</strong> ancak şimdi 
              <strong> tüm Türkiye'ye açılarak büyümeye devam ediyoruz</strong>. Ekibimize katılarak, 
              <strong> geleneksel oto yıkama sektörünü dijital dünyaya taşıyan</strong> bu dönüşümde yer almak ister misiniz?
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Neden Mavina Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-8">🌟 Neden Mavina?</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-3">
                  <div className="text-blue-600 mr-2">
                    <FaRocket size={20} />
                  </div>
                  <h3 className="font-bold text-black">Hızla büyüyen bir girişimde yer alın</h3>
                </div>
                <p className="text-black">Teknoloji ve hizmet sektörünü birleştiren yenilikçi bir projede çalışma fırsatı.</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-3">
                  <div className="text-blue-600 mr-2">
                    <FaCheckCircle size={20} />
                  </div>
                  <h3 className="font-bold text-black">Dinamik bir ekip ile çalışma imkanı</h3>
                </div>
                <p className="text-black">Startup ruhuna sahip, yenilikçi ve enerjik bir ekip içinde yer alın.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Açık Pozisyonlar Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-2">📌 Açık Pozisyonlar</h2>
            <p className="text-black">Şu anda aşağıdaki pozisyonlar için ekibimizi genişletiyoruz:</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full text-white mr-4">
                    <FaLaptopCode size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-black">Yazılım Geliştirici</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-black mb-2">Görevler:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-black">
                    <li>Mavina platformunun geliştirilmesine katkı sağlamak.</li>
                    <li>React.js / Next.js teknolojileriyle çalışmak.</li>
                    <li>API entegrasyonları yapmak.</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 p-3 rounded-full text-white mr-4">
                    <FaBullhorn size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-black">Pazarlama Uzmanı</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-black mb-2">Görevler:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-black">
                    <li>Mavina'nın marka bilinirliğini artıracak kampanyalar oluşturmak.</li>
                    <li>Sosyal medya yönetimi yapmak.</li>
                    <li>Dijital pazarlama stratejileri geliştirmek.</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Başvuru Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-8">📢 Nasıl Başvurabilirsiniz?</h2>
            <p className="text-xl mb-6">
              Eğer Mavina ekibinde yer almak istiyorsanız, <strong>CV'nizi ve kısa bir ön yazınızı aşağıdaki e-posta adresine gönderebilirsiniz:</strong>
            </p>
            <div className="flex items-center justify-center mb-6">
              <FaEnvelope className="mr-2 text-2xl" />
              <span className="text-2xl font-bold">kariyer@mavina.com</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Mavina</h2>
              <p className="text-blue-200 mb-4">
                Mobil Araç Yıkama Hizmetleri
              </p>
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
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/kariyer" className="text-blue-200 hover:text-white transition-colors">Kariyer</Link></li>
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
    </div>
  );
} 