<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import SearchInput from '@/components/SearchInput.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import Loader from '@/components/MainLoader.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { useWeatherStore } from '@/stores/weather.store'
import { storeToRefs } from 'pinia'
import EmptyWeather from '@/components/EmptyWeather.vue'

const weatherStore = useWeatherStore()
const { error, loading, weather, hasWeather } = storeToRefs(weatherStore)

const { getLocation, error: geoError } = useGeolocation()

async function loadWeather() {
  try {
    const position = await getLocation()

    await weatherStore.fetchByCoordinates(position.latitude, position.longitude)
  } catch {
    weatherStore.clearWeather()
    Notify.create({
      type: 'negative',
      message: geoError.value || 'Не удалось определить местоположение',
    })
  }
}

async function searchCity(city: string) {
  await weatherStore.fetchByCity(city)
}

watch(error, (value) => {
  if (value) {
    Notify.create({
      type: 'negative',
      message: value,
    })
  }
})

onMounted(loadWeather)
</script>

<template>
  <div class="page">
    <SearchInput @search="searchCity" @clear="loadWeather" :disable="loading" />
    <Loader v-if="loading" />
    <WeatherCard v-else-if="hasWeather" :weather="weather!" />
    <EmptyWeather v-else />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px;
}
</style>
