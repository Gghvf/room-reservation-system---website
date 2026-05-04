export interface User {
  id: string;
  login: string;
  fam: string;
  ima: string;
  otch: string;
  phone: string;
  kolvo: number;
  isAdmin: boolean;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Room {
  id: string;
  num: number;
  capacity: number;
  status: string;
  date: string;
  booked_by: string;
  name: string;
  description: string;
  equipment: string[];
  isAvailable: boolean;
}

export interface Booking {
  room_num: number;
  capacity: number;
  date: string;
}

export interface LoginRequest {
  login: string;
}

export interface RegisterRequest {
  login: string;
  fam: string;
  ima: string;
  otch: string;
  phone: string;
  kolvo: number;
}

export interface CreateAdminRequest {
  login: string;
}

export interface AuthResponse {
  message?: string;
  error?: string;
  fio?: string;
  login?: string;
}

export interface UserProfile {
  fio: string;
  phone: string;
  kolvo: number;
  is_admin: boolean;
}

export interface RoomData {
  num: number;
  capacity: number;
  status: string;
  date: string;
  booked_by: string;
}
