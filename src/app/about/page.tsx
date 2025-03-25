"use client";

import Link from "next/link";
import { FaArrowLeft, FaCar, FaCheckCircle, FaHandshake, FaLeaf, FaClock, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
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
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="bg-blue-50 p-4 rounded-full inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default function AboutPage() {
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
            <h1 className="text-2xl font-bold text-white">Hakkımızda</h1>
            <div className="w-24"></div> {/* Boşluk için */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-4">Mavina Nedir?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Mavina, araç sahiplerini güvenilir oto yıkamacılarla buluşturan yenilikçi bir platformdur. 
              Kullanıcılar, bulundukları konuma en yakın yıkamacıları kolayca bulabilir, hizmetlerini karşılaştırabilir ve anında rezervasyon yapabilirler. 
              Mobil oto yıkama deneyimini zahmetsiz, hızlı ve güvenli hale getiriyoruz.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hikayemiz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Mavina, modern şehir hayatının yoğun temposunda araç temizliğini kolaylaştırmak için doğdu. 
              Günümüzde araç sahipleri, kaliteli bir yıkama hizmeti bulmak için zaman kaybedebiliyor veya yıkamacılara gitmek için ekstra efor sarf edebiliyor. 
              Biz, <span className="font-bold">"Yıkama zahmet olmasın"</span> mottosuyla yola çıktık ve oto yıkamacıları dijital dünyaya taşıyarak herkes için erişilebilir bir hizmet sunduk.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <AnimatedSection delay={0.2}>
              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">Misyonumuz</h3>
                <p className="text-gray-700">
                  Mavina olarak misyonumuz, oto yıkama sürecini hem araç sahipleri hem de yıkamacılar için daha 
                  <span className="font-bold"> hızlı, kolay ve güvenilir</span> hale getirmektir. 
                  Çevre dostu yıkama seçenekleriyle sürdürülebilirliği destekliyor ve kullanıcılarımıza konforlu bir deneyim sunuyoruz.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">Vizyonumuz</h3>
                <p className="text-gray-700">
                  <span className="font-bold">Türkiye'nin en büyük dijital oto yıkama platformu olmak</span> ve mobil oto yıkama sektörünü geleceğe taşımak istiyoruz. 
                  Mavina, kullanıcı dostu arayüzü, güvenilir iş ortakları ve müşteri memnuniyeti odaklı hizmet anlayışıyla 
                  <span className="font-bold"> otomotiv sektöründe dijital dönüşüme liderlik etmeyi hedefliyor</span>.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Neden Mavina */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Neden Mavina?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mavina'yı tercih etmeniz için birçok neden var. İşte size sunduğumuz avantajlar:
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <AnimatedSection delay={0.1}>
              <FeatureCard 
                icon={<FaCar className="text-blue-600 text-2xl" />}
                title="Kolay Kullanım"
                description="Web ve mobil platformumuz sayesinde hızlı ve zahmetsiz rezervasyon yapabilirsiniz."
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <FeatureCard 
                icon={<FaShieldAlt className="text-blue-600 text-2xl" />}
                title="Güvenilir Hizmet"
                description="Alanında uzman, müşteri puanlarına göre değerlendirilen yıkamacılarla çalışıyoruz."
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <FeatureCard 
                icon={<FaCheckCircle className="text-blue-600 text-2xl" />}
                title="Esnek Seçenekler"
                description="Aracınıza ve bütçenize uygun farklı yıkama seçenekleri sunuyoruz."
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <FeatureCard 
                icon={<FaClock className="text-blue-600 text-2xl" />}
                title="Zamandan Tasarruf"
                description="Yıkamacıya gitmeye gerek kalmadan, aracınızın temizlenmesini sağlayabilirsiniz."
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.5}>
              <FeatureCard 
                icon={<FaLeaf className="text-blue-600 text-2xl" />}
                title="Çevre Dostu Çözümler"
                description="Su tasarruflu ve çevreye duyarlı oto yıkama seçenekleri sunuyoruz."
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.6}>
              <FeatureCard 
                icon={<FaHandshake className="text-blue-600 text-2xl" />}
                title="İş Ortaklarımız"
                description="Bireysel ve kurumsal oto yıkamacılarla iş birliği yaparak onların daha fazla müşteriye ulaşmasını sağlarız."
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6">Bizimle İletişime Geçin</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Herhangi bir sorunuz veya iş birliği teklifiniz varsa bizimle iletişime geçmekten çekinmeyin!
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 max-w-2xl mx-auto">
              <div className="bg-blue-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">E-posta</h3>
                <p>destek@mavina.tr</p>
              </div>
              <div className="bg-blue-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Web Sitesi</h3>
                <p>www.mavina.com</p>
              </div>
              <div className="bg-blue-700 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Konum</h3>
                <p>İzmir, Türkiye</p>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4} className="mt-12">
            <p className="text-2xl font-bold">
              Mavina ile <span className="italic">Yıkama zahmet olmasın!</span> 🚀
            </p>
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