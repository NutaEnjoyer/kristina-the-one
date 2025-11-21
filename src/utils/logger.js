// Безопасная система логирования в Telegram
// Все ошибки логирования перехватываются и не влияют на работу приложения

const BOT_TOKEN = '8274559349:AAF0sxzIsm3BMdc8geKllXSRed6xihkK9V4'
const CHAT_ID = '5344758315'

// Хранение идентификатора сессии
let sessionId = null

// Получение идентификатора сессии
function getSessionId() {
  if (sessionId) return sessionId

  // Пытаемся получить из sessionStorage
  const stored = sessionStorage.getItem('session-id')
  if (stored) {
    sessionId = stored
    return sessionId
  }

  return 'pending' // Вернем "pending" пока IP не получен
}

// Установка идентификатора сессии
function setSessionId(ip) {
  try {
    // Создаем короткий хэш из IP + timestamp для уникальности
    const hash = ip.split('.').map(n => parseInt(n).toString(36)).join('')
    const timeHash = (Date.now() % 100000).toString(36)
    sessionId = `#${hash}${timeHash}`
    sessionStorage.setItem('session-id', sessionId)
    return sessionId
  } catch (error) {
    sessionId = `#${Math.random().toString(36).substr(2, 9)}`
    return sessionId
  }
}

// Debounce функция для ограничения частоты вызовов
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Базовая функция отправки сообщений в Telegram
async function sendToTelegram(message) {
  try {
    // Добавляем идентификатор сессии к каждому сообщению
    const id = getSessionId()
    const messageWithId = `${id} ${message}`

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageWithId,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    // Тихо игнорируем ошибки логирования, чтобы не ломать приложение
    console.error('Logger error:', error)
  }
}

// Получение информации об устройстве
function getDeviceInfo() {
  try {
    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)

    let os = 'Неизвестно'
    if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
    else if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'MacOS'
    else if (ua.includes('Linux')) os = 'Linux'

    let browser = 'Неизвестно'
    if (ua.includes('YaBrowser')) browser = 'Яндекс.Браузер'
    else if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
    else if (ua.includes('Edge')) browser = 'Edge'

    return {
      isMobile,
      os,
      browser,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      platform: navigator.platform
    }
  } catch (error) {
    return null
  }
}

// Логирование посещения сайта
export async function logVisit() {
  try {
    // Отправляем уведомление только один раз за сессию
    if (sessionStorage.getItem('visit-notified')) return

    let ip = 'Не удалось получить'
    let location = 'Не удалось определить'

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      ip = ipData.ip

      // Пытаемся получить геолокацию по IP
      try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
        const geoData = await geoResponse.json()
        if (geoData.city && geoData.country_name) {
          location = `${geoData.city}, ${geoData.country_name}`
        }
      } catch (error) {
        // Игнорируем ошибку геолокации
      }
    } catch (error) {
      // Игнорируем ошибку получения IP
    }

    const deviceInfo = getDeviceInfo()
    if (!deviceInfo) return

    const deviceType = deviceInfo.isMobile ? '📱 Мобильный' : '💻 Десктоп'

    // Определяем источник перехода
    const referrer = document.referrer || 'Прямой переход'
    const utmSource = new URLSearchParams(window.location.search).get('utm_source') || 'Нет'

    // Определяем touch screen
    const hasTouch = 'ontouchstart' in window ? 'Да' : 'Нет'

    // Определяем online/offline
    const isOnline = navigator.onLine ? 'Онлайн' : 'Оффлайн'

    // Ориентация экрана
    const orientation = window.screen.orientation?.type || 'Неизвестно'

    // Часовой пояс
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Устанавливаем идентификатор сессии на основе IP
    const sessionIdentifier = setSessionId(ip)

    const message = `🌸 НОВЫЙ ПОСЕТИТЕЛЬ!\n\n` +
      `🆔 ID: <b>${sessionIdentifier}</b>\n` +
      `⏰ Время: ${new Date().toLocaleString('ru-RU', { dateStyle: 'full', timeStyle: 'long' })}\n` +
      `🌍 IP: ${ip}\n` +
      `📍 Локация: ${location}\n` +
      `🕐 Часовой пояс: ${timezone}\n\n` +
      `${deviceType}\n` +
      `📱 ОС: ${deviceInfo.os}\n` +
      `🌐 Браузер: ${deviceInfo.browser}\n` +
      `📐 Разрешение: ${deviceInfo.screen}\n` +
      `🔄 Ориентация: ${orientation}\n` +
      `👆 Touch Screen: ${hasTouch}\n` +
      `🗣 Язык: ${deviceInfo.language}\n` +
      `💻 Платформа: ${deviceInfo.platform}\n` +
      `📶 Статус: ${isOnline}\n\n` +
      `🔗 Источник: ${referrer}\n` +
      `🏷 UTM Source: ${utmSource}`

    await sendToTelegram(message)
    sessionStorage.setItem('visit-notified', 'true')
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование выхода со страницы
export function logExit() {
  try {
    // Получаем последнюю активность
    const lastScene = sessionStorage.getItem('last-scene') || 'Неизвестно'
    const lastScroll = sessionStorage.getItem('last-scroll') || '0'
    const id = getSessionId()

    const message = `${id} 👋 ПОЛЬЗОВАТЕЛЬ ПОКИНУЛ САЙТ\n\n` +
      `⏰ Время выхода: ${new Date().toLocaleString('ru-RU')}\n` +
      `⌛ Время на сайте: ${getSessionDuration()}\n` +
      `📄 Последняя сцена: ${lastScene}\n` +
      `📜 Последний скролл: ${lastScroll}%\n` +
      `🔢 Всего визитов: ${parseInt(localStorage.getItem('total-visits') || '0') + 1}`

    // Увеличиваем счетчик визитов
    localStorage.setItem('total-visits', (parseInt(localStorage.getItem('total-visits') || '0') + 1).toString())

    // Используем sendBeacon для надежной отправки при закрытии страницы
    navigator.sendBeacon(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      new URLSearchParams({
        chat_id: CHAT_ID,
        text: message
      })
    )
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование изменения видимости вкладки
export function logVisibilityChange(isVisible) {
  try {
    const awayTime = sessionStorage.getItem('away-time')
    let timeAwayMsg = ''

    if (isVisible && awayTime) {
      const duration = Date.now() - parseInt(awayTime)
      const minutes = Math.floor(duration / 60000)
      const seconds = Math.floor((duration % 60000) / 1000)
      timeAwayMsg = `\n⏱ Был вне вкладки: ${minutes > 0 ? `${minutes} мин ${seconds} сек` : `${seconds} сек`}`
      sessionStorage.removeItem('away-time')
    } else if (!isVisible) {
      sessionStorage.setItem('away-time', Date.now().toString())
    }

    const message = isVisible
      ? `👁 ВЕРНУЛСЯ НА ВКЛАДКУ\n\n⏰ ${new Date().toLocaleString('ru-RU')}${timeAwayMsg}\n⌛ Общее время на сайте: ${getSessionDuration()}`
      : `🙈 УШЁЛ С ВКЛАДКИ\n\n⏰ ${new Date().toLocaleString('ru-RU')}\n⌛ Время на сайте: ${getSessionDuration()}\n📄 Текущая сцена: ${sessionStorage.getItem('last-scene') || 'Неизвестно'}`

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование скролла (с debounce)
let scrollStartTime = null
let lastScrollPosition = 0

export const logScroll = debounce((scrollProgress, currentScene) => {
  try {
    const currentPosition = Math.round(scrollProgress * 100)

    // Сохраняем последнюю позицию для логирования выхода
    sessionStorage.setItem('last-scroll', currentPosition.toString())

    // Логируем только значимые изменения (каждые 10%)
    if (Math.abs(currentPosition - lastScrollPosition) >= 10) {
      const direction = currentPosition > lastScrollPosition ? '⬇️ Вниз' : '⬆️ Вверх'
      const sceneName = currentScene >= 0 ? `Сцена ${currentScene + 1}` : 'Intro'

      const message = `📜 СКРОЛЛ: ${currentPosition}%\n\n` +
        `${direction}\n` +
        `📄 ${sceneName}\n` +
        `⏰ ${new Date().toLocaleString('ru-RU')}\n` +
        `⌛ Время на сайте: ${getSessionDuration()}`

      sendToTelegram(message)
      lastScrollPosition = currentPosition
    }
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}, 1000) // Отправляем не чаще раза в секунду

// Логирование клика по кнопке
export function logButtonClick(buttonName, additionalInfo = {}) {
  try {
    // Подсчитываем клики
    const clickCount = parseInt(sessionStorage.getItem('click-count') || '0') + 1
    sessionStorage.setItem('click-count', clickCount.toString())

    let message = `🔘 КЛИК ПО КНОПКЕ\n\n` +
      `🎯 Кнопка: <b>${buttonName}</b>\n` +
      `⏰ Время: ${new Date().toLocaleString('ru-RU')}\n` +
      `⌛ Время на сайте: ${getSessionDuration()}\n` +
      `🖱 Всего кликов в сессии: ${clickCount}`

    // Добавляем дополнительную информацию, если есть
    if (Object.keys(additionalInfo).length > 0) {
      message += '\n\n📋 Дополнительно:'
      for (const [key, value] of Object.entries(additionalInfo)) {
        message += `\n• ${key}: ${value}`
      }
    }

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование выбора доставки
export function logDeliveryChoice(method) {
  try {
    const methodText = method === 'delivery' ? 'Доставка 🚚' : 'Лично 🤝'
    const emoji = method === 'delivery' ? '📦' : '💐'

    const message = `${emoji} ═══ ЦВЕТЫ ПРИНЯТЫ! ═══ ${emoji}\n\n` +
      `🎁 Способ получения: <b>${methodText}</b>\n` +
      `⏰ Время решения: ${new Date().toLocaleString('ru-RU', { dateStyle: 'full', timeStyle: 'medium' })}\n` +
      `⌛ Время до решения: ${getSessionDuration()}\n` +
      `📊 Прогресс просмотра: ${sessionStorage.getItem('last-scroll') || '0'}%\n` +
      `🖱 Кликов сделано: ${sessionStorage.getItem('click-count') || '0'}\n\n` +
      `✨ Это важный шаг!`

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование достижения определенной сцены
export function logSceneReached(sceneIndex, sceneName) {
  try {
    // Сохраняем для использования при выходе
    sessionStorage.setItem('last-scene', `${sceneIndex + 1}: ${sceneName}`)

    // Подсчитываем просмотренные сцены
    const viewedScenes = new Set(JSON.parse(sessionStorage.getItem('viewed-scenes') || '[]'))
    viewedScenes.add(sceneIndex)
    sessionStorage.setItem('viewed-scenes', JSON.stringify([...viewedScenes]))

    const message = `📖 НОВАЯ СЦЕНА ДОСТИГНУТА\n\n` +
      `🎬 Сцена ${sceneIndex + 1}\n` +
      `💬 Вопрос: "${sceneName}"\n` +
      `⏰ Время: ${new Date().toLocaleString('ru-RU')}\n` +
      `⌛ Время на сайте: ${getSessionDuration()}\n` +
      `📊 Просмотрено сцен: ${viewedScenes.size}`

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование долгого нахождения на сцене
export function logSceneDwell(sceneIndex, dwellTime) {
  try {
    const seconds = Math.round(dwellTime / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    let timeText = minutes > 0 ? `${minutes} мин ${remainingSeconds} сек` : `${seconds} сек`
    let emoji = '⏱'

    // Добавляем эмодзи в зависимости от времени
    if (seconds > 60) emoji = '📚' // Долгое чтение
    else if (seconds > 30) emoji = '👀' // Внимательный просмотр
    else emoji = '⏱' // Обычный просмотр

    const message = `${emoji} ЗАДЕРЖАЛСЯ НА СЦЕНЕ\n\n` +
      `🎬 Сцена ${sceneIndex + 1}\n` +
      `🕐 Время просмотра: <b>${timeText}</b>\n` +
      `⏰ ${new Date().toLocaleString('ru-RU')}\n` +
      `⌛ Общее время на сайте: ${getSessionDuration()}\n\n` +
      `${seconds > 60 ? '✨ Тщательно читает!' : seconds > 30 ? '💭 Задумался...' : '👁 Быстрый просмотр'}`

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Вспомогательная функция для вычисления времени сессии
function getSessionDuration() {
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

// Инициализация времени начала сессии
try {
  if (!sessionStorage.getItem('session-start')) {
    sessionStorage.setItem('session-start', Date.now().toString())
  }
} catch (error) {
  // Тихо игнорируем ошибки
}

// Логирование активности мыши (с debounce)
let mouseActivityCount = 0
let lastMouseLogTime = Date.now()

export const logMouseActivity = debounce(() => {
  try {
    const now = Date.now()
    const timeSinceLastLog = now - lastMouseLogTime

    if (timeSinceLastLog > 30000) { // Логируем каждые 30 секунд активности
      const message = `🖱 АКТИВНОСТЬ МЫШИ\n\n` +
        `📊 Движений за период: ${mouseActivityCount}\n` +
        `⏰ ${new Date().toLocaleString('ru-RU')}\n` +
        `⌛ Время на сайте: ${getSessionDuration()}\n` +
        `📄 Текущая сцена: ${sessionStorage.getItem('last-scene') || 'Неизвестно'}`

      sendToTelegram(message)
      lastMouseLogTime = now
      mouseActivityCount = 0
    }
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}, 2000)

// Счетчик движений мыши
export function trackMouseMovement() {
  mouseActivityCount++
  logMouseActivity()
}

// Логирование времени простоя (неактивности)
let inactivityTimer = null
let lastActivityTime = Date.now()

export function resetInactivityTimer() {
  try {
    lastActivityTime = Date.now()

    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    // Логируем если пользователь неактивен больше 2 минут
    inactivityTimer = setTimeout(() => {
      const message = `💤 ПОЛЬЗОВАТЕЛЬ НЕАКТИВЕН\n\n` +
        `⏱ Время простоя: 2+ минуты\n` +
        `⏰ ${new Date().toLocaleString('ru-RU')}\n` +
        `⌛ Время на сайте: ${getSessionDuration()}\n` +
        `📄 Последняя сцена: ${sessionStorage.getItem('last-scene') || 'Неизвестно'}\n` +
        `📜 Последний скролл: ${sessionStorage.getItem('last-scroll') || '0'}%`

      sendToTelegram(message)
    }, 120000) // 2 минуты
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование фокуса на странице
export function logPageFocus(hasFocus) {
  try {
    const message = hasFocus
      ? `🎯 ФОКУС НА СТРАНИЦЕ\n\n⏰ ${new Date().toLocaleString('ru-RU')}\n⌛ Время на сайте: ${getSessionDuration()}`
      : `😶‍🌫️ ПОТЕРЯН ФОКУС\n\n⏰ ${new Date().toLocaleString('ru-RU')}\n⌛ Время на сайте: ${getSessionDuration()}`

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование изменения размера окна
export function logWindowResize(width, height, orientation) {
  try {
    const message = `📐 ИЗМЕНЕНИЕ РАЗМЕРА ОКНА\n\n` +
      `📏 Новый размер: ${width}x${height}\n` +
      `🔄 Ориентация: ${orientation}\n` +
      `⏰ ${new Date().toLocaleString('ru-RU')}\n` +
      `⌛ Время на сайте: ${getSessionDuration()}`

    sendToTelegram(message)
  } catch (error) {
    // Тихо игнорируем ошибки
  }
}

// Логирование ошибок JavaScript (если они происходят)
export function logError(error, errorInfo) {
  try {
    const message = `❌ ОШИБКА НА СТРАНИЦЕ\n\n` +
      `🐛 Ошибка: ${error.toString()}\n` +
      `📍 Место: ${errorInfo || 'Неизвестно'}\n` +
      `⏰ ${new Date().toLocaleString('ru-RU')}\n` +
      `⌛ Время на сайте: ${getSessionDuration()}`

    sendToTelegram(message)
  } catch (e) {
    // Тихо игнорируем ошибки логирования
  }
}

// Экспорт для общего использования
export default {
  logVisit,
  logExit,
  logVisibilityChange,
  logScroll,
  logButtonClick,
  logDeliveryChoice,
  logSceneReached,
  logSceneDwell,
  trackMouseMovement,
  resetInactivityTimer,
  logPageFocus,
  logWindowResize,
  logError
}
