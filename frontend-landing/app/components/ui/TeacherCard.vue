<script setup lang="ts">
/**
 * Карточка преподавателя.
 * Используется в секции «Преподаватели». Поля передаются через пропсы:
 * имя/фамилия, роль, краткое описание (опыт, специализация) и список тегов.
 *
 * Когда у преподавателей появятся реальные фото — добавим проп `photoUrl`,
 * сейчас в качестве аватара рисуются крупные инициалы на брендовом фоне
 * (выглядит на бренд и не требует ассетов).
 */

type Accent = "brand" | "slate"

const props = withDefaults(
  defineProps<{
    /** Имя */
    firstName: string
    /** Фамилия */
    lastName: string
    /** Роль (как пишется на сайте, например «Ведущий преподаватель») */
    role: string
    /** Описание: опыт, образование, специализация */
    description: string
    /** Теги под описанием — короткие плашки (например, «5–7 лет», «Python») */
    tags?: string[]
    /** Цвет акцентной полоски и аватара */
    accent?: Accent
    /** URL фотографии. Если не задан — рисуются инициалы. */
    photoUrl?: string
  }>(),
  { tags: () => [], accent: "brand" },
)

// Если фото не загрузится (сервис недоступен / 404) — переключимся
// на инициалы. Локальное состояние одной карточки.
const photoFailed = ref<boolean>(false)
const showPhoto = computed<boolean>(() => Boolean(props.photoUrl) && !photoFailed.value)

/** Инициалы из имени и фамилии — для аватара-плейсхолдера. */
const initials = computed<string>(() => {
  const a = props.firstName.trim()[0] ?? ""
  const b = props.lastName.trim()[0] ?? ""
  return `${a}${b}`.toUpperCase()
})

const accentClasses: Record<Accent, { bar: string; avatar: string }> = {
  brand: {
    bar: "bg-brand",
    avatar: "bg-gradient-to-br from-brand to-[#bb4612]",
  },
  slate: {
    bar: "bg-slate",
    avatar: "bg-gradient-to-br from-slate to-ink",
  },
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl bg-white border border-line/60 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_36px_-10px_rgba(234,92,31,0.28)] hover:border-brand/40"
  >
    <!-- Цветная полоска сверху — единый стиль с CenterCard -->
    <div :class="['h-1.5 w-full', accentClasses[accent ?? 'brand'].bar]" />

    <div class="p-6 md:p-7 text-center">
      <!-- Аватар. Фото (если есть) или fallback-инициалы на брендовом градиенте. -->
      <div
        :class="[
          'mx-auto mb-5 h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden shadow-md',
          showPhoto ? 'bg-line/40' : `flex items-center justify-center text-white ${accentClasses[accent ?? 'brand'].avatar}`,
        ]"
      >
        <img
          v-if="showPhoto"
          :src="photoUrl"
          :alt="`${firstName} ${lastName}`"
          loading="lazy"
          class="h-full w-full object-cover"
          @error="photoFailed = true"
        />
        <span v-else class="text-3xl sm:text-4xl font-black tracking-tight">
          {{ initials }}
        </span>
      </div>

      <h3 class="text-lg sm:text-xl font-bold text-ink leading-tight">
        {{ firstName }} {{ lastName }}
      </h3>
      <p class="mt-1 text-sm font-semibold text-brand uppercase tracking-wider">
        {{ role }}
      </p>
      <p class="mt-4 text-sm sm:text-base text-slate leading-relaxed">
        {{ description }}
      </p>

      <!-- Теги/специализации — мелкие плашки -->
      <ul v-if="tags.length > 0" class="mt-5 flex flex-wrap justify-center gap-2">
        <li
          v-for="tag in tags"
          :key="tag"
          class="inline-flex items-center rounded-full bg-line/60 px-3 py-1 text-xs font-semibold text-ink"
        >
          {{ tag }}
        </li>
      </ul>
    </div>
  </article>
</template>
