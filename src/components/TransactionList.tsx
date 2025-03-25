"use client";

import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaStar, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

interface Review {
  rating: number;
  comment: string;
  date: Date;
}

interface Transaction {
  id: number;
  date: Date;
  amount: number;
  status: 'Ödendi' | 'Onay Bekliyor' | 'Onaylandı';
  serviceName: string;
  providerName?: string;
  review?: Review;
  address: string;
  service: string;
  price: number;
  carModel?: string;
  licensePlate?: string;
}

interface TransactionListProps {
  userId: string;
  userRole: 'USER' | 'PROVIDER';
}

export default function TransactionList({ userId, userRole }: TransactionListProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelNotification, setShowCancelNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 2,
      date: new Date(),
      amount: 250,
      status: 'Ödendi',
      serviceName: 'Detaylı Yıkama',
      providerName: 'Mobil Yıkama Servisi 2',
      review: {
        rating: 5,
        comment: 'Çok memnun kaldım, araç pırıl pırıl oldu. Teşekkürler!',
        date: new Date()
      },
      address: 'Örnek Mahallesi, Örnek Sokak No:1, İstanbul',
      service: 'Detaylı Yıkama',
      price: 250,
      carModel: 'BMW 320i',
      licensePlate: '34ABC123'
    },
    {
      id: 3,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      amount: 180,
      status: 'Ödendi',
      serviceName: 'İç Dış Yıkama',
      providerName: 'Mobil Yıkama Servisi 3',
      address: 'Örnek Mahallesi, Örnek Sokak No:2, İstanbul',
      service: 'Detaylı Yıkama',
      price: 250,
      carModel: 'Mercedes C200',
      licensePlate: '34XYZ789'
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

  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-6 h-6 ${
          index < (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
        onMouseEnter={() => interactive && setHoveredRating(index + 1)}
        onMouseLeave={() => interactive && setHoveredRating(0)}
        onClick={() => interactive && setRating(index + 1)}
      />
    ));
  };

  const handleReviewSubmit = () => {
    if (!selectedTransaction || !rating || !comment.trim()) {
      alert('Lütfen yıldız ve yorum alanlarını doldurunuz.');
      return;
    }

    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === selectedTransaction.id) {
        return {
          ...transaction,
          review: {
            rating,
            comment: comment.trim(),
            date: new Date()
          }
        };
      }
      return transaction;
    });

    setTransactions(updatedTransactions);
    setShowReviewModal(false);
    
    // Başarılı değerlendirme bildirimi göster
    setSuccessMessage(isEditMode 
      ? 'Değerlendirmeniz başarıyla güncellendi!' 
      : 'Değerlendirmeniz için teşekkürler!');
    setShowSuccessNotification(true);
    
    // Modalı kapattıktan sonra state'i temizle
    setTimeout(() => {
      setSelectedTransaction(null);
      setRating(0);
      setComment('');
      setIsEditMode(false);
    }, 100);
    
    // 3 saniye sonra bildirimi kapat
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const handleCancelClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!selectedTransaction) return;

    // Burada gerçek uygulamada API çağrısı yapılacak
    setShowCancelModal(false);
    setShowCancelNotification(true);

    // 3 saniye sonra bildirimi kapat
    setTimeout(() => {
      setShowCancelNotification(false);
    }, 3000);
  };
  
  const handleEditReview = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (transaction.review) {
      setRating(transaction.review.rating);
      setComment(transaction.review.comment);
    }
    setIsEditMode(true);
    setShowReviewModal(true);
  };
  
  const handleDeleteReview = (transaction: Transaction) => {
    if (confirm('Değerlendirmenizi silmek istediğinize emin misiniz?')) {
      const updatedTransactions = transactions.map(item => {
        if (item.id === transaction.id) {
          const { review, ...rest } = item;
          return rest;
        }
        return item;
      });
      
      setTransactions(updatedTransactions);
      setSuccessMessage('Değerlendirmeniz silindi.');
      setShowSuccessNotification(true);
      
      // 3 saniye sonra bildirimi kapat
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    }
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
      {transactions.map((transaction) => (
        <div key={transaction.id} className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-black">{transaction.serviceName}</h3>
              {transaction.providerName && (
                <p className="text-sm text-blue-600">
                  {transaction.providerName}
                </p>
              )}
              <p className="text-sm text-blue-600 mt-1">
                <FaMoneyBillWave className="inline mr-1" />
                {transaction.amount}₺
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(transaction.date)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <FaCalendarAlt className="inline mr-1" />
                {transaction.address}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <FaClock className="inline mr-1" />
                {transaction.service}
              </p>
              {transaction.carModel && (
                <p className="text-sm text-gray-600 mt-1">
                  Araç: {transaction.carModel} ({transaction.licensePlate})
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                {transaction.status}
              </span>
              {transaction.status === 'Ödendi' && userRole === 'USER' && !transaction.review && (
                <button 
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowReviewModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center"
                >
                  <FaStar className="mr-1" /> Değerlendirme Yap
                </button>
              )}
              {transaction.status === 'Onay Bekliyor' && userRole === 'USER' && (
                <button 
                  onClick={() => handleCancelClick(transaction)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  İptal Et
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            {transaction.review ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(transaction.review.rating)}
                  </div>
                  {userRole === 'USER' && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditReview(transaction)} 
                        className="text-blue-600 hover:text-blue-800"
                        title="Değerlendirmeyi Düzenle"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(transaction)} 
                        className="text-red-600 hover:text-red-800"
                        title="Değerlendirmeyi Sil"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-black text-sm italic">
                  "{transaction.review.comment}"
                </p>
                <p className="text-xs text-gray-500">
                  Değerlendirme tarihi: {formatDate(transaction.review.date)}
                </p>
              </div>
            ) : transaction.status === 'Ödendi' && userRole === 'USER' && (
              <button 
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowReviewModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center inline-flex"
              >
                <FaStar className="mr-1" /> Değerlendirme Yap
              </button>
            )}
          </div>
        </div>
      ))}
      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Geçmiş hizmetiniz bulunmuyor.
        </div>
      )}
      
      {/* Değerlendirme Modal */}
      {showReviewModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isEditMode ? 'Değerlendirmeyi Düzenle' : `${selectedTransaction.serviceName} Hizmetini Değerlendir`}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puanınız
              </label>
              <div className="flex gap-1">
                {renderStars(rating, true)}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorumunuz
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hizmet hakkında düşüncelerinizi yazın..."
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-black"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedTransaction(null);
                  setRating(0);
                  setComment('');
                  setIsEditMode(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={!rating || !comment.trim()}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  rating && comment.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isEditMode ? 'Güncelle' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Başarı Bildirimi */}
      {showSuccessNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <div className="bg-white bg-opacity-20 rounded-full p-1">
            <FaCheck className="text-white" />
          </div>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
} 