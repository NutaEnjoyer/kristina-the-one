import { useState } from 'react'
import './HomePage.css'

export function HomePage({ onNavigate }) {
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
    </div>
  )
}
