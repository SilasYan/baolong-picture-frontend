<template>
  <div id="schedule-task-manage-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <ClockCircleOutlined />
            定时任务管理
          </a-typography-title>
        </a-typography>
        <!-- 操作 -->
        <a-space>
          <a-button
            ghost
            size="large"
            type="primary"
            @click="addTaskDialog = true"
            style="margin-right: 20px"
          >
            <PlusCircleOutlined />
            创建定时任务
          </a-button>
          <a-button
            @click="refreshAllTask"
            style="color: red; border-color: red"
            :icon="h(SyncOutlined)"
            size="large"
          >
            重新所有任务
          </a-button>
        </a-space>
      </a-flex>
    </div>

    <!-- 搜索区域 -->
    <div class="custom-div search-region">
      <!-- 搜索表单 -->
      <a-form
        class="custom-form"
        layout="inline"
        :model="scheduledTaskSearchParams"
        @finish="doScheduledTaskSearch"
      >
        <a-form-item label="任务名称">
          <a-input
            v-model:value="scheduledTaskSearchParams.taskName"
            placeholder="请输入任务名称"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="执行方法">
          <a-input
            v-model:value="scheduledTaskSearchParams.taskBean"
            placeholder="请输入执行方法"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="任务状态" name="taskStatus">
          <a-select
            v-model:value="scheduledTaskSearchParams.taskStatus"
            :options="TASK_STATUS_OPTIONS"
            placeholder="请选择任务状态"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item>
          <a-space size="large">
            <a-button type="primary" html-type="submit" :icon="h(SearchOutlined)" size="large"
              >搜索
            </a-button>
            <a-button
              @click="refreshResetData"
              style="color: #1890ff; border-color: #1890ff"
              :icon="h(SyncOutlined)"
              size="large"
            >
              刷新数据
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 数据区域 -->
    <div class="custom-div data-region">
      <!-- 表格数据 -->
      <a-table
        :columns="scheduledTaskColumns"
        :data-source="scheduledTaskList"
        :pagination="scheduledTaskPagination"
        @change="handleScheduledTaskTableChange"
        :scroll="{ x: 'max-content', y: 800 }"
        :loading="scheduledTaskListLoading"
      >
        <template #bodyCell="{ column, record }">
          <!-- 注册时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <!-- 是否禁用 -->
          <template v-if="column.dataIndex === 'taskStatus'">
            <a-switch
              :checked="record.taskStatus === 1"
              checked-children="开启"
              un-checked-children="关闭"
              @change="(checked) => handleTaskStatus(record.taskId, checked)"
            />
          </template>
          <!-- 操作 -->
          <template v-if="column.key === 'action'">
            <a-space wrap>
              <a-button type="link" @click="editTask(record)">编辑</a-button>
              <a-button type="link" danger @click="deleteTask(record.taskId)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增任务弹窗 -->
    <a-modal
      v-model:open="addTaskDialog"
      title="新增任务"
      centered
      cancelText="取消"
      okText="创建"
      @ok="handleAddTask"
      :afterClose="handleAddClose"
    >
      <a-form layout="vertical" :model="addTaskForm">
        <a-form-item label="任务名称" name="taskName">
          <a-input v-model:value="addTaskForm.taskName" placeholder="请输入任务名称" />
        </a-form-item>
        <a-form-item label="执行方法" name="taskBean">
          <a-input v-model:value="addTaskForm.taskBean" placeholder="请输入执行方法" />
        </a-form-item>
        <a-form-item label="任务表达式" name="taskCron">
          <a-input v-model:value="addTaskForm.taskCron" placeholder="请输入任务表达式" />
        </a-form-item>
        <a-form-item label="任务描述" name="taskDesc">
          <a-input v-model:value="addTaskForm.taskDesc" placeholder="请输入任务描述" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑任务弹窗 -->
    <a-modal
      v-model:open="editTaskDialog"
      title="更新任务"
      centered
      cancelText="取消"
      okText="修改"
      @ok="handleEditTask"
    >
      <a-form layout="vertical" :model="updateTaskForm">
        <a-form-item label="任务名称" name="taskName">
          <a-input v-model:value="updateTaskForm.taskName" placeholder="请输入任务名称" />
        </a-form-item>
        <a-form-item label="执行方法" name="taskBean">
          <a-input v-model:value="updateTaskForm.taskBean" placeholder="请输入执行方法" />
        </a-form-item>
        <a-form-item label="任务表达式" name="taskCron">
          <a-input v-model:value="updateTaskForm.taskCron" placeholder="请输入任务表达式" />
        </a-form-item>
        <a-form-item label="任务描述" name="taskDesc">
          <a-input v-model:value="updateTaskForm.taskDesc" placeholder="请输入任务描述" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  ClockCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  addScheduledTaskUsingPost,
  deleteScheduledTaskUsingPost,
  editTaskStatusUsingPost,
  getScheduledTaskPageUsingPost,
  refreshScheduledTaskUsingPost,
  updateScheduledTaskUsingPost,
} from '@/api/scheduledTaskController'
import { TASK_STATUS_OPTIONS } from '@/constants/task'

/**
 * 初始化页面
 */
onMounted(() => {
  getScheduledTaskListData()
})

/**
 * 定时任务表格列
 */
const scheduledTaskColumns = [
  {
    title: '任务 ID',
    dataIndex: 'taskId',
    fixed: 'left',
    align: 'center',
    width: 80,
  },
  {
    title: '任务 KEY',
    dataIndex: 'taskKey',
    align: 'center',
    width: 150,
    customCell: () => ({ style: { minWidth: '150px', maxWidth: '150px' } }),
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    align: 'center',
    width: 200,
    customCell: () => ({ style: { minWidth: '200px', maxWidth: '300px' } }),
  },
  {
    title: '表达式',
    dataIndex: 'taskCron',
    align: 'center',
    width: 200,
    customCell: () => ({ style: { minWidth: '200px', maxWidth: '300px' } }),
  },
  {
    title: '目标方法',
    dataIndex: 'taskBean',
    align: 'center',
    width: 200,
    customCell: () => ({ style: { minWidth: '200px', maxWidth: '300px' } }),
  },
  {
    title: '任务描述',
    dataIndex: 'taskDesc',
    align: 'center',
    ellipsis: true,
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatus',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
 * 初始化定时任务搜索参数
 */
const INITIAL_TASK_SEARCH_PARAMS: API.ScheduledTaskQueryRequest = {
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
 * 定时任务搜索条件
 */
const scheduledTaskSearchParams = reactive<API.ScheduledTaskQueryRequest>({
  ...INITIAL_TASK_SEARCH_PARAMS,
})

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 定时任务分页参数
 */
const scheduledTaskPagination = computed(() => {
  return {
    current: scheduledTaskSearchParams.current ?? 1,
    pageSize: scheduledTaskSearchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
/**
 * 处理定时任务表格变化
 * @param page
 * @param filters
 * @param sorter
 */
const handleScheduledTaskTableChange = (page: any, filters: any, sorter: any) => {
  scheduledTaskSearchParams.current = page.current
  scheduledTaskSearchParams.pageSize = page.pageSize
  getScheduledTaskListData()
}
/**
 * 清理定时任务搜索条件
 */
const clearScheduledTaskParams = () => {
  Object.keys(scheduledTaskSearchParams).forEach((key) => {
    scheduledTaskSearchParams[key] = undefined
  })
}
/**
 * 重置定时任务搜索条件
 */
const resetScheduledTaskSearchParams = () => {
  clearScheduledTaskParams()
  Object.assign(scheduledTaskSearchParams, INITIAL_TASK_SEARCH_PARAMS)
}
/**
 * 刷新重置数据
 */
const refreshResetData = () => {
  resetScheduledTaskSearchParams()
  getScheduledTaskListData()
  message.success('刷新成功')
}
/**
 * 执行定时任务搜索
 */
const doScheduledTaskSearch = () => {
  // 重置页码
  scheduledTaskSearchParams.current = 1
  getScheduledTaskListData()
}

/**
 * 定时任务列表
 */
const scheduledTaskList = ref<API.ScheduledTaskVO>([])
/**
 * 定时任务列表加载状态
 */
const scheduledTaskListLoading = ref<boolean>(true)
/**
 * 获取定时任务列表数据
 */
const getScheduledTaskListData = async () => {
  scheduledTaskListLoading.value = true
  const res = await getScheduledTaskPageUsingPost({
    ...scheduledTaskSearchParams,
  })
  if (res.code === 0 && res.data) {
    scheduledTaskList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取定时任务列表失败!')
  }
  scheduledTaskListLoading.value = false
}

/**
 * 处理任务状态
 */
const handleTaskStatus = async (taskId: string, checked: boolean) => {
  if (!taskId) {
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: `${checked ? '开启' : '关闭'}定时任务`,
    content: `确定要${checked ? '开启' : '关闭'}该定时任务吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await editTaskStatusUsingPost({
          taskId: taskId,
          taskStatus: checked ? 1 : 0,
        })
        if (res.code === 0) {
          message.success(`${checked ? '开启' : '关闭'}成功！`)
        } else {
          message.error(res.message)
        }
      } catch (e) {
        message.error(`${checked ? '开启' : '关闭'}失败！`)
      } finally {
        await getScheduledTaskListData()
      }
    },
    onCancel: () => {
      message.info(`取消${checked ? '开启' : '关闭'}该定时任务！`)
    },
  })
}

/**
 * 新增分类弹框变量
 */
const addTaskDialog = ref<boolean>(false)
/**
 * 新增分类表单
 */
const addTaskForm = reactive<API.ScheduledTaskAddRequest>({})
/**
 * 提交新增分类
 */
const handleAddTask = async () => {
  try {
    const res = await addScheduledTaskUsingPost(addTaskForm)
    if (res.code === 0) {
      message.success('新增成功！')
    } else {
      message.error(res.message)
    }
  } catch (e) {
    message.error('新增失败！')
  } finally {
    addTaskDialog.value = false
    await getScheduledTaskListData()
  }
}
/**
 * 处理新增任务关闭
 */
const handleAddClose = () => {
  updateTaskForm.taskName = ''
  updateTaskForm.taskCron = ''
  updateTaskForm.taskBean = ''
  updateTaskForm.taskDesc = ''
}

/**
 * 编辑分类弹窗变量
 */
const editTaskDialog = ref<boolean>(false)
/**
 * 更新分类表单
 */
const updateTaskForm = reactive<API.ScheduledTaskUpdateRequest>({})
/**
 * 编辑分类
 * @param record
 */
const editTask = (record: any) => {
  editTaskDialog.value = true
  updateTaskForm.taskId = record.taskId
  updateTaskForm.taskName = record.taskName
  updateTaskForm.taskCron = record.taskCron
  updateTaskForm.taskBean = record.taskBean
  updateTaskForm.taskDesc = record.taskDesc
}
/**
 * 处理编辑分类
 */
const handleEditTask = async () => {
  try {
    const res = await updateScheduledTaskUsingPost(updateTaskForm)
    if (res.code === 0) {
      message.success('修改成功！')
    } else {
      message.error(res.message)
    }
  } catch (e) {
    message.error('修改失败！')
  } finally {
    editTaskDialog.value = false
    await getScheduledTaskListData()
  }
}

/**
 * 删除分类
 * @param taskId
 */
const deleteTask = async (taskId: string) => {
  if (!taskId) {
    return
  }
  Modal.confirm({
    title: '删除定时任务',
    content: '确定要删除该定时任务吗？删除后不可恢复！',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteScheduledTaskUsingPost({ id: taskId })
        if (res.code === 0) {
          message.success('删除成功！')
        } else {
          message.error(res.message)
        }
      } catch (e) {
        message.error('删除失败！')
      } finally {
        await getScheduledTaskListData()
      }
    },
    onCancel: () => {
      message.info('取消删除！')
    },
  })
}

/**
 * 重新加载所有定时任务
 */
const refreshAllTask = async () => {
  await refreshScheduledTaskUsingPost()
  message.success('刷新成功')
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
