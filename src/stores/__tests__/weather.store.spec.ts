import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'

import {
  API_KEY_ERROR,
  CITY_NOT_FOUND,
  FETCH_ERROR,
  UNKONWN_ERROR,
  useWeatherStore,
} from '../weather.store'

import { weatherService } from '@/services/weather.service'

import type { Weather } from '@/types/weather'

vi.mock('@/services/weather.service', () => ({
  weatherService: {
    getCurrentWeather: vi.fn<() => void>(),
    getWeatherByCity: vi.fn<() => void>(),
  },
}))

describe('WeatherStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.clearAllMocks()
  })

  const weatherMock: Weather = {
    city: 'Moscow',
    temperature: 20,
    description: 'пасмурно',
    icon: '04d',
    humidity: 80,
    windSpeed: 5,
  }

  describe('fetchByCity', () => {
    it('успешно получает погоду по городу', async () => {
      vi.mocked(weatherService.getWeatherByCity).mockResolvedValue(weatherMock)

      const store = useWeatherStore()
      await store.fetchByCity('Moscow')

      expect(weatherService.getWeatherByCity).toHaveBeenCalledWith('Moscow')
      expect(store.weather).toEqual(weatherMock)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.hasWeather).toBe(true)
    })

    it('обрабатывает ошибку 404', async () => {
      vi.mocked(weatherService.getWeatherByCity).mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 404,
        },
      })

      const store = useWeatherStore()
      await store.fetchByCity('Unknown')

      expect(store.weather).toBeNull()
      expect(store.error).toBe(CITY_NOT_FOUND)
      expect(store.loading).toBe(false)
    })

    it('обрабатывает ошибку 401', async () => {
      vi.mocked(weatherService.getWeatherByCity).mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 401,
        },
      })

      const store = useWeatherStore()
      await store.fetchByCity('Москва')

      expect(store.weather).toBeNull()
      expect(store.error).toBe(API_KEY_ERROR)
      expect(store.loading).toBe(false)
    })

    it('обрабатывает API ошибку', async () => {
      vi.mocked(weatherService.getWeatherByCity).mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 500,
        },
      })

      const store = useWeatherStore()
      await store.fetchByCity('Москва')

      expect(store.weather).toBeNull()
      expect(store.error).toBe(FETCH_ERROR)
      expect(store.loading).toBe(false)
    })

    it('обрабатывает неизвестную ошибку', async () => {
      vi.mocked(weatherService.getWeatherByCity).mockRejectedValue(
        new Error('Something went wrong'),
      )

      const store = useWeatherStore()

      await store.fetchByCity('Moscow')

      expect(store.error).toBe(UNKONWN_ERROR)
    })
  })

  describe('fetchByCoordinates', () => {
    it('получает погоду по координатам', async () => {
      vi.mocked(weatherService.getCurrentWeather).mockResolvedValue(weatherMock)

      const store = useWeatherStore()
      await store.fetchByCoordinates(55.75, 37.61)

      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(55.75, 37.61)
      expect(store.weather).toEqual(weatherMock)
    })
  })

  describe('clearWeather', () => {
    it('очищает текущую погоду', async () => {
      vi.mocked(weatherService.getWeatherByCity).mockResolvedValue(weatherMock)

      const store = useWeatherStore()
      await store.fetchByCity('Moscow')

      expect(store.hasWeather).toBe(true)
      store.clearWeather()
      expect(store.weather).toBeNull()
      expect(store.hasWeather).toBe(false)
    })
  })
})
