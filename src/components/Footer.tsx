import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Mavina</h2>
            <p className="text-blue-400">Mobil Araç Yıkama Hizmetleri</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Link href="/about" className="hover:text-blue-400">Hakkımızda</Link>
            <Link href="/contact" className="hover:text-blue-400">İletişim</Link>
            <Link href="/privacy" className="hover:text-blue-400">Gizlilik Politikası</Link>
            <Link href="/terms" className="hover:text-blue-400">Kullanım Şartları</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-blue-400">
          <p>&copy; {new Date().getFullYear()} Mavina. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 