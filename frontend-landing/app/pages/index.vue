<script setup lang="ts">
// Главная страница лендинга. Здесь собираются все секции по порядку.
// Сама вёрстка секций живёт в `components/sections/*` — этот файл только композиция.
useHead({ title: "SBORIKA — школа инженерного мышления для детей" })
</script>

<template>
  <div>
    <TheNavbar />
    <HeroSection />

    <!-- Бегущая лента-разделитель: ритм + декор, плавный переход к следующей секции. -->
    <MarqueeRibbon background="ink" :speed="180" />

    <AboutSection />
    <StatsSection />
    <LessonsSection />

    <!-- Вторая лента — на сине-сером фоне, перед "холодной" частью лендинга. -->
    <MarqueeRibbon background="slate" :speed="220" />

    <CentersSection />
    <!-- Преподаватели — пока заглушка, контент добавим позже -->
    <TeachersSection />
    <QuizSection />
    <ContactsSection />
    <SiteFooter />
  </div>
</template>
