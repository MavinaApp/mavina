"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Kullanım Şartları</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="mb-4 text-black">Son güncellenme: 15 Mart 2024</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">1. Kabul</h2>
            <p className="text-black">Mavina uygulamasını ("Uygulama") kullanarak, bu Kullanım Şartları'nı ("Şartlar") kabul etmiş olursunuz. Bu Şartları kabul etmiyorsanız, lütfen Uygulamayı kullanmayın.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">2. Hizmet Tanımı</h2>
            <p className="text-black">Mavina, araç sahipleri ile araç bakım ve onarım hizmetleri sunan servis sağlayıcıları arasında bağlantı kuran bir platformdur. Uygulama, kullanıcıların servis sağlayıcılarını bulmasına, randevu almasına ve ödeme yapmasına olanak tanır.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">3. Hesap Oluşturma</h2>
            <p className="text-black">Uygulamayı kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken doğru, güncel ve eksiksiz bilgiler sağlamakla yükümlüsünüz. Hesap bilgilerinizin gizliliğini korumak ve hesabınız altında gerçekleşen tüm etkinliklerden sorumlu olmak sizin sorumluluğunuzdadır.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">4. Kullanıcı Yükümlülükleri</h2>
            <p className="text-black">Uygulamayı kullanırken:</p>
            <ul className="list-disc pl-6 mb-4 text-black">
              <li>Yasalara ve düzenlemelere uygun hareket etmelisiniz</li>
              <li>Başkalarının haklarına saygı göstermelisiniz</li>
              <li>Doğru ve dürüst bilgiler sağlamalısınız</li>
              <li>Uygulamayı kötüye kullanmamalısınız</li>
              <li>Uygulamanın güvenliğini tehlikeye atmamalısınız</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">5. Hizmet Sağlayıcı Yükümlülükleri</h2>
            <p className="text-black">Hizmet sağlayıcı olarak:</p>
            <ul className="list-disc pl-6 mb-4 text-black">
              <li>Sunduğunuz hizmetleri doğru bir şekilde tanımlamalısınız</li>
              <li>Belirtilen zamanlarda hizmet vermelisiniz</li>
              <li>Profesyonel ve kaliteli hizmet sunmalısınız</li>
              <li>Gerekli lisans ve izinlere sahip olmalısınız</li>
              <li>Vergi ve yasal yükümlülüklerinizi yerine getirmelisiniz</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">6. Ödemeler ve Ücretler</h2>
            <p className="text-black">Uygulama üzerinden yapılan ödemeler, güvenli ödeme işlemcileri aracılığıyla gerçekleştirilir. Hizmet sağlayıcılar, sundukları hizmetler için ücretleri belirler ve Mavina, her işlem üzerinden bir hizmet bedeli alır. Ödeme koşulları ve iade politikaları, her bir hizmet için ayrıca belirtilir.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">7. İptal ve İade Politikası</h2>
            <p className="text-black">Randevu iptalleri ve iade talepleri, hizmetin başlama zamanından en az 24 saat önce yapılmalıdır. Bu süre içinde yapılan iptaller için tam iade yapılır. Daha geç yapılan iptaller için, hizmet sağlayıcının politikasına bağlı olarak kısmi iade veya iade yapılmayabilir.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">8. Fikri Mülkiyet</h2>
            <p className="text-black">Uygulama ve içeriği, Mavina'nın veya lisans verenlerin mülkiyetindedir ve telif hakkı, ticari marka ve diğer fikri mülkiyet yasaları tarafından korunmaktadır. Uygulamayı kullanmanız, bu hakların size devredildiği anlamına gelmez.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">9. Sorumluluk Sınırlaması</h2>
            <p className="text-black">Mavina, platformda sunulan hizmetlerin kalitesi, güvenliği veya yasallığı konusunda garanti vermez. Uygulama "olduğu gibi" sunulmaktadır. Yasal olarak izin verilen azami ölçüde, Mavina, dolaylı, tesadüfi, özel veya sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">10. Anlaşmazlık Çözümü</h2>
            <p className="text-black">Kullanıcılar ve hizmet sağlayıcılar arasındaki anlaşmazlıklar öncelikle taraflar arasında çözülmeye çalışılmalıdır. Mavina, gerektiğinde arabuluculuk yapabilir ancak nihai çözüm sorumluluğunu üstlenmez.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">11. Hesap Sonlandırma</h2>
            <p className="text-black">Mavina, bu Şartları ihlal eden kullanıcıların hesaplarını önceden bildirimde bulunmaksızın sonlandırma hakkını saklı tutar. Kullanıcılar da istedikleri zaman hesaplarını kapatabilirler.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">12. Değişiklikler</h2>
            <p className="text-black">Mavina, bu Şartları zaman zaman güncelleyebilir. Değişiklikler, Uygulama üzerinden duyurulacaktır. Değişikliklerden sonra Uygulamayı kullanmaya devam etmeniz, güncellenmiş Şartları kabul ettiğiniz anlamına gelir.</p>
            
            <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">13. İletişim</h2>
            <p className="text-black">Bu Kullanım Şartları hakkında sorularınız varsa, lütfen <a href="mailto:info@mavina.com" className="text-blue-600 hover:text-blue-500">info@mavina.com</a> adresinden bizimle iletişime geçin.</p>
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