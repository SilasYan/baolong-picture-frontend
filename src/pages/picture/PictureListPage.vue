<template>
  <div id="space-manager-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <PicCenterOutlined />
            发布列表
          </a-typography-title>
        </a-typography>
        <!-- 操作 -->
        <a-space>
          <a-button size="large" ghost type="primary" @click="openAddEditPicture">
            <SendOutlined />
            发布图片
          </a-button>
        </a-space>
      </a-flex>
    </div>

    <a-divider />

    <!-- 搜索区域 -->
    <div class="custom-div search-region">
      <a-form
        class="custom-form"
        layout="inline"
        :model="pictureSearchParams"
        @finish="doPictureSearch"
      >
        <a-form-item label="关键词" name="searchText">
          <a-input
            v-model:value="pictureSearchParams.searchText"
            placeholder="从名称、描述、标签中搜索"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="图片名称" name="picName">
          <a-input
            v-model:value="pictureSearchParams.picName"
            placeholder="请输入图片名称"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="分类" name="categoryId">
          <a-select
            v-model:value="pictureSearchParams.categoryId"
            :options="categoryList"
            placeholder="请选择分类"
            style="min-width: 180px"
            allowClear
            size="large"
          />
        </a-form-item>
        <a-form-item label="图片格式" name="originFormat">
          <a-select
            v-model:value="pictureSearchParams.originFormat"
            :options="PIC_FORMAT_STATUS_OPTIONS"
            placeholder="请选择图片格式"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="审核状态" name="reviewStatus">
          <a-select
            v-model:value="pictureSearchParams.reviewStatus"
            :options="PIC_REVIEW_STATUS_OPTIONS"
            placeholder="请选择审核状态"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="上传日期" name="">
          <a-range-picker
            style="width: 300px"
            show-time
            v-model:value="dateRange"
            :placeholder="['开始日期', '结束日期']"
            format="YYYY/MM/DD"
            :presets="rangePresets"
            @change="onRangeChange"
            size="large"
          />
        </a-form-item>
        <a-form-item>
          <a-space size="large">
            <a-button type="primary" html-type="submit" :icon="h(SearchOutlined)" size="large">
              搜索
            </a-button>
            <a-button
              @click="refreshResetData"
              style="color: #1890ff; border-color: #1890ff"
              :icon="h(SyncOutlined)"
              size="large"
            >
              刷新重置数据
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <a-divider />

    <!-- 数据区域 -->
    <div class="custom-div data-region">
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }"
        :data-source="pictureList"
        :loading="pictureListLoading"
      >
        <template #renderItem="{ item: picture }">
          <a-list-item style="padding: 0">
            <!-- 单张图片 -->
            <a-badge-ribbon
              :text="PIC_REVIEW_STATUS_MAP[picture.reviewStatus]"
              :color="PIC_STATUS_TAG_COLOR[picture.reviewStatus]"
              style="width: 80px; height: 30px; font-size: 16px; text-align: center; line-height: 30px"
            >
              <a-card hoverable @click="doClickPicture(picture)">
                <template #cover>
                  <img
                    style="height: 250px; object-fit: cover"
                    :alt="picture.picName"
                    :src="picture.picUrl"
                    loading="lazy"
                  />
                </template>
                <a-card-meta>
                  <template #title>
                    {{ picture.picName }}
                    <a-tag v-if="picture.categoryInfo" color="green">
                      {{ picture.categoryInfo?.name }}
                    </a-tag>
                    <span v-else></span>
                  </template>
                </a-card-meta>
                <!-- 操作 -->
                <template #actions>
                  <div @click="(e) => doEditPicture(picture.pictureId, e)">
                    <EditOutlined />
                    编辑
                  </div>
                  <div @click="(e) => doDeletePicture(picture.pictureId, e)">
                    <DeleteOutlined />
                    删除
                  </div>
                  <div @click="(e) => doSharePicture(picture, e)">
                    <ShareAltOutlined />
                    分享
                  </div>
                </template>
              </a-card>
            </a-badge-ribbon>
          </a-list-item>
        </template>
      </a-list>
      <!-- 分页 -->
      <a-pagination
        style="text-align: right"
        v-model:current="pictureSearchParams.current"
        v-model:pageSize="pictureSearchParams.pageSize"
        :total="total"
        :show-total="() => `共 ${total} 条`"
        @change="handlePageChange"
      />
    </div>

    <!-- 分享弹框组件 -->
    <ShareModal ref="shareModal" :link="shareLink" />
  </div>
</template>

<script lang="ts" setup>
import {
  PicCenterOutlined,
  DeleteOutlined,
  EditOutlined,
  SendOutlined,
  SearchOutlined,
  ShareAltOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'
import { h, onMounted, reactive, ref } from 'vue'
import {
  PIC_FORMAT_STATUS_OPTIONS,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
  PIC_SHEAR_STATUS_ENUM,
  PIC_STATUS_TAG_COLOR,
} from '@/constants/picture'
import dayjs from 'dayjs'
import { message, Modal } from 'ant-design-vue'
import { getCategoryListAsHomeUsingGet } from '@/api/categoryController'
import {
  deletePictureUsingPost,
  getPicturePageListAsPersonReleaseUsingPost,
  getPicturePageListAsPersonSpaceUsingPost,
  pictureShareUsingPost,
} from '@/api/pictureController'
import { useRoute, useRouter } from 'vue-router'
import { decrypt, encrypt } from '@/utils'
import ShareModal from '@/components/ShareModal.vue'

/**
 * 路由组件中的路由对象
 */
const router = useRouter()
/**
 * 路由组件中的路径对象
 */
const route = useRoute()

/**
 * 初始化页面
 */
onMounted(() => {
  getPictureListData()
  getCategoryListData()
})

/**
 * 点击图片
 * @param picture
 */
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/detail/${picture.pictureId}`,
    query: {
      pId: picture.pictureId,
      ed: encodeURIComponent(encrypt(route.path + '=' + '发布列表', 'source')),
    },
  })
}

/**
 * 初始化图片搜索参数
 */
const INITIAL_PICTURE_SEARCH_PARAMS: API.PictureQueryRequest = {
  current: 1,
  pageSize: 10,
  multipleSort: true,
  sorts: [
    {
      asc: false,
      field: 'createTime',
    },
  ],
}
/**
 * 图片搜索参数
 */
const pictureSearchParams = reactive<API.PictureQueryRequest>({ ...INITIAL_PICTURE_SEARCH_PARAMS })

/**
 * 日期搜索组件范围变量
 */
const dateRange = ref<[Dayjs, Dayjs]>([])
/**
 * 日期搜索组件预设变量
 */
const rangePresets = ref([
  { label: '今天', value: [dayjs(), dayjs()] },
  { label: '昨天', value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')] },
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])
/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates.length < 2) {
    pictureSearchParams.startCreateTime = undefined
    pictureSearchParams.endCreateTime = undefined
  } else {
    pictureSearchParams.startCreateTime = dayjs(dayjs(dates[0]).format('YYYY-MM-DD') + ' 00:00:00')
    pictureSearchParams.endCreateTime = dayjs(dayjs(dates[0]).format('YYYY-MM-DD') + ' 23:59:59')
  }
}

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 处理分页
 * @param page
 * @param pageSize
 */
const handlePageChange = (page, pageSize) => {
  pictureSearchParams.current = page
  pictureSearchParams.pageSize = pageSize
  getPictureListData()
}
/**
 * 清理图片搜索条件
 */
const clearPictureParams = () => {
  Object.keys(pictureSearchParams).forEach((key) => {
    pictureSearchParams[key] = undefined
  })
}
/**
 * 重置图片搜索条件
 */
const resetPictureSearchParams = () => {
  dateRange.value = []
  clearPictureParams()
  Object.assign(pictureSearchParams, INITIAL_PICTURE_SEARCH_PARAMS)
}
/**
 * 刷新重置数据
 */
const refreshResetData = () => {
  resetPictureSearchParams()
  getPictureListData()
  message.success('刷新成功')
}
/**
 * 执行图片搜索
 */
const doPictureSearch = () => {
  pictureSearchParams.current = 1
  getPictureListData()
}

/**
 * 图片列表
 */
const pictureList = ref<API.PictureVO>([])
/**
 * 图片列表加载状态
 */
const pictureListLoading = ref<boolean>(true)
/**
 * 获取图片列表数据
 */
const getPictureListData = async () => {
  pictureListLoading.value = true
  const res = await getPicturePageListAsPersonReleaseUsingPost({
    ...pictureSearchParams,
  })
  if (res.code === 0 && res.data) {
    pictureList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取图片列表失败!')
  }
  pictureListLoading.value = false
}

/**
 * 分类列表
 */
const categoryList = ref<API.CategoryVO[]>([])
/**
 * 获取分类列表数据
 */
const getCategoryListData = async () => {
  const res = await getCategoryListAsHomeUsingGet()
  if (res.code === 0 && res.data) {
    categoryList.value = (res.data ?? []).map((data: API.CategoryVO) => {
      return {
        value: data.categoryId,
        label: data.name,
      }
    })
  } else {
    message.error('分类加载失败!')
  }
}

/**
 * 打开上传图片页面
 */
const openAddEditPicture = () => {
  router.push({
    path: '/picture/addEdit',
    query: {
      ed: encodeURIComponent(encrypt(route.path, 'source')),
    },
  })
}

/**
 * 编辑图片
 */
const doEditPicture = (pictureId: number, e: Event) => {
  e.stopPropagation()
  if (!pictureId) {
    return
  }
  router.push({
    path: '/picture/addEdit',
    query: {
      pId: pictureId,
      sid: spaceDetail.value.spaceId,
      t: spaceDetail.value.spaceType,
      n: spaceDetail.value.spaceName,
      ed: encodeURIComponent(encrypt(route.path + '=', 'source')),
    },
  })
}

/**
 * 删除图片
 */
const doDeletePicture = async (pictureId: number, e: Event) => {
  e.stopPropagation()
  if (!pictureId) {
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: '删除图片',
    content: '确定要删除该图片吗？删除后不可恢复！',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deletePictureUsingPost({ id: pictureId })
        if (res.code === 0) {
          message.success('删除成功！')
        } else {
          message.error('删除失败！')
        }
      } catch (e) {
        console.log(e)
        message.error('删除失败！')
      } finally {
        await getPictureListData()
        await getSpaceDetailData()
      }
    },
    onCancel: () => {
      message.info('取消删除！')
    },
  })
}

/**
 * 分享状态
 */
const isShare = ref<boolean>(true)
/**
 * 分享弹窗
 */
const shareModal = ref()
/**
 * 分享链接
 */
const shareLink = ref<string>()
/**
 * 处理分享
 * @param picture
 * @param e
 */
const doSharePicture = async (picture: API.PictureDetailVO, e: Event) => {
  e.stopPropagation()
  if (!isShare.value) {
    message.warn('已分享！')
    return
  }
  const pictureId = picture.pictureId
  const res = await pictureShareUsingPost({ pictureId })
  if (res.code === 0 && res.data) {
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.pictureId}`
    if (shareModal.value) {
      shareModal.value.openModal()
    }
    setTimeout(() => {
      isDownload.value = true
    }, 3000)
  } else {
    message.error(res.message)
  }
}
</script>

<style scoped>
/* 表单中输入框左边文字和右边输入框在同一水平线处理 */
.custom-form :deep(.ant-form-item-label > label) {
  height: 40px; /* 与输入框高度一致 */
  line-height: 40px; /* 垂直居中 */
  display: flex;
  align-items: center; /* 垂直对齐 */
}
</style>
