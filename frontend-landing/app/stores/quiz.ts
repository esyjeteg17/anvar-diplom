import { defineStore } from "pinia"

/**
 * Стор квиза SBORIKA — состояние интерактивного теста для получения промокода.
 *
 * Источник правды для:
 *   - списка вопросов (questions);
 *   - текущего шага и ответов пользователя (currentStep, answers);
 *   - флага завершения (finished);
 *   - вычисляемого промокода (promoCode).
 *
 * Сам стор не зависит от UI: компоненты квиза только подписываются на состояние
 * и вызывают экшены (answer, next, prev, finish, reset).
 */

export interface QuizOption {
  /** Уникальный ID варианта в пределах вопроса */
  id: string
  /** Текст варианта, который видит пользователь */
  label: string
}

export interface QuizQuestion {
  /** ID вопроса (по индексу в массиве, для надёжности явный) */
  id: number
  /** Текст вопроса */
  text: string
  /** Варианты ответа */
  options: QuizOption[]
}

// 10 вопросов квиза. Тематика — формат и предпочтения семьи,
// чтобы потом можно было персонализировать пробное занятие.
const questions: QuizQuestion[] = [
  {
    id: 1,
    text: "Сколько лет вашему ребёнку?",
    options: [
      { id: "5_7",   label: "5–7 лет" },
      { id: "8_10",  label: "8–10 лет" },
      { id: "11_14", label: "11–14 лет" },
      { id: "other", label: "Другой возраст" },
    ],
  },
  {
    id: 2,
    text: "Какое метро вам комфортнее?",
    options: [
      { id: "perovo",       label: "Метро Перово" },
      { id: "novogireevo",  label: "Метро Новогиреево" },
      { id: "semenovskaya", label: "Метро Семёновская" },
      { id: "any",          label: "Готов(а) ездить, любое" },
    ],
  },
  {
    id: 3,
    text: "Есть ли у ребёнка опыт сборки конструкторов?",
    options: [
      { id: "lots",     label: "Да, давно собирает" },
      { id: "some",     label: "Изредка собирает" },
      { id: "none",     label: "Нет, новичок" },
    ],
  },
  {
    id: 4,
    text: "Знаком ли ребёнок с программированием?",
    options: [
      { id: "tried",     label: "Уже пробовал" },
      { id: "interested", label: "Слышал, интересно" },
      { id: "no",        label: "Нет, не сталкивался" },
    ],
  },
  {
    id: 5,
    text: "Что больше нравится ребёнку?",
    options: [
      { id: "instr",  label: "Собирать по инструкции" },
      { id: "create", label: "Придумывать своё" },
      { id: "both",   label: "И то, и другое" },
    ],
  },
  {
    id: 6,
    text: "Если бы ваш ребёнок собрал робота с уникальной суперспособностью — какой бы она была?",
    options: [
      { id: "fix",     label: "Чинить любые сломанные вещи" },
      { id: "homework", label: "Помогать с уроками и проектами" },
      { id: "ideas",   label: "Превращать любые идеи в реальность" },
      { id: "time",    label: "Перемещаться во времени" },
    ],
  },
  {
    id: 7,
    text: "Какой навык важнее всего развивать с детства?",
    options: [
      { id: "logic",   label: "Логическое мышление" },
      { id: "create",  label: "Креативное воображение" },
      { id: "grit",    label: "Терпение и упорство" },
      { id: "team",    label: "Умение работать в команде" },
    ],
  },
  {
    id: 8,
    text: "Что важнее в занятиях?",
    options: [
      { id: "logic",  label: "Развитие логики и мышления" },
      { id: "career", label: "Подготовка к профессии будущего" },
      { id: "fun",    label: "Чтобы было интересно ребёнку" },
    ],
  },
  {
    id: 9,
    text: "Откуда вы узнали о SBORIKA?",
    options: [
      { id: "friends", label: "От знакомых" },
      { id: "social",  label: "Из соцсетей / рекламы" },
      { id: "search",  label: "Нашли через поиск" },
      { id: "other",   label: "Другое" },
    ],
  },
  {
    id: 10,
    text: "Когда планируете начать?",
    options: [
      { id: "soon",   label: "В ближайшие 2 недели" },
      { id: "month",  label: "В течение месяца" },
      { id: "later",  label: "Пока просто интересуюсь" },
    ],
  },
]

export const useQuizStore = defineStore("quiz", () => {
  // Индекс текущего вопроса (0..questions.length-1)
  const currentStep = ref<number>(0)
  // Карта ответов: id вопроса → id выбранного варианта
  const answers = ref<Record<number, string>>({})
  // Флаг — квиз пройден до конца, показываем экран результата
  const finished = ref<boolean>(false)

  /** Текущий вопрос (или null если квиз завершён). */
  const currentQuestion = computed<QuizQuestion | null>(() =>
    questions[currentStep.value] ?? null,
  )

  /** Прогресс в процентах: сколько вопросов пройдено относительно общего числа. */
  const progress = computed<number>(() =>
    Math.round((currentStep.value / questions.length) * 100),
  )

  /** Можно ли двигаться дальше — на текущий вопрос дан ответ. */
  const canGoNext = computed<boolean>(() => {
    const q = currentQuestion.value
    return q ? answers.value[q.id] != null : false
  })

  /** Можно ли вернуться — это не первый вопрос. */
  const canGoPrev = computed<boolean>(() => currentStep.value > 0)

  /** Это последний вопрос — следующий шаг = завершение квиза. */
  const isLastStep = computed<boolean>(
    () => currentStep.value === questions.length - 1,
  )

  /**
   * Промокод выдаётся всем, кто завершил квиз.
   * Логика выдачи может усложняться позже (например, разные коды от ответов),
   * но для запуска школы достаточно одного фиксированного.
   */
  const promoCode = computed<string>(() => "SBORIKA-START")

  // Действия

  function answer(questionId: number, optionId: string) {
    answers.value[questionId] = optionId
  }

  function next() {
    if (!canGoNext.value) return
    if (isLastStep.value) {
      finished.value = true
      return
    }
    currentStep.value++
  }

  function prev() {
    if (canGoPrev.value) currentStep.value--
  }

  function reset() {
    currentStep.value = 0
    answers.value = {}
    finished.value = false
  }

  return {
    // данные (readonly для UI)
    questions: readonly(ref(questions)),
    currentStep,
    answers,
    finished,

    // computed
    currentQuestion,
    progress,
    canGoNext,
    canGoPrev,
    isLastStep,
    promoCode,

    // actions
    answer,
    next,
    prev,
    reset,
  }
})
