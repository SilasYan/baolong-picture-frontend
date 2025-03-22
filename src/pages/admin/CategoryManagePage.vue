<template>
  <div id="category-manager-page">
    <!-- 标题区域 -->
    <div class="custom-div title-region">
      <a-flex justify="space-between">
        <!-- 顶部标题 -->
        <a-typography>
          <a-typography-title :level="3">
            <InsertRowAboveOutlined />
            分类管理
          </a-typography-title>
        </a-typography>
        <!-- 操作 -->
        <a-space>
          <a-button
            ghost
            size="large"
            type="primary"
            @click="addCategoryDialog = true"
            style="margin-right: 20px"
          >
            <PlusCircleOutlined />
            创建分类
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
        :model="categorySearchParams"
        @finish="doCategorySearch"
      >
        <!-- 表单 -->
        <a-form-item name="name" label="名称">
          <a-input
            v-model:value="categorySearchParams.name"
            placeholder="请输入分类名称"
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
        :columns="categoryColumns"
        :data-source="categoryList"
        :pagination="categoryPagination"
        @change="doCategoryTableChange"
        :scroll="{ x: 'max-content', y: 800 }"
        :loading="categoryListLoading"
      >
        <template #bodyCell="{ column, record }">
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
              <a-button type="link" @click="editCategory(record)">编辑</a-button>
              <a-button type="link" danger @click="deleteCategory(record.categoryId)"
                >删除</a-button
              >
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增分类弹窗 -->
    <a-modal
      v-model:open="addCategoryDialog"
      title="新增分类"
      centered
      cancelText="取消"
      okText="创建"
      @ok="handleAddCategory"
      :afterClose="handleAddClose"
    >
      <a-form layout="vertical" :model="addCategoryForm">
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="addCategoryForm.name" placeholder="请输入分类名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑就分类弹窗 -->
    <a-modal
      v-model:open="editCategoryDialog"
      title="更新分类"
      centered
      cancelText="取消"
      okText="修改"
      @ok="handleEditCategory"
    >
      <a-form layout="vertical" :model="updateCategoryForm">
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="updateCategoryForm.name" placeholder="请输入分类名称" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { PlusCircleOutlined, InsertRowAboveOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  addCategoryUsingPost,
  deleteCategoryUsingPost,
  getCategoryPageListAsManageUsingPost,
  updateCategoryUsingPost,
} from '@/api/categoryController'
import dayjs from 'dayjs'

/**
 * 初始化页面
 */
onMounted(() => {
  getCategoryListData()
})

/**
 * 分类表格列
 */
const categoryColumns = [
  {
    title: '分类 ID',
    dataIndex: 'categoryId',
    fixed: 'left',
    align: 'center',
    width: 80,
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    align: 'center',
    customCell: () => ({ style: { minWidth: '250px', maxWidth: '250px' } }),
  },
  {
    title: '使用数量',
    dataIndex: 'useNum',
    align: 'center',
    customCell: () => ({ style: { minWidth: '100px', maxWidth: '100px' } }),
  },
  {
    title: '用户 ID',
    dataIndex: 'userId',
    align: 'center',
    customCell: () => ({ style: { minWidth: '100px', maxWidth: '250px' } }),
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
 * 分类搜索参数
 */
const categorySearchParams = reactive<API.CategoryQueryRequest>({
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
 * 执行分类搜索
 */
const doCategorySearch = () => {
  categorySearchParams.current = 1
  getCategoryListData()
}

/**
 * 分类列表
 */
const categoryList = ref<API.CategoryVO>([])
/**
 * 分类列表加载状态
 */
const categoryListLoading = ref<boolean>(true)
/**
 * 获取分类列表数据
 */
const getCategoryListData = async () => {
  categoryListLoading.value = true
  const res = await getCategoryPageListAsManageUsingPost({ ...categorySearchParams })
  if (res.code === 0 && res.data) {
    categoryList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取分类列表失败!')
  }
  categoryListLoading.value = false
}

/**
 * 数据总数
 */
const total = ref(0)
/**
 * 分类分页参数
 */
const categoryPagination = computed(() => {
  return {
    current: categorySearchParams.current ?? 1,
    pageSize: categorySearchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})
/**
 * 处理分类表格变化
 * @param page
 */
const doCategoryTableChange = (page: any) => {
  categorySearchParams.current = page.current
  categorySearchParams.pageSize = page.pageSize
  getCategoryListData()
}

/**
 * 新增分类弹框变量
 */
const addCategoryDialog = ref<boolean>(false)
/**
 * 新增分类表单
 */
const addCategoryForm = reactive<API.CategoryAddRequest>({})
/**
 * 提交新增分类
 */
const handleAddCategory = async () => {
  try {
    const res = await addCategoryUsingPost(addCategoryForm)
    if (res.code === 0) {
      message.success('新增成功！')
    } else {
      message.error('新增失败！')
    }
  } catch (e) {
    message.error('新增失败！')
  } finally {
    addCategoryDialog.value = false
    await getCategoryListData()
  }
}
/**
 * 处理新增分类关闭
 */
const handleAddClose = () => {
  updateCategoryForm.name = ''
}

/**
 * 编辑分类弹窗变量
 */
const editCategoryDialog = ref<boolean>(false)
/**
 * 更新分类表单
 */
const updateCategoryForm = reactive<API.CategoryUpdateRequest>({})
/**
 * 编辑分类
 * @param record
 */
const editCategory = (record: any) => {
  editCategoryDialog.value = true
  updateCategoryForm.categoryId = record.categoryId
  updateCategoryForm.name = record.name
}
/**
 * 处理编辑分类
 */
const handleEditCategory = async () => {
  try {
    const res = await updateCategoryUsingPost(updateCategoryForm)
    if (res.code === 0) {
      message.success('修改成功！')
    } else {
      message.error('修改失败！')
    }
  } catch (e) {
    message.error('修改失败！')
  } finally {
    editCategoryDialog.value = false
    await getCategoryListData()
  }
}

/**
 * 删除分类
 * @param categoryId
 */
const deleteCategory = async (categoryId: string) => {
  if (!categoryId) {
    return
  }
  Modal.confirm({
    title: '删除图片',
    content: '确定要删除该分类吗？删除后不可恢复！',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteCategoryUsingPost({ id: categoryId })
        if (res.code === 0) {
          message.success('删除成功！')
        } else {
          message.error('删除失败！')
        }
      } catch (e) {
        message.error('删除失败！')
      } finally {
        await getCategoryListData()
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
