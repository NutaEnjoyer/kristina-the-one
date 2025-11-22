import { useState } from 'react'
import './LetterPage.css'
import { letters } from '../letterText'
import { logLetterOpen } from '../utils/logger'

// Полноэкранная страница письма
export function LetterPageFull({ onClose }) {
  const [selectedLetter, setSelectedLetter] = useState(null)

  // Обработчик открытия письма с логированием
  const handleLetterOpen = (letter) => {
    setSelectedLetter(letter)
    logLetterOpen(letter.id, letter.title)
  }

  // Если письмо выбрано, показываем его
  if (selectedLetter) {
    return (
      <div className="letter-page-full">
        <div className="letter-full-container">
          <button className="back-btn" onClick={() => setSelectedLetter(null)}>
            ← К списку
          </button>

          <h1 className="letter-title">{selectedLetter.title}</h1>

          <div className="letter-full-text">
            {selectedLetter.text.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Иначе показываем список писем
  return (
    <div className="letter-page-full">
      <div className="letter-full-container">
        <button className="back-btn" onClick={onClose}>
          ← Назад
        </button>

        <h1 className="letter-title">Мои письма</h1>

        <div className="letters-list">
          {letters.map(letter => (
            <button
              key={letter.id}
              className="letter-item"
              onClick={() => handleLetterOpen(letter)}
            >
              <span className="letter-number">{letter.id}</span>
              <span className="letter-item-title">{letter.title}</span>
              <span className="letter-arrow">→</span>
            </button>
          ))}
        </div>
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
