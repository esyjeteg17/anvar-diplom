<script setup lang="ts">
/**
 * Страница «Дети» — таблица всех детей с поиском, фильтром по центру,
 * кнопкой «Добавить» и редактированием/удалением для каждой строки.
 *
 * Логика данных — в useChildrenStore (CRUD), список центров — useCentersStore.
 */

import type { Child, ChildInput } from "~/stores/children"

useHead({ title: "SBORIKA — Дети" })

const childrenStore = useChildrenStore()
const centersStore = useCentersStore()

// Загружаем данные при первом монтировании страницы
onMounted(async () => {
  await Promise.all([childrenStore.fetchAll(), centersStore.fetchAll()])
})

// Состояние фильтров
const searchQuery = ref<string>("")
const centerFilter = ref<number | null>(null)

/** Отфильтрованные дети по поисковой строке и центру. */
const filteredChildren = computed<Child[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return childrenStore.items.filter((c) => {
    if (centerFilter.value && c.center !== centerFilter.value) return false
    if (!q) return true
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.parent_full_name.toLowerCase().includes(q) ||
      c.parent_phone.toLowerCase().includes(q)
    )
  })
})

// Состояние модалки создания/редактирования
const formOpen = ref<boolean>(false)
const editingChild = ref<Child | null>(null)

function openCreate() {
  editingChild.value = null
  childrenStore.resetErrors()
  formOpen.value = true
}

function openEdit(child: Child) {
  editingChild.value = child
  childrenStore.resetErrors()
  formOpen.value = true
}

async function onSubmit(payload: ChildInput) {
  const saved = editingChild.value
    ? await childrenStore.update(editingChild.value.id, payload)
    : await childrenStore.create(payload)
  if (saved) formOpen.value = false
}

// Состояние подтверждения удаления
const deleteOpen = ref<boolean>(false)
const deleteCandidate = ref<Child | null>(null)

function askDelete(child: Child) {
  deleteCandidate.value = child
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!deleteCandidate.value) return
  await childrenStore.remove(deleteCandidate.value.id)
  deleteCandidate.value = null
}
</script>

<template>
  <AdminPage
    title="Дети"
    description="Карточки клиентов: ребёнок, родители, центр, контакты, абонемент."
  >
    <template #actions>
      <BrandButton variant="primary" size="md" @click="openCreate">
        + Добавить ребёнка
      </BrandButton>
    </template>

    <!-- Панель фильтров -->
    <div class="mb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:flex-wrap">
      <div class="relative flex-1 sm:max-w-xs">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Поиск по ФИО, телефону…"
          class="w-full rounded-xl border-2 border-line bg-white px-4 py-2.5 pl-10 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <select
        v-model.number="centerFilter"
        class="rounded-xl border-2 border-line bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-brand"
      >
        <option :value="null">Все центры</option>
        <option v-for="opt in centersStore.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <span class="ml-auto text-sm text-slate">
        Найдено: {{ filteredChildren.length }} из {{ childrenStore.items.length }}
      </span>
    </div>

    <!-- Таблица -->
    <div class="overflow-x-auto rounded-2xl border border-line/60 bg-white shadow-sm">
      <table class="w-full text-sm">
        <thead class="bg-line/30 text-xs uppercase tracking-wider text-slate">
          <tr>
            <th class="px-4 py-3 text-left font-semibold">Ребёнок</th>
            <th class="px-4 py-3 text-left font-semibold">Центр</th>
            <th class="px-4 py-3 text-left font-semibold">Родитель</th>
            <th class="px-4 py-3 text-left font-semibold">Телефон</th>
            <th class="px-4 py-3 text-left font-semibold">Соцсети</th>
            <th class="px-4 py-3 text-right font-semibold">Абонемент</th>
            <th class="px-4 py-3 text-center font-semibold">Статус</th>
            <th class="px-4 py-3 text-right font-semibold">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line/60">
          <tr v-if="childrenStore.loading">
            <td colspan="8" class="px-4 py-10 text-center text-slate">Загрузка…</td>
          </tr>
          <tr v-else-if="filteredChildren.length === 0">
            <td colspan="8" class="px-4 py-10 text-center text-slate">
              <span v-if="childrenStore.items.length === 0">
                Пока нет ни одного ребёнка. Нажмите «Добавить ребёнка» сверху.
              </span>
              <span v-else>
                Под фильтры никто не подходит — попробуйте сбросить.
              </span>
            </td>
          </tr>
          <tr
            v-for="child in filteredChildren"
            :key="child.id"
            class="hover:bg-bg/60 transition-colors"
          >
            <td class="px-4 py-3 font-semibold text-ink">{{ child.full_name }}</td>
            <td class="px-4 py-3 text-ink/85">{{ child.center_name }}</td>
            <td class="px-4 py-3 text-ink/85">{{ child.parent_full_name || "—" }}</td>
            <td class="px-4 py-3 text-ink/85">
              <a :href="`tel:${child.parent_phone}`" class="hover:text-brand transition-colors">
                {{ child.parent_phone }}
              </a>
            </td>
            <td class="px-4 py-3 text-xs">
              <div class="flex flex-col gap-0.5 text-slate">
                <span v-if="child.parent_telegram">TG: {{ child.parent_telegram }}</span>
                <a
                  v-if="child.parent_vk"
                  :href="child.parent_vk"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-brand"
                >
                  VK ↗
                </a>
                <span v-if="!child.parent_telegram && !child.parent_vk">—</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right tabular-nums text-ink/85">
              {{ Number(child.monthly_fee).toLocaleString("ru-RU") }} ₽
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  child.is_active ? 'bg-brand/10 text-brand' : 'bg-line/60 text-slate',
                ]"
              >
                {{ child.is_active ? "активен" : "не активен" }}
              </span>
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink hover:bg-line/60 mr-1"
                @click="openEdit(child)"
              >
                Изменить
              </button>
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10"
                @click="askDelete(child)"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Общая ошибка от стора (например, при сетевом сбое) -->
    <p v-if="childrenStore.errorText" class="mt-3 text-sm font-medium text-brand">
      {{ childrenStore.errorText }}
    </p>

    <!-- Модалка создания / редактирования -->
    <Modal
      v-model="formOpen"
      :title="editingChild ? 'Редактировать ребёнка' : 'Новый ребёнок'"
      size="lg"
    >
      <ChildForm
        :initial="editingChild"
        :field-error="childrenStore.fieldError"
        :saving="childrenStore.saving"
        @submit="onSubmit"
        @cancel="formOpen = false"
      />
    </Modal>

    <!-- Подтверждение удаления -->
    <ConfirmDialog
      v-model="deleteOpen"
      title="Удалить ребёнка?"
      :message="deleteCandidate ? `Удалить запись «${deleteCandidate.full_name}»? Это действие необратимо.` : ''"
      confirm-text="Удалить"
      variant="danger"
      @confirm="confirmDelete"
    />
  </AdminPage>
</template>
