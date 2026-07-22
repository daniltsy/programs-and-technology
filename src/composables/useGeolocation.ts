import { ref } from 'vue'

interface Coordinates {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const coordinates = ref<Coordinates | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getLocation() {
    return new Promise<Coordinates>((resolve, reject) => {
      error.value = ''
      if (!navigator.geolocation) {
        error.value = 'Геолокация недоступна'
        reject(error.value)
        return
      }

      loading.value = true

      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          loading.value = false
          resolve(coordinates.value)
        },
        () => {
          error.value = 'Не удалось определить местоположение'
          loading.value = false
          reject(error.value)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }

  return {
    coordinates,
    loading,
    error,
    getLocation,
  }
}
