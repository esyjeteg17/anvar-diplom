<script setup lang="ts">
/**
 * Секция «Цифры SBORIKA» — короткая, но эффектная: 4 цифры,
 * каждая насчитывается от нуля при появлении в viewport.
 * Цифры пока примерные, заменяются под реальные данные в массиве `stats`.
 */

interface Stat {
  value: number
  label: string
  prefix?: string
  suffix?: string
  icon?: "map" | "users" | "calendar" | "graduation"
}

const stats: Stat[] = [
  { value: 4,   label: "центра в Москве",        icon: "map" },
  { value: 500, label: "детей прошли через нас", icon: "users", suffix: "+" },
  { value: 5,   label: "лет на рынке",            icon: "calendar" },
  { value: 3,   label: "опытных преподавателя",   icon: "graduation" },
]
</script>

<template>
  <SectionWrapper id="stats" background="bg" padding="md">
    <BackgroundGears variant="subtle" />

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
      <Reveal
        v-for="(s, i) in stats"
        :key="s.label"
        direction="up"
        :delay="i * 120"
      >
        <StatNumber
          :value="s.value"
          :label="s.label"
          :prefix="s.prefix"
          :suffix="s.suffix"
          :icon="s.icon"
        />
      </Reveal>
    </div>
  </SectionWrapper>
</template>
