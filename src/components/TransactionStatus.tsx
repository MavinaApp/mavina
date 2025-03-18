import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { updatePaymentStatus, updateServiceStatus, getTransaction } from "@/lib/api-service";
import { FaCheck, FaTimes, FaSpinner, FaMoneyBillWave, FaTools } from "react-icons/fa";
import { motion } from "framer-motion";

interface TransactionStatusProps {
  transactionId: string;
  userRole: "USER" | "PROVIDER";
  userId: string;
  onUpdate?: (transaction: Transaction) => void;
}

export default function TransactionStatus({
  transactionId,
  userRole,
  userId,
  onUpdate
}: TransactionStatusProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // İşlem bilgilerini yükle
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const data = await getTransaction(transactionId);
        setTransaction(data);
        setError(null);
      } catch (err) {
        setError("İşlem bilgileri yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();

    // Gerçek zamanlı güncellemeler için WebSocket veya polling kullanılabilir
    const interval = setInterval(fetchTransaction, 10000); // 10 saniyede bir güncelle

    return () => clearInterval(interval);
  }, [transactionId]);

  // Ödeme durumunu güncelle (Müşteri tarafından)
  const handlePaymentConfirmation = async () => {
    if (!transaction || userRole !== "USER") return;

    try {
      setUpdating(true);
      const updatedTransaction = await updatePaymentStatus(transactionId, "CONFIRMED");
      if (updatedTransaction) {
        setTransaction(updatedTransaction);
        if (onUpdate) onUpdate(updatedTransaction);
      }
    } catch (err) {
      setError("Ödeme durumu güncellenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Hizmet durumunu güncelle (Yıkamacı tarafından)
  const handleServiceCompletion = async () => {
    if (!transaction || userRole !== "PROVIDER") return;

    try {
      setUpdating(true);
      const updatedTransaction = await updateServiceStatus(transactionId, "COMPLETED");
      if (updatedTransaction) {
        setTransaction(updatedTransaction);
        if (onUpdate) onUpdate(updatedTransaction);
      }
    } catch (err) {
      setError("Hizmet durumu güncellenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
        <span className="ml-2 text-gray-600">İşlem bilgileri yükleniyor...</span>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">{error || "İşlem bulunamadı."}</p>
      </div>
    );
  }

  const isCustomer = userId === transaction.customerId;
  const isWasher = userId === transaction.washerId;
  const isPaymentConfirmed = transaction.paymentStatus === "CONFIRMED";
  const isServiceCompleted = transaction.serviceStatus === "COMPLETED";
  const isTransactionCompleted = isPaymentConfirmed && isServiceCompleted;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        İşlem Durumu: {transaction.serviceName}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaMoneyBillWave className="text-blue-500 mr-2" />
            <h4 className="font-medium text-gray-700">Ödeme Durumu</h4>
          </div>
          <div className="flex items-center mt-2">
            {isPaymentConfirmed ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <FaCheck className="mr-1" /> Onaylandı
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <FaSpinner className="mr-1 animate-spin" /> Bekliyor
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaTools className="text-blue-500 mr-2" />
            <h4 className="font-medium text-gray-700">Hizmet Durumu</h4>
          </div>
          <div className="flex items-center mt-2">
            {isServiceCompleted ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <FaCheck className="mr-1" /> Tamamlandı
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <FaSpinner className="mr-1 animate-spin" /> Devam Ediyor
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              <span className="font-medium">Tutar:</span> {transaction.amount} TL
            </p>
            <p className="text-gray-600 text-sm">
              Son güncelleme: {new Date(transaction.timestamp).toLocaleString("tr-TR")}
            </p>
          </div>

          <div className="flex space-x-4">
            {isCustomer && !isPaymentConfirmed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePaymentConfirmation}
                disabled={updating}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheck className="mr-2" />
                )}
                Ödeme Yapıldı
              </motion.button>
            )}

            {isWasher && !isServiceCompleted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleServiceCompletion}
                disabled={updating}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheck className="mr-2" />
                )}
                Hizmet Tamamlandı
              </motion.button>
            )}
          </div>
        </div>

        {isTransactionCompleted && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-700 flex items-center">
              <FaCheck className="mr-2" /> 
              Bu işlem başarıyla tamamlanmıştır. Hem ödeme hem de hizmet onaylanmıştır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 