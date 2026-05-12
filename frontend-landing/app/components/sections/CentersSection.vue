<script setup lang="ts">
/**
 * Секция «Центры» — 4 действующих партнёрских центра в Москве + интерактивная карта.
 * Список центров — единый источник истины: используется и в карте, и в карточках,
 * никакого дублирования. Координаты указаны приблизительно по адресам;
 * при необходимости уточняй точку через любой геокодер (Yandex Maps / OSM).
 */

interface Center {
  name: string
  address: string
  /** Координаты для метки на карте */
  lat: number
  lng: number
  accent: "brand" | "slate" | "ink"
}

const centers: Center[] = [
  {
    name: "Центр на Зелёном проспекте",
    address: "Москва, Зелёный проспект, 59А",
    lat: 55.7503,
    lng: 37.8123,
    accent: "brand",
  },
  {
    name: "Центр на Мартеновской",
    address: "Москва, Мартеновская, 7",
    lat: 55.7567,
    lng: 37.8125,
    accent: "slate",
  },
  {
    name: "Центр на Щербаковской",
    address: "Москва, Щербаковская, 26",
    lat: 55.7870,
    lng: 37.7090,
    accent: "brand",
  },
  {
    name: "Центр на Плеханова",
    address: "Москва, ул. Плеханова, 26, корпус 4",
    lat: 55.7570,
    lng: 37.7945,
    accent: "slate",
  },
]
</script>

<template>
  <SectionWrapper id="centers" background="bg" padding="lg">
    <BackgroundGears variant="subtle" />

    <Reveal direction="up">
      <SectionHeading
        eyebrow="Где мы находимся"
        title="Партнёрские центры в Москве"
        description="Сейчас занятия проходят в четырёх центрах. Выбирай удобный по геолокации и приходи на пробное занятие."
      />
    </Reveal>

    <!-- Интерактивная карта со всеми точками. Только клиент → ClientOnly. -->
    <Reveal direction="up" :delay="80">
      <div class="mb-8 md:mb-10">
        <ClientOnly>
          <CentersMap :points="centers" />
          <template #fallback>
            <div
              class="h-[480px] w-full rounded-2xl border border-line/60 bg-line/30 animate-pulse"
              aria-hidden="true"
            />
          </template>
        </ClientOnly>
      </div>
    </Reveal>

    <!-- Сетка центров: stagger по карточкам -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      <Reveal
        v-for="(c, i) in centers"
        :key="c.name"
        direction="up"
        :delay="i * 90"
      >
        <CenterCard
          :name="c.name"
          :address="c.address"
          :accent="c.accent"
        />
      </Reveal>
    </div>
  </SectionWrapper>
</template>
