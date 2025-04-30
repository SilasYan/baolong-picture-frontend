<template>
  <div id="person-space-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between" align="center">
        <!-- 顶部标题 -->
        <a-typography-title :level="3" class="title-text">
          <BlockOutlined class="title-icon" />
          个人空间
        </a-typography-title>
        <!-- 操作 -->
        <a-space size="large">
          <a-button
            type="primary"
            size="large"
            @click="openAddEditPicture"
            class="upload-btn"
          >
            <CloudUploadOutlined />
            上传图片
          </a-button>

          <a-button type="primary" size="large" ghost @click="openBatchAddPicture">
            <CloudUploadOutlined />
            批量上传图片
          </a-button>

          <a-button type="dashed"  size="large" danger>
            <KeyOutlined />
            空间升级
          </a-button>
        </a-space>
      </a-flex>
    </div>

    <!-- 空间使用区域 -->
    <div class="usage-section">
      <a-collapse v-model:activeKey="useActiveKey" collapsible="header" :bordered="false">
        <a-collapse-panel key="1" class="usage-panel">
          <template #header>
            <div class="panel-header">
              <a-typography-title :level="5" class="usage-title">
                <FolderOpenOutlined class="usage-icon" />
                空间使用情况
              </a-typography-title>
              <CaretDownOutlined class="collapse-icon" />
            </div>
          </template>
          <div class="usage-content">
            <div class="usage-item">
              <span class="usage-label">存储空间:</span>
              <span class="usage-value">{{ spaceDetail.usedSizeUnit }} / {{ spaceDetail.maxSizeUnit }}</span>
              <a-progress
                :percent="((spaceDetail.usedSize / spaceDetail.maxSize) * 100).toFixed(1)"
                :stroke-color="getProgressColor(spaceDetail.usedSize / spaceDetail.maxSize)"
                status="active"
                :show-info="false"
                class="usage-progress"
              />
            </div>
            <div class="usage-item">
              <span class="usage-label">图片数量:</span>
              <span class="usage-value">{{ spaceDetail.usedCount }} / {{ spaceDetail.maxCount }} 张</span>
              <a-progress
                :percent="((spaceDetail.usedCount / spaceDetail.maxCount) * 100).toFixed(1)"
                :stroke-color="getProgressColor(spaceDetail.usedCount / spaceDetail.maxCount)"
                status="active"
                :show-info="false"
                class="usage-progress"
              />
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

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
        <a-form-item label="标签" name="tags">
          <a-input
            v-model:value="pictureSearchParams.tags"
            placeholder="请输入标签"
            allow-clear
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
              :text="picture.categoryInfo?.name ?? '无'"
              :color="`${picture.categoryInfo?.name ? '#87d068' : 'gray'}`"
              style="
                width: 80px;
                height: 30px;
                font-size: 16px;
                text-align: center;
                line-height: 30px;
              "
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
    <ShareModal ref="shareModal" :link="shareLink" :name="picName" />
  </div>
</template>

<script lang="ts" setup>
import {
  BlockOutlined,
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  ShareAltOutlined,
  SyncOutlined, CaretDownOutlined, FolderOpenOutlined, KeyOutlined
} from '@ant-design/icons-vue'
import { h, onMounted, reactive, ref } from 'vue'
import {
  PIC_FORMAT_STATUS_OPTIONS,
  PIC_REVIEW_STATUS_MAP,
  PIC_STATUS_TAG_COLOR,
} from '@/constants/picture'
import dayjs from 'dayjs'
import { message, Modal } from 'ant-design-vue'
import { getCategoryListAsHomeUsingGet } from '@/api/categoryController'
import {
  deletePictureUsingPost,
  getPicturePageListAsPersonSpaceUsingPost,
  pictureShareUsingPost,
} from '@/api/pictureController'
import { getSpaceDetailByLoginUserUsingGet } from '@/api/spaceController'
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
  getSpaceDetailData()
  getPictureListData()
  getCategoryListData()
})

// 辅助函数：获取进度条颜色
const getProgressColor = (ratio: number) => {
  if (ratio < 0.5) return '#06D6A0'
  if (ratio < 0.8) return '#FFD166'
  return '#D90429'
}

/**
 * 点击图片
 * @param picture
 */
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/detail/${picture.pictureId}`,
    query: {
      pId: picture.pictureId,
      ed: encodeURIComponent(encrypt(route.path + '=' + spaceDetail.value.spaceName, 'source')),
    },
  })
}

/**
 * 空间使用情况选中的 KEY
 */
const useActiveKey = ref([])

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
    pictureSearchParams.startEditTime = undefined
    pictureSearchParams.endEditTime = undefined
  } else {
    pictureSearchParams.startEditTime = dayjs(dates[0]).format('YYYY-MM-DD') + ' 00:00:00'
    pictureSearchParams.endEditTime = dayjs(dates[1]).format('YYYY-MM-DD') + ' 23:59:59'
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
 * 空间详情
 */
const spaceDetail = ref<API.SpaceDetailVO>({
  usedSize: 0,
  maxSize: 0,
  usedCount: 0,
  maxCount: 0,
})
/**
 * 获取空间详情数据
 */
const getSpaceDetailData = async () => {
  const res = await getSpaceDetailByLoginUserUsingGet()
  if (res.code === 0 && res.data) {
    spaceDetail.value = res.data
  } else {
    message.error('获取空间详情失败!')
  }
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
  const res = await getPicturePageListAsPersonSpaceUsingPost({
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
  const r = router.push({
    path: '/picture/addEdit',
    query: {
      sid: spaceDetail.value.spaceId,
      t: spaceDetail.value.spaceType,
      n: spaceDetail.value.spaceName,
      ed: encodeURIComponent(encrypt(route.path, 'source')),
    },
  })
}

/**
 * 打开批量上传图片页面
 */
const openBatchAddPicture = () => {
  router.push({
    path: '/picture/batch',
    query: {
      sid: spaceDetail.value.spaceId,
      t: spaceDetail.value.spaceType,
      n: spaceDetail.value.spaceName,
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
 * 图片名称
 */
const picName = ref<string>()
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
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/detail/${picture.pictureId}`
    picName.value = picture.picName
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

.usage-section {
  margin-bottom: 24px;

  .usage-panel {
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #f0f0f0;

    :deep(.ant-collapse-header) {
      padding: 12px 16px !important;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .usage-title {
        margin: 0;
        display: flex;
        align-items: center;

        .usage-icon {
          margin-right: 8px;
          color: #ff9a2e;
        }
      }

      .collapse-icon {
        transition: transform 0.3s;
      }
    }

    :deep(.ant-collapse-content-box) {
      padding: 16px !important;
    }
  }

  .usage-content {
    .usage-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .usage-label {
        font-weight: 500;
        margin-right: 8px;
        color: #555;
      }

      .usage-value {
        color: #333;
        font-weight: 500;
      }

      .usage-progress {
        margin-top: 8px;

        :deep(.ant-progress-bg) {
          height: 10px !important;
        }
      }
    }
  }
}
</style>
