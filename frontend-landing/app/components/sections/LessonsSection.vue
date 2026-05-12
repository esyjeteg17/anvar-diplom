<script setup lang="ts">
/**
 * Секция «Занятия» — что делают дети + как устроен формат.
 * Композиция повторяет постер: две панели в две колонки.
 * Тексты пунктов лежат в массивах `whatChildrenDo` и `lessonFormat`,
 * визуальная часть — компонент BulletList.
 */

const whatChildrenDo: string[] = [
  "Собирают модели из конструктора",
  "Программируют роботов с планшета",
  "Развивают логику и инженерное мышление",
]

const lessonFormat: string[] = [
  "Набор и планшет на каждого ребёнка",
  "Игровой и понятный формат подачи",
  "Не требует никакой подготовки",
]
</script>

<template>
  <SectionWrapper id="lessons" background="bg" padding="lg">
    <BackgroundGears variant="edge-right" />

    <Reveal direction="up">
      <SectionHeading
        eyebrow="Занятия"
        title="Что происходит на занятии"
        description="Каждое занятие — это собранная и запрограммированная модель. Никаких лекций «у доски» — только руки, конструктор и собственные открытия."
      />
    </Reveal>

    <!-- Две панели рядом: что делают дети / формат занятий.
         Левая въезжает справа, правая — слева, синхронно по центру. -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
      <Reveal direction="right">
        <BulletList
          title="На занятиях дети"
          :items="whatChildrenDo"
          icon-color="brand"
          variant="panel-light"
        />
      </Reveal>
      <Reveal direction="left" :delay="120">
        <BulletList
          title="Формат занятий"
          :items="lessonFormat"
          icon-color="brand"
          variant="panel-slate"
        />
      </Reveal>
    </div>
  </SectionWrapper>
</template>
