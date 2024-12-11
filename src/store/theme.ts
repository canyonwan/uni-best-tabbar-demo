import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ConfigProviderThemeVars } from 'wot-design-uni'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 主题色数组
    const themeColors = ['#007bff', '#000000', '#686210']

    const currentTheme = ref<'light' | 'dark'>('dark') // 当前主题，指定类型
    const currentThemeColor = ref(themeColors[0]) // 当前主题色
    const themeVars = ref<ConfigProviderThemeVars>()

    // 切换主题的函数
    function toggleTheme(mode?: 'light' | 'dark') {
      currentTheme.value = mode || (currentTheme.value === 'light' ? 'dark' : 'light')
    }

    function toggleThemeColor(themeColor: string) {
      currentThemeColor.value = themeColor
      themeVars.value = {
        colorTheme: currentThemeColor.value,
      }
    }

    return { currentTheme, themeColors, toggleTheme, toggleThemeColor, themeVars }
  },
  {
    persist: true,
  },
)
