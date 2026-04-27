import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserProfile } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null);
  const login = ref<string | null>(localStorage.getItem('login'));

  const isAuthenticated = computed(() => !!login.value);
  const isAdmin = computed(() => user.value?.is_admin ?? false);

  const setUser = (userData: UserProfile) => {
    user.value = userData;
  };

  const setLogin = (newLogin: string) => {
    login.value = newLogin;
    localStorage.setItem('login', newLogin);
  };

  const logout = () => {
    user.value = null;
    login.value = null;
    localStorage.removeItem('login');
  };

  return {
    user,
    login,
    isAuthenticated,
    isAdmin,
    setUser,
    setLogin,
    logout,
  };
});
