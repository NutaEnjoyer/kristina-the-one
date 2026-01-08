import { useState, useRef, useEffect } from 'react'
import './LetterPage.css'
import { letters as fallbackLetters, availableTags, tagMapping } from '../letterText'
import { logLetterOpen, logButtonClick } from '../utils/logger'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// import { lettersApi } from '../api/lettersApi' // Для будущего использования с API
// import { LetterForm } from './LetterForm' // Для будущего использования с API

// Полноэкранная страница письма
export function LetterPageFull({ onClose, onShowFlowers, onBack }) {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [reversed, setReversed] = useState(false) // Флаг реверса
  const [selectedTag, setSelectedTag] = useState('all') // Выбранный тег для фильтрации
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
        attemptedPassword: passwordInput // Маскируем пароль звездочками
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

  // Кастомный видео плеер
  const CustomVideoPlayer = ({ mediaItem }) => {
    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showControls, setShowControls] = useState(true)

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const handleVideoClick = () => {
      togglePlay()
    }

    return (
      <div
        className="custom-video-container"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(true)}
      >
        <video
          ref={videoRef}
          className="letter-media-video"
          preload="metadata"
          onClick={handleVideoClick}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster={mediaItem.thumbnail}
          loop
          playsInline
          webkit-playsinline="true"
        >
          <source src={mediaItem.url} type="video/mp4" />
        </video>

        {/* Кастомная кнопка play */}
        {!isPlaying && showControls && (
          <div className="video-play-overlay" onClick={togglePlay}>
            <div className="video-play-button">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="3" fill="rgba(0,0,0,0.6)"/>
                <path d="M32 25 L32 55 L55 40 Z" fill="white"/>
              </svg>
            </div>
          </div>
        )}

        {/* Индикатор паузы */}
        {isPlaying && showControls && (
          <div className="video-pause-indicator">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="18" y="15" width="8" height="30" fill="white" rx="2"/>
              <rect x="34" y="15" width="8" height="30" fill="white" rx="2"/>
            </svg>
          </div>
        )}
      </div>
    )
  }

  // Кастомный аудио плеер
  const CustomAudioPlayer = ({ mediaItem }) => {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    }

    const handleProgressClick = (e) => {
      if (audioRef.current) {
        const bounds = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - bounds.left
        const percentage = x / bounds.width
        audioRef.current.currentTime = percentage * duration
      }
    }

    const handleVolumeChange = (e) => {
      const newVolume = parseFloat(e.target.value)
      setVolume(newVolume)
      if (audioRef.current) {
        audioRef.current.volume = newVolume
      }
    }

    const formatTime = (seconds) => {
      if (isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <div className="custom-audio-container">
        <audio
          ref={audioRef}
          src={mediaItem.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="audio-controls">
          {/* Кнопка Play/Pause */}
          <button className="audio-play-btn" onClick={togglePlay}>
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="4" height="14" fill="currentColor" rx="1"/>
                <rect x="14" y="5" width="4" height="14" fill="currentColor" rx="1"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5 L8 19 L19 12 Z" fill="currentColor"/>
              </svg>
            )}
          </button>

          {/* Прогресс бар */}
          <div className="audio-progress-section">
            <span className="audio-time">{formatTime(currentTime)}</span>
            <div className="audio-progress-bar" onClick={handleProgressClick}>
              <div
                className="audio-progress-fill"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="audio-time">{formatTime(duration)}</span>
          </div>

          {/* Громкость */}
          <div className="audio-volume-section">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
              <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="audio-volume-slider"
            />
          </div>
        </div>
      </div>
    )
  }

  // Функции для рендеринга медиа
  const renderMediaItem = (mediaItem) => {
    if (mediaItem.type === 'image') {
      return (
        <div key={mediaItem.id} className="media-item media-image">
          <img
            src={mediaItem.url}
            alt={mediaItem.alt || mediaItem.caption || 'Image'}
            className="letter-media-img"
            loading="lazy"
          />
          {mediaItem.caption && <p className="media-caption">{mediaItem.caption}</p>}
        </div>
      )
    } else if (mediaItem.type === 'video') {
      return (
        <div key={mediaItem.id} className="media-item media-video">
          <CustomVideoPlayer mediaItem={mediaItem} />
          {mediaItem.caption && <p className="media-caption">{mediaItem.caption}</p>}
        </div>
      )
    } else if (mediaItem.type === 'audio') {
      return (
        <div key={mediaItem.id} className="media-item media-audio">
          <CustomAudioPlayer mediaItem={mediaItem} />
          {mediaItem.caption && <p className="media-caption">{mediaItem.caption}</p>}
        </div>
      )
    }
    return null
  }

  const renderMediaSection = (mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) return null
    return (
      <div className="letter-media-section">
        {mediaItems.map(mediaItem => renderMediaItem(mediaItem))}
      </div>
    )
  }

  const renderMediaGallery = (mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) return null
    return (
      <div className="letter-media-gallery">
        {mediaItems.map(mediaItem => renderMediaItem(mediaItem))}
      </div>
    )
  }

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

          {/* Медиа сверху */}
          {selectedLetter.media && renderMediaSection(selectedLetter.media.filter(m => m.position === 'top'))}

          <div className="letter-full-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedLetter.text}
            </ReactMarkdown>
          </div>

          {/* Медиа снизу */}
          {selectedLetter.media && renderMediaSection(selectedLetter.media.filter(m => m.position === 'bottom'))}

          {/* Галерея медиа */}
          {selectedLetter.media && renderMediaGallery(selectedLetter.media.filter(m => m.position === 'gallery'))}

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

  // Фильтрация писем по тегу
  const filteredLetters = letters.filter(letter => {
    if (selectedTag === 'all') return true
    const letterTagId = tagMapping[letter.tag] || 'other'
    return letterTagId === selectedTag
  })

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

        {/* Фильтр по тегам */}
        <div className="tag-filter-dropdown">
          <label htmlFor="tag-select" className="tag-filter-label">Фильтр:</label>
          <select
            id="tag-select"
            className="tag-select"
            value={selectedTag}
            onChange={(e) => {
              const newTag = e.target.value
              setSelectedTag(newTag)
              const tagName = availableTags.find(t => t.id === newTag)?.name || 'Все'
              logButtonClick(`Фильтр по тегу: ${tagName}`, {
                source: 'diary-tag-filter',
                tagId: newTag,
                tagName: tagName
              })
            }}
          >
            {availableTags.map(tag => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

          <div className="letters-list">
            {filteredLetters.map(letter => (
              <button
                key={letter.id}
                className={`letter-item ${letter.pinned ? 'pinned' : ''}`}
                onClick={() => handleLetterOpen(letter)}
              >
                <span className="letter-number">{letter.id}</span>
                <div className="letter-item-content">
                  <span className="letter-item-title">
                    {letter.pinned && (
                      <img
                        src="/icons/pin-svgrepo-com.svg"
                        alt="Закреплено"
                        className="pin-icon"
                      />
                    )}
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
