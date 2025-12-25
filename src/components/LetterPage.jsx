import { useState, useRef, useEffect } from 'react'
import './LetterPage.css'
import { letters as fallbackLetters } from '../letterText'
import { logLetterOpen, logButtonClick } from '../utils/logger'
// import { lettersApi } from '../api/lettersApi' // Для будущего использования с API
// import { LetterForm } from './LetterForm' // Для будущего использования с API

// Полноэкранная страница письма
export function LetterPageFull({ onClose, onShowFlowers, onBack }) {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [reversed, setReversed] = useState(false) // Флаг реверса
  // const [error, setError] = useState(null) // Не используется при локальной загрузке
  // const [showForm, setShowForm] = useState(false) // Для будущего CRUD
  // const [editingLetter, setEditingLetter] = useState(null) // Для будущего CRUD
  const containerRef = useRef(null)

  // Состояния для механики пароля
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [pendingLetter, setPendingLetter] = useState(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  // Функция для сортировки писем (закрепленные всегда сверху)
  const sortLetters = (lettersArray) => {
    return [...lettersArray].sort((a, b) => {
      // Закрепленные письма всегда сверху
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      // Для остальных сохраняем текущий порядок
      return 0
    })
  }

  // Загрузка писем из локального файла (пока без API)
  useEffect(() => {
    setLetters(sortLetters(fallbackLetters))
    setLoading(false)
  }, [])

  // Функция переворота списка
  const toggleReverse = () => {
    // Разделяем закрепленные и обычные письма
    const pinnedLetters = letters.filter(l => l.pinned)
    const regularLetters = letters.filter(l => !l.pinned)

    // Переворачиваем только обычные письма
    const reversedRegular = [...regularLetters].reverse()

    // Закрепленные всегда остаются сверху
    setLetters([...pinnedLetters, ...reversedRegular])
    setReversed(!reversed)

    // Логируем переключение сортировки
    logButtonClick(reversed ? 'Новые сверху' : 'Старые сверху', {
      source: 'diary-sort',
      totalLetters: letters.length
    })
  }

  // Закомментировано - для будущего использования с API
  /*
  const loadLetters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await lettersApi.getAll()
      // Сортируем по ID (новые вверху)
      setLetters(data.sort((a, b) => b.id - a.id))
    } catch (err) {
      console.error('Failed to load letters:', err)
      setError('Не удалось загрузить записи. Используем локальные данные.')
      setLetters(fallbackLetters)
    } finally {
      setLoading(false)
    }
  }
  */

  // CRUD функции закомментированы - используем только локальные данные
  /*
  const handleCreateLetter = () => {
    setEditingLetter(null)
    setShowForm(true)
  }

  const handleEditLetter = (letter) => {
    setEditingLetter(letter)
    setShowForm(true)
  }

  const handleDeleteLetter = async (letterId) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
      return
    }

    try {
      await lettersApi.delete(letterId)
      await loadLetters()
      if (selectedLetter?.id === letterId) {
        setSelectedLetter(null)
      }
    } catch (err) {
      console.error('Failed to delete letter:', err)
      alert('Не удалось удалить запись')
    }
  }

  const handleSaveLetter = async (formData) => {
    try {
      if (editingLetter) {
        await lettersApi.update(editingLetter.id, formData)
      } else {
        await lettersApi.create(formData)
      }
      await loadLetters()
      setShowForm(false)
      setEditingLetter(null)
    } catch (err) {
      console.error('Failed to save letter:', err)
      alert('Не удалось сохранить запись')
    }
  }
  */

  // Обработчик открытия письма с логированием
  const handleLetterOpen = (letter) => {
    // Если у письма есть пароль, показываем модальное окно
    if (letter.password) {
      setPendingLetter(letter)
      setShowPasswordModal(true)
      setPasswordInput('')
      setPasswordError(false)

      // Логируем попытку открыть защищенную запись
      logButtonClick('Попытка открыть защищенную запись', {
        source: 'diary-password',
        letterId: letter.id,
        letterTitle: letter.title
      })
    } else {
      setSelectedLetter(letter)
      logLetterOpen(letter.id, letter.title)
    }
  }

  // Проверка пароля
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordInput === pendingLetter.password) {
      // Успешный вход
      logButtonClick('Успешный ввод пароля', {
        source: 'diary-password',
        letterId: pendingLetter.id,
        letterTitle: pendingLetter.title,
        status: 'success'
      })

      setSelectedLetter(pendingLetter)
      logLetterOpen(pendingLetter.id, pendingLetter.title)
      setShowPasswordModal(false)
      setPendingLetter(null)
      setPasswordInput('')
      setPasswordError(false)
    } else {
      // Неудачная попытка
      logButtonClick('Неверный пароль', {
        source: 'diary-password',
        letterId: pendingLetter.id,
        letterTitle: pendingLetter.title,
        status: 'failed',
        attemptedPassword: passwordInput.replace(/./g, '*') // Маскируем пароль звездочками
      })

      setPasswordError(true)
    }
  }

  // Закрытие модального окна пароля
  const handlePasswordModalClose = () => {
    setShowPasswordModal(false)
    setPendingLetter(null)
    setPasswordInput('')
    setPasswordError(false)
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
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Назад
          </button>
        )}

        <div className="diary-header">
          <div>
            <h1 className="letter-title">Дневник</h1>
            <p className="letter-subtitle">Просто мои мысли без нейронок и прочего. Оставлю их здесь.</p>
          </div>
          <button className="reverse-btn" onClick={toggleReverse}>
            {reversed ? '↓ Новые сверху' : '↑ Старые сверху'}
          </button>
        </div>

          <div className="letters-list">
            {letters.map(letter => (
              <button
                key={letter.id}
                className={`letter-item ${letter.pinned ? 'pinned' : ''}`}
                onClick={() => handleLetterOpen(letter)}
              >
                <span className="letter-number">{letter.id}</span>
                <div className="letter-item-content">
                  <span className="letter-item-title">
                    {letter.pinned && <span className="pin-icon">📌 </span>}
                    {letter.title}
                    {letter.password && (
                      <img
                        src="/icons/lock-svgrepo-com.svg"
                        alt="Защищено"
                        className="lock-icon"
                      />
                    )}
                    {letter.inProgress && <span className="writing-status"> • Пишется...</span>}
                  </span>
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

      {/* Модальное окно для ввода пароля */}
      {showPasswordModal && (
        <div className="password-modal-overlay" onClick={handlePasswordModalClose}>
          <div className="password-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="password-modal-close" onClick={handlePasswordModalClose}>
              ✕
            </button>
            <h2 className="password-modal-title">Защищенная запись</h2>
            <p className="password-modal-hint">
              {pendingLetter?.passwordHint || 'Введите пароль для доступа к записи'}
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                className={`password-input ${passwordError ? 'error' : ''}`}
                placeholder="Пароль"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setPasswordError(false)
                }}
                autoFocus
              />
              {passwordError && (
                <p className="password-error-text">Неверный пароль</p>
              )}
              <button type="submit" className="password-submit-btn">
                Открыть
              </button>
            </form>
          </div>
        </div>
      )}
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
