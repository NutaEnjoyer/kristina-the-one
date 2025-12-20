import { useState } from 'react'
import './HomePage.css'

export function HomePage({ onNavigate }) {
  const [showQuote, setShowQuote] = useState(false)

  const quotes = [
    {
      text: "Если не ты, то кто-то другой. Почему не ты? Ты в триллион раз лучше.",
      author: ""
    }
  ]

  // Получаем цитату дня на основе даты
  const getTodayQuote = () => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    return quotes[dayOfYear % quotes.length]
  }

  const todayQuote = getTodayQuote()

  const menuItems = [
    {
      id: 'diary',
      title: 'Дневник',
      icon: '/icons/book-svgrepo-com.svg',
      description: 'Мысли и размышления'
    },
    {
      id: 'schedule',
      title: 'Распорядок',
      icon: '/icons/align-text-left-svgrepo-com.svg',
      description: 'Структура дня'
    },
    {
      id: 'music',
      title: 'Музыка',
      icon: '/icons/music-svgrepo-com.svg',
      description: 'Треки и вдохновение'
    },
    {
      id: 'uni',
      title: 'UNI',
      icon: '/icons/target-arrow-svgrepo-com.svg',
      description: 'О компании и продукте'
    }
  ]

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <h1 className="home-title">Макс</h1>
          <p className="home-subtitle">Chaque jour est une création</p>
        </header>

        <button className="quote-btn" onClick={() => setShowQuote(true)}>
          💭 Цитата дня
        </button>

        <nav className="home-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => onNavigate(item.id)}
            >
              <img src={item.icon} alt={item.title} className="menu-icon" />
              <h2 className="menu-title">{item.title}</h2>
            </button>
          ))}
        </nav>

        <footer className="home-footer">
          <p>Обновлено: {new Date().toLocaleDateString('ru-RU')}</p>
        </footer>
      </div>

      {showQuote && (
        <div className="modal-overlay" onClick={() => setShowQuote(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQuote(false)}>
              ✕
            </button>
            <h2 className="modal-title">Цитата дня</h2>
            <blockquote className="quote-text">
              "{todayQuote.text}"
            </blockquote>
            <p className="quote-author">— {todayQuote.author}</p>
          </div>
        </div>
      )}
    </div>
  )
}
