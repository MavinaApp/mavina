export type UserRole = "USER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  providerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: Date;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionStatus = "PENDING" | "COMPLETED" | "DISPUTED";
export type PaymentStatus = "PENDING" | "CONFIRMED" | "DISPUTED";

export interface Transaction {
  id: string;
  appointmentId: string;
  customerId: string;
  washerId: string;
  serviceStatus: TransactionStatus;
  paymentStatus: PaymentStatus;
  timestamp: string;
  amount: number;
  serviceName: string;
} 