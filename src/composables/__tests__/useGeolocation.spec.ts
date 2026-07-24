import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useGeolocation } from '../useGeolocation'

type GetCurrentPosition = (
  success: PositionCallback,
  error?: PositionErrorCallback,
  options?: PositionOptions,
) => void

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('успешно получает координаты', async () => {
    const mockPosition = {
      coords: {
        latitude: 55.75,
        longitude: 37.61,
      },
    }

    const getCurrentPosition = vi.fn<GetCurrentPosition>((success) => {
      success(mockPosition as GeolocationPosition)
    })

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition,
      },
      configurable: true,
    })

    const { getLocation, coordinates, loading, error } = useGeolocation()

    const result = await getLocation()

    expect(result).toEqual({
      latitude: 55.75,
      longitude: 37.61,
    })

    expect(coordinates.value).toEqual({
      latitude: 55.75,
      longitude: 37.61,
    })

    expect(loading.value).toBe(false)

    expect(error.value).toBe('')

    expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  })

  it('обрабатывает ошибку получения координат', async () => {
    const getCurrentPosition = vi.fn<GetCurrentPosition>((_, errorCallback) => {
      errorCallback?.({} as GeolocationPositionError)
    })

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition,
      },
      configurable: true,
    })

    const { getLocation, loading, error } = useGeolocation()

    await expect(getLocation()).rejects.toBe('Не удалось определить местоположение')

    expect(error.value).toBe('Не удалось определить местоположение')

    expect(loading.value).toBe(false)
  })

  it('обрабатывает отсутствие поддержки геолокации', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    })

    const { getLocation, loading, error } = useGeolocation()

    await expect(getLocation()).rejects.toBe('Геолокация недоступна')

    expect(error.value).toBe('Геолокация недоступна')

    expect(loading.value).toBe(false)
  })
})
