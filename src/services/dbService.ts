import connectDB from '@/lib/db';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import Transaction from '@/models/Transaction';

export const dbService = {
  // Kullanıcı işlemleri
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    address?: string;
  }) {
    await connectDB();
    const user = await User.create(userData);
    return user;
  },

  async getUserByEmail(email: string) {
    await connectDB();
    const user = await User.findOne({ email });
    return user;
  },

  // Randevu işlemleri
  async createAppointment(appointmentData: {
    customerId: string;
    washerId: string;
    appointmentDate: Date;
    serviceName: string;
    price: number;
    address: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  }) {
    await connectDB();
    const appointment = await Appointment.create(appointmentData);
    return appointment;
  },

  async getAppointmentsByCustomer(customerId: string) {
    await connectDB();
    const appointments = await Appointment.find({ customerId })
      .populate('washerId', 'name')
      .sort({ appointmentDate: -1 });
    return appointments;
  },

  async updateAppointmentStatus(appointmentId: string, status: string) {
    await connectDB();
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
    return appointment;
  },

  // İşlem işlemleri
  async createTransaction(transactionData: {
    appointmentId: string;
    customerId: string;
    washerId: string;
    amount: number;
    serviceName: string;
  }) {
    await connectDB();
    const transaction = await Transaction.create(transactionData);
    return transaction;
  },

  async updateTransactionStatus(
    transactionId: string,
    serviceStatus: string,
    paymentStatus: string
  ) {
    await connectDB();
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { serviceStatus, paymentStatus },
      { new: true }
    );
    return transaction;
  }
}; 