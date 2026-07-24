import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { mount } from '@vue/test-utils'

import SearchInput from '../SearchInput.vue'
import { SEARCH_DEBOUNCE } from '@/utils/constants.ts'

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function createWrapper(props = {}) {
    return mount(SearchInput, {
      props,

      global: {
        stubs: {
          QInput: {
            template: `
                <input
                  :value="modelValue"
                  :disabled="disable"
                  @input="
                    $emit(
                      'update:modelValue',
                      $event.target.value
                    )
                  "
                />
              `,
            props: ['modelValue', 'disable'],
          },

          QBtn: {
            template: `
                <button>
                  search
                </button>
              `,
          },
        },
      },
    })
  }

  it('рендерится', () => {
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
  })

  it('отправляет search после debounce', async () => {
    const wrapper = createWrapper()

    const input = wrapper.find('input')

    await input.setValue('Moscow')

    vi.advanceTimersByTime(SEARCH_DEBOUNCE)

    expect(wrapper.emitted('search')).toEqual([['Moscow']])

    expect(wrapper.emitted('update:modelValue')).toEqual([['Moscow']])
  })

  it('не отправляет событие для пустой строки', async () => {
    const wrapper = createWrapper()

    const input = wrapper.find('input')

    await input.setValue('')

    vi.advanceTimersByTime(SEARCH_DEBOUNCE)

    expect(wrapper.emitted('search')).toBeUndefined()
  })

  it('очищает значение', async () => {
    const wrapper = createWrapper()

    await wrapper.find('input').trigger('clear')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])

    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('передает disable в input', () => {
    const wrapper = createWrapper({
      disable: true,
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
