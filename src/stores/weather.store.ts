import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { weatherService } from '@/services/weather.service'

import type { Weather } from '@/types/weather'
import { AxiosError } from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const weather = ref<Weather | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasWeather = computed(() => !!weather.value)

  async function fetchByCoordinates(lat: number, lon: number) {
    loading.value = true
    error.value = null

    try {
      weather.value = await weatherService.getCurrentWeather(lat, lon)
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value = getErrorMessage(e)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchByCity(city: string) {
    loading.value = true
    error.value = null

    try {
      weather.value = await weatherService.getWeatherByCity(city)
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        error.value = getErrorMessage(e)
      }
    } finally {
      loading.value = false
    }
  }

  function getErrorMessage(error: AxiosError) {
    if (error.response?.status === 404) {
      return 'Город не найден'
    }

    if (error.response?.status === 401) {
      return 'Ошибка API ключа'
    }

    return 'Ошибка загрузки данных'
  }

  function clearWeather() {
    weather.value = null
  }

  return {
    weather,
    loading,
    error,
    hasWeather,
    fetchByCoordinates,
    fetchByCity,
    clearWeather,
  }
})
