<template>
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 16px" size="large">
      <a-input
        v-model:value="pictureUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片 URL"
      />
      <a-button
        type="primary"
        :loading="uploadLoading"
        @click="handleUploadPicture"
        style="width: 120px"
      >
        上传图片
      </a-button>
    </a-input-group>
    <img v-if="picture?.picUrl" :src="picture?.picUrl" :alt="picture.picName" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController'

// 接收父组件参数，返回父组件参数
interface Props {
  picture?: API.PictureDetailVO
  spaceId?: number
  uploadSuccess?: (newPicture: API.PictureDetailVO) => void
}

// 把接收到的父组件参数做一个赋值
const props = defineProps<Props>()

// 上传加载状态
const uploadLoading = ref<boolean>(false)
// 图片地址
const pictureUrl = ref<string>()
/**
 * 上传图片
 */
const handleUploadPicture = async () => {
  uploadLoading.value = true
  try {
    const params: API.PictureUploadRequest = { pictureUrl: pictureUrl.value }
    if (props.picture) {
      params.pictureId = props.picture.pictureId
    }
    if (props.spaceId) {
      params.spaceId = props.spaceId
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.code === 0 && res.data) {
      message.success('图片上传成功!')
      // 将上传成功的图片信息传递给父组件
      props.uploadSuccess?.(res.data)
    } else {
      message.error(res.message)
    }
  } finally {
    uploadLoading.value = false
  }
}
</script>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
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
