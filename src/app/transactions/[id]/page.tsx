"use client";

import { useParams } from "next/navigation";
import TransactionStatus from "@/components/TransactionStatus";
import { useAuth } from "@/lib/auth-context";
import { FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function TransactionDetailPage() {
  const params = useParams();
  const transactionId = params.id as string;
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
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
      </div>
    );
  }

  // UserRole tipini kontrol et ve dönüştür
  const userRole = user.role === "PROVIDER" ? "PROVIDER" : "USER";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/transactions"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              İşlemler Listesine Dön
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">İşlem Detayları</h1>
              <div className="flex items-center text-gray-500">
                <FaInfoCircle className="mr-2" />
                <span>İşlem ID: {transactionId}</span>
              </div>
            </div>

            <TransactionStatus
              transactionId={transactionId}
              userRole={userRole}
              userId={user.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 