<script setup lang="ts">
/**
 * Форма обратной связи. Локально хранит значения полей, валидацию и отправку
 * делегирует Pinia-стору useLeadsStore (он уже знает, как пойти в Django).
 *
 * Если пользователь только что прошёл квиз — leadIntent stор хранит
 * полученный промокод и source="landing/quiz". Форма показывает плашку
 * «Применён промокод …» и прикрепляет код+source к запросу на бэк.
 *
 * После успешной отправки форма заменяется на «Спасибо!»-экран и
 * leadIntent очищается, чтобы повторная подача стартовала с чистого состояния.
 */

import { useLeadsStore } from "~/stores/leads"
import { useLeadIntentStore } from "~/stores/leadIntent"

const leads = useLeadsStore()
const leadIntent = useLeadIntentStore()

const name = ref<string>("")
const phone = ref<string>("")
const message = ref<string>("")

/** Получить ошибку конкретного поля из ответа DRF (массив сообщений → одна строка). */
function fieldError(name: string): string | undefined {
  const arr = leads.fieldErrors[name]
  return Array.isArray(arr) && arr.length ? arr[0] : undefined
}

async function onSubmit() {
  const ok = await leads.submit({
    name: name.value,
    phone: phone.value,
    message: message.value,
    // Источник и промокод подтягиваем из leadIntent — заполнены если зашли с квиза.
    source: leadIntent.source,
    promo_code: leadIntent.promoCode ?? undefined,
  })
  if (ok) {
    // Очищаем поля и намерение — следующая подача начнёт с чистого состояния.
    name.value = ""
    phone.value = ""
    message.value = ""
    leadIntent.clear()
  }
}

function sendAnother() {
  leads.reset()
}

// При размонтировании — сбрасываем стор, чтобы при следующем монтировании
// форма открылась без «прилипшей» success-плашки.
onBeforeUnmount(() => leads.reset())
</script>

<template>
  <div class="rounded-2xl bg-white border border-line/60 shadow-sm p-6 sm:p-8">
    <!-- Состояние «успешно отправлено» -->
    <div v-if="leads.success" class="text-center py-4">
      <div class="mb-4 flex justify-center">
        <IconGear :size="56" color="brand" :hole-radius="30" />
      </div>
      <h3 class="text-2xl font-bold text-ink mb-2">Заявка отправлена</h3>
      <p class="text-slate text-base mb-6">
        Мы свяжемся с вами в ближайшее время и согласуем удобное время пробного занятия.
      </p>
      <BrandButton variant="outline" size="md" @click="sendAnother">
        Отправить ещё одну
      </BrandButton>
    </div>

    <!-- Форма -->
    <form v-else class="space-y-5" @submit.prevent="onSubmit">
      <h3 class="text-xl sm:text-2xl font-bold text-ink mb-1">Оставьте заявку</h3>
      <p class="text-sm text-slate mb-2">Перезвоним в течение рабочего дня.</p>

      <!-- Плашка о применённом промокоде из квиза. -->
      <div
        v-if="leadIntent.promoCode"
        class="flex items-center gap-3 rounded-xl border-2 border-dashed border-brand bg-brand/5 px-4 py-3"
      >
        <IconGear :size="32" color="brand" :hole-radius="30" />
        <div class="flex-1">
          <p class="text-xs font-semibold uppercase tracking-wider text-brand">
            Применён промокод
          </p>
          <p class="text-base font-black text-brand tracking-widest font-mono">
            {{ leadIntent.promoCode }}
          </p>
        </div>
        <button
          type="button"
          class="text-xs font-semibold text-slate hover:text-ink"
          @click="leadIntent.clear()"
        >
          Убрать
        </button>
      </div>

      <FormField
        id="lead-name"
        v-model="name"
        label="Как вас зовут"
        placeholder="Имя"
        required
        autocomplete="name"
        :error="fieldError('name')"
      />

      <FormField
        id="lead-phone"
        v-model="phone"
        type="tel"
        label="Телефон"
        placeholder="+7 (___) ___-__-__"
        required
        autocomplete="tel"
        :error="fieldError('phone')"
      />

      <FormField
        id="lead-message"
        v-model="message"
        type="textarea"
        label="Комментарий"
        placeholder="Например: возраст ребёнка, удобный район, вопросы — что угодно"
        :error="fieldError('message')"
      />

      <!-- Общая ошибка (когда DRF вернул `detail` или сетевая) -->
      <p v-if="leads.errorText" class="text-sm font-medium text-brand">
        {{ leads.errorText }}
      </p>

      <BrandButton
        type="submit"
        variant="primary"
        size="lg"
        block
        :disabled="leads.loading"
      >
        {{ leads.loading ? "Отправляем…" : "Отправить заявку" }}
      </BrandButton>

      <p class="text-xs text-slate/80 leading-relaxed">
        Нажимая на кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  </div>
</template>
