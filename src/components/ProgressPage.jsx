import './ProgressPage.css'

export function ProgressPage({ onBack }) {
  const progressData = [
    {
      category: 'Здоровье',
      items: [
        { label: 'Зал', value: '42 тренировки', progress: 70 },
        { label: 'Курение', value: '30+ дней без сигарет', progress: 100 },
        { label: 'Режим сна', value: '8 часов стабильно', progress: 85 }
      ]
    },
    {
      category: 'Навыки',
      items: [
        { label: 'Французский', value: '150+ слов', progress: 30 },
        { label: 'Шахматы', value: '1100 → 1600 ELO', progress: 60 },
        { label: 'Go (язык)', value: 'Junior уровень', progress: 40 }
      ]
    },
    {
      category: 'Карьера',
      items: [
        { label: 'UNI', value: 'Получил долю в компании', progress: 100 },
        { label: 'Проекты', value: '3 активных проекта', progress: 75 },
        { label: 'Навыки', value: 'Full-stack разработчик', progress: 80 }
      ]
    },
    {
      category: 'Личное',
      items: [
        { label: 'Дневник', value: '35+ записей', progress: 100 },
        { label: 'Психолог', value: '4 сессии', progress: 20 },
        { label: 'Дисциплина', value: 'Каждый день', progress: 90 }
      ]
    }
  ]

  return (
    <div className="progress-page">
      <div className="progress-container">
        <button className="back-btn" onClick={onBack}>
          ← Назад
        </button>

        <header className="progress-header">
          <h1>📊 Прогресс</h1>
          <p>Трекинг изменений за последний месяц</p>
        </header>

        <div className="progress-sections">
          {progressData.map((section, idx) => (
            <div key={idx} className="progress-section">
              <h2 className="section-title">{section.category}</h2>
              <div className="progress-items">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="progress-item">
                    <div className="item-header">
                      <span className="item-label">{item.label}</span>
                      <span className="item-value">{item.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="summary">
          <h3>Итого</h3>
          <p>Месяц изменений. Системная работа над собой.</p>
          <p className="date">Начало: 21.11.2024</p>
        </div>
      </div>
    </div>
  )
}
