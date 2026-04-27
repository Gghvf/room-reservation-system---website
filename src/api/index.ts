import axios from 'axios';
import type {
  User,
  Room,
  Booking,
  LoginRequest,
  RegisterRequest,
  CreateAdminRequest,
  AuthResponse,
} from '@/types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export const roomApi = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await api.get<Room[]>('/rooms');
    return response.data;
  },

  getRoomById: async (id: string): Promise<Room> => {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (data: Partial<Room>): Promise<Room> => {
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },

  updateRoom: async (id: string, data: Partial<Room>): Promise<Room> => {
    const response = await api.put<Room>(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },

  searchAvailableRooms: async (
    startTime: string,
    endTime: string,
    capacity?: number
  ): Promise<Room[]> => {
    const params = new URLSearchParams({
      start_time: startTime,
      end_time: endTime,
    });
    if (capacity) {
      params.append('capacity', capacity.toString());
    }
    const response = await api.get<Room[]>(`/rooms/search?${params}`);
    return response.data;
  },
};

export const bookingApi = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/my');
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};

export const adminApi = {
  createAdmin: async (data: CreateAdminRequest): Promise<User> => {
    const response = await api.post<User>('/admin/create', data);
    return response.data;
  },

  getAllAdmins: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/list');
    return response.data;
  },
};
