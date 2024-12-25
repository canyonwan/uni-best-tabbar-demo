<script setup lang="ts">
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { currentTheme, themeVars } = storeToRefs(themeStore)
</script>
<template>
  <wd-config-provider :theme="currentTheme" :theme-vars="themeVars">
    <KuRootView />
  </wd-config-provider>
</template>
