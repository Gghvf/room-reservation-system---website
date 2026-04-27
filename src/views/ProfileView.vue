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
            <label>Имя:</label>
            <span>{{ user?.name }}</span>
          </div>
          <div class="info-row">
            <label>Email:</label>
            <span>{{ user?.email }}</span>
          </div>
          <div class="info-row">
            <label>Роль:</label>
            <span :class="['role-badge', user?.role === 'admin' ? 'admin' : 'user']">
              {{ user?.role === 'admin' ? 'Администратор' : 'Пользователь' }}
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
            <div v-for="booking in bookings" :key="booking.id" class="booking-card">
              <div class="booking-header">
                <span class="booking-id">#{{ booking.id.slice(0, 8) }}</span>
                <span :class="['status-badge', getStatusClass(booking.status)]">
                  {{ getStatusText(booking.status) }}
                </span>
              </div>
              <div class="booking-details">
                <p><strong>Комната:</strong> {{ getRoomName(booking.roomId) }}</p>
                <p><strong>Начало:</strong> {{ formatDate(booking.startTime) }}</p>
                <p><strong>Конец:</strong> {{ formatDate(booking.endTime) }}</p>
              </div>
              <button 
                v-if="booking.status === 'confirmed'"
                @click="cancelBooking(booking.id)" 
                class="btn-cancel"
              >
                Отменить
              </button>
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
import { useAuthStore } from '@/stores/auth';
import { bookingApi, roomApi } from '@/api';
import type { Booking, Room } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const bookings = ref<Booking[]>([]);
const rooms = ref<Room[]>([]);
const loading = ref(false);

const loadBookings = async () => {
  loading.value = true;
  try {
    bookings.value = await bookingApi.getUserBookings();
  } catch (error) {
    console.error('Ошибка загрузки бронирований:', error);
  } finally {
    loading.value = false;
  }
};

const loadRooms = async () => {
  try {
    rooms.value = await roomApi.getAllRooms();
  } catch (error) {
    console.error('Ошибка загрузки комнат:', error);
  }
};

const getRoomName = (roomId: string): string => {
  const room = rooms.value.find(r => r.id === roomId);
  return room ? room.name : 'Неизвестно';
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'confirmed';
    case 'pending':
      return 'pending';
    case 'cancelled':
      return 'cancelled';
    default:
      return '';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Подтверждено';
    case 'pending':
      return 'Ожидает';
    case 'cancelled':
      return 'Отменено';
    default:
      return status;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const cancelBooking = async (bookingId: string) => {
  if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
    return;
  }

  try {
    await bookingApi.cancelBooking(bookingId);
    alert('Бронирование отменено');
    loadBookings();
  } catch (error) {
    console.error('Ошибка отмены бронирования:', error);
    alert('Не удалось отменить бронирование');
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  loadBookings();
  loadRooms();
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
