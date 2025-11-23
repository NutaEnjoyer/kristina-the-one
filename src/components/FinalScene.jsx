import { useState } from 'react'
import './FinalScene.css'
import { logButtonClick, logDeliveryChoice } from '../utils/logger'

function FinalScene({ onBack }) {
  const [showFlowerChoice, setShowFlowerChoice] = useState(false)
  const [showDeliveryChoice, setShowDeliveryChoice] = useState(false)
  const [showBouquet, setShowBouquet] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [selectedFlower, setSelectedFlower] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('')

  // Варианты цветов (минималистично, без эмодзи)
  const flowerOptions = [
    { id: 'roses', name: 'Розы' },
    { id: 'tulips', name: 'Тюльпаны' },
    { id: 'peonies', name: 'Пионы' },
    { id: 'lilies', name: 'Лилии' },
    { id: 'orchids', name: 'Орхидеи' },
    { id: 'daisies', name: 'Ромашки' },
    { id: 'lavender', name: 'Лаванда' },
    { id: 'surprise', name: 'Сюрприз' }
  ]

  const handleTakeFlowers = () => {
    try {
      logButtonClick('Получить цветы', {
        'Время на сайте': getSessionDuration()
      })
    } catch (error) {
      // Тихо игнорируем ошибки
    }
    setShowFlowerChoice(true)
  }

  const handleFlowerChoice = (flower) => {
    try {
      logButtonClick(`Выбор цветов: ${flower.name}`, {
        'Цветы': flower.name,
        'Время на сайте': getSessionDuration()
      })
    } catch (error) {
      // Тихо игнорируем ошибки
    }
    setSelectedFlower(flower)
    setShowFlowerChoice(false)
    setShowDeliveryChoice(true)
  }

  // Вспомогательная функция для получения длительности сессии
  const getSessionDuration = () => {
    try {
      const startTime = sessionStorage.getItem('session-start')
      if (!startTime) return 'неизвестно'
      const duration = Date.now() - parseInt(startTime)
      const minutes = Math.floor(duration / 60000)
      const seconds = Math.floor((duration % 60000) / 1000)
      if (minutes > 0) {
        return `${minutes} мин ${seconds} сек`
      }
      return `${seconds} сек`
    } catch (error) {
      return 'неизвестно'
    }
  }

  const handleDeliveryChoice = async (method) => {
    setDeliveryMethod(method)

    // Логируем выбор через новую систему логирования
    try {
      logDeliveryChoice(method)

      // Дополнительно логируем клик по кнопке
      const methodText = method === 'delivery' ? 'Доставка' : 'Лично'
      logButtonClick(`Выбор доставки: ${methodText}`, {
        'Способ': methodText,
        'Цветы': selectedFlower.name || 'Не выбрано',
        'Время на сайте': getSessionDuration()
      })
    } catch (error) {
      // Тихо игнорируем ошибки логирования
    }

    // Воспроизводим тихий звук колокольчика (если есть)
    try {
      const audio = new Audio('/bell.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Если звук не загрузился, просто продолжаем без него
      })
    } catch (e) {
      // Игнорируем ошибки со звуком
    }

    setShowBouquet(true)
    setTimeout(() => {
      setShowThanks(true)
    }, 1500)
  }

  return (
    <div className="final-scene">
      {!showFlowerChoice && !showDeliveryChoice ? (
        <div className="invitation">
          {onBack && (
            <button className="back-to-letters-btn" onClick={onBack}>
              ← К записям
            </button>
          )}

          <p className="final-message">
            Я рядом, когда ты будешь готова к спокойному и честному разговору
            <br />
            <span className="subtle">Всё в твоём темпе.</span>
          </p>

          <div className="photo-container">
            <img
              src="/our-photo.jpg"
              alt="Мы вместе"
              className="our-photo"
            />
          </div>

          <button
            className="take-flowers-btn"
            onClick={handleTakeFlowers}
          >
            Получить цветы
          </button>
        </div>
      ) : showFlowerChoice ? (
        <div className="flower-choice">
          <p className="flower-message">
            Какие цветы ты хочешь?
          </p>

          <div className="flower-grid">
            {flowerOptions.map((flower) => (
              <button
                key={flower.id}
                className="flower-btn"
                onClick={() => handleFlowerChoice(flower)}
              >
                {flower.name}
              </button>
            ))}
          </div>
        </div>
      ) : showDeliveryChoice && !showBouquet ? (
        <div className="delivery-choice">
          <p className="delivery-message">
            Как ты хочешь получить цветы?
          </p>

          <div className="delivery-buttons">
            <button
              className="delivery-btn"
              onClick={() => handleDeliveryChoice('delivery')}
            >
              Доставка
            </button>
            <button
              className="delivery-btn"
              onClick={() => handleDeliveryChoice('personal')}
            >
              Лично
            </button>
          </div>
        </div>
      ) : (
        <div className="thanks-container">
          {showThanks && (
            <div className="thanks-message">
              <p>Спасибо.</p>
              <p className="respect">Я люблю тебя.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FinalScene
