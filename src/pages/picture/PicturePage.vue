<template>
  <div id="picture-page">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        placeholder="从海量图片中搜索"
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        size="large"
        @search="doHomeSearch"
      />
    </div>

    <!-- 分类列表 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doHomeSearch">
      <a-tab-pane key="ALL" tab="全部图片" />
      <a-tab-pane
        v-for="category in homeCategoryList"
        :key="category.categoryId"
        :tab="`${category.name}（${category.useNum}）`"
      />
    </a-tabs>

    <!-- 图片列表 -->
    <div v-if="homeLoading" class="loading-spinner">
      <a-spin size="large" tip="加载中..." />
    </div>
    <div v-else>
      <!-- 图片列表 -->
      <PictureList
        :pictureList="homePictureList"
        :loading="homeLoading"
        :showView="true"
        :showLike="true"
        :showCollect="true"
        :showShare="true"
        :showSearch="true"
      />

      <!-- 加载信息 -->
      <div class="loadingInfo">
        <a-spin v-if="homeLoading" size="large" />
        <div v-if="showBottomLine">
          <a-divider v-if="homePictureList.length > 0" style="color: #666666">
            🦖🦖🦖 这是我的底线~
          </a-divider>
          <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { Empty, message } from 'ant-design-vue'
import PictureList from '@/components/picture/HomePictureList.vue'
import { getCategoryListAsHomeUsingGet } from '@/api/categoryController'
import { getPicturePageListAsHomeUsingGet } from '@/api/pictureController'

/**
 * 加载变量状态
 */
const homeLoading = ref(true)
/**
 * 加载完成状态
 */
const loadingFinish = ref(false)
/**
 * 控制底线显示
 */
const showBottomLine = ref(false)

/**
 * 初始化页面
 */
onMounted(() => {
  getHomeCategoryList()
  getHomePictureList()
  window.addEventListener('scroll', debounce(handleScroll, 200))
})

/**
 * 卸载页面
 */
onUnmounted(() => {
  window.removeEventListener('scroll', debounce(handleScroll, 200))
})

/**
 * 当前选中的分类
 */
const selectedCategory = ref<string>('ALL')
/**
 * 首页分类列表
 */
const homeCategoryList = ref<API.CategoryVO[]>([])
/**
 * 获取首页分类列表
 */
const getHomeCategoryList = async () => {
  const res = await getCategoryListAsHomeUsingGet()
  if (res.code === 0 && res.data) {
    homeCategoryList.value = res.data ?? []
  } else {
    message.error('分类加载失败! ' + res.message)
  }
}

/**
 * 首页图片列表
 */
const homePictureList = ref<API.PictureHomeVO[]>([])
/**
 * 获取首页图片列表
 */
const getHomePictureList = async () => {
  if (loadingFinish.value) return // 如果已经加载完毕，直接返回
  // homeLoading.value = true
  // 发请求
  const res = await getPicturePageListAsHomeUsingGet(searchParams)
  if (res.code === 0 && res.data) {
    const newRecords = res.data.records || []
    homePictureList.value = [...homePictureList.value, ...newRecords]

    // 判断是否没有更多数据
    if (newRecords.length < searchParams.pageSize) {
      loadingFinish.value = true // 没有更多数据了
      window.removeEventListener('scroll', handleScroll) // 移除滚动监听

      // 延迟 1 秒后显示底线
      setTimeout(() => {
        showBottomLine.value = true
      }, 1000)
    } else {
      // 检查页面高度是否小于屏幕高度
      checkPageHeight()
    }
  } else {
    message.error('图片加载失败! ' + res.message)
  }
  homeLoading.value = false
}

/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
})
/**
 * 搜索
 */
const doHomeSearch = () => {
  homeLoading.value = true
  searchParams.current = 1
  // 处理分类
  if (selectedCategory.value !== 'ALL') {
    searchParams.categoryId = selectedCategory.value
  } else {
    searchParams.categoryId = undefined
  }
  loadingFinish.value = false
  showBottomLine.value = false
  homePictureList.value = []
  getHomePictureList()
}

/**
 * 检查页面高度是否小于屏幕高度
 */
const checkPageHeight = () => {
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  const clientHeight =
    window.innerHeight ||
    Math.min(document.documentElement.clientHeight, document.body.clientHeight)

  // 如果页面高度小于屏幕高度，继续加载下一页
  if (scrollHeight <= clientHeight && !loadingFinish.value) {
    searchParams.current++
    getHomePictureList()
  }
}
/**
 * 滚动加载
 */
const handleScroll = () => {
  if (loadingFinish.value || homeLoading.value) return // 如果已经加载完毕或正在加载，直接返回
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight =
    window.innerHeight ||
    Math.min(document.documentElement.clientHeight, document.body.clientHeight)

  // 滚动到底部时加载更多
  if (clientHeight + scrollTop + 100 >= scrollHeight) {
    searchParams.current++
    getHomePictureList() // 发送下一页的请求
  }
}
/**
 * 防抖函数
 */
const debounce = (fn, delay) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
</script>

<style scoped>
#picture-page .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

.loadingInfo {
  text-align: center;
  padding: 30px 50px;
  margin: 20px 0;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px; /* 设置一个合适的高度 */
}
</style>
