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
<script lang="ts" setup>
import PLATFORM from '@/utils/platform'
import { useThemeStore } from '@/store/theme'
import { useToast } from 'wot-design-uni'

const themeStore = useThemeStore()
const toast = useToast()
defineOptions({
  name: 'Home',
})

function showToast() {
  toast.show('提示信息')
}
function onToggleThemeColor(item: string) {
  themeStore.toggleThemeColor(item)
}

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const author = ref('菲鸽')
const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)

// 测试 uni API 自动引入
onLoad(() => {})

function handleClick() {
  uni.navigateTo({
    url: '/pages-sub/test-b/index',
  })
}

function handleToggleTheme() {
  themeStore.toggleTheme()
}

function handleGetPhoneNumber(e) {}

function handleAgreePrivacyAuthorization(e) {}
</script>

<template>
  <div class="overflow-hidden pt-2 px-4" :style="{ marginTop: safeAreaInsets?.top + 'px' }">
    <div class="text-justify max-w-100 m-auto text-4 indent mb-2">{{ description }}</div>
    <div class="text-center mt-8">
      当前平台是：
      <text class="text-green-500">{{ PLATFORM.platform }}</text>
    </div>
    <div class="text-center mt-4">
      模板分支是：
      <text class="text-green-500">tabbar</text>
    </div>
    <wd-img src="/static/images/test_icon.jpg" :width="24" :height="24" />
    <wd-icon class-prefix="iconfont icon-my" name="" :color="themeStore.currentThemeColor" />
    <wd-button @click="showToast">测试按钮</wd-button>
    <wd-button @click="handleToggleTheme">切换主题</wd-button>

    <view
      :style="{ backgroundColor: item }"
      class="w-20 h-20 rounded-xl flex justify-between"
      v-for="item in themeStore.themeColors"
      :key="item"
      @click="onToggleThemeColor(item)"
    >
      {{ item }}
    </view>

    <!-- 颜色的多选按钮 -->
  </div>
</template>

<style lang="scss" scoped>
.main-title-color {
  color: #d14328;
}
</style>
