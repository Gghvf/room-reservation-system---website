<template>
  <div class="admin-users">
    <div class="page-header">
      <h2>Управление пользователями</h2>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="users.length === 0" class="no-data">
      <p>Пользователи не найдены</p>
    </div>

    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Login</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Телефон</th>
            <th>Кол-во</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.login">
            <td class="user-id">{{ user.login }}</td>
            <td>{{ user.fam }}</td>
            <td>{{ user.ima }}</td>
            <td>{{ user.otch }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.kolvo }}</td>
            <td>
              <span :class="['role-badge', user.isAdmin ? 'admin' : 'user']">
                {{ user.isAdmin ? 'Администратор' : 'Пользователь' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editUser(user)" class="btn-edit">✏️</button>
                <button 
                  v-if="!user.isAdmin"
                  @click="deleteUser(user.login)" 
                  class="btn-delete"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Edit -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>Редактировать пользователя</h3>
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label>Фамилия</label>
            <input type="text" v-model="formData.fam" required />
          </div>
          <div class="form-group">
            <label>Имя</label>
            <input type="text" v-model="formData.ima" required />
          </div>
          <div class="form-group">
            <label>Отчество</label>
            <input type="text" v-model="formData.otch" />
          </div>
          <div class="form-group">
            <label>Телефон</label>
            <input type="text" v-model="formData.phone" required />
          </div>
          <div class="form-group">
            <label>Кол-во</label>
            <input type="number" v-model.number="formData.kolvo" min="1" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Отмена</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userApi } from '@/api';
import type { User } from '@/types';

const users = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const showEditModal = ref(false);

const formData = ref<Partial<User>>({
  login: '',
  fam: '',
  ima: '',
  otch: '',
  phone: '',
  kolvo: 1,
  isAdmin: false,
});

const loadUsers = async () => {
  loading.value = true;
  try {
    // API не поддерживает получение всех пользователей
    users.value = [];
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    login: '',
    fam: '',
    ima: '',
    otch: '',
    phone: '',
    kolvo: 1,
    isAdmin: false,
  };
};

const editUser = (user: User) => {
  formData.value = { ...user };
  showEditModal.value = true;
};

const saveUser = async () => {
  saving.value = true;

  try {
    if (formData.value.login) {
      // Update not directly supported, using updateKolvo as example
      if (formData.value.kolvo !== undefined) {
        await userApi.updateKolvo(formData.value.login, formData.value.kolvo);
      }
      closeModal();
      loadUsers();
    }
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error);
    alert('Не удалось сохранить пользователя');
  } finally {
    saving.value = false;
  }
};

const deleteUser = async (userLogin: string) => {
  if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    return;
  }

  const adminLogin = localStorage.getItem('login') || '';
  
  try {
    await userApi.deleteUser(adminLogin, userLogin);
    loadUsers();
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    alert('Не удалось удалить пользователя');
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.admin-users {
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

.loading,
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #4a4a68;
  font-size: 14px;
}

.users-table td {
  color: #1a1a2e;
}

.user-id {
  font-family: monospace;
  color: #666;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
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

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-edit:hover {
  background: #e9ecef;
}

.btn-delete:hover {
  background: #fee;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin: 0 0 30px;
  color: #1a1a2e;
  font-size: 24px;
}

.modal-form {
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

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  background: #e9ecef;
  color: #666;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
