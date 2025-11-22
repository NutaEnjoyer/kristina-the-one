import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion'
import './App.css'
import FloatingParticles from './components/FloatingParticles'
import FinalScene from './components/FinalScene'
import {
  logVisit,
  logExit,
  logVisibilityChange,
  logScroll,
  logSceneReached,
  logSceneDwell,
  trackMouseMovement,
  resetInactivityTimer,
  logWindowResize,
  logError
} from './utils/logger'

// ЛЕГКО РЕДАКТИРУЕМЫЕ СЦЕНЫ - ПРОСТО ИЗМЕНИ ТЕКСТ ЗДЕСЬ
const scenes = [
  {
    her: "Что это такое?",
    me: "Это мои ответы на вопросы, которые тебя задели. Я собрал их, чтобы объяснить честно и спокойно, без оправданий. Мне важно, чтобы ты услышала правду, а не обрывки и догадки."
  },
  {
    her: "Ты мне изменял?",
    me: "Нет. И это самое главное. Всё, что произошло, превратилось в большой и запутанный кошмар из-за моих неправильных реакций и недоговорённости. Но измены — ни физической, ни эмоциональной — не было. Я не искал никого и не тянулся ни к кому. Всё, что у меня было внутри, было про нас."
  },
  {
    her: "Почему ты сидел на ДВ?",
    me: "Мне было стыдно признаться. Я не искал никого и не флиртовал — мы с друзьями сидели там ради шуток. Но скрывая это, я подорвал твоё доверие. Это была моя ошибка."
  },
  {
    her: "Кто такая Катя и зачем ты ей писал?",
    me: "Катя — знакомая друзей с ДВ. Мы общались с ней компанией, шутили. Без флирта, встреч или намёков. Я понимаю, что со стороны это выглядит отвратительно. Никакой измены не было, но я осознаю, как это задело тебя."
  },
  {
    her: "Почему ты пытался это скрыть?",
    me: "Я боялся твоей реакции и не хотел усугублять ситуацию. Вместо того чтобы быть честным, я выбрал ложь. Это было неправильно, и я сожалею об этом."
  },
  {
    her: "Ты писал в ChatGPT, как скрыть измену",
    me: "Я не изменял. Я написал это в момент панической ревности и глупости. Вместо того чтобы поговорить с тобой, я начал искать ответы в ChatGPT. Это было безрассудно и неправильно."
  },
  {
    her: "Ты писал, что активно ищешь девушку",
    me: "Я написал это в том же контексте — паника и ревность. Я никого по-настоящему не искал. Я был с тобой и выбирал только тебя. Но сам факт, что я такое написал — моя ошибка."
  },
  {
    her: "Откуда у тебя паническая ревность?",
    me: "Я боялся тебя потерять. Вместо того чтобы говорить о своих чувствах открыто, я начал накручивать себя и искать угрозы там, где их не было. Вместо доверия я выбрал страх и панику. Это моя слабость, над которой мне нужно работать."
  },
  {
    her: "А ты не доверял мне вообще?",
    me: "Я доверял тебе. Проблема была во мне — я не умел справляться с собственной тревогой и страхами. Это моя ответственность, не твоя"
  },
  {
    her: "Ты вообще когда-нибудь хотел кого-то другого?",
    me: "Нет, никогда. С момента как мы начали встречаться, я был с тобой и выбирал только тебя. Все мои мысли и чувства были о нас."
  },
  {
    her: "Ты удалил Face ID, чтобы скрыть что-то?",
    me: "Нет. Я его не удалял. Он мог просто не считаться — такое бывает. Мы можем проверить: без тебя я бы не смог добавить Face ID обратно."
  },
  {
    her: "Почему ты отключил время, когда ты в сети?",
    me: "Это было на эмоциях. Я закрылся и повёл себя глупо после разговора перед парами, когда я почувствовал отдаление. Это не было попыткой что-то скрыть — просто детская реакция, за которую мне стыдно."
  },
  {
    her: "Мне сложно верить после всего этого",
    me: "Я понимаю. И ты имеешь на это право. Я не прошу поверить сразу — я хочу быть честным и чтобы ты увидела всю картину, а не только обрывки и догадки."
  },
  {
    her: "Я сейчас не хочу разговаривать",
    me: "Хорошо. Я не давлю. Возьми столько времени, сколько нужно. Когда ты будешь готова — я хочу поговорить спокойно, без эмоций и крика."
  },
  {
    her: "И что между нами теперь?",
    me: "Я хочу попробовать всё исправить. Не обещаниями, а действиями. Понять, что тебе больно — и не повторять этих ошибок. Если ты захочешь — я рядом. Если нет — я приму твой выбор. Но попытаться я обязан."
  },
  {
    her: "Ты уверен, что мы сможем это исправить?",
    me: "Я не могу быть уверен в будущем. Но я знаю, что хочу бороться за нас. Если ты тоже этого хочешь, мы сможем пройти через это вместе. Я буду работать над этим каждый день. Готов показывать действиями, а не словами, что достоин твоего доверия."
  },
  {
    her: "Любишь ли ты меня?",
    me: "Да, я люблю тебя. Но я не прошу сейчас отвечать или решать что-то. Я просто хочу, чтобы ты знала, что мои чувства настоящие."
  },
  {
    her: "Что мне делать?",
    me: "Я не могу решать за тебя. Ты сама знаешь, что тебе нужно. Я могу только быть честным и ждать твоего решения. Когда будешь готова, мы сможем поговорить спокойно и без обид."
  },
  {
    her: "Зачем ты всё это говоришь?",
    me: "Потому что я вижу свои ошибки — в реакциях, в ревности, в том, что скрывал вместо того, чтобы говорить. Я не хочу делать вид, что ничего не было. Хочу, чтобы мы прошли через это и стали сильнее, а не расстались."
  },
  {
    her: "Что еще скажешь?",
    me: "Мы всегда умели разговаривать и находить решение, даже в тяжёлых спорах. Пары, которые говорят честно, остаются вместе. Я хочу, чтобы мы справились и с этим."
  }
]


function App() {
  const [currentScene, setCurrentScene] = useState(-1) // -1 = intro screen
  const [showFinal, setShowFinal] = useState(false)
  const [progressPercent, setProgressPercent] = useState(0)
  const containerRef = useRef(null)
  const sceneStartTimeRef = useRef(Date.now())
  const lastLoggedSceneRef = useRef(-1)
  const audioRef = useRef(null) // Ref для предзагруженного звука
  const { scrollYProgress } = useScroll({
    container: containerRef
  })

  // Обновляем прогресс только при изменении (избегаем лишних рендеров)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const percent = Math.round(latest * 100)
    setProgressPercent(percent)
  })

  // Предзагрузка звука
  useEffect(() => {
    try {
      const audio = new Audio('/page-turn.mp3')
      audio.volume = 0.1
      audio.load() // Предзагружаем
      audioRef.current = audio
    } catch (error) {
      // Игнорируем ошибки
    }
  }, [])

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
        trackMouseMovement()
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

  // Определяем текущую сцену по прогрессу скролла и логируем
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      try {
        // Логируем скролл
        logScroll(latest, currentScene)

        const totalScenes = scenes.length + 2 // +1 для intro, +1 для финальной сцены
        const sceneIndex = Math.floor(latest * totalScenes)
        let newScene = -1

        if (sceneIndex >= scenes.length + 1) {
          setShowFinal(true)
          newScene = scenes.length
          setCurrentScene(newScene)
        } else if (sceneIndex === 0) {
          setShowFinal(false)
          newScene = -1 // -1 означает показываем intro
          setCurrentScene(newScene)
        } else {
          setShowFinal(false)
          newScene = sceneIndex - 1 // -1 потому что intro занимает индекс 0
          setCurrentScene(newScene)
        }

        // Логируем достижение новой сцены
        if (newScene !== lastLoggedSceneRef.current && newScene >= 0) {
          logSceneReached(newScene, scenes[newScene].her)

          // Тактильная и звуковая обратная связь при смене сцены
          try {
            // Вибрация (если поддерживается)
            if (navigator.vibrate) {
              navigator.vibrate(50) // Короткая вибрация 50мс
            }

            // Звук перелистывания страницы
            try {
              if (audioRef.current) {
                audioRef.current.currentTime = 0 // Сбрасываем на начало
                audioRef.current.play().catch(() => {
                  // Игнорируем если звук не загрузился
                })
              }
            } catch (e) {
              // Игнорируем ошибки со звуком
            }
          } catch (error) {
            // Игнорируем ошибки
          }

          // Логируем время, проведенное на предыдущей сцене
          if (lastLoggedSceneRef.current >= 0) {
            const dwellTime = Date.now() - sceneStartTimeRef.current
            if (dwellTime > 5000) { // Логируем если больше 5 секунд
              logSceneDwell(lastLoggedSceneRef.current, dwellTime)
            }
          }

          lastLoggedSceneRef.current = newScene
          sceneStartTimeRef.current = Date.now()
        }
      } catch (error) {
        // Тихо игнорируем ошибки логирования
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress, currentScene])

  // Функция навигации к определённой сцене (мемоизируем)
  const navigateToScene = useCallback((targetScene) => {
    try {
      const containerElement = containerRef.current
      if (!containerElement) return

      const totalScenes = scenes.length + 2
      let scrollTarget = 0

      if (targetScene < -1) return // Не идём дальше intro
      if (targetScene >= scenes.length) targetScene = scenes.length // Финальная сцена

      // Вычисляем позицию скролла для нужной сцены
      scrollTarget = ((targetScene + 1) / totalScenes) * containerElement.scrollHeight

      containerElement.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      })
    } catch (error) {
      // Игнорируем ошибки
    }
  }, [scenes.length])

  // Навигация по тапу (мемоизируем)
  const handleTapNavigation = useCallback((e) => {
    try {
      const containerElement = containerRef.current
      if (!containerElement) return

      const clickX = e.clientX || e.touches?.[0]?.clientX
      const screenWidth = window.innerWidth

      // Определяем зону клика
      if (clickX < screenWidth * 0.3) {
        // Левая треть - предыдущая сцена
        navigateToScene(currentScene - 1)
      } else if (clickX > screenWidth * 0.7) {
        // Правая треть - следующая сцена
        navigateToScene(currentScene + 1)
      }
    } catch (error) {
      // Игнорируем ошибки
    }
  }, [currentScene, navigateToScene])

  return (
    <div className="app">
      {/* Прогресс-индикатор */}
      <div className="progress-indicator">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
        <div className="progress-text">
          {currentScene >= 0 ? `${currentScene + 1} / ${scenes.length}` : 'Начало'}
        </div>
      </div>

      {/* Фоновые эффекты */}
      <div className="background-gradient" />
      <FloatingParticles />

      {/* Контейнер со сценами */}
      <div
        className="scroll-container"
        ref={containerRef}
        onClick={handleTapNavigation}
        onTouchEnd={handleTapNavigation}
      >
        <div className="scenes-wrapper">
          {/* Приветственный экран */}
          <SceneBlock key="intro" isVisible={currentScene === -1}>
            <div className="intro-text">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Письмо для тебя
              </motion.h1>
              <p className="scroll-hint">
                листай вниз или нажимай справа
              </p>
            </div>
          </SceneBlock>

          {/* Основные сцены */}
          {scenes.map((scene, index) => (
            <SceneBlock
              key={index}
              isVisible={currentScene === index}
            >
              <LetterCard scene={scene} index={index} />
            </SceneBlock>
          ))}

          {/* Финальная сцена */}
          <SceneBlock isVisible={showFinal}>
            <FinalScene />
          </SceneBlock>
        </div>
      </div>
    </div>
  )
}

// Компонент блока сцены с анимациями появления/исчезновения
const SceneBlock = React.memo(({ children, isVisible }) => {
  return (
    <div className="scene-block">
      {children}
    </div>
  )
})

// Компонент карточки письма
const LetterCard = React.memo(({ scene, index }) => {
  return (
    <div
      className="letter-card"
      style={{
        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.5}deg)`
      }}
    >
      {/* Цитата "её" */}
      <div className="her-quote">
        <div className="quote-mark">"</div>
        <p>{scene.her}</p>
        <div className="quote-underline" />
      </div>

      {/* Мой ответ */}
      <div className="my-response">
        <p>{scene.me}</p>
      </div>
    </div>
  )
})

export default App
