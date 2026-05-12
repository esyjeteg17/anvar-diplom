<script setup lang="ts">
/**
 * Главный экран лендинга. Композиция собрана по постеру из Figma:
 *   - крупный заголовок «Робототехника для детей»;
 *   - акцентный «5–14 лет» (оранжевый);
 *   - CTA на квиз;
 *   - наклонная сине-серая «лента» под заголовком;
 *   - декоративные шестерёнки в углах (через IconGear).
 *
 * Шестерёнки выводятся абсолютным позиционированием — параметры размера/цвета
 * лежат в локальном массиве, чтобы расположение легко правилось из одного места.
 *
 * При скролле страницы декоративные шестерёнки получают лёгкий parallax —
 * двигаются медленнее самого контента, создавая ощущение глубины.
 */

interface DecorGear {
  /** Размер в пикселях */
  size: number
  /** Цвет — соответствует пропу IconGear */
  color: "brand" | "slate" | "ink" | "white" | "line"
  /** Tailwind-классы позиционирования (top/right/bottom/left + opacity/rotate) */
  pos: string
  /** Количество зубцов */
  teeth?: number
  /** Скорость вращения (0 = не вращать) */
  spin?: number
  /** Коэффициент parallax (0 = не двигается, 1 = двигается со скоростью контента) */
  parallax?: number
}

interface DecorBrick {
  size: number
  color: "brand" | "slate" | "ink" | "white"
  /** Позиционирование */
  pos: string
  /** Анимация «парения» (сек) */
  float: number
  /** Параллакс при скролле */
  parallax: number
}

const decorGears: DecorGear[] = [
  { size: 220, color: "brand", pos: "top-[-60px] right-[-60px] opacity-90",     teeth: 12, spin: 30, parallax: 0.4 },
  { size: 140, color: "slate", pos: "top-[20%] right-[14%] opacity-80",          teeth: 10, spin: 24, parallax: 0.25 },
  { size: 90,  color: "line",  pos: "top-[8%] left-[6%] opacity-70",             teeth: 10, spin: 20, parallax: 0.3 },
  { size: 110, color: "brand", pos: "bottom-[10%] left-[-30px] opacity-80",      teeth: 10, spin: 28, parallax: 0.5 },
  { size: 70,  color: "slate", pos: "bottom-[18%] right-[8%] opacity-70",        teeth: 8,  spin: 18, parallax: 0.35 },
  { size: 50,  color: "line",  pos: "top-[55%] left-[42%] opacity-60",           teeth: 8,  spin: 14, parallax: 0.6 },
]

// Изометрические LEGO-кубики — мотив с постера. Парят и двигаются с
// небольшим parallax-сдвигом, дают ощущение «детский конструктор».
const decorBricks: DecorBrick[] = [
  { size: 78, color: "brand", pos: "top-[12%] right-[6%]",  float: 4.2, parallax: 0.2 },
  { size: 60, color: "slate", pos: "top-[68%] left-[10%]",  float: 5.0, parallax: 0.3 },
  { size: 50, color: "ink",   pos: "top-[40%] right-[3%]",  float: 4.6, parallax: 0.45 },
]

// Реактивная позиция скролла — пересчитывается на scroll и применяется
// как translateY к каждой шестерёнке через её persoнальный коэффициент parallax.
const scrollY = ref<number>(0)

const onScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => {
  // passive — браузер может оптимизировать обработчик и не блокировать скролл.
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll))
</script>

<template>
  <section
    id="top"
    class="relative isolate overflow-hidden bg-bg pt-10 md:pt-16 pb-24 md:pb-32"
  >
    <!-- Декоративные шестерёнки фоном с parallax-сдвигом по скроллу. -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <IconGear
        v-for="(g, i) in decorGears"
        :key="`gear-${i}`"
        :size="g.size"
        :color="g.color"
        :teeth="g.teeth ?? 8"
        :spin="g.spin ?? 0"
        :class="['absolute', g.pos]"
        :style="{
          transform: `translate3d(0, ${-scrollY * (g.parallax ?? 0.3)}px, 0)`,
          willChange: 'transform',
        }"
      />
      <!-- Парящие LEGO-кубики — добавляют мотив «конструктор» -->
      <LegoBrick
        v-for="(b, i) in decorBricks"
        :key="`brick-${i}`"
        :size="b.size"
        :color="b.color"
        :float="b.float"
        :class="['absolute drop-shadow-md', b.pos]"
        :style="{
          transform: `translate3d(0, ${-scrollY * b.parallax}px, 0)`,
          willChange: 'transform',
        }"
      />
    </div>

    <!-- Наклонная сине-серая «лента» под заголовком (декоративный мотив с постера) -->
    <div
      class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[58%] bg-slate -z-10"
      style="clip-path: polygon(0 18%, 100% 0, 100% 78%, 0 100%);"
    />

    <SiteContainer size="wide">
      <div class="relative mx-auto max-w-3xl text-center md:max-w-4xl">
        <Reveal direction="up" :duration="900">
          <!-- Большой логотип сверху -->
          <div class="mb-10 md:mb-14 flex justify-center">
            <BrandLogo size="xl" tagline />
          </div>
        </Reveal>

        <Reveal direction="up" :delay="150" :duration="900">
          <!-- Главный заголовок -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Робототехника
            <span class="block text-white/95">для&nbsp;детей</span>
          </h1>
        </Reveal>

        <Reveal direction="up" :delay="280" :duration="900">
          <!-- Возраст — крупный оранжевый акцент -->
          <p class="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand">
            5–14&nbsp;лет
          </p>
        </Reveal>

        <Reveal direction="up" :delay="380" :duration="900">
          <!-- Подзаголовок-слоган -->
          <p class="mt-6 text-base sm:text-lg text-white/90 font-medium">
            Собирай. Думай. Создавай.
          </p>
        </Reveal>

        <Reveal direction="up" :delay="500" :duration="900">
          <!-- CTA-кнопка ведёт к квизу. Класс cta-pulse даёт мягкое пульсирующее свечение. -->
          <div class="mt-10 flex justify-center">
            <BrandButton href="#quiz" variant="primary" size="lg" class="cta-pulse">
              Пройти квиз и получить бесплатное занятие
            </BrandButton>
          </div>
        </Reveal>
      </div>
    </SiteContainer>
  </section>
</template>

<style>
/* Пульсирующее свечение вокруг главной CTA-кнопки на Hero — привлекает внимание,
   но не отвлекает: тень ритмично «дышит» в фирменном оранжевом. */
@keyframes cta-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(234, 92, 31, 0.55); }
  70%  { box-shadow: 0 0 0 18px rgba(234, 92, 31, 0); }
  100% { box-shadow: 0 0 0 0 rgba(234, 92, 31, 0); }
}
.cta-pulse {
  animation: cta-pulse 2.4s ease-out infinite;
}
.cta-pulse:hover {
  /* На hover пауза — пульсация не отвлекает, когда пользователь уже наводится. */
  animation-play-state: paused;
}
</style>
