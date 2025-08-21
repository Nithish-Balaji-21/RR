export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  medicalHistory?: string[];
  orders?: Order[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type UserRole = 'user' | 'admin';

export interface Order {
  id: string;
  items: { medicineId: string; quantity: number }[];
  totalAmount: number;
  date: string;
  status: 'processing' | 'delivered' | 'cancelled';
  address: string;
}