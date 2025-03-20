<template>
  <div class="pictureSearchForm">
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-select
          v-model:value="searchParams.category"
          :options="categoryOptions"
          placeholder="请选择分类"
          style="min-width: 180px"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          :options="tagOptions"
          placeholder="请选择标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="日期" name="">
        <a-range-picker
          style="width: 400px"
          show-time
          v-model:value="dateRange"
          :placeholder="['编辑开始日期', '编辑结束时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="searchParams.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-input v-model:value="searchParams.introduction" placeholder="请输入简介" allow-clear />
      </a-form-item>
      <a-form-item label="宽度" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth" />
      </a-form-item>
      <a-form-item label="高度" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight" />
      </a-form-item>
      <a-form-item label="格式" name="picFormat">
        <a-select
          v-model:value="searchParams.picFormat"
          placeholder="请选择图片格式"
          style="min-width: 180px"
          allow-clear
        >
          <a-select-option value="jpg">jpg</a-select-option>
          <a-select-option value="jpeg">jpeg</a-select-option>
          <a-select-option value="png">png</a-select-option>
          <a-select-option value="webp">webp</a-select-option>
          <a-select-option value="gif">gif</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" style="width: 96px">搜索</a-button>
          <a-button html-type="reset" @click="doClear">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { pictureCategoryTagDataUsingGet } from '@/api2/categoryTagController'
import PictureQueryRequest = API.PictureQueryRequest
import dayjs from 'dayjs'

interface Props {
  onSearch?: (searchParams: PictureQueryRequest) => void
}

const props = defineProps<Props>()

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({})

// 获取数据
const doSearch = () => {
  props.onSearch?.(searchParams)
}

// 分类和标签下拉框
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])
// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await pictureCategoryTagDataUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.data.data.tagVOList ?? []).map((data: API.CategoryTagVO) => {
      return {
        value: data.id,
        label: data.name,
      }
    })
    categoryOptions.value = (res.data.data.categoryVOList ?? []).map((data: API.CategoryTagVO) => {
      return {
        value: data.id,
        label: data.name,
      }
    })
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

const dateRange = ref<[]>([])

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates.length < 2) {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  } else {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  }
}

const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

// 清理
const doClear = () => {
  // 取消所有对象的值
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchParams)
}

onMounted(() => {
  getTagCategoryOptions()
})
</script>

<style scoped>
.pictureSearchForm .ant-form-item {
  margin-bottom: 16px;
}
</style>
