"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ProviderPage() {
  const router = useRouter();

  const handleJoinClick = () => {
    router.push("/provider/select-plan");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Daha Fazla Müşteri, Daha Fazla Kazanç!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8"
            >
              Oto yıkama işinizi büyütün. Mavina'ya katılın ve yeni müşterilere ulaşın!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={handleJoinClick}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center"
              >
                Hemen Katılın
                <FaArrowRight className="ml-2" />
              </button>
              <a
                href="#features"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300"
              >
                Daha Fazla Bilgi
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden Mavina?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mavina ile işinizi büyütün, daha fazla müşteriye ulaşın ve kazancınızı artırın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hemen Mavina'ya Katılın
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Siz de Mavina ailesine katılın ve işinizi büyütmeye başlayın.
            </p>
            <Link
              href="/register?role=provider"
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 inline-flex items-center"
            >
              Hemen Başvurun
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: FaCheck,
    title: "Kolay Müşteri Yönetimi",
    description: "Tüm müşterilerinizi ve randevularınızı tek bir yerden yönetin."
  },
  {
    icon: FaTimes,
    title: "Esnek Çalışma",
    description: "Kendi programınızı oluşturun ve size uygun zamanlarda çalışın."
  },
  {
    icon: FaArrowRight,
    title: "Daha Fazla Kazanç",
    description: "Yeni müşterilere ulaşın ve kazancınızı artırın."
  }
]; 