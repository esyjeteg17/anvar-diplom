import { defineStore } from "pinia"

export const useAppStore = defineStore("app", () => {
  const ready = ref(false)

  function markReady() {
    ready.value = true
  }

  return { ready, markReady }
})
