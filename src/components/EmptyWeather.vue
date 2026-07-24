<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Погода пока не загружена',
  description: 'Разрешите доступ к геолокации или найдите город вручную',
})
</script>

<template>
  <QCard class="empty-card">
    <QCardSection class="text-center">
      <QIcon name="cloud" size="64px" color="grey" />
      <div class="title">
        {{ title }}
      </div>
      <div class="description">
        {{ description }}
      </div>
    </QCardSection>
  </QCard>
</template>

<style scoped>
.empty-card {
  width: 100%;
  max-width: 500px;
}

.title {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 600;
}

.description {
  margin-top: 8px;
  color: #777;
}
</style>
