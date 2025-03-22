<template>
  <div id="app">
    <!--<a-watermark content="Ant Design Vue">-->
    <a-config-provider :locale="zhCN">
      <BasicLayout />
    </a-config-provider>
    <!--</a-watermark>-->
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'

// 国际化
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
</script>

<style scoped>
#app {
}
</style>
