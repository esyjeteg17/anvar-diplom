<script setup lang="ts">
/**
 * Секция «О школе» — миссия SBORIKA + карточки ценностей.
 * Тексты пока нейтрально-стартовые, чтобы можно было заменить на боевые
 * без перевёрстки. Каждая ценность — это IconCard, варьируется только
 * цветом шестерёнки и текстом, никакого дублирования разметки.
 */

interface Value {
  /** Заголовок карточки */
  title: string
  /** Описание */
  description: string
  /** Цвет иконки-шестерёнки */
  iconColor: "brand" | "slate" | "ink"
}

// Список ценностей школы. Чтобы добавить пункт — просто расширить массив.
const values: Value[] = [
  {
    title: "Игровой формат",
    description:
      "Учим через игру и собственные открытия — никакой скуки и зубрёжки, только живой интерес.",
    iconColor: "brand",
  },
  {
    title: "Ничего готовить не нужно",
    description:
      "Конструктор и планшет уже на каждом столе. Достаточно прийти и начать собирать.",
    iconColor: "slate",
  },
  {
    title: "Малые группы",
    description:
      "Преподаватель видит каждого ребёнка и помогает в нужный момент, а не зачитывает по бумажке.",
    iconColor: "brand",
  },
  {
    title: "Опыт инженеров",
    description:
      "Программу составляют действующие инженеры — то, что дети собирают, работает по-настоящему.",
    iconColor: "slate",
  },
]
</script>

<template>
  <SectionWrapper id="about" background="bg" padding="lg">
    <BackgroundGears variant="corners" />

    <Reveal direction="up">
      <SectionHeading
        eyebrow="О школе"
        title="Школа инженерного мышления"
        description="SBORIKA помогает детям 5–14 лет полюбить инженерное дело. Через конструктор, программирование и собственного робота мы развиваем логику, усидчивость и привычку доводить дело до результата."
      />
    </Reveal>

    <!-- Сетка ценностей — на десктопе 4 в ряд, на планшете 2, на мобильном 1.
         Каждая карточка с возрастающей задержкой → stagger-эффект. -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      <Reveal
        v-for="(v, i) in values"
        :key="v.title"
        direction="up"
        :delay="i * 100"
      >
        <IconCard
          :title="v.title"
          :description="v.description"
          :icon-color="v.iconColor"
          variant="light"
        />
      </Reveal>
    </div>
  </SectionWrapper>
</template>
