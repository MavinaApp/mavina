import { Transaction, TransactionStatus, PaymentStatus } from "@/types";

// Demo işlemler
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    appointmentId: "1",
    customerId: "1",
    washerId: "2",
    serviceStatus: "PENDING",
    paymentStatus: "PENDING",
    timestamp: new Date().toISOString(),
    amount: 150,
    serviceName: "Standart Yıkama"
  },
  {
    id: "2",
    appointmentId: "2",
    customerId: "1",
    washerId: "2",
    serviceStatus: "COMPLETED",
    paymentStatus: "CONFIRMED",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
    amount: 250,
    serviceName: "Detaylı İç Temizlik"
  }
];

// İşlemleri getir
export async function getTransactions(userId: string, role: "USER" | "PROVIDER"): Promise<Transaction[]> {
  // Gerçek bir API'ye istek yapılacak
  return new Promise((resolve) => {
    setTimeout(() => {
      // Kullanıcı rolüne göre filtreleme
      const filteredTransactions = DEMO_TRANSACTIONS.filter(transaction => 
        role === "USER" 
          ? transaction.customerId === userId 
          : transaction.washerId === userId
      );
      resolve(filteredTransactions);
    }, 500);
  });
}

// İşlem detayını getir
export async function getTransaction(transactionId: string): Promise<Transaction | null> {
  // Gerçek bir API'ye istek yapılacak
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = DEMO_TRANSACTIONS.find(t => t.id === transactionId);
      resolve(transaction || null);
    }, 500);
  });
}

// Ödeme durumunu güncelle
export async function updatePaymentStatus(
  transactionId: string, 
  status: PaymentStatus
): Promise<Transaction | null> {
  // Gerçek bir API'ye istek yapılacak
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionIndex = DEMO_TRANSACTIONS.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        DEMO_TRANSACTIONS[transactionIndex] = {
          ...DEMO_TRANSACTIONS[transactionIndex],
          paymentStatus: status,
          timestamp: new Date().toISOString()
        };
        resolve(DEMO_TRANSACTIONS[transactionIndex]);
      } else {
        resolve(null);
      }
    }, 500);
  });
}

// Hizmet durumunu güncelle
export async function updateServiceStatus(
  transactionId: string, 
  status: TransactionStatus
): Promise<Transaction | null> {
  // Gerçek bir API'ye istek yapılacak
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionIndex = DEMO_TRANSACTIONS.findIndex(t => t.id === transactionId);
      if (transactionIndex !== -1) {
        DEMO_TRANSACTIONS[transactionIndex] = {
          ...DEMO_TRANSACTIONS[transactionIndex],
          serviceStatus: status,
          timestamp: new Date().toISOString()
        };
        resolve(DEMO_TRANSACTIONS[transactionIndex]);
      } else {
        resolve(null);
      }
    }, 500);
  });
}

// Yeni işlem oluştur
export async function createTransaction(
  appointmentId: string,
  customerId: string,
  washerId: string,
  amount: number,
  serviceName: string
): Promise<Transaction> {
  // Gerçek bir API'ye istek yapılacak
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: `tr-${Date.now()}`,
        appointmentId,
        customerId,
        washerId,
        serviceStatus: "PENDING",
        paymentStatus: "PENDING",
        timestamp: new Date().toISOString(),
        amount,
        serviceName
      };
      
      DEMO_TRANSACTIONS.push(newTransaction);
      resolve(newTransaction);
    }, 500);
  });
} 