import axios from 'axios';
import type {
  User,
  Room,
  Booking,
  LoginRequest,
  RegisterRequest,
  CreateAdminRequest,
  AuthResponse,
  UserProfile,
  RoomData,
} from '@/types';

const API_BASE_URL = 'http://127.0.0.1:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get current login from localStorage
const getCurrentLogin = (): string | null => {
  return localStorage.getItem('login');
};

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Проверяем существование пользователя через профиль
    try {
      const response = await api.get<UserProfile>('/user/profile', {
        params: { login: data.login }
      });
      // Проверяем, есть ли ошибка в ответе
      if ('error' in response.data && response.data.error) {
        throw new Error(String(response.data.error));
      }
      // Успешный вход - сохраняем логин
      localStorage.setItem('login', data.login);
      return { message: 'Вход выполнен успешно', login: data.login };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Пользователь не найден или ошибка входа');
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/register', {
      params: {
        login: data.login,
        fam: data.fam,
        ima: data.ima,
        otch: data.otch,
        phone: data.phone,
        kolvo: data.kolvo
      }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    localStorage.setItem('login', data.login);
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('login');
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    const login = getCurrentLogin();
    if (!login) return null;
    try {
      const response = await api.get<UserProfile>('/user/profile', {
        params: { login }
      });
      return response.data;
    } catch {
      return null;
    }
  },

  isAdmin: async (): Promise<boolean> => {
    const login = getCurrentLogin();
    if (!login) return false;
    try {
      const response = await api.get<UserProfile>('/user/profile', {
        params: { login }
      });
      return response.data.is_admin;
    } catch {
      return false;
    }
  }
};

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    // API не поддерживает получение всех пользователей, возвращаем пустой массив
    return [];
  },

  getUserByLogin: async (login: string): Promise<UserProfile | null> => {
    try {
      const response = await api.get<UserProfile>('/user/profile', {
        params: { login }
      });
      return response.data;
    } catch {
      return null;
    }
  },

  updateKolvo: async (login: string, kolvo: number): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/user/update_kolvo', {
      params: { login, kolvo }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },

  deleteUser: async (adminLogin: string, userLogin: string): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/user/delete', {
      params: { login: adminLogin, user_login: userLogin }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },
};

export const roomApi = {
  getAllRooms: async (login: string): Promise<RoomData[]> => {
    const response = await api.get<{ rooms: RoomData[] }>('/rooms', {
      params: { login }
    });
    return response.data.rooms;
  },

  getAvailableRooms: async (login: string): Promise<RoomData[]> => {
    const response = await api.get<{ available_rooms: RoomData[] }>('/rooms/available', {
      params: { login }
    });
    return response.data.available_rooms;
  },

  createRoom: async (adminLogin: string, num: number, cap: number): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/room/create', {
      params: { login: adminLogin, num, cap }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },

  deleteRoom: async (adminLogin: string, roomNum: number): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/room/delete', {
      params: { login: adminLogin, room_num: roomNum }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },

  bookRoom: async (login: string, roomNum: number, date: string): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/room/book', {
      params: { login, room_num: roomNum, date }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },

  unbookRoom: async (login: string, roomNum: number): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/room/unbook', {
      params: { login, room_num: roomNum }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },

  updateBookingDate: async (login: string, roomNum: number, newDate: string): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/room/update_date', {
      params: { login, room_num: roomNum, new_date: newDate }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },
};

export const bookingApi = {
  getUserBookings: async (login: string): Promise<Booking[]> => {
    const response = await api.get<{ bookings: Booking[] }>('/user/bookings', {
      params: { login }
    });
    return response.data.bookings;
  },

  cancelBooking: async (login: string, roomNum: number): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/room/unbook', {
      params: { login, room_num: roomNum }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },
};

export const adminApi = {
  createAdmin: async (adminLogin: string, newAdminLogin: string): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/admin/create', {
      params: { login: adminLogin, new_login: newAdminLogin }
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  },
};