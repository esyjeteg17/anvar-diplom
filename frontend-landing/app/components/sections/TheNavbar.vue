<script setup lang="ts">
/**
 * Верхняя навигация лендинга.
 * Прилипает к верху страницы (sticky) и при скролле получает лёгкую тень.
 * Состав:
 *   - логотип SBORIKA;
 *   - якорные ссылки на основные секции;
 *   - кнопка-CTA «Записаться» (ведёт на якорь #quiz, где запускается квиз).
 *
 * Список ссылок единый источник истины — массив `links`. Чтобы добавить пункт,
 * не нужно править разметку, достаточно расширить массив.
 */

interface NavLink {
  label: string
  href: string
}

// Список якорных пунктов меню. id-шники должны совпадать с `id` SectionWrapper-ов.
const links: NavLink[] = [
  { label: "О школе", href: "#about" },
  { label: "Занятия", href: "#lessons" },
  { label: "Центры", href: "#centers" },
  { label: "Преподаватели", href: "#teachers" },
  { label: "Квиз", href: "#quiz" },
  { label: "Контакты", href: "#contacts" },
]

// Открыто ли мобильное меню (бургер)
const mobileOpen = ref(false)

// Включена ли тень при прокрутке
const scrolled = ref(false)

const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

// Закрываем мобильное меню при клике по ссылке
const onLinkClick = () => {
  mobileOpen.value = false
}
</script>

<template>
  <header
    :class="[
      // z-1100 — выше любого внутреннего z-index Leaflet (макс ~700) и обычного UI.
      'sticky top-0 z-1100 w-full bg-bg/90 backdrop-blur transition-shadow',
      scrolled ? 'shadow-md' : '',
    ]"
  >
    <SiteContainer size="wide">
      <div class="flex h-16 items-center justify-between md:h-20">
        <!-- Логотип ведёт на верх страницы -->
        <a href="#top" class="flex items-center" aria-label="SBORIKA — на главную">
          <BrandLogo size="md" />
        </a>

        <!-- Десктопная навигация -->
        <nav class="hidden md:flex items-center gap-8">
          <a
            v-for="l in links"
            :key="l.href"
            :href="l.href"
            class="text-sm font-medium text-ink/80 hover:text-brand transition-colors"
          >
            {{ l.label }}
          </a>
        </nav>

        <!-- CTA + бургер -->
        <div class="flex items-center gap-3">
          <BrandButton href="#contacts" variant="primary" size="sm" class="hidden sm:inline-flex">
            Записаться
          </BrandButton>

          <button
            type="button"
            class="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-line/60"
            :aria-label="mobileOpen ? 'Закрыть меню' : 'Открыть меню'"
            :aria-expanded="mobileOpen"
            @click="mobileOpen = !mobileOpen"
          >
            <!-- Иконка-бургер / крестик в зависимости от состояния -->
            <svg
              v-if="!mobileOpen"
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Мобильное меню (раскрывающийся блок) -->
      <div
        v-if="mobileOpen"
        class="md:hidden pb-4 border-t border-line/60"
      >
        <nav class="flex flex-col gap-1 pt-3">
          <a
            v-for="l in links"
            :key="l.href"
            :href="l.href"
            class="px-2 py-3 rounded-lg text-base font-medium text-ink hover:bg-line/60"
            @click="onLinkClick"
          >
            {{ l.label }}
          </a>
          <BrandButton
            href="#contacts"
            variant="primary"
            size="md"
            block
            class="mt-3"
            @click="onLinkClick"
          >
            Записаться
          </BrandButton>
        </nav>
      </div>
    </SiteContainer>
  </header>
</template>
