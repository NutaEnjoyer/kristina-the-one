import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './FinalScene.css'
import { logButtonClick, logDeliveryChoice } from '../utils/logger'

function FinalScene() {
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
    { id: 'sunflowers', name: 'Подсолнухи' },
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
      <AnimatePresence mode="wait">
        {!showFlowerChoice && !showDeliveryChoice ? (
          <motion.div
            key="invitation"
            className="invitation"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="final-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Я рядом, когда ты будешь готова к спокойному и честному разговору
              <br />
              <span className="subtle">Всё в твоём темпе.</span>
            </motion.p>

            <motion.button
              className="take-flowers-btn"
              onClick={handleTakeFlowers}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 192, 203, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Получить цветы
            </motion.button>
          </motion.div>
        ) : showFlowerChoice ? (
          <motion.div
            key="flower-choice"
            className="flower-choice"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="flower-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Какие цветы ты хочешь?
            </motion.p>

            <motion.div
              className="flower-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {flowerOptions.map((flower, index) => (
                <motion.button
                  key={flower.id}
                  className="flower-btn"
                  onClick={() => handleFlowerChoice(flower)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 192, 203, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {flower.name}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : showDeliveryChoice && !showBouquet ? (
          <motion.div
            key="delivery-choice"
            className="delivery-choice"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="delivery-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Как ты хочешь получить цветы?
            </motion.p>

            <motion.div
              className="delivery-buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className="delivery-btn"
                onClick={() => handleDeliveryChoice('delivery')}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 192, 203, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Доставка
              </motion.button>
              <motion.button
                className="delivery-btn"
                onClick={() => handleDeliveryChoice('personal')}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 192, 203, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Лично
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            className="thanks-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence>
              {showThanks && (
                <motion.div
                  className="thanks-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <p>Спасибо.</p>
                  <p className="respect">Я уважаю твоё пространство.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FinalScene
