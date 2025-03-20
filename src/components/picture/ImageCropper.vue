<template>
  <div id="image-cropper">
    <a-modal
      class="image-cropper"
      v-model:visible="modalVisible"
      title="裁剪图片"
      :footer="false"
      @cancel="closeModal"
      :maskClosable="false"
    >
      <a-spin :spinning="cropLoading">
        <div class="custom-div">
          <vue-cropper
            ref="cropperRef"
            :img="picture?.picUrl"
            :autoCrop="true"
            :fixedBox="false"
            :centerBox="true"
            :can-move="false"
            :canMoveBox="true"
            :info="true"
            outputType="png"
          />
        </div>
      </a-spin>
      <!-- 图片操作 -->
      <div class="image-cropper-actions">
        <a-space>
          <a-button @click="rotateLeft">向左旋转</a-button>
          <a-button @click="rotateRight">向右旋转</a-button>
          <a-button @click="changeScale(1)">放大</a-button>
          <a-button @click="changeScale(-1)">缩小</a-button>
          <a-button type="primary" :loading="cropLoading" @click="handleImageCrop"> 确认</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { PICTURE_EDIT_ACTION_ENUM } from '@/constants/picture'
import { uploadPictureByFileUsingPost } from '@/api/pictureController'

/**
 * 定义 Props 接口
 */
interface Props {
  picture?: API.PictureDetailVO
  spaceId?: number
  cropSuccess?: (newPicture: API.PictureDetailVO) => void
}

/**
 * 使用 defineProps 声明 props 并指定类型
 */
const props = defineProps<Props>()

/**
 * 编辑器组件引用
 */
const cropperRef = ref()

/**
 * 向左旋转
 */
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

/**
 * 向右旋转
 */
const rotateRight = () => {
  cropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

/**
 * 缩放
 * @param num
 */
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}

/**
 * 弹窗显隐
 */
const modalVisible = ref(false)

/**
 * 打开弹窗
 */
const openModal = () => {
  modalVisible.value = true
}

/**
 * 定义暴露给父组件的方法
 */
defineExpose({
  openModal,
})

/**
 * 裁剪加载中
 */
const cropLoading = ref<boolean>(false)

/**
 * 处理图片裁剪
 */
const handleImageCrop = () => {
  cropLoading.value = true
  try {
    cropperRef.value.getCropBlob(async (blob: Blob) => {
      const fileName = (props.picture?.picName || 'image') + '.png'
      const file = new File([blob], fileName, { type: blob.type })
      // 发送上传图片请求
      const params = props.picture ? { id: props.picture.id } : {}
      params.spaceId = props.spaceId
      const res = await uploadPictureByFileUsingPost(params, {}, file)
      if (res.code === 0 && res.data) {
        message.success('图片上传成功!')
        modalVisible.value = false
        // 将上传成功的图片信息传递给父组件
        props.cropSuccess?.(res.data)
      } else {
        message.error('图片上传失败! ' + res.message)
      }
    })
  } catch (error) {
    message.error('图片裁剪失败！')
  } finally {
    cropLoading.value = false
  }
}
</script>

<style scoped>
.image-cropper {
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px !important;
}

.image-cropper .image-edit-actions,
.image-cropper .image-cropper-actions {
  text-align: center;
}
</style>
