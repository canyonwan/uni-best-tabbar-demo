<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <div
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <div class="mt-12">
      <image src="/static/logo.svg" alt="" class="w-28 h-28 block mx-auto" />
    </div>
    <div class="text-center text-4xl main-title-color mt-4">unibest</div>
    <div class="text-center text-2xl mt-2 mb-8">最好用的 uniapp 开发模板</div>

    <div class="text-justify max-w-100 m-auto text-4 indent mb-2">{{ description }}</div>
    <div class="text-center mt-8">
      当前平台是：
      <text class="text-green-500">{{ PLATFORM.platform }}</text>
    </div>
    <div class="text-center mt-4">
      模板分支是：
      <text class="text-green-500">tabbar</text>
    </div>
    <wd-button @click="handleClick">测试按钮</wd-button>
    <wd-button @click="handleToggleTheme">切换主题</wd-button>

    <!-- 颜色的多选按钮 -->
  </div>
</template>

<script lang="ts" setup>
import PLATFORM from '@/utils/platform'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const author = ref('菲鸽')
const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)
// 测试 uni API 自动引入
onLoad(() => {
  console.log(author)
})

function handleClick() {
  uni.navigateTo({
    url: '/pages-sub/test-b/index',
  })
}

function handleToggleTheme() {
  themeStore.toggleTheme()
}
</script>

<style lang="scss">
.main-title-color {
  color: #d14328;
}
</style>
