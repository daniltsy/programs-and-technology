<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string | number
}

defineProps<Props>()
</script>

<template>
  <div class="weather-info">
    <QIcon :name="icon" size="28px" />
    <div class="content">
      <div class="label">
        {{ label }}
      </div>
      <div class="value">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #777;
}

.value {
  font-size: 18px;
  font-weight: 600;
}
</style>
