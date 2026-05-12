<script setup lang="ts">
/**
 * Секция «Контакты» — двухколоночный блок: контактная информация слева,
 * форма обратной связи справа. На мобильных секции выкладываются друг под другом.
 */
</script>

<template>
  <SectionWrapper id="contacts" background="bg" padding="lg">
    <BackgroundGears variant="corners" />

    <Reveal direction="up">
      <SectionHeading
        eyebrow="Контакты"
        title="Свяжитесь с нами"
        description="Позвоните, напишите ВКонтакте или оставьте заявку через форму — ответим в ближайшее время."
      />
    </Reveal>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
      <Reveal direction="right">
        <ContactsInfo />
      </Reveal>
      <Reveal direction="left" :delay="120">
        <ContactsForm />
      </Reveal>
    </div>
  </SectionWrapper>
</template>
