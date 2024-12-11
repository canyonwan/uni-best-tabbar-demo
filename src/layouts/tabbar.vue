<template>
  <div>
    <slot />
    <!-- 注意下面，多了一个自定义tabbar -->
    <fg-tabbar />
    <wd-toast />
    <wd-message-box />
  </div>
</template>

<script lang="ts" setup></script>
