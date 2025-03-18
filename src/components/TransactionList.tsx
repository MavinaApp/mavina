import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { getTransactions } from "@/lib/api-service";
import { FaSpinner, FaMoneyBillWave, FaTools, FaCheck, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

interface TransactionListProps {
  userId: string;
  userRole: "USER" | "PROVIDER";
}

export default function TransactionList({ userId, userRole }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions(userId, userRole);
        setTransactions(data);
        setError(null);
      } catch (err) {
        setError("İşlemler yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, userRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
        <span className="ml-2 text-gray-600">İşlemler yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600">Henüz işlem bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                {transaction.serviceName}
              </h3>
              <p className="text-gray-600 text-sm">
                İşlem ID: {transaction.id}
              </p>
              <p className="text-gray-600 text-sm">
                Tarih: {new Date(transaction.timestamp).toLocaleString("tr-TR")}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <p className="font-medium text-gray-800">
                {transaction.amount} TL
              </p>
              
              <div className="flex space-x-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.paymentStatus === "CONFIRMED" 
                    ? "bg-green-100 text-green-800" 
                    : transaction.paymentStatus === "DISPUTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {transaction.paymentStatus === "CONFIRMED" ? (
                    <>
                      <FaCheck className="mr-1" /> Ödeme Onaylandı
                    </>
                  ) : transaction.paymentStatus === "DISPUTED" ? (
                    <>
                      <FaTimes className="mr-1" /> Ödeme İhtilafı
                    </>
                  ) : (
                    <>
                      <FaMoneyBillWave className="mr-1" /> Ödeme Bekliyor
                    </>
                  )}
                </span>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.serviceStatus === "COMPLETED" 
                    ? "bg-green-100 text-green-800" 
                    : transaction.serviceStatus === "DISPUTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {transaction.serviceStatus === "COMPLETED" ? (
                    <>
                      <FaCheck className="mr-1" /> Hizmet Tamamlandı
                    </>
                  ) : transaction.serviceStatus === "DISPUTED" ? (
                    <>
                      <FaTimes className="mr-1" /> Hizmet İhtilafı
                    </>
                  ) : (
                    <>
                      <FaTools className="mr-1" /> Hizmet Devam Ediyor
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href={`/transactions/${transaction.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              İşlem Detayları
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 