<template>
  <div id="user-manage-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <ContactsOutlined />
            用户管理
          </a-typography-title>
        </a-typography>
      </a-flex>
    </div>

    <!-- 搜索区域 -->
    <div class="custom-div search-region">
      <!-- 搜索表单 -->
      <a-form class="custom-form" layout="inline" :model="userSearchParams" @finish="doUserSearch">
        <a-form-item label="账号">
          <a-input
            v-model:value="userSearchParams.userAccount"
            placeholder="请输入账号"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            v-model:value="userSearchParams.userEmail"
            placeholder="请输入邮箱"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input
            v-model:value="userSearchParams.userName"
            placeholder="请输入昵称"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
            v-model:value="userSearchParams.userPhone"
            placeholder="请输入手机号"
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
        :columns="userColumns"
        :data-source="userList"
        :pagination="userPagination"
        @change="handleUserTableChange"
        :scroll="{ x: 'max-content', y: 800 }"
        :loading="userListLoading"
      >
        <template #bodyCell="{ column, record }">
          <!-- 头像 -->
          <template v-if="column.dataIndex === 'userAvatar'">
            <a-image :src="record.userAvatar" :width="50" />
          </template>
          <!-- 用户角色 -->
          <template v-if="column.dataIndex === 'userRole'">
            <div v-if="record.userRole === 'ADMIN'">
              <a-tag color="green">管理员</a-tag>
            </div>
            <div v-else>
              <a-tag color="blue">普通用户</a-tag>
            </div>
          </template>
          <!-- 会员信息 -->
          <template v-if="column.dataIndex === 'vipInfo'">
            <div v-if="record.vipNumber">
              <p>会员编号：{{ record.vipNumber }}</p>
              <p>会员类型：{{ record.vipSign }}</p>
              <p>到期时间：{{ dayjs(record.vipExpireTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
            </div>
            <div v-else>未开通</div>
          </template>
          <!-- 其他信息 -->
          <template v-if="column.dataIndex === 'otherInfo'">
            <div>
              <p>手机号码：{{ record.userPhone }}</p>
              <p>
                出生日期：{{ record.birthday ? dayjs(record.birthday).format('YYYY-MM-DD') : '' }}
              </p>
            </div>
          </template>
          <!-- 注册时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <!-- 是否禁用 -->
          <template v-if="column.dataIndex === 'isDisabled'">
            <a-switch
              :checked="record.isDisabled === 0"
              checked-children="正常"
              un-checked-children="禁用"
              :class="{
                'active-switch': record.isDisabled === 0,
                'disabled-switch': record.isDisabled === 1,
              }"
              @change="(checked) => handleDisabled(record.userId, checked)"
            />
          </template>
          <!-- 操作 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleResetPassword(record.userId)">密码重置</a-button>
              <a-button type="link" danger @click="handleDelete(record.userId)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ContactsOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  deleteUserUsingPost,
  disabledUserUsingPost,
  getUserPageListAsManageUsingPost,
  resetPasswordUsingPost,
} from '@/api/userController'

/**
 * 初始化页面
 */
onMounted(() => {
  getUserListData()
})

/**
 * 用户表格列
 */
const userColumns = [
  {
    title: '用户 ID',
    dataIndex: 'userId',
    fixed: 'left',
    align: 'center',
    width: 80,
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    align: 'center',
    width: 150,
    customCell: () => ({ style: { minWidth: '150px', maxWidth: '150px' } }),
  },
  {
    title: '邮箱',
    dataIndex: 'userEmail',
    align: 'center',
    width: 180,
    customCell: () => ({ style: { minWidth: '150px', maxWidth: '180px' } }),
  },
  {
    title: '昵称',
    dataIndex: 'userName',
    align: 'center',
    width: 250,
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    align: 'center',
    width: 100,
    customCell: () => ({ style: { minWidth: '100px', maxWidth: '100px' } }),
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    align: 'center',
    width: 100,
    customCell: () => ({ style: { minWidth: '100px', maxWidth: '100px' } }),
  },
  {
    title: '会员信息',
    dataIndex: 'vipInfo',
    minWidth: 100,
    customCell: () => ({ style: { minWidth: '100px' } }),
  },
  {
    title: '其他信息',
    dataIndex: 'otherInfo',
    width: 'auto',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    align: 'center',
    ellipsis: true,
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '是否禁用',
    dataIndex: 'isDisabled',
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
 * 初始化用户搜索参数
 */
const INITIAL_USER_SEARCH_PARAMS: API.UserQueryRequest = {
  current: 1,
  pageSize: 10,
  multipleSort: true,
  sorts: [
    {
      asc: true,
      field: 'userRole',
    },
    {
      asc: false,
      field: 'createTime',
    },
  ],
}
/**
 * 用户搜索条件
 */
const userSearchParams = reactive<API.UserQueryRequest>({ ...INITIAL_USER_SEARCH_PARAMS })

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 用户分页参数
 */
const userPagination = computed(() => {
  return {
    current: userSearchParams.current ?? 1,
    pageSize: userSearchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
/**
 * 处理用户表格变化
 * @param page
 * @param filters
 * @param sorter
 */
const handleUserTableChange = (page: any, filters: any, sorter: any) => {
  userSearchParams.current = page.current
  userSearchParams.pageSize = page.pageSize
  getUserListData()
}
/**
 * 清理用户搜索条件
 */
const clearUserParams = () => {
  Object.keys(userSearchParams).forEach((key) => {
    userSearchParams[key] = undefined
  })
}
/**
 * 重置用户搜索条件
 */
const resetUserSearchParams = () => {
  clearUserParams()
  Object.assign(userSearchParams, INITIAL_USER_SEARCH_PARAMS)
}
/**
 * 刷新重置数据
 */
const refreshResetData = () => {
  resetUserSearchParams()
  getUserListData()
  message.success('刷新成功')
}
/**
 * 执行用户搜索
 */
const doUserSearch = () => {
  // 重置页码
  userSearchParams.current = 1
  getUserListData()
}

/**
 * 用户列表
 */
const userList = ref<API.UserVO>([])
/**
 * 用户列表加载状态
 */
const userListLoading = ref<boolean>(true)
/**
 * 获取用户列表数据
 */
const getUserListData = async () => {
  userListLoading.value = true
  const res = await getUserPageListAsManageUsingPost({
    ...userSearchParams,
  })
  if (res.code === 0 && res.data) {
    userList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取用户列表失败!')
  }
  userListLoading.value = false
}

/**
 * 处理用户禁用
 */
const handleDisabled = async (userId: string, checked: boolean) => {
  if (!userId) {
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: `${checked ? '启用' : '禁用'}用户`,
    content: `确定要${checked ? '启用' : '禁用'}该用户吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await disabledUserUsingPost({ userId: userId, isDisabled: checked ? 0 : 1 })
        if (res.code === 0) {
          message.success(`${checked ? '启用' : '禁用'}成功！`)
        } else {
          message.error(`${checked ? '启用' : '禁用'}失败！`)
          // 回滚状态
          record.isDisabled = checked ? 1 : 0
        }
      } catch (e) {
        message.error(`${checked ? '启用' : '禁用'}失败！`)
      } finally {
        await getUserListData()
      }
    },
    onCancel: () => {
      message.info(`取消${checked ? '启用' : '禁用'}该用户！`)
    },
  })
}

/**
 * 处理密码重置
 * @param userId
 */
const handleResetPassword = async (userId: string) => {
  if (!userId) {
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: '确认重置密码',
    content: '确定要重置该用户的密码吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await resetPasswordUsingPost({ userId })
        if (res.code === 0) {
          message.success('重置成功！')
          resetPasswordSuccess(res.data) // 处理重置成功后的逻辑
        } else {
          message.error('重置失败！')
        }
      } catch (e) {
        message.error('重置失败！')
      } finally {
      }
    },
    onCancel: () => {
      // 用户点击取消
      message.info('取消重置密码！')
    },
  })
}

/**
 * 重置密码成功弹窗
 * @param password
 */
const resetPasswordSuccess = (password) => {
  Modal.success({
    title: '密码重置成功!',
    content: h('div', {}, [
      h(
        'p',
        {
          style: {
            paddingTop: '20px',
            fontSize: '16px',
            fontWeight: 'bold',
          },
        },
        password,
      ),
    ]),
    bodyStyle: {},
  })
}

/**
 * 处理删除
 * @param userId
 */
const handleDelete = async (userId: string) => {
  if (!userId) {
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: '删除用户',
    content: '确定要删除该用户吗？删除后不可恢复！',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteUserUsingPost({ id: userId })
        if (res.code === 0) {
          message.success('删除成功！')
        } else {
          message.error('删除失败！')
        }
      } catch (e) {
        message.error('删除失败！')
      } finally {
        await getUserListData()
      }
    },
    onCancel: () => {
      message.info('取消删除！')
    },
  })
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

/* 添加自定义开关样式 */
.active-switch {
  background-color: green;
}

.disabled-switch {
  background-color: red;
}
</style>
