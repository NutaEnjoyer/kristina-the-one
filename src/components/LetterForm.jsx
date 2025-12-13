import { useState } from 'react'
import './LetterForm.css'

export function LetterForm({ letter, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: letter?.title || '',
    text: letter?.text || '',
    date: letter?.date || '',
    tag: letter?.tag || '',
    inProgress: letter?.inProgress || false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="letter-form-overlay" onClick={onCancel}>
      <div className="letter-form-container" onClick={(e) => e.stopPropagation()}>
        <h2>{letter ? 'Редактировать запись' : 'Новая запись'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Введите название"
              required
            />
          </div>

          <div className="form-group">
            <label>Текст</label>
            <textarea
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Введите текст записи"
              rows="15"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Дата</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                placeholder="11 июня 2024"
              />
            </div>

            <div className="form-group">
              <label>Тег</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => handleChange('tag', e.target.value)}
                placeholder="философия"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.inProgress}
                onChange={(e) => handleChange('inProgress', e.target.checked)}
              />
              Пишется...
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Отмена
            </button>
            <button type="submit" className="btn-save">
              {letter ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
