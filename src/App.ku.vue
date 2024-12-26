<script setup lang="ts">
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { currentTheme, themeVars, currentThemeColor } = storeToRefs(themeStore)
</script>
<template>
  <wd-config-provider :theme="currentTheme" :theme-vars="themeVars">
    <KuRootView />
  </wd-config-provider>
</template>
<style lang="scss">
:root,
page {
  --wot-color-success: red;
  --wot-color-warning: yellow;
  // background-color: var(--currentThemeColor);
}
</style>
