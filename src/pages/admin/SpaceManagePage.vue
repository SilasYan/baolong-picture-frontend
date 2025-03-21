<template>
  <div id="space-manager-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <BlockOutlined />
            空间管理
          </a-typography-title>
        </a-typography>
      </a-flex>
    </div>

    <!-- 搜索区域 -->
    <div class="custom-div search-region">
      <a-form
        class="custom-form"
        layout="inline"
        :model="spaceSearchParams"
        @finish="doSpaceSearch"
      >
        <a-form-item label="空间名称" name="spaceName">
          <a-input
            v-model:value="spaceSearchParams.spaceName"
            placeholder="请输入空间名称"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="空间类别" name="spaceType">
          <a-select
            v-model:value="spaceSearchParams.spaceType"
            :options="SPACE_TYPE_OPTIONS"
            placeholder="请输入空间类别"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="空间级别" name="spaceLevel">
          <a-select
            v-model:value="spaceSearchParams.spaceLevel"
            :options="SPACE_LEVEL_OPTIONS"
            placeholder="请输入空间级别"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="用户 ID" name="userId">
          <a-input
            v-model:value="spaceSearchParams.userId"
            placeholder="请输入用户 ID"
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
      <a-table
        :columns="spaceColumns"
        :data-source="spaceList"
        :pagination="spacePagination"
        @change="handleSpaceTableChange"
        :scroll="{ x: 'max-content', y: 800 }"
        :loading="spaceListLoading"
      >
        <template #bodyCell="{ column, record }">
          <!-- 空间类型 -->
          <template v-if="column.dataIndex === 'spaceType'">
            <a-tag>{{ SPACE_TYPE_MAP[record.spaceType] }}</a-tag>
          </template>
          <!-- 空间级别 -->
          <template v-if="column.dataIndex === 'spaceLevel'">
            <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag>
          </template>
          <!-- 空间信息 -->
          <template v-if="column.dataIndex === 'spaceInfo'">
            <div>使用大小：{{ record.usedSizeUnit }} / {{ record.maxSizeUnit }}</div>
            <div>使用数量：{{ record.usedCount }} / {{ record.maxCount }} 张</div>
          </template>
          <!-- 用户信息 -->
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
          <!-- 开通时间 -->
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <!-- 编辑时间 -->
          <template v-else-if="column.dataIndex === 'editTime'">
            {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <a-space wrap>
              <a-button type="link" :href="`/add_space?id=${record.spaceId}`" target="_blank">
                编辑
              </a-button>
              <a-button type="link" danger @click="doDelete(record.spaceId)">删除</a-button>
              <a-button type="link" :href="`/space_analyze?spaceId=${record.spaceId}`" target="_blank">
                分析
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BlockOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_MAP,
  SPACE_TYPE_OPTIONS,
} from '@/constants/space'
import { getSpacePageListAsManageUsingPost } from '@/api/spaceController'
import dayjs from 'dayjs'

/**
 * 初始化页面
 */
onMounted(() => {
  getSpaceListData()
})

/**
 * 空间表格列
 */
const spaceColumns = [
  {
    title: '空间 ID',
    dataIndex: 'spaceId',
    fixed: 'left',
    align: 'center',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
    align: 'center',
    ellipsis: true,
    width: 250,
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '空间类型',
    dataIndex: 'spaceType',
    align: 'center',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
    align: 'center',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
  {
    title: '空间信息',
    dataIndex: 'spaceInfo',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
  {
    title: '作者信息',
    dataIndex: 'userInfo',
    align: 'center',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
  {
    title: '开通时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '修改时间',
    align: 'center',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
]

/**
 * 初始化空间搜索参数
 */
const INITIAL_SPACE_SEARCH_PARAMS: API.SpaceQueryRequest = {
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
 * 空间搜索参数
 */
const spaceSearchParams = reactive<API.SpaceQueryRequest>({ ...INITIAL_SPACE_SEARCH_PARAMS })

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 空间分页参数
 */
const spacePagination = computed(() => {
  return {
    current: spaceSearchParams.current ?? 1,
    pageSize: spaceSearchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
/**
 * 处理空间表格变化
 * @param page
 */
const handleSpaceTableChange = (page: any, filters: any, sorter: any) => {
  // 分页参数
  spaceSearchParams.current = page.current
  spaceSearchParams.pageSize = page.pageSize
  getSpaceListData()
}
/**
 * 清理空间搜索条件
 */
const clearSpaceParams = () => {
  Object.keys(spaceSearchParams).forEach((key) => {
    spaceSearchParams[key] = undefined
  })
}
/**
 * 重置空间搜索条件
 */
const resetSpaceSearchParams = () => {
  clearSpaceParams()
  Object.assign(spaceSearchParams, INITIAL_SPACE_SEARCH_PARAMS)
}
/**
 * 刷新重置数据
 */
const refreshResetData = () => {
  resetSpaceSearchParams()
  getSpaceListData()
  message.success('刷新成功')
}
/**
 * 执行空间搜索
 */
const doSpaceSearch = () => {
  spaceSearchParams.current = 1
  getSpaceListData()
}

/**
 * 空间列表
 */
const spaceList = ref<API.SpaceVO>([])
/**
 * 空间列表加载状态
 */
const spaceListLoading = ref<boolean>(true)
/**
 * 获取空间列表数据
 */
const getSpaceListData = async () => {
  spaceListLoading.value = true
  const res = await getSpacePageListAsManageUsingPost({
    ...spaceSearchParams,
  })
  if (res.code === 0 && res.data) {
    spaceList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取空间列表失败!')
  }
  spaceListLoading.value = false
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
