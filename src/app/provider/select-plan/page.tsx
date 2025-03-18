"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

export default function SelectPlanPage() {
  const router = useRouter();

  const handlePlanSelect = (planType: 'free' | 'premium') => {
    if (planType === 'premium') {
      router.push("/register?role=provider&plan=premium");
    } else {
      router.push("/register?role=provider&plan=free");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Size En Uygun Paketi Seçin
          </h1>
          <p className="text-xl text-gray-600">
            İhtiyaçlarınıza göre özelleştirilmiş paketlerimizden birini seçin
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Ücretsiz Paket */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ücretsiz Paket</h2>
              <p className="text-4xl font-bold text-blue-600 mb-6">₺0<span className="text-lg text-gray-500">/ay</span></p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700">
                <FaCheck className="text-green-500 mr-2" />
                Temel profil yönetimi
              </li>
              <li className="flex items-center text-gray-700">
                <FaCheck className="text-green-500 mr-2" />
                Aylık 10 randevu hakkı
              </li>
              <li className="flex items-center text-gray-700">
                <FaCheck className="text-green-500 mr-2" />
                Temel müşteri yönetimi
              </li>
            </ul>
            <button
              onClick={() => handlePlanSelect('free')}
              className="w-full py-3 px-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition-all duration-300"
            >
              Ücretsiz Başla
            </button>
          </motion.div>

          {/* Premium Paket */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-400 text-blue-900 text-sm font-bold px-3 py-1 rounded-full">
                ÖNERİLEN
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Premium Paket</h2>
              <p className="text-4xl font-bold mb-6">₺299<span className="text-lg opacity-75">/ay</span></p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <FaCheck className="text-yellow-400 mr-2" />
                Sınırsız randevu alma
              </li>
              <li className="flex items-center">
                <FaCheck className="text-yellow-400 mr-2" />
                Öncelikli listeleme
              </li>
              <li className="flex items-center">
                <FaCheck className="text-yellow-400 mr-2" />
                Detaylı analitik raporlar
              </li>
              <li className="flex items-center">
                <FaCheck className="text-yellow-400 mr-2" />
                7/24 öncelikli destek
              </li>
              <li className="flex items-center">
                <FaCheck className="text-yellow-400 mr-2" />
                Özel promosyon araçları
              </li>
            </ul>
            <button
              onClick={() => handlePlanSelect('premium')}
              className="w-full py-3 px-6 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Premium'a Geç
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 