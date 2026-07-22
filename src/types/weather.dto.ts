export interface WeatherResponseDto {
  weather: WeatherDto[]
  main: MainDto
  wind: WindDto
  name: string
}

interface WeatherDto {
  main: string
  description: string
  icon: string
}

interface MainDto {
  temp: number
  humidity: number
}

interface WindDto {
  speed: number
}
