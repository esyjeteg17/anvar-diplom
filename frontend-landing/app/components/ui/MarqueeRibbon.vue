<script setup lang="ts">
/**
 * Бегущая лента — горизонтальная полоса с повторяющимся слоганом
 * и шестерёнками-разделителями. Используется как декоративный
 * разделитель между секциями (придаёт ритм и брендовость).
 *
 * Контент состоит из двух идентичных «дорожек», каждая из которых сама
 * по себе шире viewport. Анимация смещает контейнер на -50% (= ширина
 * одной дорожки), в момент рестарта вторая дорожка занимает место первой —
 * визуально это выглядит как бесшовное движение.
 */

withDefaults(
  defineProps<{
    /** Цвет фона ленты */
    background?: "ink" | "slate" | "brand"
    /** Скорость прокрутки в секундах (длительность одного полного цикла) */
    speed?: number
  }>(),
  {
    background: "ink",
    speed: 30,
  },
)

const bgClass = {
  ink: "bg-ink text-white",
  slate: "bg-slate text-white",
  brand: "bg-brand text-white",
} as const

// Слова слогана. Между ними рендерим шестерёнки-разделители.
// Внутри одной дорожки контент повторяется N раз, чтобы дорожка была
// гарантированно шире самого широкого монитора (включая 4K).
const words = ["Собирай", "Думай", "Создавай"] as const
const REPEATS_PER_TRACK = 8
</script>

<template>
  <div
    :class="[bgClass[background ?? 'ink'], 'sborika-marquee overflow-hidden py-5 sm:py-6 select-none']"
  >
    <!--
      Внутренний контейнер — display: inline-flex (через CSS-класс track),
      ширина auto = ровно содержимому двух дорожек.
      animation сдвигает на -50%, что = ровно одна дорожка → бесшовный цикл.
    -->
    <div
      class="sborika-marquee__track"
      :style="{ animationDuration: `${speed}s` }"
    >
      <!-- Дорожка 1 и Дорожка 2 — идентичны. -->
      <div v-for="track in 2" :key="track" class="sborika-marquee__group">
        <template v-for="repeat in REPEATS_PER_TRACK" :key="`${track}-${repeat}`">
          <div
            v-for="(word, idx) in words"
            :key="`${track}-${repeat}-${idx}`"
            class="sborika-marquee__item"
          >
            <span class="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest">
              {{ word }}
            </span>
            <IconGear
              :size="36"
              color="brand"
              hole-color="white"
              :hole-radius="30"
              :spin="14"
              class="shrink-0"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
/* Сама лента: добавляем градиентные «маски» по краям через mask-image,
   чтобы текст плавно появлялся слева и исчезал справа, а не врезался
   резко в кромку секции. */
.sborika-marquee {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 6%,
    black 94%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    black 6%,
    black 94%,
    transparent
  );
}

/* Контейнер дорожки — inline-flex даёт ширину ровно по контенту,
   без сюрпризов с w-max или flex-родителем. */
.sborika-marquee__track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  will-change: transform;
  animation-name: sborika-marquee-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Группа = одна дорожка. Их две, идентичные. */
.sborika-marquee__group {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

/* Отдельный «слово + шестерёнка» — c фиксированным правым отступом.
   Тот же отступ есть и на последнем элементе дорожки, поэтому
   промежуток между концом дорожки 1 и началом дорожки 2 такой же,
   как между любыми двумя соседними элементами. */
.sborika-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding-right: 3rem;
  flex-shrink: 0;
}
@media (min-width: 640px) {
  .sborika-marquee__item {
    gap: 2rem;
    padding-right: 4rem;
  }
}

/* Сдвигаем на 50% — ровно одна дорожка из двух. */
@keyframes sborika-marquee-scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
</style>
