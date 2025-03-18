"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransactionStatus from "@/components/TransactionStatus";
import { useAuth } from "@/lib/auth-context";
import { FaArrowLeft, FaInfoCircle, FaMoneyBillWave, FaTools } from "react-icons/fa";
import Link from "next/link";

export default function TransactionDetailPage() {
  const params = useParams();
  const transactionId = params.id as string;
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Erişim Reddedildi</h2>
              <p className="text-gray-600 mb-4">Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.</p>
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Giriş Yap
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const userRole = user.role === "PROVIDER" ? "PROVIDER" : "USER";
  const dashboardPath = userRole === "PROVIDER" ? "/provider" : "/user";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              href={dashboardPath}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Panele Geri Dön
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-6">İşlem Detayları</h1>
          
          <TransactionStatus 
            transactionId={transactionId}
            userRole={userRole}
            userId={user.id}
          />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">İşlem Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">İşlem ID</h3>
                <p className="mt-1 text-gray-900">{transactionId}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Kullanıcı Rolü</h3>
                <p className="mt-1 text-gray-900">
                  {userRole === "PROVIDER" ? "Hizmet Sağlayıcı" : "Müşteri"}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Nasıl Çalışır?
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-700 mb-2">İki Taraflı Onay Sistemi</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Mavina, ödeme işlemlerinin güvenli bir şekilde gerçekleştirilmesi için iki taraflı onay sistemi kullanır:
                </p>
                <ol className="list-decimal pl-5 text-blue-700 text-sm space-y-2">
                  <li>
                    <strong>Hizmet Tamamlandı:</strong> Hizmet sağlayıcı, hizmeti tamamladığında bu butona tıklar.
                  </li>
                  <li>
                    <strong>Ödeme Yapıldı:</strong> Müşteri, ödemeyi yaptığında bu butona tıklar.
                  </li>
                  <li>
                    <strong>İşlem Tamamlandı:</strong> Her iki taraf da onay verdiğinde işlem tamamlanmış sayılır.
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                {userRole === "PROVIDER" ? (
                  <FaTools className="mr-2 text-green-500" />
                ) : (
                  <FaMoneyBillWave className="mr-2 text-green-500" />
                )}
                Sizin Yapmanız Gereken
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-sm">
                  {userRole === "PROVIDER" 
                    ? "Hizmet tamamlandığında 'Hizmet Tamamlandı' butonuna tıklayarak müşteriyi bilgilendirebilirsiniz. Bu, müşterinin ödeme yapması gerektiğini hatırlatacaktır."
                    : "Ödeme yaptığınızda 'Ödeme Yapıldı' butonuna tıklayarak hizmet sağlayıcıyı bilgilendirebilirsiniz. Bu, hizmet sağlayıcının ödemeyi aldığını onaylamasını sağlayacaktır."}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <FaInfoCircle className="mr-2 text-red-500" />
                Ödeme Sorumluluk Reddi
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-700 text-sm">
                  Mavina, ödeme işlemlerine doğrudan aracılık etmemektedir. Tüm ödemeler, müşteri ile hizmet sağlayıcı arasında doğrudan gerçekleştirilir. Ödemeyle ilgili tüm sorumluluk taraflara aittir. Anlaşmazlık durumunda, taraflar kendi aralarında çözüm bulmalıdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 