import { useState } from 'react'
import './SchedulePage.css'

export function SchedulePage({ onBack }) {
  const [isEvenDay, setIsEvenDay] = useState(true) // true = четный, false = нечетный

  // Четный день (с залом)
  const evenDaySchedule = [
    { id: 1, time: '06:00', title: 'Подъем', description: 'Ранний старт' },
    { id: 2, time: '06:15', title: 'Зарядка и душ', description: 'Разминка, легкая активность, холодный душ' },
    { id: 3, time: '07:00', title: 'Завтрак', description: 'Кофе, питательный завтрак' },
    { id: 4, time: '07:30', title: 'Планирование', description: 'Быстро накидать задачи на день' },
    { id: 5, time: '07:45', title: 'Чтение', description: 'Художественная литература или учебник' },
    { id: 6, time: '08:45', title: 'Deep work 1.1', description: 'Первая рабочая сессия' },
    { id: 7, time: '10:30', title: 'Прогулка', description: 'Короткий перерыв, размяться' },
    { id: 8, time: '11:00', title: 'Deep work 1.2', description: 'Продолжение первой сессии' },
    { id: 9, time: '12:00', title: 'Зал', description: 'Полноценная тренировка' },
    { id: 10, time: '13:30', title: 'Обед', description: 'Плотный прием пищи, много белка' },
    { id: 11, time: '14:30', title: 'Английский', description: 'Сериал, книга, видеоурок' },
    { id: 12, time: '15:30', title: 'Свободный блок', description: 'Внеплановые, незапланированные дела' },
    { id: 13, time: '16:00', title: 'Deep work 2', description: 'Вторая рабочая сессия' },
    { id: 14, time: '19:00', title: 'Мелкие дела', description: 'Убраться дома, вынести мусор, сходить в магазин' },
    { id: 15, time: '19:30', title: 'Ужин', description: 'Легкое второе, овощи, фрукты' },
    { id: 16, time: '20:00', title: 'Творчество', description: 'Дневник, канал, общение' },
    { id: 17, time: '21:00', title: 'Свободное время', description: 'Фильмы, чтение, ютуб' },
    { id: 18, time: '23:00', title: 'Сон', description: '7 часов здорового сна' }
  ]

  // Нечетный день (без зала)
  const oddDaySchedule = [
    { id: 1, time: '06:00', title: 'Подъем', description: 'Ранний старт' },
    { id: 2, time: '06:15', title: 'Зарядка и душ', description: 'Разминка, легкая активность, холодный душ' },
    { id: 3, time: '07:00', title: 'Завтрак', description: 'Кофе, питательный завтрак' },
    { id: 4, time: '07:30', title: 'Планирование', description: 'Быстро накидать задачи на день' },
    { id: 5, time: '07:45', title: 'Чтение', description: 'Художественная литература или учебник' },
    { id: 6, time: '08:45', title: 'Deep work 1.1', description: 'Первая рабочая сессия' },
    { id: 7, time: '10:30', title: 'Прогулка', description: 'Короткий перерыв, размяться' },
    { id: 8, time: '11:00', title: 'Deep work 1.2', description: 'Продолжение первой сессии' },
    { id: 9, time: '12:00', title: 'Обед', description: 'Плотный прием пищи, много белка' },
    { id: 10, time: '13:00', title: 'Французский', description: 'Учебник и практика' },
    { id: 11, time: '13:30', title: 'Свободный блок', description: 'Внеплановые, незапланированные дела' },
    { id: 12, time: '14:00', title: 'Deep work 2', description: 'Вторая рабочая сессия' },
    { id: 13, time: '17:30', title: 'Мелкие дела', description: 'Убраться дома, вынести мусор, сходить в магазин' },
    { id: 14, time: '18:30', title: 'Социальный блок', description: 'Прогулки с друзьями, созвоны, родители' },
    { id: 15, time: '19:30', title: 'Ужин', description: 'Легкое второе, овощи, фрукты' },
    { id: 16, time: '20:00', title: 'Изучение Go', description: 'Книги, практика' },
    { id: 17, time: '21:00', title: 'Творчество', description: 'Дневник, канал, общение' },
    { id: 18, time: '22:00', title: 'Свободное время', description: 'Шахматы, фильм, чтение' },
    { id: 19, time: '23:00', title: 'Сон', description: '7 часов здорового сна' }
  ]

  const currentSchedule = isEvenDay ? evenDaySchedule : oddDaySchedule

  return (
    <div className="schedule-page">
      <div className="schedule-container">
        <button className="back-btn" onClick={onBack}>
          ← Назад
        </button>

        <header className="schedule-header">
          <h1>Распорядок дня</h1>
          <p>Структура дня. Доступна с любого устройства</p>
        </header>

        <div className="day-toggle">
          <button
            className={`toggle-btn ${isEvenDay ? 'active' : ''}`}
            onClick={() => setIsEvenDay(true)}
          >
            Четный день
          </button>
          <button
            className={`toggle-btn ${!isEvenDay ? 'active' : ''}`}
            onClick={() => setIsEvenDay(false)}
          >
            Нечетный день
          </button>
        </div>

        <div className="schedule-list">
          {currentSchedule.length === 0 ? (
            <div className="empty-state">
              <p>Распорядок пока не заполнен</p>
              <p className="empty-hint">Добавьте элементы в массив {isEvenDay ? 'evenDaySchedule' : 'oddDaySchedule'}</p>
            </div>
          ) : (
            currentSchedule.map(item => (
              <div key={item.id} className="schedule-item">
                <span className="schedule-time">{item.time}</span>
                <div className="schedule-content">
                  <span className="schedule-title">{item.title}</span>
                  {item.description && (
                    <span className="schedule-description">{item.description}</span>
                  )}
                </div>
                <span className="schedule-arrow">→</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
