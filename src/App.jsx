import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import './App.css'
import FloatingParticles from './components/FloatingParticles'
import FinalScene from './components/FinalScene'

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
