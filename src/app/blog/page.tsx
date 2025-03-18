"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaSearch, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";

// Blog yazısı tipi
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  image_url: string;
}

// Örnek blog yazıları (normalde API'den gelecek)
const DUMMY_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Araç Bakımında Dikkat Edilmesi Gereken 5 Önemli Nokta",
    excerpt: "Aracınızın ömrünü uzatmak ve performansını artırmak için düzenli bakım şart. İşte dikkat etmeniz gereken 5 önemli nokta.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Araç Bakımı",
    author: "Ahmet Yılmaz",
    published_at: "2023-03-15T10:00:00Z",
    image_url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwd2FzaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    title: "Mobil Araç Yıkama Hizmetinin Avantajları",
    excerpt: "Zamanınız değerli! Mobil araç yıkama hizmeti ile zamandan tasarruf edin ve aracınızı istediğiniz yerde temizletin.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Mobil Hizmetler",
    author: "Zeynep Kaya",
    published_at: "2023-03-10T14:30:00Z",
    image_url: "https://images.unsplash.com/photo-1605618313023-d8b0af2f1f09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhciUyMHdhc2h8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "3",
    title: "Kış Aylarında Araç Bakımı: Nelere Dikkat Etmelisiniz?",
    excerpt: "Kış ayları yaklaşırken aracınızı soğuk hava koşullarına hazırlamak için yapmanız gerekenler.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Mevsimsel Bakım",
    author: "Mehmet Demir",
    published_at: "2023-03-05T09:15:00Z",
    image_url: "https://images.unsplash.com/photo-1545171709-47bd85cda8fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHdpbnRlciUyMGNhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "4",
    title: "Araç İç Temizliğinde Profesyonel Dokunuş",
    excerpt: "Aracınızın iç temizliğini profesyonel şekilde yapmanın püf noktaları ve kullanabileceğiniz en iyi ürünler.",
    content: "Lorem ipsum dolor sit amet...",
    category: "İç Temizlik",
    author: "Ayşe Kaya",
    published_at: "2023-03-01T11:45:00Z",
    image_url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyJTIwaW50ZXJpb3J8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "5",
    title: "Çevre Dostu Araç Temizlik Ürünleri",
    excerpt: "Doğayı korurken aracınızı temizleyebileceğiniz çevre dostu ürünler ve yöntemler.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Çevre",
    author: "Elif Yıldız",
    published_at: "2023-02-25T13:20:00Z",
    image_url: "https://images.unsplash.com/photo-1618483584935-9dbd45fea7fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZWNvJTIwZnJpZW5kbHl8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "6",
    title: "Araç Cilalama Teknikleri ve Faydaları",
    excerpt: "Aracınızın boyasını korumak ve parlaklığını artırmak için cilalama teknikleri ve faydaları hakkında bilmeniz gerekenler.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Detaylı Bakım",
    author: "Ali Yılmaz",
    published_at: "2023-02-20T15:10:00Z",
    image_url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwcG9saXNofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
  }
];

// Kategorileri çıkar
const categories = Array.from(new Set(DUMMY_POSTS.map(post => post.category)));

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(DUMMY_POSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Arama ve filtreleme işlemi
  useEffect(() => {
    let filteredPosts = DUMMY_POSTS;
    
    // Kategori filtresi
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
    }
    
    // Arama filtresi
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setPosts(filteredPosts);
  }, [searchTerm, selectedCategory]);

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
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
            <h1 className="text-2xl font-bold text-white">Mavina Blog</h1>
            <div className="w-24"></div> {/* Boşluk için */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Araç Bakımı Hakkında Her Şey</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Araç bakımı, temizliği ve mobil hizmetler hakkında en güncel bilgiler, ipuçları ve uzman tavsiyeleri.
          </p>
          
          {/* Arama Kutusu */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Blog yazılarında ara..."
              className="w-full px-4 py-3 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Kategori Filtreleri */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Tümü
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Yazıları */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinize uygun blog yazısı bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-xs font-medium">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <div className="flex items-center mr-4">
                          <FaUser className="mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
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