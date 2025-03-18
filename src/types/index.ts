export type UserRole = "USER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone: string;
  address?: string;
}

export interface Provider extends User {
  services: Service[];
  availability: Availability[];
  location: Location;
  rating: number;
  reviews: Review[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // dakika cinsinden
  providerId: string;
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  serviceName: string;
  price: number;
  location: Location;
  notes?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Availability {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6 (Pazar-Cumartesi)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
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