"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
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

// Yorum tipi
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  avatar: string;
}

// Örnek blog yazıları (normalde API'den gelecek)
const DUMMY_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Araç Bakımında Dikkat Edilmesi Gereken 5 Önemli Nokta",
    excerpt: "Aracınızın ömrünü uzatmak ve performansını artırmak için düzenli bakım şart. İşte dikkat etmeniz gereken 5 önemli nokta.",
    content: `
      <p>Araç bakımı, aracınızın ömrünü uzatmak ve performansını korumak için son derece önemlidir. Düzenli bakım sayesinde hem güvenliğinizi sağlar hem de beklenmedik arıza masraflarından kaçınabilirsiniz.</p>
      
      <h2>1. Motor Yağı Kontrolü</h2>
      <p>Motor yağı, motorun kalbidir. Düzenli olarak seviyesini kontrol etmeli ve zamanında değiştirmelisiniz. Eski ve kirli yağ, motorunuza ciddi zararlar verebilir.</p>
      
      <h2>2. Lastik Basıncı ve Durumu</h2>
      <p>Lastiklerinizin basıncını ayda bir kez kontrol edin. Doğru lastik basıncı, yakıt tasarrufu sağlar ve lastiklerin ömrünü uzatır. Ayrıca lastiklerin diş derinliğini ve genel durumunu da düzenli olarak kontrol etmelisiniz.</p>
      
      <h2>3. Fren Sistemi</h2>
      <p>Frenler, aracınızın en kritik güvenlik bileşenidir. Fren balatalarının, disklerinin ve hidrolik sistemin düzenli kontrolü hayati önem taşır.</p>
      
      <h2>4. Akü Bakımı</h2>
      <p>Akünüzün terminalleri temiz olmalı ve bağlantıları sıkı olmalıdır. Soğuk havalarda akü performansı düşebilir, bu nedenle kış aylarına girerken akünüzün durumunu kontrol ettirin.</p>
      
      <h2>5. Sıvı Seviyeleri</h2>
      <p>Motor yağı dışında, soğutma sıvısı, fren hidroliği, direksiyon hidroliği ve cam suyu gibi diğer sıvıların da düzenli olarak kontrol edilmesi gerekir.</p>
      
      <p>Düzenli bakım, sadece aracınızın performansını korumakla kalmaz, aynı zamanda güvenliğinizi sağlar ve uzun vadede size para tasarrufu sağlar. Bakım takvimini takip etmek ve profesyonel yardım almak, aracınızın ömrünü uzatmanın en iyi yoludur.</p>
    `,
    category: "Araç Bakımı",
    author: "Ahmet Yılmaz",
    published_at: "2023-03-15T10:00:00Z",
    image_url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwd2FzaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    title: "Mobil Araç Yıkama Hizmetinin Avantajları",
    excerpt: "Zamanınız değerli! Mobil araç yıkama hizmeti ile zamandan tasarruf edin ve aracınızı istediğiniz yerde temizletin.",
    content: `
      <p>Günümüzün yoğun temposunda, araç bakımı için zaman ayırmak giderek zorlaşıyor. Mobil araç yıkama hizmetleri tam da bu noktada devreye giriyor ve size birçok avantaj sunuyor.</p>
      
      <h2>Zaman Tasarrufu</h2>
      <p>Mobil araç yıkama hizmetinin en büyük avantajı, size zaman kazandırmasıdır. Oto yıkamaya gitmek, sıra beklemek ve işlem bitene kadar beklemek yerine, mobil hizmet sayesinde aracınız evinizde veya iş yerinizde temizlenir.</p>
      
      <h2>Uygun Fiyatlar</h2>
      <p>Birçok kişi mobil hizmetlerin daha pahalı olduğunu düşünse de, aslında rekabetçi fiyatlar sunarlar. Üstelik yakıt ve zaman tasarrufu da düşünüldüğünde, ekonomik bir seçenek haline gelir.</p>
      
      <h2>Kişiselleştirilmiş Hizmet</h2>
      <p>Mobil yıkama ekipleri genellikle daha az araçla ilgilendikleri için, her araca özel ilgi gösterebilirler. Bu da daha detaylı ve özenli bir temizlik anlamına gelir.</p>
      
      <h2>Çevre Dostu Seçenekler</h2>
      <p>Birçok mobil yıkama hizmeti, su tasarrufu sağlayan ve çevre dostu temizlik ürünleri kullanır. Bu da ekolojik ayak izinizi azaltmanıza yardımcı olur.</p>
      
      <h2>Esneklik</h2>
      <p>Mobil hizmetler genellikle daha esnek çalışma saatlerine sahiptir ve sizin programınıza göre randevu ayarlayabilirler.</p>
      
      <p>Sonuç olarak, mobil araç yıkama hizmetleri, modern yaşamın hızlı temposuna uyum sağlayan, pratik ve etkili bir çözümdür. Mavina ile bu hizmeti kolayca bulabilir ve rezervasyon yapabilirsiniz.</p>
    `,
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

// Örnek yorumlar
const DUMMY_COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: "1",
      author: "Mehmet Yılmaz",
      content: "Çok faydalı bir yazı olmuş, teşekkürler! Özellikle lastik basıncı konusunda verdiğiniz bilgiler çok değerli.",
      date: "2023-03-16T08:30:00Z",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: "2",
      author: "Ayşe Demir",
      content: "Akü bakımı konusunda verdiğiniz bilgileri uyguladım ve gerçekten fark yarattı. Aracım artık soğuk havalarda bile daha kolay çalışıyor.",
      date: "2023-03-17T14:15:00Z",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  ],
  "2": [
    {
      id: "1",
      author: "Ali Kaya",
      content: "Mobil yıkama hizmetini ilk kez denedim ve gerçekten çok memnun kaldım. Zamandan tasarruf etmek büyük avantaj!",
      date: "2023-03-11T09:45:00Z",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ]
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    const foundPost = DUMMY_POSTS.find(p => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      setComments(DUMMY_COMMENTS[postId] || []);
    } else {
      router.push("/blog");
    }
  }, [postId, router]);

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Yorum gönderme
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      setError("Lütfen adınızı girin");
      return;
    }
    
    if (!newComment.trim()) {
      setError("Lütfen yorumunuzu girin");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    // Gerçek uygulamada API'ye gönderilecek
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `${comments.length + 1}`,
        author: userName,
        content: newComment,
        date: new Date().toISOString(),
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg`
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment("");
      setIsSubmitting(false);
    }, 1000);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-4">Yükleniyor...</h2>
          <p className="text-black">Blog yazısı yükleniyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header */}
      <header className="bg-blue-700 shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/blog" className="text-white flex items-center hover:text-blue-200 transition-colors">
              <FaArrowLeft className="mr-2" />
              Blog'a Dön
            </Link>
            <h1 className="text-2xl font-bold text-white">Mavina Blog</h1>
            <div className="w-24"></div> {/* Boşluk için */}
          </div>
        </div>
      </header>

      {/* Blog İçeriği */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Blog Başlığı ve Meta Bilgiler */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center text-black text-sm mb-6">
                <div className="flex items-center mr-6 mb-2">
                  <FaUser className="mr-1" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center mr-6 mb-2">
                  <FaCalendarAlt className="mr-1" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaTag className="mr-1" />
                  <span>{post.category}</span>
                </div>
              </div>
            </div>
            
            {/* Blog Görseli */}
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-xl overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
            
            {/* Blog İçeriği */}
            <div 
              className="prose prose-lg max-w-none mb-12 text-black"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Sosyal Paylaşım */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-black hover:text-blue-600 transition-colors">
                  <FaThumbsUp className="mr-2" />
                  <span>Beğen</span>
                </button>
                <button className="flex items-center text-black hover:text-blue-600 transition-colors">
                  <FaComment className="mr-2" />
                  <span>Yorum Yap</span>
                </button>
              </div>
              <button className="flex items-center text-black hover:text-blue-600 transition-colors">
                <FaShare className="mr-2" />
                <span>Paylaş</span>
              </button>
            </div>
            
            {/* Yorumlar Bölümü */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-6">Yorumlar ({comments.length})</h2>
              
              {/* Yorum Formu */}
              <form onSubmit={handleSubmitComment} className="bg-gray-50 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold text-black mb-4">Yorum Yap</h3>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="userName" className="block text-black mb-2">Adınız</label>
                  <input
                    type="text"
                    id="userName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-black mb-2">Yorumunuz</label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Gönderiliyor..." : "Yorum Gönder"}
                </button>
              </form>
              
              {/* Yorum Listesi */}
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start mb-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={comment.avatar}
                            alt={comment.author}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">{comment.author}</h4>
                          <p className="text-sm text-black">{formatDate(comment.date)}</p>
                        </div>
                      </div>
                      <p className="text-black">{comment.content}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-black">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                </div>
              )}
            </div>
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