<template>
  <div class="profile-container">
    <header class="header">
      <div class="header-content">
        <h1>Room Reservation</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">Главная</router-link>
          <router-link to="/profile" class="nav-link active">Профиль</router-link>
          <button @click="handleLogout" class="btn-logout">Выйти</button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="profile-card">
        <h2>Личный кабинет</h2>
        
        <div class="profile-info">
          <div class="info-row">
            <label>ФИО:</label>
            <span>{{ user?.fio }}</span>
          </div>
          <div class="info-row">
            <label>Телефон:</label>
            <span>{{ user?.phone }}</span>
          </div>
          <div class="info-row">
            <label>Количество персон:</label>
            <span>{{ user?.kolvo }}</span>
          </div>
          <div class="info-row">
            <label>Роль:</label>
            <span :class="['role-badge', user?.is_admin ? 'admin' : 'user']">
              {{ user?.is_admin ? 'Администратор' : 'Пользователь' }}
            </span>
          </div>
        </div>

        <div class="bookings-section">
          <h3>Мои бронирования</h3>
          <div v-if="loading" class="loading">Загрузка...</div>
          <div v-else-if="bookings.length === 0" class="no-bookings">
            У вас пока нет бронирований
          </div>
          <div v-else class="bookings-list">
            <div v-for="(booking, index) in bookings" :key="index" class="booking-card">
              <div class="booking-header">
                <span class="booking-id">Комната #{{ booking.room_num }}</span>
                <span class="status-badge confirmed">
                  Забронировано
                </span>
              </div>
              <div class="booking-details">
                <p><strong>Номер комнаты:</strong> {{ booking.room_num }}</p>
                <p><strong>Вместимость:</strong> {{ booking.capacity }} чел.</p>
                <p><strong>Дата бронирования:</strong> {{ booking.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { authApi, bookingApi } from '@/api';
import { useAuthStore } from '@/stores/auth';
import type { Booking, UserProfile } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const user = ref<UserProfile | null>(null);
const bookings = ref<Booking[]>([]);
const loading = ref(false);

const loadUserProfile = async () => {
  try {
    user.value = await authApi.getCurrentUser();
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  }
};

const loadBookings = async () => {
  loading.value = true;
  try {
    const login = localStorage.getItem('login');
    if (login) {
      bookings.value = await bookingApi.getUserBookings(login);
    }
  } catch (error) {
    console.error('Ошибка загрузки бронирований:', error);
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout(); 
  localStorage.removeItem('userLogin');
  router.push('/login');
};

onMounted(() => {
  loadUserProfile();
  loadBookings();
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 28px;
}

.nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.profile-card h2 {
  color: #1a1a2e;
  font-size: 28px;
  margin-bottom: 30px;
}

.profile-info {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.info-row {
  display: flex;
  padding: 12px 0;
  gap: 20px;
}

.info-row label {
  font-weight: 600;
  color: #666;
  width: 120px;
}

.info-row span {
  color: #1a1a2e;
  font-size: 16px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.role-badge.admin {
  background: #667eea;
  color: white;
}

.role-badge.user {
  background: #e9ecef;
  color: #666;
}

.bookings-section h3 {
  color: #1a1a2e;
  font-size: 22px;
  margin-bottom: 20px;
}

.loading,
.no-bookings {
  text-align: center;
  padding: 40px;
  color: #666;
}

.bookings-list {
  display: grid;
  gap: 20px;
}

.booking-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.booking-id {
  font-weight: 600;
  color: #667eea;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.confirmed {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.booking-details p {
  margin: 8px 0;
  color: #666;
}

.btn-cancel {
  margin-top: 16px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #c82333;
}
</style>
