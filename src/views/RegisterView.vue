<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Регистрация</h1>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="login">Логин</label>
          <input
            type="text"
            id="login"
            v-model="login"
            placeholder="Придумайте логин"
            required
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="fam">Фамилия</label>
            <input
              type="text"
              id="fam"
              v-model="fam"
              placeholder="Иванов"
              required
            />
          </div>
          <div class="form-group">
            <label for="ima">Имя</label>
            <input
              type="text"
              id="ima"
              v-model="ima"
              placeholder="Иван"
              required
            />
          </div>
          <div class="form-group">
            <label for="otch">Отчество</label>
            <input
              type="text"
              id="otch"
              v-model="otch"
              placeholder="Иванович"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="phone">Номер телефона</label>
          <input
            type="tel"
            id="phone"
            v-model="phone"
            placeholder="+7 (999) 000-00-00"
            required
          />
        </div>
        <div class="form-group">
          <label for="kolvo">Количество персон</label>
          <input
            type="number"
            id="kolvo"
            v-model.number="kolvo"
            min="1"
            max="50"
            placeholder="1"
            required
          />
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>
      <p class="auth-link">
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const login = ref('');
const fam = ref('');
const ima = ref('');
const otch = ref('');
const phone = ref('');
const kolvo = ref(1);
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (kolvo.value <= 0 || kolvo.value > 50) {
    error.value = 'Количество персон должно быть от 1 до 50';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = await authApi.register({
      login: login.value,
      fam: fam.value,
      ima: ima.value,
      otch: otch.value,
      phone: phone.value,
      kolvo: kolvo.value,
    });

    // Получаем данные профиля и обновляем хранилище
    const profile = await authApi.getCurrentUser();
    if (profile) {
      authStore.setLogin(login.value);
      authStore.setUser(profile);
    }

    router.push('/');
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message || 'Ошибка регистрации';
    } else {
      error.value = 'Ошибка регистрации';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  color: #1a1a2e;
  margin-bottom: 32px;
  font-size: 32px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #4a4a68;
  font-size: 14px;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #fee;
  color: #c00;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .auth-card {
    padding: 32px 24px;
  }
}
</style>