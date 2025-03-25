"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Gizlilik Politikası</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="mb-4 text-black">Son güncellenme: 15 Mart 2024</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">1. Giriş</h2>
            <p className="text-black">Mavina ("Şirket", "Biz" veya "Uygulama"), kullanıcılarımızın gizliliğini korumaya büyük önem vermektedir. Bu Gizlilik Politikası, Mavina'nın topladığı, kullandığı, sakladığı ve paylaştığı kişisel veriler hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">2. Toplanan Bilgiler</h2>
            <p className="text-black">Mavina, sunduğumuz hizmetleri sağlamak ve geliştirmek amacıyla aşağıdaki türde bilgileri toplayabilir:</p>
            <ul className="list-disc pl-6 mb-4 text-black">
              <li><strong>Kullanıcı Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası, araç bilgileri vb.</li>
              <li><strong>Konum Bilgileri:</strong> Kullanıcıların konumlarını tespit ederek en yakın hizmeti sunmak amacıyla toplanabilir.</li>
              <li><strong>Ödeme Bilgileri:</strong> Mavina doğrudan ödeme almamakta olup, müşteriler ile hizmet sağlayıcılar arasındaki işlemleri takip edebilmek adına ödeme durum bilgilerini toplayabilir.</li>
              <li><strong>Cihaz ve Kullanım Verileri:</strong> IP adresi, tarayıcı türü, işletim sistemi, kullanım alışkanlıkları gibi teknik veriler toplanabilir.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">3. Bilgilerin Kullanımı</h2>
            <p className="text-black">Toplanan bilgiler şu amaçlarla kullanılabilir:</p>
            <ul className="list-disc pl-6 mb-4 text-black">
              <li>Kullanıcılara hizmet sağlamak ve rezervasyonları gerçekleştirmek</li>
              <li>Müşteri desteği sunmak</li>
              <li>Güvenliği sağlamak ve dolandırıcılığı önlemek</li>
              <li>Kullanıcıların ödeme durumlarını takip etmek ve bilgilendirmek</li>
              <li>Uygulamanın performansını analiz etmek ve geliştirmek</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">4. Ödeme İşlemleri ve Sorumluluk Reddi</h2>
            <p className="text-black">Mavina, ödeme işlemlerine doğrudan aracılık etmemektedir. Tüm ödemeler, müşteri ile hizmet sağlayıcı arasında doğrudan gerçekleştirilir. Kullanıcılar, ödeme yöntemlerini kendi aralarında belirler ve ödemeyle ilgili tüm sorumluluk kendilerine aittir. Mavina, ödeme süreçlerinde herhangi bir garanti sunmaz ve ödeme kaynaklı anlaşmazlıklardan sorumlu değildir.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">5. Bilgi Paylaşımı</h2>
            <p className="text-black">Mavina, kullanıcı bilgilerini yalnızca aşağıdaki durumlarda üçüncü taraflarla paylaşabilir:</p>
            <ul className="list-disc pl-6 mb-4 text-black">
              <li>Hizmet sağlayıcılarla (bireysel oto yıkamacılar ve ödeme sağlayıcılar gibi)</li>
              <li>Yasal zorunluluklar gereği yetkili mercilerle</li>
              <li>Uygulama geliştirme ve analiz hizmetleri sunan üçüncü taraflarla</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">6. Verilerin Saklanması ve Güvenliği</h2>
            <p className="text-black">Kullanıcı verileri, yalnızca hizmetlerimizi sağlamak için gerekli olduğu süre boyunca saklanacaktır. Kişisel verilerin güvenliğini sağlamak için teknik ve idari önlemler alınmaktadır.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">7. Çerezler ve İzleme Teknolojileri</h2>
            <p className="text-black">Mavina, kullanıcı deneyimini iyileştirmek amacıyla çerezler ve benzeri izleme teknolojileri kullanabilir. Kullanıcılar tarayıcı ayarlarından çerezleri yönetebilir.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">8. Kullanıcı Hakları</h2>
            <p className="text-black">Kullanıcılar, aşağıdaki haklara sahiptir:</p>
            <ul className="list-disc pl-6 mb-4 text-black">
              <li>Kişisel verilerine erişim talep etme</li>
              <li>Verilerinin düzeltilmesini veya silinmesini isteme</li>
              <li>Verilerinin işlenmesine itiraz etme</li>
              <li>Veri taşınabilirliği talep etme</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">9. Değişiklikler ve Güncellemeler</h2>
            <p className="text-black">Mavina, bu Gizlilik Politikasını zaman zaman güncelleyebilir. Kullanıcılar, güncellenen politikayı uygulama üzerinden inceleyebilir.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">10. İletişim</h2>
            <p className="text-black">Herhangi bir soru, öneri veya talebiniz için bizimle iletişime geçebilirsiniz:</p>
            <p className="text-black"><strong>E-posta:</strong> <a href="mailto:destek@mavina.tr" className="text-blue-600 hover:text-blue-500">destek@mavina.tr</a></p>
            
            <p className="mt-6 text-black">Bu Gizlilik Politikası, 15 Mart 2024 itibarıyla geçerlidir.</p>
          </div>
          
          <div className="mt-8">
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              ← Kayıt sayfasına geri dön
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 