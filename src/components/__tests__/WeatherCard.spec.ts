import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'

import WeatherCard from '../WeatherCard.vue'

import type { Weather } from '@/types/weather'

describe('WeatherCard', () => {
  const weatherMock: Weather = {
    city: 'Moscow',
    temperature: 20,
    description: 'пасмурно',
    icon: '04d',
    humidity: 80,
    windSpeed: 5,
  }

  function createWrapper() {
    return mount(WeatherCard, {
      props: {
        weather: weatherMock,
      },

      global: {
        stubs: {
          QCard: {
            template: '<div><slot /></div>',
          },

          QCardSection: {
            template: '<section><slot /></section>',
          },

          QSeparator: {
            template: '<hr />',
          },

          QIcon: {
            template: '<span />',
          },
        },
      },
    })
  }

  it('рендерит город', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Moscow')
  })

  it('рендерит температуру', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('20°C')
  })

  it('рендерит описание погоды', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('пасмурно')
  })

  it('рендерит влажность', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Влажность')
    expect(wrapper.text()).toContain('80%')
  })

  it('рендерит скорость ветра', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Ветер')
    expect(wrapper.text()).toContain('5 м/с')
  })

  it('формирует корректную ссылку на иконку', () => {
    const wrapper = createWrapper()

    const image = wrapper.find('img')

    expect(image.attributes('src')).toBe('https://openweathermap.org/img/wn/04d@2x.png')
    expect(image.attributes('alt')).toBe('weather icon')
  })
})
