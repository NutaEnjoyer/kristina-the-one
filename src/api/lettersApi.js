const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const lettersApi = {
  // Получить все письма
  async getAll() {
    const response = await fetch(`${API_URL}/letters`);
    if (!response.ok) {
      throw new Error(`Failed to fetch letters: ${response.status}`);
    }
    return response.json();
  },

  // Получить одно письмо по ID
  async getById(id) {
    const response = await fetch(`${API_URL}/letters/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch letter: ${response.status}`);
    }
    return response.json();
  },

  // Создать новое письмо
  async create(letter) {
    const response = await fetch(`${API_URL}/letters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(letter),
    });
    if (!response.ok) {
      throw new Error(`Failed to create letter: ${response.status}`);
    }
    return response.json();
  },

  // Обновить письмо
  async update(id, letter) {
    const response = await fetch(`${API_URL}/letters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(letter),
    });
    if (!response.ok) {
      throw new Error(`Failed to update letter: ${response.status}`);
    }
    return response.json();
  },

  // Удалить письмо
  async delete(id) {
    const response = await fetch(`${API_URL}/letters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete letter: ${response.status}`);
    }
  },
};
