import { weatherApi } from '@/api/weather.api'

import type { WeatherResponseDto } from '@/types/weather.dto'

import type { Weather } from '@/types/weather'

class WeatherService {
  async getCurrentWeather(lat: number, lon: number): Promise<Weather> {
    const { data } = await weatherApi.getByCoords(lat, lon)

    return this.mapWeather(data)
  }

  async getWeatherByCity(city: string): Promise<Weather> {
    const { data } = await weatherApi.getByCity(city)

    return this.mapWeather(data)
  }

  private mapWeather(data: WeatherResponseDto): Weather {
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0]?.description ?? '',
      icon: data.weather[0]?.icon ?? '',
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    }
  }
}

export const weatherService = new WeatherService()
