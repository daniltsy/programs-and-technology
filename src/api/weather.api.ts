import { api } from './axios'
import type { WeatherResponseDto } from '@/types/weather.dto'

const API_KEY = import.meta.env.VITE_API_KEY

export const weatherApi = {
  getByCity(city: string) {
    return api.get<WeatherResponseDto>('/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'ru',
      },
    })
  },

  getByCoords(lat: number, lon: number) {
    return api.get<WeatherResponseDto>('/weather', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'ru',
      },
    })
  },
}
