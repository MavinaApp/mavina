"use client";

import Link from "next/link";
import { FaCookieBite, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header */}
      <header className="bg-blue-700 shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Link href="/" className="text-white flex items-center hover:text-blue-200 transition-colors">
              <FaArrowLeft className="mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <FaCookieBite className="text-blue-600 text-4xl mr-4" />
            <h1 className="text-3xl font-bold text-gray-800">Çerez Politikası</h1>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-6">
              Bu Çerez Politikası, Mavina web sitesinde çerezlerin nasıl kullanıldığını açıklamaktadır. 
              Sitemizi ziyaret ettiğinizde, size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Çerez Nedir?</h2>
            <p className="mb-4">
              Çerezler, web sitelerinin bilgisayarınızda veya mobil cihazınızda depoladığı küçük metin dosyalarıdır. 
              Bu dosyalar, web sitesinin ziyaretiniz sırasında ve gelecekteki ziyaretlerinizde sizi tanımasına yardımcı olur.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Hangi Çerezleri Kullanıyoruz?</h2>
            <p className="mb-2">Mavina web sitesinde aşağıdaki çerez türlerini kullanıyoruz:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">1. Zorunlu Çerezler</h3>
            <p className="mb-4">
              Bu çerezler, web sitesinin düzgün çalışması için gereklidir ve sistemlerimizde kapatılamazlar. 
              Genellikle yalnızca sizin tarafınızdan yapılan ve gizlilik tercihlerinizi ayarlama, oturum açma veya form doldurma gibi hizmet taleplerine yanıt olarak ayarlanırlar.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">2. Performans Çerezleri</h3>
            <p className="mb-4">
              Bu çerezler, ziyaretçilerin web sitesini nasıl kullandığı hakkında bilgi toplar. 
              Hangi sayfaların en çok ziyaret edildiğini ve ziyaretçilerin sitede nasıl gezindiğini anlamamıza yardımcı olurlar. 
              Tüm bilgiler anonim olarak toplanır ve ziyaretçinin kimliğini tanımlamak için kullanılmaz.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">3. İşlevsellik Çerezleri</h3>
            <p className="mb-4">
              Bu çerezler, web sitesinin dil tercihi veya bulunduğunuz bölge gibi yaptığınız seçimleri hatırlamasını sağlar. 
              Bu, size daha kişiselleştirilmiş bir deneyim sunmamıza yardımcı olur.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">4. Hedefleme/Reklam Çerezleri</h3>
            <p className="mb-4">
              Bu çerezler, ilgi alanlarınıza göre size özel reklamlar göstermek için kullanılabilir. 
              Ayrıca, bir reklamı görme sayınızı sınırlamak ve reklam kampanyalarının etkinliğini ölçmek için de kullanılırlar.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
            <p className="mb-4">
              Çoğu web tarayıcısı, çerezleri otomatik olarak kabul edecek şekilde ayarlanmıştır. 
              Ancak, tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya çerez ayarlandığında uyarı alabilirsiniz. 
              Tarayıcınızın çerezleri nasıl yönettiğini öğrenmek için tarayıcınızın yardım sayfasına bakabilirsiniz.
            </p>
            <p className="mb-4">
              Çerezleri devre dışı bırakmayı seçerseniz, web sitemizin bazı özelliklerinin düzgün çalışmayabileceğini lütfen unutmayın.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Çerez Politikamızdaki Değişiklikler</h2>
            <p className="mb-4">
              Çerez politikamızı zaman zaman güncelleyebiliriz. 
              Bu sayfada yapılan tüm değişiklikler yayınlanacak ve gerektiğinde size bildirilecektir.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Bize Ulaşın</h2>
            <p className="mb-4">
              Çerez politikamız hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin:
            </p>
            <p className="mb-4">
              <strong>E-posta:</strong> info@mavina.tr<br />
              <strong>Telefon:</strong> +90 212 123 45 67
            </p>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'})}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200">
            &copy; {new Date().getFullYear()} Mavina. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
} 