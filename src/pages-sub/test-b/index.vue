<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '测试B',
  },
}
</route>

<template>
  <wd-button>测试按钮</wd-button>
  <!-- <wd-cell title="切换暗黑" title-width="240px" center>
    <wd-switch v-model="themeStore.currentTheme" />
  </wd-cell> -->
  <view
    :style="{ backgroundColor: item }"
    class="w-20 h-20 rounded-xl flex justify-between"
    v-for="item in themeStore.themeColors"
    :key="item"
    @click="onToggleThemeColor(item)"
  >
    {{ item }}
  </view>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

// defineOptions({
//   options: {
//     addGlobalClass: true,
//     virtualHost: true,
//     styleIsolation: 'shared',
//   },
// })

const themeStore = useThemeStore()

function onToggleThemeColor(item: string) {
  themeStore.toggleThemeColor(item)
}
</script>
