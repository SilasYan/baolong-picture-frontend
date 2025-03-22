<template>
  <div id="menu-manager-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <UnorderedListOutlined />
            菜单管理
          </a-typography-title>
        </a-typography>
        <!-- 操作 -->
        <a-space>
          <a-button
            ghost
            size="large"
            type="primary"
            @click="addMenuDialog = true"
            style="margin-right: 20px"
          >
            <PlusCircleOutlined />
            创建菜单
          </a-button>
        </a-space>
      </a-flex>
    </div>

    <!-- 搜索区域 -->
    <div class="custom-div search-region">
      <!-- 搜索表单 -->
      <a-form class="custom-form" layout="inline" :model="menuSearchParams" @finish="doMenuSearch">
        <!-- 表单 -->
        <a-form-item name="name" label="名称">
          <a-input
            v-model:value="menuSearchParams.name"
            placeholder="请输入菜单名称"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 数据区域 -->
    <div class="custom-div data-region">
      <!-- 表格数据 -->
      <a-table
        :columns="menuColumns"
        :data-source="menuList"
        :pagination="menuPagination"
        @change="doMenuTableChange"
        :scroll="{ x: 'max-content', y: 800 }"
        :loading="menuListLoading"
      >
        <template #bodyCell="{ column, record }">
          <!-- 创建时间 -->
          <template v-if="column.dataIndex === 'menuPosition'">
            {{ MENU_POSITION_MAP[record.menuPosition] }}
          </template>
          <!-- 创建时间 -->
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
              <a-button type="link" @click="editMenu(record)">编辑</a-button>
              <a-button type="link" danger @click="deleteMenu(record.menuId)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增菜单弹窗 -->
    <a-modal
      v-model:open="addMenuDialog"
      title="新增菜单"
      centered
      cancelText="取消"
      okText="创建"
      @ok="handleAddMenu"
      :afterClose="handleAddClose"
    >
      <a-form layout="vertical" :model="addMenuForm">
        <a-form-item label="菜单名称" name="menuName">
          <a-input v-model:value="addMenuForm.menuName" placeholder="请输入菜单名称" size="large" />
        </a-form-item>
        <a-form-item label="菜单位置" name="menuPosition">
          <a-select
            v-model:value="addMenuForm.menuPosition"
            :options="MENU_POSITION_OPTIONS"
            placeholder="请选择菜单位置"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="菜单路径" name="menuPath">
          <a-input v-model:value="addMenuForm.menuPath" placeholder="请输入菜单路径" size="large" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑就菜单弹窗 -->
    <a-modal
      v-model:open="editMenuDialog"
      title="更新菜单"
      centered
      cancelText="取消"
      okText="修改"
      @ok="handleEditMenu"
    >
      <a-form layout="vertical" :model="updateMenuForm">
        <a-form-item label="菜单名称" name="menuName">
          <a-input
            v-model:value="updateMenuForm.menuName"
            placeholder="请输入菜单名称"
            size="large"
          />
        </a-form-item>
        <a-form-item label="菜单位置" name="menuPosition">
          <a-select
            v-model:value="updateMenuForm.menuPosition"
            :options="MENU_POSITION_OPTIONS"
            placeholder="请选择菜单位置"
            style="min-width: 180px"
            allow-clear
            size="large"
          />
        </a-form-item>
        <a-form-item label="菜单路径" name="menuPath">
          <a-input
            v-model:value="updateMenuForm.menuPath"
            placeholder="请输入菜单路径"
            size="large"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { PlusCircleOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  addMenuUsingPost,
  deleteMenuUsingPost,
  getMenuPageListUsingPost,
  updateMenuUsingPost,
} from '@/api/menuController'
import dayjs from 'dayjs'
import { MENU_POSITION_ENUM, MENU_POSITION_MAP, MENU_POSITION_OPTIONS } from '@/constants/menu'

/**
 * 初始化页面
 */
onMounted(() => {
  getMenuListData()
})

/**
 * 菜单表格列
 */
const menuColumns = [
  {
    title: '菜单 ID',
    dataIndex: 'menuId',
    fixed: 'left',
    align: 'center',
    width: 80,
  },
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    align: 'center',
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '菜单位置',
    dataIndex: 'menuPosition',
    align: 'center',
    customCell: () => ({ style: { minWidth: '100px', maxWidth: '100px' } }),
  },
  {
    title: '菜单路径',
    dataIndex: 'menuPath',
    align: 'center',
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '编辑时间',
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
 * 菜单搜索参数
 */
const menuSearchParams = reactive<API.MenuQueryRequest>({
  current: 1,
  pageSize: 10,
  multipleSort: true,
  sorts: [
    {
      asc: false,
      field: 'createTime',
    },
  ],
})
/**
 * 执行菜单搜索
 */
const doMenuSearch = () => {
  menuSearchParams.current = 1
  getMenuListData()
}

/**
 * 菜单列表
 */
const menuList = ref<API.MenuVO>([])
/**
 * 菜单列表加载状态
 */
const menuListLoading = ref<boolean>(true)
/**
 * 获取菜单列表数据
 */
const getMenuListData = async () => {
  menuListLoading.value = true
  const res = await getMenuPageListUsingPost({ ...menuSearchParams })
  if (res.code === 0 && res.data) {
    menuList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取菜单列表失败!')
  }
  menuListLoading.value = false
}

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 菜单分页参数
 */
const menuPagination = computed(() => {
  return {
    current: menuSearchParams.current ?? 1,
    pageSize: menuSearchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
/**
 * 处理菜单表格变化
 * @param page
 */
const doMenuTableChange = (page: any) => {
  menuSearchParams.current = page.current
  menuSearchParams.pageSize = page.pageSize
  getMenuListData()
}

/**
 * 新增菜单弹框变量
 */
const addMenuDialog = ref<boolean>(false)
/**
 * 新增菜单表单
 */
const addMenuForm = reactive<API.MenuAddRequest>({})
/**
 * 提交新增菜单
 */
const handleAddMenu = async () => {
  try {
    const res = await addMenuUsingPost(addMenuForm)
    if (res.code === 0) {
      message.success('新增成功！')
    } else {
      message.error(res.message)
    }
  } catch (e) {
    message.error('新增失败！')
  } finally {
    addMenuDialog.value = false
    await getMenuListData()
  }
}
/**
 * 处理新增菜单关闭
 */
const handleAddClose = () => {
  addMenuForm.menuName = ''
  addMenuForm.menuPosition = ''
  addMenuForm.menuPath = ''
}

/**
 * 编辑菜单弹窗变量
 */
const editMenuDialog = ref<boolean>(false)
/**
 * 更新菜单表单
 */
const updateMenuForm = reactive<API.MenuUpdateRequest>({})
/**
 * 编辑菜单
 * @param record
 */
const editMenu = (record: any) => {
  editMenuDialog.value = true
  updateMenuForm.menuId = record.menuId
  updateMenuForm.menuName = record.menuName
  updateMenuForm.menuPosition = record.menuPosition
  updateMenuForm.menuPath = record.menuPath
}
/**
 * 处理编辑菜单
 */
const handleEditMenu = async () => {
  try {
    const res = await updateMenuUsingPost(updateMenuForm)
    if (res.code === 0) {
      message.success('修改成功！')
    } else {
      message.error(res.message)
    }
  } catch (e) {
    message.error('修改失败！')
  } finally {
    editMenuDialog.value = false
    await getMenuListData()
  }
}

/**
 * 删除菜单
 * @param menuId
 */
const deleteMenu = async (menuId: string) => {
  if (!menuId) {
    return
  }
  Modal.confirm({
    title: '删除图片',
    content: '确定要删除该菜单吗？删除后不可恢复！',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteMenuUsingPost({ id: menuId })
        if (res.code === 0) {
          message.success('删除成功！')
        } else {
          message.error(res.message)
        }
      } catch (e) {
        message.error('删除失败！')
      } finally {
        await getMenuListData()
      }
    },
    onCancel: () => {
      message.info('取消删除！')
    },
  })
}
</script>

<style scoped>
.custom-form :deep(.ant-form-item-label > label) {
  height: 40px; /* 与输入框高度一致 */
  line-height: 40px; /* 垂直居中 */
  display: flex;
  align-items: center; /* 垂直对齐 */
}
</style>
