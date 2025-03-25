"use client";

import { useState } from 'react';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

interface Payment {
  id: number;
  date: Date;
  amount: number;
  status: 'Beklemede' | 'Ödeme Yapılmadı';
  serviceName: string;
  providerName?: string;
}

interface PaymentListProps {
  userId: string;
  userRole: 'USER' | 'PROVIDER';
}

export default function PaymentList({ userId, userRole }: PaymentListProps) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      date: new Date(),
      amount: 150,
      status: 'Beklemede',
      serviceName: 'Standart Yıkama',
      providerName: 'Mobil Yıkama Servisi 1'
    },
    {
      id: 2,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 gün sonra
      amount: 300,
      status: 'Ödeme Yapılmadı',
      serviceName: 'Premium Detaylı Yıkama',
      providerName: 'Mobil Yıkama Servisi 2'
    }
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-black">{payment.serviceName}</h3>
              {payment.providerName && (
                <p className="text-sm text-blue-600">
                  {payment.providerName}
                </p>
              )}
              <p className="text-sm text-blue-600 mt-1">
                <FaMoneyBillWave className="inline mr-1" />
                {payment.amount}₺
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(payment.date)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${
                payment.status === 'Beklemede'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {payment.status}
              </span>
              {payment.status === 'Ödeme Yapılmadı' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaCreditCard />
                  Ödeme Yap
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Ödemeniz bulunmuyor.
        </div>
      )}
    </div>
  );
} 