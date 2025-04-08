<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUploadPicture"
      :before-upload="beforeUploadPicture"
      accept=".jpg,.jpeg,.png,.gif,.webp"
    >
      <img v-if="picture?.picUrl" :src="picture?.picUrl" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="uploadLoading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { imageValidator } from '@/utils'
import { uploadPictureByFileUsingPost } from '@/api/pictureController'

// 接收父组件参数，返回父组件参数
interface Props {
  picture?: API.PictureDetailVO
  spaceId?: number
  uploadSuccess?: (newPicture: API.PictureDetailVO) => void
  expandPicture?: boolean
}

// 把接收到的父组件参数做一个赋值
const props = defineProps<Props>()

// 上传加载状态
const uploadLoading = ref<boolean>(false)
/**
 * 上传图片校验
 * @param file
 */
const beforeUploadPicture = (file: File) => imageValidator(file, { maxSizeMB: Infinity })
/**
 * 上传图片
 * @param file
 */
const handleUploadPicture = async ({ file }: any) => {
  uploadLoading.value = true
  try {
    const params = props.picture ? { pictureId: props.picture.pictureId } : {}
    params.spaceId = props.spaceId
    // 说明是AI 扩图进来了，应该存储为临时文件，等扩图之后保存了再修改状态
    if (props.expandPicture) {
      params.expandStatus = 1
    }
    const res = await uploadPictureByFileUsingPost(params, {}, file)
    if (res.code === 0 && res.data) {
      message.success('图片上传成功!')
      // 将上传成功的图片信息传递给父组件
      props.uploadSuccess?.(res.data)
    } else {
      message.error('图片上传失败! ' + res.message)
    }
  } catch (error) {
    console.error(error)
    message.error('图片上传失败!')
  } finally {
    uploadLoading.value = false
  }
}
</script>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 250px;
  min-width: 152px;
}

.picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
