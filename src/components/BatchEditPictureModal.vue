<!--<template>-->
<!--  <a-modal v-model:visible="visible" title="批量编辑图片" :footer="false" @cancel="closeModal">-->
<!--    <a-typography-paragraph type="secondary">* 只对当前页面的图片生效</a-typography-paragraph>-->
<!--    &lt;!&ndash; 表单项 &ndash;&gt;-->
<!--    <a-form layout="vertical" :model="formData" @finish="handleSubmit">-->
<!--      <a-form-item label="图片名称" name="nameRule">-->
<!--        <a-input-->
<!--          v-model:value="formData.nameRule"-->
<!--          placeholder="请输入命名规则，输入 {序号} 可动态生成"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="分类" name="category">-->
<!--        <a-auto-complete-->
<!--          v-model:value="formData.category"-->
<!--          :options="categoryOptions"-->
<!--          placeholder="请输入分类"-->
<!--          allowClear-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="标签" name="tags">-->
<!--        <a-select-->
<!--          v-model:value="selectedTag"-->
<!--          :options="tagOptions"-->
<!--          mode="tags"-->
<!--          placeholder="请输入标签"-->
<!--          allowClear-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item>-->
<!--        <a-button type="primary" html-type="submit">提交</a-button>-->
<!--      </a-form-item>-->
<!--    </a-form>-->
<!--  </a-modal>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { defineProps, ref, withDefaults, defineExpose, reactive, onMounted } from 'vue'-->
<!--import { editPictureByBatchUsingPost } from '@/api2/pictureController'-->
<!--import { message } from 'ant-design-vue'-->
<!--import { pictureCategoryTagDataUsingGet } from '@/api2/categoryTagController'-->

<!--// 定义组件属性类型-->
<!--interface Props {-->
<!--  pictureList: API.PictureVO[]-->
<!--  spaceId: number-->
<!--  onSuccess: () => void-->
<!--}-->

<!--// 给组件指定初始值-->
<!--const props = withDefaults(defineProps<Props>(), {})-->

<!--// 控制弹窗可见性-->
<!--const visible = ref(false)-->

<!--// 打开弹窗-->
<!--const openModal = () => {-->
<!--  visible.value = true-->
<!--}-->

<!--// 关闭弹窗-->
<!--const closeModal = () => {-->
<!--  visible.value = false-->
<!--}-->

<!--// 暴露函数给父组件-->
<!--defineExpose({-->
<!--  openModal,-->
<!--})-->

<!--// 初始化表单数据-->
<!--const formData = reactive({-->
<!--  category: '', // 分类-->
<!--  tags: [], // 标签-->
<!--  nameRule: '', // 命名规则-->
<!--})-->

<!--// 分类和标签下拉框-->
<!--const categoryOptions = ref<string[]>([])-->
<!--const tagOptions = ref<string[]>([])-->
<!--// 标签下拉框的Value-->
<!--const tagValue = ref<string[]>([])-->
<!--// 标签下拉框的Label-->
<!--const tagLabel = ref<string[]>([])-->
<!--// 选择的标签-->
<!--const selectedTag = ref<string[]>([])-->
<!--const tagList = ref<string[]>([])-->
<!--const inputTagList = ref<string[]>([])-->

<!--// 获取标签和分类选项-->
<!--const getTagCategoryOptions = async () => {-->
<!--  const res = await pictureCategoryTagDataUsingGet()-->
<!--  if (res.data.code === 0 && res.data.data) {-->
<!--    tagOptions.value = (res.data.data.tagVOList ?? []).map((data: API.CategoryTagVO) => {-->
<!--      return {-->
<!--        value: data.id,-->
<!--        label: data.name,-->
<!--      }-->
<!--    })-->
<!--    categoryOptions.value = (res.data.data.categoryVOList ?? []).map((data: API.CategoryTagVO) => {-->
<!--      return {-->
<!--        value: data.id,-->
<!--        label: data.name,-->
<!--      }-->
<!--    })-->
<!--  } else {-->
<!--    message.error('加载选项失败，' + res.data.message)-->
<!--  }-->
<!--}-->

<!--// 提交表单时处理-->
<!--const handleSubmit = async (values: any) => {-->
<!--  if (!props.pictureList) {-->
<!--    return-->
<!--  }-->

<!--  // 处理手动输入的标签, 如果在查询出来的标签下拉框中匹配不到，则添加到 inputTagList 中-->
<!--  tagOptions.value.forEach((tag) => {-->
<!--    tagValue.value.push(tag.value)-->
<!--  })-->
<!--  if (selectedTag) {-->
<!--    selectedTag.value.forEach((tag) => {-->
<!--      if (!tagValue.value.includes(tag)) {-->
<!--        inputTagList.value.push(tag)-->
<!--      } else {-->
<!--        tagList.value.push(tag)-->
<!--      }-->
<!--    })-->
<!--    values.tags = tagList.value-->
<!--    values.inputTagList = inputTagList.value-->
<!--  }-->

<!--  const res = await editPictureByBatchUsingPost({-->
<!--    pictureIdList: props.pictureList.map((picture) => picture.id),-->
<!--    spaceId: props.spaceId,-->
<!--    ...values,-->
<!--  })-->
<!--  if (res.data.code === 0 && res.data.data) {-->
<!--    message.success('操作成功')-->
<!--    closeModal()-->
<!--    props.onSuccess?.()-->
<!--  } else {-->
<!--    message.error('操作失败，' + res.data.message)-->
<!--  }-->
<!--}-->

<!--onMounted(() => {-->
<!--  getTagCategoryOptions()-->
<!--})-->
<!--</script>-->
