import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './FinalScene.css'

function FinalScene() {
  const [showDeliveryChoice, setShowDeliveryChoice] = useState(false)
  const [showBouquet, setShowBouquet] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('')

  const handleTakeFlowers = () => {
    setShowDeliveryChoice(true)
  }

  const handleDeliveryChoice = async (method) => {
    setDeliveryMethod(method)

    // Отправляем уведомление в Telegram
    const botToken = '8274559349:AAF0sxzIsm3BMdc8geKllXSRed6xihkK9V4'
    const chatId = '5344758315'
    const methodText = method === 'delivery' ? 'Доставка' : 'Лично'
    const message = `🌸 Цветы приняты!\n\nСпособ получения: ${methodText}\nВремя: ${new Date().toLocaleString('ru-RU')}`

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      })
    } catch (error) {
      console.log('Telegram notification failed:', error)
      // Продолжаем работу даже если уведомление не отправилось
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
        {!showDeliveryChoice ? (
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
              Забрать цветы
            </motion.button>
          </motion.div>
        ) : !showBouquet ? (
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
