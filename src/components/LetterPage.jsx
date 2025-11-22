import { useState } from 'react'
import './LetterPage.css'
import { letterText } from '../letterText'

// Полноэкранная страница письма
export function LetterPageFull({ onClose }) {
  return (
    <div className="letter-page-full">
      <div className="letter-full-container">
        <button className="back-btn" onClick={onClose}>
          ← Назад
        </button>

        <h1 className="letter-title">Моё письмо</h1>

        <div className="letter-full-text">
          {letterText.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
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
