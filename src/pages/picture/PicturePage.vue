<template>
  <div id="picture-page">
    <!-- 吸顶搜索容器 -->
    <div :class="['sticky-header', { sticky: isSticky }]">
      <div class="search-with-logo">
        <img src="@/assets/logo.ico" alt="logo" class="search-logo" />
        <a-input-search
          v-model:value="searchParams.searchText"
          placeholder="从海量图库中搜索图片..."
          enter-button="搜索"
          size="large"
          @search="doHomeSearch('search')"
          class="logo-search"
        />
      </div>

      <!-- 分类标签 -->
      <a-tabs v-model:activeKey="selectedCategory" @change="doHomeSearch">
        <a-tab-pane key="ALL" tab="全部图片" />
        <a-tab-pane
          v-for="category in homeCategoryList"
          :key="category.categoryId"
          :tab="`${category.name}`"
        />
      </a-tabs>
    </div>

    <!-- 占位元素 -->
    <div v-if="isSticky" class="sticky-placeholder"></div>

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

// 新增吸顶状态
const isSticky = ref(false)

// 滚动监听
const checkSticky = () => {
  isSticky.value = window.scrollY > 100
}

/**
 * 初始化页面
 */
onMounted(() => {
  window.addEventListener('scroll', checkSticky)
  getHomeCategoryList()
  // 延迟执行初始图片加载，确保DOM已准备好
  setTimeout(() => {
    getHomePictureList()
  }, 100)
  window.addEventListener('scroll', handleScrollDebounced)
})

/**
 * 卸载页面
 */
onUnmounted(() => {
  window.removeEventListener('scroll', checkSticky)
  window.removeEventListener('scroll', handleScrollDebounced)
})

const loadingLock = ref(false)

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
  if (loadingFinish.value || loadingLock.value) return // 如果已经加载完毕，直接返回
  loadingLock.value = true
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
  loadingLock.value = false
}

/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 20,
})
/**
 * 搜索
 */
const doHomeSearch = (type: string) => {
  // if (selectedCategory.value === 'ALL' && !searchParams.searchText) {
  //   message.warning('请输入搜索内容！')
  //   return
  // }
  if (type === 'search') {
    if (!searchParams.searchText) {
      message.warning('请输入搜索内容！')
      return
    }
  }
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
  // 延迟检查，确保DOM更新完成
  setTimeout(() => {
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    const clientHeight =
      window.innerHeight ||
      Math.min(document.documentElement.clientHeight, document.body.clientHeight)

    if (scrollHeight <= clientHeight && !loadingFinish.value) {
      searchParams.current++
      getHomePictureList()
    }
  }, 300)
}
/**
 * 滚动加载
 */
const handleScroll = () => {
  if (loadingFinish.value || homeLoading.value) return
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight =
    window.innerHeight ||
    Math.min(document.documentElement.clientHeight, document.body.clientHeight)

  // 增加更严格的判断条件
  if (scrollHeight - (clientHeight + scrollTop) < 500) {
    searchParams.current++
    getHomePictureList()
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
// 在setup外部定义防抖函数
const handleScrollDebounced = debounce(handleScroll, 200)
</script>

<style scoped>
/* 吸顶容器 */
.sticky-header {
  background: white;
  transition: all 0.3s ease;
  padding: 0 20px;
}

/* 吸顶状态 */
.sticky-header.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 100% !important;
}

/* 占位元素 */
.sticky-placeholder {
  height: calc(50px + 46px + 48px); /* logo高度 + 搜索框高度 + 标签高度 + 间距 */
}

/* 带logo的搜索容器 */
.search-with-logo {
  display: flex;
  align-items: center;
  max-width: 800px;
  margin: 20px auto 10px;
  gap: 12px;
}

/* logo样式 */
.search-logo {
  height: 70px;
  width: auto;
  object-fit: contain;
}

/* 调整后的搜索框 */
.logo-search {
  flex: 1;
  max-width: 700px;
}

.logo-search :deep(.ant-input) {
  border-radius: 24px 0 0 24px !important;
  height: 46px;
  font-size: 16px;
  border-color: #d9d9d9;
}

.logo-search :deep(.ant-input:hover),
.logo-search :deep(.ant-input:focus) {
  border-color: #4096ff;
}

.logo-search :deep(.ant-input-group-addon .ant-btn) {
  border-radius: 0 24px 24px 0 !important;
  height: 46px;
  width: 90px;
  background-color: #4096ff;
  color: white;
  border-color: #4096ff;
}

.logo-search :deep(.ant-input-group-addon .ant-btn:hover) {
  background-color: #1677ff;
  border-color: #1677ff;
}

/* 分类标签样式 */
:deep(.ant-tabs) {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.ant-tabs-nav) {
  margin: 0;
}

:deep(.ant-tabs-tab) {
  padding: 12px 16px;
  font-size: 15px;
  color: #666;
  transition: all 0.2s;
}

:deep(.ant-tabs-tab:hover) {
  color: #4096ff;
}

:deep(.ant-tabs-tab-active) {
  color: #4096ff;
  font-weight: 500;
}

:deep(.ant-tabs-ink-bar) {
  background: #4096ff;
  height: 3px;
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
  height: 300px;
}
</style>
