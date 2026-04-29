<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin/rooms" class="nav-item" active-class="active">
          <span class="icon">🏢</span>
          Комнаты
        </router-link>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <span class="icon">👥</span>
          Пользователи
        </router-link>
        <router-link to="/admin/create-admin" class="nav-item" active-class="active">
          <span class="icon">🔐</span>
          Создать админа
        </router-link>
        <router-link to="/" class="nav-item">
          <span class="icon">🏠</span>
          На главную
        </router-link>
        <button @click="handleLogout" class="nav-item logout-btn">
          <span class="icon">🚪</span>
          Выйти
        </button>
      </nav>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <h1>Панель администратора</h1>
        <div class="user-info">
          <span>{{ userName }}</span>
        </div>
      </header>

      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.user?.fio || 'Администратор');

const handleLogout = () => {
  authStore.logout(); 
  localStorage.removeItem('userLogin');
  router.push('/login');
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  color: white;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 15px;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-left: 4px solid white;
}

.nav-item .icon {
  font-size: 20px;
}

.logout-btn {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.top-bar h1 {
  margin: 0;
  font-size: 24px;
  color: #1a1a2e;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info span {
  color: #666;
  font-weight: 500;
}

.content-area {
  padding: 40px;
  flex: 1;
}
</style>
