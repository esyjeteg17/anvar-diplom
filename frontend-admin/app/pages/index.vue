<script setup lang="ts">
// Корневая страница — просто перекидываем на финансы (первая вкладка по умолчанию).
definePageMeta({ layout: false })
await navigateTo("/finance", { replace: true })
</script>

<template>
  <div />
</template>
