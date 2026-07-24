import { beforeEach, describe, expect, it, vi } from 'vitest'

import { weatherService } from '../weather.service'
import { weatherApi } from '@/api/weather.api'
import type { WeatherResponseDto } from '@/types/weather.dto'

vi.mock('@/api/weather.api', () => ({
  weatherApi: {
    getByCity: vi.fn<() => void>(),
    getByCoords: vi.fn<() => void>(),
  },
}))

describe('WeatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const response: WeatherResponseDto = {
    name: 'Moscow',
    weather: [
      {
        main: 'Clouds',
        description: 'пасмурно',
        icon: '04d',
      },
    ],
    main: {
      temp: 21.4,
      humidity: 75,
    },
    wind: {
      speed: 5.6,
    },
  }

  describe('getWeatherByCity', () => {
    it('должен преобразовывать DTO в Weather', async () => {
      vi.mocked(weatherApi.getByCity).mockResolvedValue({
        data: response,
      } as Awaited<ReturnType<typeof weatherApi.getByCity>>)

      const weather = await weatherService.getWeatherByCity('Moscow')

      expect(weatherApi.getByCity).toHaveBeenCalledWith('Moscow')

      expect(weather).toEqual({
        city: 'Moscow',
        temperature: 21,
        description: 'пасмурно',
        icon: '04d',
        humidity: 75,
        windSpeed: 5.6,
      })
    })

    it('должен пробрасывать ошибку', async () => {
      vi.mocked(weatherApi.getByCity).mockRejectedValue(new Error('Network Error'))

      await expect(weatherService.getWeatherByCity('Moscow')).rejects.toThrow('Network Error')
    })
  })

  describe('getCurrentWeather', () => {
    it('должен получать погоду по координатам', async () => {
      vi.mocked(weatherApi.getByCoords).mockResolvedValue({
        data: response,
      } as Awaited<ReturnType<typeof weatherApi.getByCoords>>)

      await weatherService.getCurrentWeather(55.75, 37.61)

      expect(weatherApi.getByCoords).toHaveBeenCalledWith(55.75, 37.61)
    })

    it('должен пробрасывать ошибку', async () => {
      vi.mocked(weatherApi.getByCoords).mockRejectedValue(new Error('Network Error'))

      await expect(weatherService.getCurrentWeather(55.75, 37.61)).rejects.toThrow('Network Error')
    })
  })
})
