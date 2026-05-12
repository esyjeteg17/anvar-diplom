<template>
  <!-- Корневой контейнер админки. Layout-ы сами рисуют свой каркас. -->
  <div class="min-h-screen bg-bg text-ink">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
