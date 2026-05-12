<script setup lang="ts">
/**
 * Секция «Преподаватели». Сетка из карточек с аватаром-инициалами,
 * именем, ролью, описанием и тегами-специализациями.
 *
 * Сейчас зашиты 3 преподавателя — стартовая команда. Чтобы добавить ещё,
 * достаточно расширить массив `teachers`, разметка перерисуется сама.
 */

interface Teacher {
  firstName: string
  lastName: string
  role: string
  description: string
  tags: string[]
  accent: "brand" | "slate"
  photoUrl: string
}

// AI-фото были сгенерированы через Pollinations.ai и сохранены локально
// в public/teachers/. Статика отдаётся мгновенно, не зависит от внешних
// сервисов и не «мигает» при первой загрузке страницы.
// Чтобы заменить — положи новый JPEG с тем же именем в public/teachers/.
const teachers: Teacher[] = [
  {
    firstName: "Анна",
    lastName: "Петрова",
    role: "Ведущий преподаватель",
    description:
      "Инженер-робототехник, 5+ лет работает с детьми. Ведёт занятия в старшей группе и отвечает за программу по программированию.",
    tags: ["8–14 лет", "Python", "Робототехника"],
    accent: "brand",
    photoUrl: "/teachers/anna.jpg",
  },
  {
    firstName: "Михаил",
    lastName: "Соколов",
    role: "Преподаватель",
    description:
      "Выпускник МГТУ им. Баумана, ведёт занятия по конструированию и алгоритмическому мышлению. Терпеливый и любит, когда дети спорят.",
    tags: ["7–10 лет", "Scratch", "Конструкторы"],
    accent: "slate",
    photoUrl: "/teachers/mikhail.jpg",
  },
  {
    firstName: "Елена",
    lastName: "Иванова",
    role: "Методист и преподаватель",
    description:
      "Педагог-психолог. Ведёт младшую группу — там, где сборка модели важнее точной инструкции, а игра — ведущий формат обучения.",
    tags: ["5–7 лет", "Игровой формат", "Малыши"],
    accent: "brand",
    photoUrl: "/teachers/elena.jpg",
  },
]
</script>

<template>
  <SectionWrapper id="teachers" background="bg" padding="lg">
    <BackgroundGears variant="edge-left" />

    <Reveal direction="up">
      <SectionHeading
        eyebrow="Команда"
        title="Наши преподаватели"
        description="Программу ведут действующие инженеры и педагоги. У каждого — своя зона ответственности и возрастная группа, чтобы каждому ребёнку было интересно."
      />
    </Reveal>

    <!-- Сетка преподавателей: 1 / 2 / 3 колонки в зависимости от ширины экрана -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      <Reveal
        v-for="(t, i) in teachers"
        :key="t.lastName + t.firstName"
        direction="up"
        :delay="i * 110"
      >
        <TeacherCard
          :first-name="t.firstName"
          :last-name="t.lastName"
          :role="t.role"
          :description="t.description"
          :tags="t.tags"
          :accent="t.accent"
          :photo-url="t.photoUrl"
        />
      </Reveal>
    </div>
  </SectionWrapper>
</template>
