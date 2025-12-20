import { useState, useEffect } from 'react'
import './App.css'
import FloatingParticles from './components/FloatingParticles'
import Snowflakes from './components/Snowflakes'
import ChristmasLights from './components/ChristmasLights'
import FinalScene from './components/FinalScene'
import { LetterPageFull } from './components/LetterPage'
import { HomePage } from './components/HomePage'
import { SchedulePage } from './components/SchedulePage'
import { UNIPage } from './components/UNIPage'
import { MusicPage } from './components/MusicPage'
import {
  logVisit,
  logExit,
  logVisibilityChange,
  resetInactivityTimer,
  logWindowResize,
  logError,
  logPageNavigation
} from './utils/logger'


function App() {
  const [showFlowers, setShowFlowers] = useState(false) // Новое состояние для страницы цветов
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'diary', 'progress', 'uni'

  // Логирование посещения сайта
  useEffect(() => {
    logVisit()
  }, [])

  // Логирование выхода со страницы и изменения видимости вкладки
  useEffect(() => {
    const handleBeforeUnload = () => {
      logExit()
    }

    const handleVisibilityChange = () => {
      try {
        logVisibilityChange(!document.hidden)
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Логирование активности пользователя (мышь, клавиатура)
  useEffect(() => {
    const handleMouseMove = () => {
      try {
        resetInactivityTimer()
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    const handleKeyPress = () => {
      try {
        resetInactivityTimer()
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    const handleClick = () => {
      try {
        resetInactivityTimer()
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    const handleTouchStart = () => {
      try {
        resetInactivityTimer()
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    // Инициализируем таймер неактивности
    resetInactivityTimer()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('scroll', resetInactivityTimer)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keypress', handleKeyPress)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('scroll', resetInactivityTimer)
    }
  }, [])

  // Логирование изменения размера окна
  useEffect(() => {
    let resizeTimeout
    const handleResize = () => {
      try {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          const orientation = window.screen.orientation?.type ||
            (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
          logWindowResize(window.innerWidth, window.innerHeight, orientation)
        }, 500) // Debounce 500ms
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  // Глобальный обработчик ошибок
  useEffect(() => {
    const handleError = (event) => {
      try {
        logError(event.error || new Error('Unknown error'), event.filename || 'Unknown')
      } catch (error) {
        // Тихо игнорируем ошибки
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // Если показываем страницу с цветами
  if (showFlowers) {
    return (
      <div className="app">
        <div className="background-gradient" />
        <ChristmasLights />
        <Snowflakes />
        <FinalScene onBack={() => {
          setShowFlowers(false)
          setCurrentPage('home')
        }} />
      </div>
    )
  }

  // Навигация между страницами
  const handleNavigate = (page) => {
    const previousPage = currentPage
    setCurrentPage(page)

    // Логируем переход на новую страницу
    try {
      logPageNavigation(page, previousPage)
    } catch (error) {
      // Тихо игнорируем ошибки логирования
    }
  }

  const handleBackToHome = () => {
    const previousPage = currentPage
    setCurrentPage('home')

    // Логируем возврат на главную
    try {
      logPageNavigation('home', previousPage)
    } catch (error) {
      // Тихо игнорируем ошибки логирования
    }
  }

  // Рендерим страницу в зависимости от текущего состояния
  let pageContent
  switch (currentPage) {
    case 'diary':
      pageContent = (
        <LetterPageFull
          onShowFlowers={() => {
            setShowFlowers(true)
          }}
          onBack={handleBackToHome}
        />
      )
      break
    case 'schedule':
      pageContent = <SchedulePage onBack={handleBackToHome} />
      break
    case 'music':
      pageContent = <MusicPage onBack={handleBackToHome} />
      break
    case 'uni':
      pageContent = <UNIPage onBack={handleBackToHome} />
      break
    case 'home':
    default:
      pageContent = <HomePage onNavigate={handleNavigate} />
      break
  }

  return (
    <>
      <ChristmasLights />
      <Snowflakes />
      {pageContent}
    </>
  )
}

export default App
