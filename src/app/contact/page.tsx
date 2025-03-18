"use client";

import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaMapMarkerAlt, FaPhone, FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode, useState } from "react";

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

// İletişim kartı bileşeni
const ContactCard = ({ icon, title, children }: { icon: ReactNode, title: string, children: ReactNode }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 p-3 rounded-full text-white mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-black">{title}</h3>
      </div>
      <div className="text-black">
        {children}
      </div>
    </div>
  );
};

// Sosyal medya bileşeni
const SocialMediaButton = ({ icon, label, href }: { icon: ReactNode, label: string, href: string }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="text-blue-600 mr-3">
        {icon}
      </div>
      <span className="text-black font-medium">{label}</span>
    </a>
  );
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Gerçek uygulamada burada form verilerini bir API'ye göndereceksiniz
    // Şimdilik sadece bir demo gösterimi yapıyoruz
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      
      // Başarı mesajını 3 saniye sonra kaldır
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

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
            <h1 className="text-2xl font-bold text-white">İletişim - Mavina</h1>
            <div className="w-24"></div> {/* Boşluk için */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-6">📞 Bize Ulaşın</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Mavina ekibi olarak her zaman müşterilerimiz ve iş ortaklarımızla iletişim halinde olmaktan mutluluk duyuyoruz. Aşağıdaki kanallar aracılığıyla bizimle iletişime geçebilirsiniz.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* İletişim Bilgileri */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-8">İletişim Bilgilerimiz</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <ContactCard icon={<FaEnvelope size={24} />} title="📧 E-posta Adreslerimiz">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">💼 Genel İletişim:</span>
                    <a href="mailto:info@mavina.com" className="text-blue-600 hover:underline">info@mavina.com</a>
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">🛠️ Teknik Destek:</span>
                    <a href="mailto:destek@mavina.com" className="text-blue-600 hover:underline">destek@mavina.com</a>
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">🤝 İş Ortaklıkları:</span>
                    <a href="mailto:ortaklik@mavina.com" className="text-blue-600 hover:underline">ortaklik@mavina.com</a>
                  </li>
                </ul>
              </ContactCard>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <ContactCard icon={<FaMapMarkerAlt size={24} />} title="📍 Merkez Ofis Adresimiz">
                <p className="mb-2">🏢 Mavina Teknoloji A.Ş.</p>
                <p className="mb-2">📌 İzmir, Türkiye</p>
                <p>📍 Türkiye Geneli Faaliyet Gösteriyoruz</p>
              </ContactCard>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <ContactCard icon={<FaPhone size={24} />} title="📞 Telefon Numaralarımız">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">📱 Müşteri Hizmetleri:</span>
                    <a href="tel:+90XXXXXXXXXX" className="text-blue-600 hover:underline">+90 XXX XXX XX XX</a>
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold mr-2">📞 İş Ortakları İçin:</span>
                    <a href="tel:+90XXXXXXXXXX" className="text-blue-600 hover:underline">+90 XXX XXX XX XX</a>
                  </li>
                </ul>
              </ContactCard>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <ContactCard icon={<FaPaperPlane size={24} />} title="💬 Bize Mesaj Gönderin">
                <p className="mb-4">
                  Sorularınızı, önerilerinizi ve iş birliklerinizi bizimle paylaşmak için aşağıdaki formu doldurabilirsiniz.
                </p>
                <p>
                  Mavina ekibi olarak en kısa sürede size dönüş yapacağız! 🚀
                </p>
              </ContactCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Sosyal Medya */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-2">📲 Sosyal Medya Hesaplarımız</h2>
            <p className="text-black">Bizi sosyal medyada takip ederek güncel haberlerden haberdar olabilirsiniz.</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedSection delay={0.1}>
              <SocialMediaButton 
                icon={<FaInstagram size={24} />} 
                label="Instagram" 
                href="https://instagram.com/mavinaofficial" 
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <SocialMediaButton 
                icon={<FaTwitter size={24} />} 
                label="Twitter (X)" 
                href="https://twitter.com/mavina" 
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <SocialMediaButton 
                icon={<FaLinkedin size={24} />} 
                label="LinkedIn" 
                href="https://linkedin.com/company/mavina" 
              />
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <SocialMediaButton 
                icon={<FaFacebook size={24} />} 
                label="Facebook" 
                href="https://facebook.com/mavina" 
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* İletişim Formu */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">📝 İletişim Formu</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz. En kısa sürede size dönüş yapacağız.
            </p>
          </AnimatedSection>
          
          <div className="max-w-2xl mx-auto">
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                {submitSuccess ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p>Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</p>
                  </div>
                ) : null}
                
                <div className="mb-6">
                  <label htmlFor="name" className="block text-black font-medium mb-2">Adınız Soyadınız</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-black font-medium mb-2">E-posta Adresiniz</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-black font-medium mb-2">Mesajınız</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                </button>
              </form>
            </AnimatedSection>
          </div>
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