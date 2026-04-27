<template>
  <div class="create-admin">
    <div class="page-header">
      <h2>Создание учетной записи администратора</h2>
    </div>

    <div class="form-card">
      <form @submit.prevent="handleCreate" class="admin-form">
        <div class="form-group">
          <label for="name">Имя</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            placeholder="Введите имя"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            placeholder="••••••••"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Подтвердите пароль</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Создание...' : 'Создать администратора' }}
        </button>
      </form>

      <div class="info-section">
        <h3>Информация</h3>
        <p>
          Создаваемая учетная запись будет иметь права администратора системы.
          Администратор может:
        </p>
        <ul>
          <li>Управлять комнатами (создавать, редактировать, удалять)</li>
          <li>Управлять пользователями</li>
          <li>Создавать новых администраторов</li>
          <li>Просматривать все бронирования</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { adminApi } from '@/api';
import type { CreateAdminRequest } from '@/types';

const formData = ref<CreateAdminRequest>({
  name: '',
  email: '',
  password: '',
});

const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleCreate = async () => {
  if (formData.value.password !== confirmPassword.value) {
    error.value = 'Пароли не совпадают';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await adminApi.createAdmin(formData.value);
    success.value = 'Администратор успешно создан!';
    
    // Reset form
    formData.value = {
      name: '',
      email: '',
      password: '',
    };
    confirmPassword.value = '';
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message || 'Ошибка создания администратора';
    } else {
      error.value = 'Ошибка создания администратора';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-admin {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0;
  color: #1a1a2e;
  font-size: 24px;
}

.form-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  padding: 12px;
  background: #fee;
  color: #c00;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  padding: 12px;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.info-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.info-section h3 {
  margin: 0 0 16px;
  color: #1a1a2e;
  font-size: 18px;
}

.info-section p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.info-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-section li {
  padding: 8px 0;
  color: #4a4a68;
  position: relative;
  padding-left: 24px;
}

.info-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

@media (max-width: 768px) {
  .form-card {
    grid-template-columns: 1fr;
  }
}
</style>
