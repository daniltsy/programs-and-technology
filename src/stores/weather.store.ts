import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { weatherService } from '@/services/weather.service'

import type { Weather } from '@/types/weather'
import axios, { AxiosError } from 'axios'

export const UNKONWN_ERROR = 'Неизвестная ошибка'
export const CITY_NOT_FOUND = 'Город не найден'
export const API_KEY_ERROR = 'Ошибка API ключа'
export const FETCH_ERROR = 'Ошибка загрузки данных'

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
      if (axios.isAxiosError(e)) {
        error.value = getErrorMessage(e)
      } else {
        error.value = UNKONWN_ERROR
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
      if (axios.isAxiosError(e)) {
        error.value = getErrorMessage(e)
      } else {
        error.value = UNKONWN_ERROR
      }
    } finally {
      loading.value = false
    }
  }

  function getErrorMessage(error: AxiosError) {
    if (error.response?.status === 404) {
      return CITY_NOT_FOUND
    }

    if (error.response?.status === 401) {
      return API_KEY_ERROR
    }

    return FETCH_ERROR
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
