<template>
  <div class="user-menu">
    <header class="header">
      <div class="header-content">
        <h1>Room Reservation</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link active">Главная</router-link>
          <router-link to="/profile" class="nav-link">Профиль</router-link>
          <button @click="handleLogout" class="btn-logout">Выйти</button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="welcome-section">
        <h2>Добро пожаловать, {{ userName }}!</h2>
        <p>Выберите комнату для бронирования</p>
      </div>

      <div class="rooms-section">
        <div class="search-filters">
          <div class="filter-group">
            <label>Дата бронирования</label>
            <input type="date" v-model="bookingDate" />
          </div>
          <button @click="loadAvailableRooms" class="btn-search">Найти доступные</button>
        </div>

        <div class="rooms-grid">
          <div v-for="room in rooms" :key="room.num" class="room-card">
            <div class="room-header">
              <h3>Комната #{{ room.num }}</h3>
              <span :class="['status-badge', room.status === 'свободна' ? 'available' : 'busy']">
                {{ room.status === 'свободна' ? 'Свободна' : 'Занята' }}
              </span>
            </div>
            <div class="room-details">
              <span class="detail-item">👥 {{ room.capacity }} чел.</span>
              <span v-if="room.booked_by" class="booked-by">Забронировал: {{ room.booked_by }}</span>
            </div>
            <button 
              @click="bookRoom(room.num)" 
              class="btn-book"
              :disabled="room.status !== 'свободна'"
            >
              Забронировать
            </button>
          </div>
        </div>

        <div v-if="rooms.length === 0" class="no-rooms">
          <p>Комнаты не найдены</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authApi, roomApi } from '@/api';
import type { RoomData, UserProfile } from '@/types';

const router = useRouter();

const rooms = ref<RoomData[]>([]);
const bookingDate = ref('');
const loading = ref(false);
const user = ref<UserProfile | null>(null);

const userName = ref('Пользователь');

const loadUserProfile = async () => {
  try {
    user.value = await authApi.getCurrentUser();
    if (user.value) {
      userName.value = user.value.fio;
    }
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  }
};

const loadAvailableRooms = async () => {
  loading.value = true;
  try {
    const login = localStorage.getItem('login');
    if (login) {
      rooms.value = await roomApi.getAvailableRooms(login);
    }
  } catch (error) {
    console.error('Ошибка загрузки комнат:', error);
  } finally {
    loading.value = false;
  }
};

const bookRoom = async (roomNum: number) => {
  if (!bookingDate.value) {
    alert('Пожалуйста, выберите дату бронирования');
    return;
  }

  try {
    const login = localStorage.getItem('login');
    if (!login) {
      throw new Error('Необходимо войти в систему');
    }
    
    await roomApi.bookRoom(login, roomNum, bookingDate.value);
    alert('Комната успешно забронирована!');
    loadAvailableRooms();
  } catch (error: unknown) {
    console.error('Ошибка бронирования:', error);
    if (error instanceof Error) {
      alert(error.message || 'Не удалось забронировать комнату');
    } else {
      alert('Не удалось забронировать комнату');
    }
  }
};

const handleLogout = async () => {
  await authApi.logout();
  router.push('/login');
};

onMounted(() => {
  loadUserProfile();
  loadAvailableRooms();
});
</script>

<style scoped>
.user-menu {
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

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-section h2 {
  color: #1a1a2e;
  font-size: 32px;
  margin-bottom: 10px;
}

.welcome-section p {
  color: #666;
  font-size: 18px;
}

.rooms-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #4a4a68;
  font-size: 14px;
}

.filter-group input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.btn-search {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  transition: transform 0.2s;
}

.btn-search:hover {
  transform: translateY(-2px);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.room-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.room-header h3 {
  margin: 0;
  color: #1a1a2e;
  font-size: 20px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.available {
  background: #d4edda;
  color: #155724;
}

.status-badge.busy {
  background: #f8d7da;
  color: #721c24;
}

.room-description {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.room-details {
  margin-bottom: 16px;
}

.detail-item {
  display: inline-block;
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 12px;
}

.equipment {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.equipment-tag {
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.btn-book {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-book:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-book:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-rooms {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
