<template>
  <a-flex justify="space-between">
    <h2>空间管理</h2>
    <a-space>
      <a-button type="primary" href="/add_space" target="_blank">
        <PlusCircleOutlined />
        创建空间
      </a-button>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
        <a-button
          type="primary"
          ghost
          href="/space_analyze?queryPublic=1"
          target="_blank"
          :icon="h(BarChartOutlined)"
        >
          分析公共图库
        </a-button>
        <a-button
          type="primary"
          ghost
          href="/space_analyze?queryAll=1"
          target="_blank"
          :icon="h(BarChartOutlined)"
        >
          分析全空间
        </a-button>
      </a-space>
    </a-space>
  </a-flex>

  <a-form layout="inline" :model="formData" @finish="handleSubmit">
    <a-form-item label="用户 id" name="userId">
      <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">添加用户</a-button>
    </a-form-item>
  </a-form>

  <div style="margin-bottom: 20px"></div>
  <!-- 表格 -->
  <a-table :columns="columns" :data-source="dataList">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'userInfo'">
        <a-space>
          <a-avatar :src="record.user?.userAvatar" />
          {{ record.user?.userName }}
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'spaceRole'">
        <a-select
          v-model:value="record.spaceRole"
          :options="SPACE_ROLE_OPTIONS"
          @change="(value) => editSpaceRole(value, record)"
        />
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space wrap>
          <a-button type="link" danger @click="doDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { SmileOutlined, PlusCircleOutlined, BarChartOutlined } from '@ant-design/icons-vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { formatPictureSize } from '@/utils'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS, SPACE_ROLE_OPTIONS } from '@/constants/space'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost,
} from '@/api2/spaceUserController'

// 表格列
const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 定义属性
interface Props {
  id: string
}

const props = defineProps<Props>()

// 数据
const dataList = ref([])

// 获取数据
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await listSpaceUserUsingPost({
    spaceId,
  })
  if (res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  // fetchData()
})

// 编辑空间角色
const editSpaceRole = async (value, record) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.data.code === 0) {
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.data.message)
  }
}

// 删除空间成员
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

// 添加用户
const formData = reactive<API.SpaceUserAddRequest>({})

const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}
</script>

<style scoped>
#homePage {
}
</style>
