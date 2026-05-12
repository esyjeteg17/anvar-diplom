<script setup lang="ts">
/**
 * Страница «Финансы» — дашборд с агрегатными цифрами + две таблицы:
 * сотрудники с зарплатами и расходы. Все данные пересчитываются на бэкенде
 * (см. /api/finance/expenses/summary/), фронт только отображает и управляет.
 *
 * Шапка с фильтром периода (месяц/начало месяца) — общая для summary и расходов.
 */

import {
  CATEGORY_LABEL,
  type Expense,
  type ExpenseInput,
  EXPENSE_CATEGORIES,
} from "~/stores/finance"
import type { Staff, StaffInput } from "~/stores/staff"
import { addDays, formatYmd, todayLocal } from "~/composables/useDate"

useHead({ title: "SBORIKA — Финансы" })

const finance = useFinanceStore()
const staffStore = useStaffStore()

// Фильтр периода: по умолчанию текущий месяц.
const today = todayLocal()
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

const dateFrom = ref<string>(formatYmd(monthStart))
const dateTo = ref<string>(formatYmd(monthEnd))

async function reload() {
  await Promise.all([
    finance.fetchSummary(dateFrom.value, dateTo.value),
    finance.fetchExpenses(dateFrom.value, dateTo.value),
    staffStore.fetchAll(true),
  ])
}

onMounted(() => reload())
watch([dateFrom, dateTo], () => reload())

/** Удобные пресеты периодов: «Этот месяц» / «Прошлый месяц» / «Сегодня». */
function setThisMonth() {
  const t = todayLocal()
  dateFrom.value = formatYmd(new Date(t.getFullYear(), t.getMonth(), 1))
  dateTo.value = formatYmd(new Date(t.getFullYear(), t.getMonth() + 1, 0))
}
function setPrevMonth() {
  const t = todayLocal()
  dateFrom.value = formatYmd(new Date(t.getFullYear(), t.getMonth() - 1, 1))
  dateTo.value = formatYmd(new Date(t.getFullYear(), t.getMonth(), 0))
}
function setLast30() {
  const t = todayLocal()
  dateFrom.value = formatYmd(addDays(t, -29))
  dateTo.value = formatYmd(t)
}

/** Текущий месяц словами для подсказок stat-карточек. */
const periodHint = computed<string>(() => {
  return `${dateFrom.value} — ${dateTo.value}`
})

// === Расходы ===
const expenseFormOpen = ref<boolean>(false)
const editingExpense = ref<Expense | null>(null)

function openCreateExpense() {
  editingExpense.value = null
  finance.resetErrors()
  expenseFormOpen.value = true
}

function openEditExpense(e: Expense) {
  editingExpense.value = e
  finance.resetErrors()
  expenseFormOpen.value = true
}

async function submitExpense(payload: ExpenseInput) {
  const saved = editingExpense.value
    ? await finance.updateExpense(editingExpense.value.id, payload)
    : await finance.createExpense(payload)
  if (saved) {
    expenseFormOpen.value = false
    // Сводка пересчитывается на бэке — перезагружаем после изменения.
    await finance.fetchSummary(dateFrom.value, dateTo.value)
  }
}

const deleteExpenseOpen = ref<boolean>(false)
const expenseToDelete = ref<Expense | null>(null)

function askDeleteExpense(e: Expense) {
  expenseToDelete.value = e
  deleteExpenseOpen.value = true
}

async function confirmDeleteExpense() {
  if (!expenseToDelete.value) return
  const ok = await finance.removeExpense(expenseToDelete.value.id)
  if (ok) {
    expenseToDelete.value = null
    await finance.fetchSummary(dateFrom.value, dateTo.value)
  }
}

// === Сотрудники ===
const staffFormOpen = ref<boolean>(false)
const editingStaff = ref<Staff | null>(null)

function openCreateStaff() {
  editingStaff.value = null
  staffStore.resetErrors()
  staffFormOpen.value = true
}

function openEditStaff(s: Staff) {
  editingStaff.value = s
  staffStore.resetErrors()
  staffFormOpen.value = true
}

async function submitStaff(payload: StaffInput) {
  const saved = editingStaff.value
    ? await staffStore.update(editingStaff.value.id, payload)
    : await staffStore.create(payload)
  if (saved) {
    staffFormOpen.value = false
    // Зарплаты учитываются в summary — перезагружаем сводку.
    await finance.fetchSummary(dateFrom.value, dateTo.value)
  }
}

const deleteStaffOpen = ref<boolean>(false)
const staffToDelete = ref<Staff | null>(null)

function askDeleteStaff(s: Staff) {
  staffToDelete.value = s
  deleteStaffOpen.value = true
}

async function confirmDeleteStaff() {
  if (!staffToDelete.value) return
  const ok = await staffStore.remove(staffToDelete.value.id)
  if (ok) {
    staffToDelete.value = null
    await finance.fetchSummary(dateFrom.value, dateTo.value)
  }
}

/** Сумма расходов по категории для маленькой легенды-разбивки. */
const expenseBreakdown = computed<Array<{ label: string; value: number }>>(() => {
  if (!finance.summary) return []
  return EXPENSE_CATEGORIES
    .map((c) => ({
      label: c.label,
      value: finance.summary?.expenses_by_category[c.value] ?? 0,
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value)
})
</script>

<template>
  <AdminPage
    title="Финансы"
    description="Прибыль компании, зарплаты сотрудников и расходы по категориям."
  >
    <!-- Панель периода — нативный date picker (open в календаре по клику). -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <span class="text-sm font-semibold text-slate">Период:</span>
      <input
        v-model="dateFrom"
        type="date"
        class="rounded-xl border-2 border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand w-44"
      />
      <span class="text-slate">—</span>
      <input
        v-model="dateTo"
        type="date"
        class="rounded-xl border-2 border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand w-44"
      />

      <div class="flex gap-2 ml-auto">
        <button
          type="button"
          class="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand"
          @click="setThisMonth"
        >
          Этот месяц
        </button>
        <button
          type="button"
          class="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand"
          @click="setPrevMonth"
        >
          Прошлый месяц
        </button>
        <button
          type="button"
          class="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand"
          @click="setLast30"
        >
          Последние 30 дней
        </button>
      </div>
    </div>

    <!-- Дашборд: 4 карточки -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Доход (потенциал)"
        :value="finance.summary?.income ?? 0"
        :hint="`${finance.summary?.active_children_count ?? 0} активных детей`"
        tone="income"
      />
      <StatCard
        label="Зарплаты"
        :value="finance.summary?.salaries ?? 0"
        :hint="`${finance.summary?.active_staff_count ?? 0} сотрудников в штате`"
        tone="expense"
      />
      <StatCard
        label="Расходы"
        :value="finance.summary?.expenses ?? 0"
        :hint="periodHint"
        tone="expense"
      />
      <StatCard
        label="Прибыль"
        :value="finance.summary?.profit ?? 0"
        :hint="periodHint"
        tone="profit"
        signed
      />
    </div>

    <!-- Разбивка расходов по категориям (если есть) -->
    <div
      v-if="expenseBreakdown.length > 0"
      class="mb-8 rounded-2xl bg-white border border-line/60 shadow-sm p-5 sm:p-6"
    >
      <h3 class="text-sm font-bold text-ink uppercase tracking-wider mb-4">
        Разбивка расходов
      </h3>
      <div class="space-y-2">
        <div
          v-for="row in expenseBreakdown"
          :key="row.label"
          class="flex items-center gap-3"
        >
          <span class="w-44 text-sm text-ink/85">{{ row.label }}</span>
          <div class="flex-1 h-2 rounded-full bg-line/60 overflow-hidden">
            <div
              class="h-full bg-brand transition-all"
              :style="{
                width: `${Math.min(100, (row.value / (finance.summary?.expenses || 1)) * 100)}%`,
              }"
            />
          </div>
          <span class="w-32 text-right text-sm font-bold text-ink tabular-nums">
            {{ row.value.toLocaleString("ru-RU") }} ₽
          </span>
        </div>
      </div>
    </div>

    <!-- Две секции: сотрудники / расходы -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Сотрудники -->
      <section class="rounded-2xl bg-white border border-line/60 shadow-sm">
        <header class="flex items-center justify-between px-5 py-4 border-b border-line/60">
          <h3 class="text-base font-bold text-ink">Сотрудники и зарплаты</h3>
          <BrandButton variant="primary" size="sm" @click="openCreateStaff">
            + Добавить
          </BrandButton>
        </header>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-line/30 text-xs uppercase tracking-wider text-slate">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">Сотрудник</th>
                <th class="px-4 py-3 text-left font-semibold">Роль</th>
                <th class="px-4 py-3 text-right font-semibold">Зарплата/мес</th>
                <th class="px-4 py-3 text-center font-semibold">Активен</th>
                <th class="px-4 py-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line/60">
              <tr v-if="staffStore.items.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-slate">
                  Пока нет сотрудников.
                </td>
              </tr>
              <tr
                v-for="s in staffStore.items"
                :key="s.id"
                class="hover:bg-bg/60 transition-colors"
              >
                <td class="px-4 py-3 font-semibold text-ink">{{ s.full_name }}</td>
                <td class="px-4 py-3 text-ink/85">
                  {{ ({ teacher: "Преподаватель", manager: "Менеджер", admin: "Админ", other: "Другое" }[s.role]) }}
                </td>
                <td class="px-4 py-3 text-right tabular-nums">
                  {{ Number(s.salary_per_month).toLocaleString("ru-RU") }} ₽
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                      s.is_active ? 'bg-brand/10 text-brand' : 'bg-line/60 text-slate',
                    ]"
                  >
                    {{ s.is_active ? "да" : "нет" }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-semibold text-ink hover:bg-line/60 mr-1"
                    @click="openEditStaff(s)"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-semibold text-brand hover:bg-brand/10"
                    @click="askDeleteStaff(s)"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Расходы -->
      <section class="rounded-2xl bg-white border border-line/60 shadow-sm">
        <header class="flex items-center justify-between px-5 py-4 border-b border-line/60">
          <h3 class="text-base font-bold text-ink">
            Расходы за период ({{ finance.expenses.length }})
          </h3>
          <BrandButton variant="primary" size="sm" @click="openCreateExpense">
            + Добавить
          </BrandButton>
        </header>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-line/30 text-xs uppercase tracking-wider text-slate">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">Дата</th>
                <th class="px-4 py-3 text-left font-semibold">Категория</th>
                <th class="px-4 py-3 text-left font-semibold">Описание</th>
                <th class="px-4 py-3 text-right font-semibold">Сумма</th>
                <th class="px-4 py-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line/60">
              <tr v-if="finance.expenses.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-slate">
                  За выбранный период расходов нет.
                </td>
              </tr>
              <tr
                v-for="e in finance.expenses"
                :key="e.id"
                class="hover:bg-bg/60 transition-colors"
              >
                <td class="px-4 py-3 text-ink/85 whitespace-nowrap">{{ e.date }}</td>
                <td class="px-4 py-3 text-ink/85">{{ CATEGORY_LABEL[e.category] }}</td>
                <td class="px-4 py-3 text-ink/85">{{ e.description || "—" }}</td>
                <td class="px-4 py-3 text-right tabular-nums font-semibold text-ink">
                  {{ Number(e.amount).toLocaleString("ru-RU") }} ₽
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-semibold text-ink hover:bg-line/60 mr-1"
                    @click="openEditExpense(e)"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-xs font-semibold text-brand hover:bg-brand/10"
                    @click="askDeleteExpense(e)"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Модалки -->
    <Modal
      v-model="staffFormOpen"
      :title="editingStaff ? 'Редактировать сотрудника' : 'Новый сотрудник'"
      size="md"
    >
      <StaffForm
        :initial="editingStaff"
        :field-error="staffStore.fieldError"
        :saving="staffStore.saving"
        @submit="submitStaff"
        @cancel="staffFormOpen = false"
      />
    </Modal>

    <Modal
      v-model="expenseFormOpen"
      :title="editingExpense ? 'Редактировать расход' : 'Новый расход'"
      size="md"
    >
      <ExpenseForm
        :initial="editingExpense"
        :field-error="finance.fieldError"
        :saving="finance.saving"
        @submit="submitExpense"
        @cancel="expenseFormOpen = false"
      />
    </Modal>

    <ConfirmDialog
      v-model="deleteStaffOpen"
      title="Удалить сотрудника?"
      :message="staffToDelete ? `Удалить «${staffToDelete.full_name}»?` : ''"
      confirm-text="Удалить"
      variant="danger"
      @confirm="confirmDeleteStaff"
    />
    <ConfirmDialog
      v-model="deleteExpenseOpen"
      title="Удалить расход?"
      :message="expenseToDelete ? `Удалить расход на ${expenseToDelete.amount} ₽?` : ''"
      confirm-text="Удалить"
      variant="danger"
      @confirm="confirmDeleteExpense"
    />
  </AdminPage>
</template>
