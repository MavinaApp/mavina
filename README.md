# Mavina - Mobil Araç Yıkama Hizmetleri

Mavina, kullanıcıların çevrelerindeki mobil araç yıkama hizmetlerini bulmalarına, iletişime geçmelerine ve randevu almalarına olanak tanıyan bir web uygulamasıdır.

## Özellikler

- **Kullanıcı Türleri**: Araç sahipleri ve hizmet sağlayıcılar için ayrı paneller
- **Harita Entegrasyonu**: Kullanıcının konumunu belirleyerek en yakın mobil araç yıkama servislerini gösterme
- **Rezervasyon Sistemi**: Uygulama üzerinden doğrudan randevu alma ve onay mekanizması
- **Hizmet Sağlayıcı Paneli**: Konum güncelleme, müsaitlik durumu yönetimi ve randevu takibi
- **Kullanıcı Dostu Arayüz**: Sezgisel ve modern bir kullanıcı deneyimi

## Teknolojiler

- **Frontend**: Next.js, React, TailwindCSS
- **Harita**: Leaflet
- **Form Yönetimi**: React Hook Form, Zod
- **Kimlik Doğrulama**: NextAuth.js
- **HTTP İstekleri**: Axios

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullanici/mavina.git
cd mavina
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

### Kullanıcılar (Araç Sahipleri) İçin

1. Kayıt olun veya giriş yapın
2. Harita üzerinden yakınınızdaki hizmet sağlayıcıları görüntüleyin
3. Bir hizmet sağlayıcı seçin ve detaylarını inceleyin
4. Size uygun bir hizmet ve zaman dilimi seçerek randevu oluşturun
5. Randevularınızı ve geçmiş hizmetlerinizi panelinizdeki ilgili sekmelerden takip edin

### Hizmet Sağlayıcılar İçin

1. Hizmet sağlayıcı olarak kayıt olun veya giriş yapın
2. Konum bilgilerinizi ve hizmet yarıçapınızı güncelleyin
3. Sunduğunuz hizmetleri ve fiyatları ekleyin/düzenleyin
4. Gelen randevu taleplerini onaylayın veya reddedin
5. Randevularınızı ve geçmiş hizmetlerinizi panelinizdeki ilgili sekmelerden takip edin

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: Açıklama'`)
4. Dalınıza push yapın (`git push origin yeni-ozellik`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

Sorularınız veya önerileriniz için [info@mavina.tr](mailto:info@mavina.tr) adresine e-posta gönderebilirsiniz.
