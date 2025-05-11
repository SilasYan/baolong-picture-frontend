<template>
  <div id="picture-manage-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <PictureOutlined />
            图片管理
          </a-typography-title>
        </a-typography>
      </a-flex>
    </div>

    <!-- 搜索区域 -->
    <div class="custom-div search-region">
      <!-- 搜索表单 -->
      <a-form
        class="custom-form"
        layout="inline"
        :model="pictureSearchParams"
        @finish="doPictureSearch"
      >
        <a-form-item label="关键字" name="searchText">
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

    <!-- 数据区域 -->
    <div class="custom-div data-region">
      <!-- 表格数据 -->
      <a-table
        :columns="pictureColumns"
        :data-source="pictureList"
        :pagination="picturePagination"
        @change="handlePictureTableChange"
        :scroll="{ x: 'max-content', y: 800 }"
        :loading="pictureListLoading"
        :rowKey="(record) => record.pictureId"
        :row-selection="rowSelection"
        v-model:selectedRows="selectedRowKeys"
      >
        <template #bodyCell="{ column, record }">
          <!-- 图片 ID -->
          <template v-if="column.dataIndex === 'pictureId'">
            <a-tooltip placement="right">
              <template #title>
                <span>{{ record.pictureId }}</span>
              </template>
              <a-button @click="copyToClipboard(record.pictureId)">复制</a-button>
            </a-tooltip>
          </template>
          <!-- 图片名称 -->
          <template v-if="column.dataIndex === 'picName'">
            <a-tooltip :overlay-class-name="'custom-tooltip'" placement="top">
              <template #title>{{ record.picName }}</template>
              <span class="text-ellipsis">{{ record.picName }}</span>
            </a-tooltip>
          </template>
          <!-- 图片地址 -->
          <template v-if="column.dataIndex === 'picUrl'">
            <a-image :src="record.picUrl" :width="120" />
          </template>
          <!-- 分类 -->
          <template v-if="column.dataIndex === 'categoryId'">
            <a-tag v-if="record.categoryInfo" color="green">
              {{ record.categoryInfo.name }}
            </a-tag>
            <span v-else>无</span>
          </template>
          <!-- 主色调 -->
          <template v-if="column.dataIndex === 'originColor'">
            <div style="text-align: center">
              <div
                :style="{
                  backgroundColor: toHexColor(record.originColor),
                  width: '36px',
                  height: '20px',
                  margin: '0 auto',
                }"
              />
              【{{ toHexColor(record.originColor) }}】
            </div>
          </template>
          <!-- 原图信息 -->
          <template v-if="column.dataIndex === 'originInfo'">
            <div>
              原图大小：
              <span v-if="record.originSize">{{ formatPictureSize(record.originSize) }}</span>
              <span v-else>-</span>
            </div>
            <div>原图格式：{{ record.originFormat }}</div>
            <div>原图宽高：{{ record.originWidth }} × {{ record.originHeight }}</div>
            <div>原图比例：{{ record.originScale }}</div>
          </template>
          <!-- 作者信息 -->
          <template v-if="column.dataIndex === 'userInfo'">
            <div v-if="record.userInfo" style="display: flex; align-items: center; gap: 8px">
              <!-- 左侧头像 -->
              <div>
                <a-avatar :src="record.userInfo.userAvatar" />
              </div>
              <!-- 右侧文字信息 -->
              <div
                style="display: flex; flex-direction: column; line-height: 1.2; text-align: left"
              >
                <span>ID：{{ record.userInfo.userId }}</span>
                <span>昵称：{{ record.userInfo.userName }}</span>
              </div>
            </div>
            <span v-else>无</span>
          </template>
          <!-- 审核信息 -->
          <template v-if="column.dataIndex === 'reviewInfo'">
            <div>
              审核状态：
              <a-tag :color="PIC_STATUS_TAG_COLOR[record.reviewStatus]">
                {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}
              </a-tag>
            </div>
            <div v-if="record.reviewMessage">审核信息：{{ record.reviewMessage }}</div>
            <div v-if="record.reviewTime">
              审核时间：{{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <div v-if="record.reviewerUser">审核人：{{ record.reviewerUser }}</div>
            <div v-if="record.spaceId">
              图片上传位置：{{ record.spaceId == 0 ? '公共图库' : record.spaceId }}
            </div>
          </template>
          <!-- 上传时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <!-- 编辑时间 -->
          <template v-if="column.dataIndex === 'editTime'">
            {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <!-- 操作 -->
          <template v-if="column.key === 'action'">
            <a-space wrap>
              <a-button
                v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
                type="link"
                @click="openReviewDialog(record.pictureId, PIC_REVIEW_STATUS_ENUM.PASS)"
              >
                通过
              </a-button>
              <a-button
                v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS && record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
                type="link"
                danger
                @click="openReviewDialog(record.pictureId, PIC_REVIEW_STATUS_ENUM.REJECT)"
              >
                拒绝
              </a-button>
              <a-button
                v-if="record.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS"
                type="link"
                danger
                @click="openReviewDialog(record.pictureId, PIC_REVIEW_STATUS_ENUM.REJECT)"
              >
                下架
              </a-button>
              <a-button type="link" :href="`/picture/addEdit?pId=${record.pictureId}`"
                >编辑
              </a-button>
              <a-button type="link" danger @click="handleDelete(record.pictureId)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <a-modal v-model:open="rejectDialog" :title="`审核${reviewFormData.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '通过' : '拒绝'}`" @ok="handleReview">
    <a-form layout="vertical" :model="reviewFormData">
      <a-form-item label="审核理由" name="reviewMessage">
        <a-input v-model:value="reviewFormData.reviewMessage" placeholder="请输入审核理由, 可以不填" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { PictureOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PIC_FORMAT_STATUS_OPTIONS,
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
  PIC_STATUS_TAG_COLOR,
} from '@/constants/picture'
import {
  deletePictureUsingPost,
  getPicturePageListAsManageUsingPost,
  reviewPictureUsingPost,
} from '@/api/pictureController'
import { copyToClipboard, formatPictureSize, toHexColor } from '@/utils'
import { getCategoryListAsHomeUsingGet } from '@/api/categoryController'

/**
 * 初始化页面
 */
onMounted(() => {
  getPictureListData()
  getCategoryListData()
})

/**
 * 图片表格列
 */
const pictureColumns = [
  {
    title: '图片 ID',
    dataIndex: 'pictureId',
    fixed: 'left',
    align: 'center',
    width: 80,
  },
  {
    title: '图片名称',
    dataIndex: 'picName',
    align: 'center',
    ellipsis: true, // 超出显示省略号
    width: 250, // 固定宽度（单位px）
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }), // 双重保障限制宽度
  },
  {
    title: '图片地址',
    dataIndex: 'picUrl',
    align: 'center',
  },
  {
    title: '分类',
    dataIndex: 'categoryId',
    align: 'center',
    width: 100,
  },
  {
    title: '主色调',
    dataIndex: 'originColor',
    align: 'center',
    width: 120,
  },
  {
    title: '数据信息',
    children: [
      {
        title: '查看数量',
        dataIndex: 'viewQuantity',
        align: 'center',
        width: 80,
        sorter: true,
      },
      {
        title: '点赞数量',
        dataIndex: 'likeQuantity',
        align: 'center',
        width: 80,
        sorter: true,
      },
      {
        title: '收藏数量',
        dataIndex: 'collectQuantity',
        align: 'center',
        width: 80,
        sorter: true,
      },
      {
        title: '下载数量',
        dataIndex: 'downloadQuantity',
        align: 'center',
        width: 80,
        sorter: true,
      },
      {
        title: '分享数量',
        dataIndex: 'shareQuantity',
        align: 'center',
        width: 80,
        sorter: true,
      },
    ],
  },
  {
    title: '原图信息',
    dataIndex: 'originInfo',
    width: 'auto',
  },
  {
    title: '作者信息',
    dataIndex: 'userInfo',
    align: 'center',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
  {
    title: '审核信息',
    dataIndex: 'reviewInfo',
  },
  {
    title: '描述',
    dataIndex: 'picDesc',
    align: 'center',
    ellipsis: true,
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '修改时间',
    dataIndex: 'editTime',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    minWidth: 80,
    customCell: () => ({ style: { minWidth: '80px' } }),
  },
]

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
    {
      asc: true,
      field: 'reviewStatus',
    },
  ],
}
/**
 * 图片搜索参数
 */
const pictureSearchParams = reactive<API.PictureQueryRequest>({ ...INITIAL_PICTURE_SEARCH_PARAMS })

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 图片分页参数
 */
const picturePagination = computed(() => {
  return {
    current: pictureSearchParams.current ?? 1,
    pageSize: pictureSearchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
/**
 * 处理图片表格变化
 * @param page
 */
const handlePictureTableChange = (page: any, filters: any, sorter: any) => {
  // 排序参数
  if (sorter.field === 'viewQuantity' && sorter.order) {
    pictureSearchParams.sorts = [
      {
        asc: sorter.order === 'ascend',
        field: 'viewQuantity',
      },
    ]
  } else if (sorter.field === 'likeQuantity' && sorter.order) {
    pictureSearchParams.sorts = [
      {
        asc: sorter.order === 'ascend',
        field: 'likeQuantity',
      },
    ]
  } else if (sorter.field === 'collectQuantity' && sorter.order) {
    pictureSearchParams.sorts = [
      {
        asc: sorter.order === 'ascend',
        field: 'collectQuantity',
      },
    ]
  } else if (sorter.field === 'downloadQuantity' && sorter.order) {
    pictureSearchParams.sorts = [
      {
        asc: sorter.order === 'ascend',
        field: 'downloadQuantity',
      },
    ]
  } else if (sorter.field === 'shareQuantity' && sorter.order) {
    pictureSearchParams.sorts = [
      {
        asc: sorter.order === 'ascend',
        field: 'shareQuantity',
      },
    ]
  } else {
    resetPictureSearchParams()
  }
  // 分页参数
  pictureSearchParams.current = page.current
  pictureSearchParams.pageSize = page.pageSize
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
  const res = await getPicturePageListAsManageUsingPost({
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

const rejectDialog = ref<boolean>(false)
const reviewFormData = reactive<API.PictureReviewRequest>({
  pictureId: null,
  reviewStatus: null,
  reviewMessage: '',
})

const openReviewDialog = (pictureId: string, reviewStatus: number) => {
  reviewFormData.pictureId = pictureId
  reviewFormData.reviewStatus = reviewStatus
  rejectDialog.value = true
}

/**
 * 处理审核
 */
const handleReview = async () => {
  const flag = reviewFormData.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS
  if (!flag && !reviewFormData.reviewMessage) {
    message.error('请输入审核不通过原因！')
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: `${flag ? '审核' : '下架'}图片`,
    content: `确定要${flag ? '审核' : '下架'}该图片吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await reviewPictureUsingPost({
          pictureId: reviewFormData.pictureId,
          reviewStatus: reviewFormData.reviewStatus,
          reviewMessage: reviewFormData.reviewMessage ? reviewFormData.reviewMessage : '手动审核通过',
        })
        if (res.code === 0) {
          message.success(`图片${flag ? '审核' : '下架'}成功！`)
          rejectDialog.value = false
        } else {
          message.error(`图片${flag ? '审核' : '下架'}失败！`)
        }
      } catch (e) {
        message.error(`图片${flag ? '审核' : '下架'}失败！`)
      } finally {
        await getPictureListData()
      }
    },
    onCancel: () => {
      message.info(`取消审核！`)
    },
  })
}

/**
 * 处理删除
 * @param pictureId
 */
const handleDelete = async (pictureId: string) => {
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
        message.error('删除失败！')
      } finally {
        await getPictureListData()
      }
    },
    onCancel: () => {
      message.info('取消删除！')
    },
  })
}

// 选项选中的 key 数组，存放 图片 ID
const selectedRowKeys = ref<string[]>([])
// 选项操作配置
const rowSelection = reactive({
  selectedRowKeys: [] as string[],
  onChange: (keys: string[]) => {
    rowSelection.selectedRowKeys = keys
  },
  // 可选：添加选择框列配置
  columnWidth: 50,
  fixed: true,
})
</script>

<style scoped>
/* 表单中输入框左边文字和右边输入框在同一水平线处理 */
.custom-form :deep(.ant-form-item-label > label) {
  height: 40px; /* 与输入框高度一致 */
  line-height: 40px; /* 垂直居中 */
  display: flex;
  align-items: center; /* 垂直对齐 */
}

/* 表格单元格样式 */
.text-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 自定义tooltip样式 */
.custom-tooltip .ant-tooltip-inner {
  max-width: 400px;
  word-break: break-all;
  white-space: pre-line;
}
</style>
