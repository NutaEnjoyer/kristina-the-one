import { useState, useRef, useEffect } from 'react'
import './LetterPage.css'
import { letters } from '../letterText'
import { logLetterOpen, logButtonClick } from '../utils/logger'

// Полноэкранная страница письма
export function LetterPageFull({ onClose, onShowFlowers }) {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const containerRef = useRef(null)

  // Обработчик открытия письма с логированием
  const handleLetterOpen = (letter) => {
    setSelectedLetter(letter)
    logLetterOpen(letter.id, letter.title)
  }

  // Скроллим в начало при смене письма
  useEffect(() => {
    if (selectedLetter && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedLetter])

  // Если письмо выбрано, показываем его
  if (selectedLetter) {
    // Находим индекс текущего письма
    const currentIndex = letters.findIndex(l => l.id === selectedLetter.id)
    const nextLetter = currentIndex < letters.length - 1 ? letters[currentIndex + 1] : null

    return (
      <div className="letter-page-full" ref={containerRef}>
        <div className="letter-full-container">
          <button className="back-btn" onClick={() => setSelectedLetter(null)}>
            ← К списку
          </button>

          <div className="letter-header">
            <h1 className="letter-title">{selectedLetter.title}</h1>
            {selectedLetter.tag && <span className="letter-tag">{selectedLetter.tag}</span>}
          </div>
          {selectedLetter.date && <p className="letter-full-date">{selectedLetter.date}</p>}

          <div className="letter-full-text">
            {selectedLetter.text.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>

          {/* Кнопка перехода к следующему письму */}
          {nextLetter && (
            <button
              className="next-letter-btn"
              onClick={() => handleLetterOpen(nextLetter)}
            >
              Следующая запись →
            </button>
          )}
        </div>
      </div>
    )
  }

  // Иначе показываем список писем
  return (
    <div className="letter-page-full">
      <div className="letter-full-container">
        <h1 className="letter-title">Дневник</h1>
        <p className="letter-subtitle">Просто мои мысли без нейронок и прочего. Оставлю их здесь.</p>

        <div className="letters-list">
          {letters.map(letter => (
            <button
              key={letter.id}
              className="letter-item"
              onClick={() => handleLetterOpen(letter)}
            >
              <span className="letter-number">{letter.id}</span>
              <div className="letter-item-content">
                <span className="letter-item-title">{letter.title}</span>
                {letter.tag && <span className="letter-tag-small">{letter.tag}</span>}
              </div>
              {letter.date && <span className="letter-date">{letter.date}</span>}
              <span className="letter-arrow">→</span>
            </button>
          ))}
        </div>

        <button className="flowers-btn" onClick={() => {
          logButtonClick('Выбрать цветы', {
            source: 'letter-page',
            lettersViewed: letters.length
          })
          onShowFlowers()
        }}>
          Выбрать цветы 🌸
        </button>
      </div>
    </div>
  )
}

// Модальное окно (старое, на случай если понадобится)
function LetterPage({ onClose }) {
  return (
    <div className="letter-page">
      <div className="letter-page-overlay" onClick={onClose} />

      <div className="letter-page-content">
        <button className="close-letter-btn" onClick={onClose}>
          ✕
        </button>

        <div className="letter-page-text">
          {letterText.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LetterPage
