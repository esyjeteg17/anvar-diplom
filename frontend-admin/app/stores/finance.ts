import { defineStore } from "pinia"

/**
 * Стор финансов. Хранит:
 *   - сводку (доход / зарплаты / расходы / прибыль) — приходит готовая
 *     с эндпоинта /finance/expenses/summary/;
 *   - список расходов с CRUD.
 *
 * Зарплаты и доход считаются на бэкенде из активных Child / Staff,
 * фронт их только отображает. Менеджер на странице финансов меняет
 * suммы расходов и зарплат — пересчёт автоматический.
 */

export interface Expense {
  id: number
  date: string
  category: ExpenseCategory
  amount: string
  description: string
  created_at: string
}

export type ExpenseCategory =
  | "transport"
  | "rent"
  | "equipment"
  | "marketing"
  | "supplies"
  | "other"

export interface ExpenseInput {
  date: string
  category: ExpenseCategory
  amount: string | number
  description?: string
}

export interface FinanceSummary {
  period_from: string
  period_to: string
  income: number
  salaries: number
  expenses: number
  expenses_by_category: Record<string, number>
  profit: number
  active_children_count: number
  active_staff_count: number
}

/** Список категорий расходов — для select-а в форме и легенды. */
export const EXPENSE_CATEGORIES: Array<{ value: ExpenseCategory; label: string }> = [
  { value: "transport", label: "Транспорт" },
  { value: "rent",      label: "Аренда" },
  { value: "equipment", label: "Оборудование / конструкторы" },
  { value: "marketing", label: "Реклама" },
  { value: "supplies",  label: "Расходники" },
  { value: "other",     label: "Прочее" },
]

export const CATEGORY_LABEL: Record<ExpenseCategory, string> = Object.fromEntries(
  EXPENSE_CATEGORIES.map((c) => [c.value, c.label]),
) as Record<ExpenseCategory, string>

type FieldErrors = Record<string, string[]>

export const useFinanceStore = defineStore("finance", () => {
  const summary = ref<FinanceSummary | null>(null)
  const expenses = ref<Expense[]>([])

  const loadingSummary = ref<boolean>(false)
  const loadingExpenses = ref<boolean>(false)
  const saving = ref<boolean>(false)

  const errorText = ref<string | null>(null)
  const fieldErrors = ref<FieldErrors>({})

  function resetErrors() {
    errorText.value = null
    fieldErrors.value = {}
  }

  function fieldError(name: string): string | undefined {
    const arr = fieldErrors.value[name]
    return Array.isArray(arr) && arr.length ? arr[0] : undefined
  }

  /** Получить сводку за период (по умолчанию — текущий месяц на бэке). */
  async function fetchSummary(date_from?: string, date_to?: string) {
    const { call } = useApi()
    loadingSummary.value = true
    try {
      const params = new URLSearchParams()
      if (date_from) params.set("date_from", date_from)
      if (date_to) params.set("date_to", date_to)
      const qs = params.toString() ? `?${params}` : ""
      summary.value = await call<FinanceSummary>(`/finance/expenses/summary/${qs}`)
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить сводку"
    } finally {
      loadingSummary.value = false
    }
  }

  async function fetchExpenses(date_from?: string, date_to?: string) {
    const { call } = useApi()
    loadingExpenses.value = true
    try {
      const params = new URLSearchParams()
      if (date_from) params.set("date_from", date_from)
      if (date_to) params.set("date_to", date_to)
      const qs = params.toString() ? `?${params}` : ""
      const response = await call<{ results: Expense[] } | Expense[]>(
        `/finance/expenses/${qs}`,
      )
      expenses.value = Array.isArray(response) ? response : response.results
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить расходы"
    } finally {
      loadingExpenses.value = false
    }
  }

  async function createExpense(payload: ExpenseInput): Promise<Expense | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const created = await call<Expense>("/finance/expenses/", {
        method: "POST",
        body: payload,
      })
      expenses.value = [created, ...expenses.value]
      toasts.success("Расход добавлен")
      return created
    } catch (e: any) {
      handleApiError(e)
      toasts.error("Не удалось добавить расход")
      return null
    } finally {
      saving.value = false
    }
  }

  async function updateExpense(
    id: number,
    payload: ExpenseInput,
  ): Promise<Expense | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const updated = await call<Expense>(`/finance/expenses/${id}/`, {
        method: "PUT",
        body: payload,
      })
      expenses.value = expenses.value.map((e) => (e.id === id ? updated : e))
      toasts.success("Расход обновлён")
      return updated
    } catch (e: any) {
      handleApiError(e)
      toasts.error("Не удалось сохранить изменения")
      return null
    } finally {
      saving.value = false
    }
  }

  async function removeExpense(id: number): Promise<boolean> {
    const { call } = useApi()
    const toasts = useToastsStore()
    resetErrors()
    try {
      await call(`/finance/expenses/${id}/`, { method: "DELETE" })
      expenses.value = expenses.value.filter((e) => e.id !== id)
      toasts.success("Расход удалён")
      return true
    } catch (e: any) {
      errorText.value = e?.data?.detail ?? "Не удалось удалить расход"
      toasts.error("Не удалось удалить")
      return false
    }
  }

  function handleApiError(e: any) {
    const data = e?.data
    if (data && typeof data === "object") {
      if (data.detail) errorText.value = String(data.detail)
      else fieldErrors.value = data as FieldErrors
    } else {
      errorText.value = "Не удалось сохранить"
    }
  }

  return {
    summary,
    expenses,
    loadingSummary,
    loadingExpenses,
    saving,
    errorText,
    fieldErrors,
    fetchSummary,
    fetchExpenses,
    createExpense,
    updateExpense,
    removeExpense,
    resetErrors,
    fieldError,
  }
})
