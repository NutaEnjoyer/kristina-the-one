import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import './App.css'
import MusicPlayer from './components/MusicPlayer'
import FloatingParticles from './components/FloatingParticles'
import FinalScene from './components/FinalScene'

// ЛЕГКО РЕДАКТИРУЕМЫЕ СЦЕНЫ - ПРОСТО ИЗМЕНИ ТЕКСТ ЗДЕСЬ
const scenes = [
  {
    her: "Ты писал в ChatGPT, как скрыть измену",
    me: "Это звучит ужасно, я понимаю. Но я написал это не потому, что изменял. Ты начала играть с бывшим и его друзьями, и у меня просто снесло крышу от ревности. Я хотел узнать, какие вообще такие ситуации бывают. Глупо, импульсивно — но это не про измену."
  },
  {
    her: "Кто такая Катя и зачем ты ей писал?",
    me: "Катя — знакомая друзей. У неё \"тяжёлая\" жизнь, и мы реально просто кринживали с нее с друзьями. Никаких встреч, флирта или намёков. Это была тупая шутка компании. Я понимаю, что со стороны выглядит безумно отвратно, но измены там нет."
  },
  {
    her: "Ты писал, что активно ищешь девушку",
    me: "То, что я писал, правда, но искать кого-то я не искал. Я делал это только для эксперимента и того, о чём говорил ранее. Это никак не касалось наших отношений — я был с тобой и всегда выбирал только тебя."
  },
  {
    her: "Ты удалил Face ID, чтобы скрыть что-то?",
    me: "Нет. Я его не удалял. Он мог просто не считаться — такое бывает. Мы можем проверить: без тебя я бы не смог добавить Face ID обратно."
  },
  {
    her: "Почему ты отключил время, когда ты в сети?",
    me: "Это было на эмоциях. Ты очень холодно мне ответила, когда уходила на пары, и я просто закрылся. Это не про скрытие. Это про то, что я повёл себя как дурак."
  },
  {
    her: "Мне сложно верить после всего этого",
    me: "Я понимаю. И ты имеешь на это право. Я не прошу поверить сразу — я хочу быть честным и показать реальную картину, а не то, что выглядит снаружи."
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
    her: "Любишь ли ты меня?",
    me: "Да, я люблю тебя. Но я не прошу сейчас отвечать или решать что-то. Я просто хочу, чтобы ты знала, что мои чувства настоящие."
  },
  {
    her: "Что мне делать?",
    me: "Я не могу решать за тебя. Ты сама знаешь, что тебе нужно. Я могу только быть честным и ждать твоего решения. Когда будешь готова, мы сможем поговорить спокойно и без обид."
  },
  {
    her: "Что еще скажешь?",
    me: "Я хочу, чтобы ты помнила: даже когда у нас были тяжёлые споры, мы всегда говорили и находили решение, и всё заканчивалось хорошо. Сейчас у нас такой период, когда ссоры кажутся необходимыми, но пары, которые умеют обсуждать всё честно и открыто, остаются вместе. Я хочу, чтобы мы тоже могли пройти через это."
  }
]


function App() {
  const [currentScene, setCurrentScene] = useState(-1) // -1 = intro screen
  const [showFinal, setShowFinal] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    container: containerRef
  })

  // Определяем текущую сцену по прогрессу скролла
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const totalScenes = scenes.length + 2 // +1 для intro, +1 для финальной сцены
      const sceneIndex = Math.floor(latest * totalScenes)

      if (sceneIndex >= scenes.length + 1) {
        setShowFinal(true)
        setCurrentScene(scenes.length)
      } else if (sceneIndex === 0) {
        setShowFinal(false)
        setCurrentScene(-1) // -1 означает показываем intro
      } else {
        setShowFinal(false)
        setCurrentScene(sceneIndex - 1) // -1 потому что intro занимает индекс 0
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div className="app">
      {/* Фоновые эффекты */}
      <div className="background-gradient" />
      <FloatingParticles />

      {/* Музыкальный плеер */}
      <MusicPlayer />

      {/* Контейнер со сценами */}
      <div className="scroll-container" ref={containerRef}>
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="scroll-hint"
              >
                листай вниз
              </motion.p>
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
function SceneBlock({ children, isVisible }) {
  return (
    <motion.div
      className="scene-block"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
        y: isVisible ? 0 : 30
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

// Компонент карточки письма
function LetterCard({ scene, index }) {
  return (
    <motion.div
      className="letter-card"
      style={{
        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.5}deg)`
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Цитата "её" */}
      <motion.div
        className="her-quote"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="quote-mark">"</div>
        <p>{scene.her}</p>
        <div className="quote-underline" />
      </motion.div>

      {/* Мой ответ */}
      <motion.div
        className="my-response"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <p>{scene.me}</p>
      </motion.div>
    </motion.div>
  )
}

export default App
