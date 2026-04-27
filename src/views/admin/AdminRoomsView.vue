<template>
  <div class="admin-rooms">
    <div class="page-header">
      <h2>Управление комнатами</h2>
      <button @click="showCreateModal = true" class="btn-create">+ Добавить комнату</button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="rooms.length === 0" class="no-data">
      <p>Комнаты не найдены</p>
    </div>

    <div v-else class="rooms-table-container">
      <table class="rooms-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Вместимость</th>
            <th>Оборудование</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.name }}</td>
            <td>{{ room.description }}</td>
            <td>{{ room.capacity }} чел.</td>
            <td>
              <div class="equipment-list">
                <span v-for="(item, idx) in room.equipment" :key="idx" class="equipment-tag">
                  {{ item }}
                </span>
              </div>
            </td>
            <td>
              <span :class="['status-badge', room.isAvailable ? 'available' : 'busy']">
                {{ room.isAvailable ? 'Свободна' : 'Занята' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editRoom(room)" class="btn-edit">✏️</button>
                <button @click="deleteRoom(room.id)" class="btn-delete">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Create/Edit -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <h3>{{ isEditing ? 'Редактировать комнату' : 'Новая комната' }}</h3>
        <form @submit.prevent="saveRoom" class="modal-form">
          <div class="form-group">
            <label>Название</label>
            <input type="text" v-model="formData.name" required />
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Вместимость</label>
            <input type="number" v-model.number="formData.capacity" min="1" required />
          </div>
          <div class="form-group">
            <label>Оборудование (через запятую)</label>
            <input type="text" v-model="equipmentInput" placeholder="Проектор, Доска, WiFi" />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formData.isAvailable" />
              Доступна для бронирования
            </label>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-cancel">Отмена</button>
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
import { roomApi } from '@/api';
import type { Room } from '@/types';

const rooms = ref<Room[]>([]);
const loading = ref(false);
const saving = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const isEditing = ref(false);

const formData = ref<Partial<Room>>({
  name: '',
  description: '',
  capacity: 1,
  equipment: [],
  isAvailable: true,
});

const equipmentInput = ref('');

const loadRooms = async () => {
  loading.value = true;
  try {
    rooms.value = await roomApi.getAllRooms();
  } catch (error) {
    console.error('Ошибка загрузки комнат:', error);
  } finally {
    loading.value = false;
  }
};

const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  isEditing.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    capacity: 1,
    equipment: [],
    isAvailable: true,
  };
  equipmentInput.value = '';
};

const editRoom = (room: Room) => {
  isEditing.value = true;
  formData.value = { ...room };
  equipmentInput.value = room.equipment.join(', ');
  showEditModal.value = true;
};

const saveRoom = async () => {
  saving.value = true;
  
  // Parse equipment
  formData.value.equipment = equipmentInput.value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  try {
    if (isEditing.value && formData.value.id) {
      await roomApi.updateRoom(formData.value.id, formData.value);
    } else {
      await roomApi.createRoom(formData.value);
    }
    
    closeModals();
    loadRooms();
  } catch (error) {
    console.error('Ошибка сохранения комнаты:', error);
    alert('Не удалось сохранить комнату');
  } finally {
    saving.value = false;
  }
};

const deleteRoom = async (roomId: string) => {
  if (!confirm('Вы уверены, что хотите удалить эту комнату?')) {
    return;
  }

  try {
    await roomApi.deleteRoom(roomId);
    loadRooms();
  } catch (error) {
    console.error('Ошибка удаления комнаты:', error);
    alert('Не удалось удалить комнату');
  }
};

onMounted(() => {
  loadRooms();
});
</script>

<style scoped>
.admin-rooms {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0;
  color: #1a1a2e;
  font-size: 24px;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-create:hover {
  transform: translateY(-2px);
}

.loading,
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.rooms-table-container {
  overflow-x: auto;
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
}

.rooms-table th,
.rooms-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.rooms-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #4a4a68;
  font-size: 14px;
}

.rooms-table td {
  color: #1a1a2e;
}

.equipment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.equipment-tag {
  background: #e9ecef;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
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

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
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
