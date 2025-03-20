<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
      <BasicLayout />
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'

// 国际化
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

// const loginUserStore = useLoginUserStore()
// // loginUserStore.fetchLoginUser()
//
// onMounted(() => {
//
//   const health =  getLoginUserDetailUsingGet()
//   console.log(health)
// })
</script>

<style scoped>
#app {
}
</style>
