<script setup lang="ts">
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { currentTheme, themeVars } = storeToRefs(themeStore)
</script>
<template>
  <WdConfigProvider :theme="currentTheme" :theme-vars="themeVars">
    <KuRootView />
  </WdConfigProvider>
</template>
