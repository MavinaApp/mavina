import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export default function Footer() {
  const [showFaq, setShowFaq] = useState(false);

  const faqItems = [
    {
      question: "Mavina nedir?",
      answer: "Mavina, hizmet veren oto yıkamacılarla müşterileri buluşturan çevrimiçi bir platformdur. Hem mobil yıkamacılar hem de marina çevresindeki hizmet sağlayıcılar burada yer alabilir."
    },
    {
      question: "Hizmet almak için üyelik zorunlu mu?",
      answer: "Evet, hizmet talebi oluşturmak için kayıtlı kullanıcı olmanız gerekir. Bu sayede hizmet geçmişinize erişebilir ve favori yıkamacılarınızı takip edebilirsiniz."
    },
    {
      question: "Ödeme nasıl yapılıyor?",
      answer: "Şu anlık ödeme, müşteri ve yıkamacı arasında gerçekleşmektedir. Ancak sistem üzerinde 'Ödeme Yapıldı' ve 'İşlem Tamamlandı' onaylarıyla süreç güvenli şekilde ilerler."
    },
    {
      question: "Randevu aldığım hizmeti iptal edebilir miyim?",
      answer: "Evet, randevu saatinden en az 1 saat öncesine kadar iptal edebilirsiniz."
    },
    {
      question: "Mavina'da kimler hizmet verebilir?",
      answer: "Mobil oto yıkamacılar, marina temizlik hizmeti verenler ve alanında yetkin bireysel veya kurumsal firmalar hizmet sağlayıcı olarak platforma katılabilir."
    },
    {
      question: "Hizmet verenlerin güvenilirliği nasıl sağlanıyor?",
      answer: "Her hizmet veren telefon numarası ve kimlik doğrulamasından geçmektedir. Ayrıca sistemde geçmiş müşteri yorumları ve puanlamalar görünür durumdadır."
    },
    {
      question: "Yorum ve değerlendirme yapabilir miyim?",
      answer: "Evet. Hizmet tamamlandıktan sonra, aldığınız hizmete puan verebilir ve yorum yazabilirsiniz."
    },
    {
      question: "Mavina hangi şehirlerde hizmet veriyor?",
      answer: "Başlangıçta İzmir ve çevresinde hizmet vermeye başladık, ancak platform Türkiye genelinde yaygınlaşmaktadır."
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mavina</h3>
            <p className="text-gray-400 text-sm">
              Araç yıkama hizmetlerini dijitalleştiren modern platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Ana Sayfa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hizmetler</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400">
              <li>info@mavina.com</li>
              <li>+90 (232) XXX XX XX</li>
              <li>İzmir, Türkiye</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="w-full text-left px-6 py-3 bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg font-medium">Sıkça Sorulan Sorular</span>
            <FaChevronDown className={`transform transition-transform ${showFaq ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFaq && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-lg font-medium mb-2">{item.question}</h4>
                      <p className="text-gray-400">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Mavina. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 