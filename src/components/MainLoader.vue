<script setup lang="ts">
interface Props {
  height?: string
}

withDefaults(defineProps<Props>(), {
  height: '250px',
})
</script>

<template>
  <div class="loader">
    <QCard>
      <QCardSection>
        <QSkeleton type="text" width="40%" class="q-mb-md" />
        <QSkeleton type="rect" :height="height" />
      </QCardSection>
    </QCard>
  </div>
</template>

<style scoped>
.loader {
  width: 100%;

  max-width: 500px;
}
</style>
