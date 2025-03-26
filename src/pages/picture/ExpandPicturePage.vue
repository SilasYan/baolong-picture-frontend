<template>
  <div id="expand-picture-page">
    <a-spin :spinning="uploadLoading" tip="图片上传中中...">
      <a-card style="height: 100%">
        <!-- 标题 -->
        <a-card-meta>
          <template #title>
            <a-typography>
              <a-typography-title :level="3">
                <FullscreenOutlined />
                AI扩图
              </a-typography-title>
            </a-typography>
          </template>
        </a-card-meta>
        <a-divider />
        <!-- 内容 -->
        <a-flex gap="middle" justify="flex-start">
          <div class="origin-region">
            <PictureUpload
              :picture="pictureInfo"
              :expandPicture="true"
              :uploadSuccess="handleUploadSuccess"
            />
          </div>
          <div v-if="pictureInfo.picUrl" class="change-region">
            <a-flex vertical justify="space-between" align="stretch">
              <a-button
                type="dashed"
                size="large"
                :disabled="expandClick"
                @click="() => doExpandPicture(pictureInfo, 0)"
              >
                等比
              </a-button>
              <a-button
                type="dashed"
                size="large"
                :disabled="expandClick"
                @click="() => doExpandPicture(pictureInfo, 1)"
              >
                旋转
              </a-button>
            </a-flex>
          </div>
          <div class="expand-region">
            <a-empty v-if="!expandPicUrl" :description="null" />
            <a-spin v-else :spinning="expandLoading" tip="扩图任务执行中...">
              <a-card
                title="请尽快保存当前扩图图片，以免失效"
                :headStyle="{ 'text-align': 'center' }"
                style="width: 100%"
              >
                <!-- 图片 -->
                <div class="image-detail-content">
                  <a-image v-if="expandPicUrl" :src="expandPicUrl" />
                </div>
                <!-- 操作按钮 -->
                <template #actions>
                  <div @click="doUploadExpandPicture">上传当前扩图图片</div>
                </template>
              </a-card>
            </a-spin>
          </div>
        </a-flex>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import { FullscreenOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PictureUpload from '@/components/picture/FilePictureUpload.vue'
import {
  expandPictureQueryUsingGet,
  expandPictureUsingPost,
  uploadPictureByUrlUsingPost,
} from '@/api/pictureController'

/**
 * 图片信息
 */
const pictureInfo = ref<API.PictureDetailVO>({})
/**
 * 处理子组件上传图片成功回调
 * @param newPicture
 */
const handleUploadSuccess = (newPicture: API.PictureDetailVO) => {
  pictureInfo.value = newPicture
}

/**
 * 扩图按钮点击状态
 */
const expandClick = ref<boolean>(false)
/**
 * 扩图加载中
 */
const expandLoading = ref<boolean>(false)
/**
 * 扩图任务ID
 */
const taskId = ref<string>('')
/**
 * 执行扩图
 * @param picture
 * @param type
 */
const doExpandPicture = async (picture: API.PictureDetailVO, type: number) => {
  if (!picture.picUrl) {
    message.error('请先上传一张图片')
    return
  }
  expandClick.value = true
  expandLoading.value = true
  const res = await expandPictureUsingPost({
    picUrl: picture.picUrl,
    expandType: type,
  })
  if (res.code === 0 && res.data) {
    expandClick.value = true
    taskId.value = res.data.output.taskId
    message.success('扩图任务执行成功，请等待...')
    startPolling()
  } else {
    expandClick.value = false
    expandLoading.value = false
  }
}
/**
 * 扩图图片地址
 */
const expandPicUrl = ref<string>('')

/**
 * 轮询定时器
 */
let pollingTimer: NodeJS.Timeout = null
/**
 * 清除轮询定时器
 */
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = null
  }
}
/**
 * 开始轮询获取扩图结果
 */
const startPolling = () => {
  if (!taskId.value) {
    message.warning('当前任务已失效')
    expandClick.value = false
    expandLoading.value = false
    return
  }

  pollingTimer = setInterval(async () => {
    try {
      const res = await expandPictureQueryUsingGet({
        taskId: taskId.value,
      })
      if (res.code === 0 && res.data) {
        const taskResult = res.data.output
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('扩图成功')
          expandPicUrl.value = taskResult.outputImageUrl
          expandClick.value = false
          expandLoading.value = false
          clearPolling()
        } else if (taskResult.taskStatus === 'FAILED')  {
          message.error(res.message)
          clearPolling()
        }
      }
    } catch (error) {
      message.error('扩图服务异常，请稍后重试！')
      clearPolling()
    }
  }, 5000) // 每隔 5 秒轮询一次
}

/**
 * 清理定时器，避免内存泄漏
 */
onUnmounted(() => {
  clearPolling()
})

/**
 * 上传扩图图片
 */
const uploadLoading = ref<boolean>(false)
const doUploadExpandPicture = async () => {
  if (!pictureInfo.value.pictureId) {
    message.error('图片不存在，请先上传图片')
    return
  }
  if (!expandPicUrl.value) {
    message.error('扩图图片不存在，请重新扩图')
    return
  }
  uploadLoading.value = true
  try {
    const params = {
      pictureId: pictureInfo.value.pictureId,
      pictureUrl: expandPicUrl.value,
      // 这里就是扩图成功后的
      expandStatus: 2,
      expandTaskId: taskId.value,
      expandOriginUrl: expandPicUrl.value,
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.code === 0 && res.data) {
      message.success('图片上传成功!')
    } else {
      message.error('图片上传失败! ' + res.message)
    }
  } catch (error) {
    console.error('上传失败:', error)
    message.error('图片上传失败!')
  } finally {
    uploadLoading.value = false
  }
}
</script>

<style scoped>
#expand-picture-page {
  max-width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 720px;
}

#expand-picture-page .origin-region {
  width: 40%;
  height: 100%;
}

#expand-picture-page .change-region {
  width: 10%;
  height: calc(100% - 24px);
}

#expand-picture-page .expand-region {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止内容溢出 */
}

.image-detail-content {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 确保容器宽度占满父容器 */
  /* 动态计算高度 */
  height: calc(100vh - 720px) !important;
}

.image-detail-content :deep(.ant-image) {
  height: 100%; /* 防止图片超出容器 */
}

.image-detail-content :deep(.ant-image .ant-image-img) {
  height: 100%; /* 防止图片超出容器 */
}

.ant-btn-dashed {
  flex: 1; /* 按钮均分宽度 */
  margin: 8px 0; /* 添加垂直间距 */
}
</style>
