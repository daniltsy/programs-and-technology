<script setup lang="ts">
import WeatherInfo from './WeatherInfo.vue'

import type { Weather } from '@/types/weather'

interface Props {
  weather: Weather
}

defineProps<Props>()

const weatherIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`
</script>

<template>
  <QCard class="weather-card">
    <QCardSection>
      <div class="city">
        {{ weather.city }}
      </div>

      <div class="temperature">{{ weather.temperature }}°C</div>

      <div class="description">
        <img :src="weatherIconUrl(weather.icon)" alt="weather icon" />
        <span>
          {{ weather.description }}
        </span>
      </div>
    </QCardSection>

    <QSeparator />

    <QCardSection class="info-grid">
      <WeatherInfo icon="water_drop" label="Влажность" :value="`${weather.humidity}%`" />
      <WeatherInfo icon="air" label="Ветер" :value="`${weather.windSpeed} м/с`" />
    </QCardSection>
  </QCard>
</template>

<style scoped>
.weather-card {
  width: 100%;

  max-width: 500px;
}

.city {
  font-size: 24px;

  font-weight: 600;
}

.temperature {
  font-size: 64px;

  font-weight: 700;

  margin: 20px 0;
}

.description {
  display: flex;

  align-items: center;

  font-size: 18px;

  text-transform: capitalize;
}

.description img {
  width: 64px;
}

.info-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 20px;
}

@media (max-width: 600px) {
  .temperature {
    font-size: 48px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
