import './UNIPage.css'

export function UNIPage({ onBack }) {
  return (
    <div className="uni-page">
      <div className="uni-container">
        <button className="back-btn" onClick={onBack}>
          ← Назад
        </button>

        <header className="uni-header">
          <h1>UNI</h1>
          <p className="tagline">AI-powered assistant платформа</p>
        </header>

        <div className="uni-content">
          <section className="uni-section">
            <h2>О продукте</h2>
            <p>
              UNI - платформа для создания AI-ассистентов для бизнеса.
              Автоматизация поддержки, обработка запросов, интеграция с существующими системами.
            </p>
          </section>

          <section className="uni-section">
            <h2>Моя роль</h2>
            <div className="role-card">
              <h3>Late co-founder & Tech Lead</h3>
              <ul>
                <li>Full-stack разработка</li>
                <li>Архитектура и развитие продукта</li>
                <li>Управление технической командой</li>
              </ul>
            </div>
          </section>

          <section className="uni-section">
            <h2>Технологии</h2>
            <div className="tech-stack">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Python</span>
              <span className="tech-tag">PostgreSQL</span>
              <span className="tech-tag">Docker</span>
              <span className="tech-tag">OpenAI API</span>
            </div>
          </section>

          <section className="uni-section">
            <h2>Статус</h2>
            <div className="status-card">
              <div className="status-item">
                <span className="status-label">Запуск продаж:</span>
                <span className="status-value">19 декабря 2025</span>
              </div>
              <div className="status-item">
                <span className="status-label">Стадия:</span>
                <span className="status-value status-live">🟢 Продакшн</span>
              </div>
              <div className="status-item">
                <span className="status-label">Команда:</span>
                <span className="status-value">3 управляющих</span>
                <span className="status-value">9 членов команды</span>
              </div>
            </div>
          </section>

          <section className="uni-section milestone">
            <h2>Веха</h2>
            <blockquote>
              "19 декабря - день, когда я перестал быть просто разработчиком и стал предпринимателем."
            </blockquote>
          </section>
        </div>
      </div>
    </div>
  )
}
