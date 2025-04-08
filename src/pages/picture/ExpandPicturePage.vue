<template>
  <div id="expand-picture-page">
    <a-spin :spinning="uploadLoading" tip="图片上传中...">
      <a-card class="expand-card">
        <!-- 标题 -->
        <a-card-meta>
          <template #title>
            <a-typography-title :level="3" class="page-title">
              <FullscreenOutlined />
              AI扩图
            </a-typography-title>
          </template>
        </a-card-meta>

        <a-divider />

        <a-spin :spinning="expandLoading" tip="扩图任务执行中，请耐心等待不要刷新页面...">
          <!-- 内容区域 -->
          <a-flex gap="middle" align="stretch" class="content-wrapper">
            <!-- 原始图片区域 -->
            <div class="origin-region">
              <PictureUpload
                :picture="pictureInfo"
                :expandPicture="true"
                :uploadSuccess="handleUploadSuccess"
              />
            </div>

            <!-- 操作按钮区域 -->
            <div v-if="pictureInfo.picUrl" class="action-region">
              <a-flex vertical justify="space-between" align="stretch">
                <a-button
                  type="dashed"
                  size="large"
                  :disabled="expandDisabled"
                  @click="() => doExpandPicture(pictureInfo, 1)"
                >
                  等比扩图
                </a-button>
                <a-button
                  type="dashed"
                  size="large"
                  :disabled="expandDisabled"
                  @click="() => doExpandPicture(pictureInfo, 0)"
                >
                  旋转扩图
                </a-button>
              </a-flex>
            </div>

            <!-- 扩图结果区域 -->
            <div class="result-region">
              <a-empty v-if="!expandPicUrl" :description="null" />
              <a-card
                v-else
                title="请尽快保存当前扩图图片，以免失效"
                class="result-card"
              >
                <!-- 扩图结果图片 -->
                <div class="image-container">
                  <a-image :src="expandPicUrl" :preview="false" />
                </div>

                <!-- 操作按钮 -->
                <template #actions>
                  <a-button type="link" @click="doUploadExpandPicture">
                    保存扩图结果
                  </a-button>
                </template>
              </a-card>
            </div>
          </a-flex>
        </a-spin>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { FullscreenOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PictureUpload from '@/components/picture/upload/FilePictureUpload.vue'
import {
  expandPictureQueryUsingGet,
  expandPictureUsingPost,
  uploadPictureByUrlUsingPost,
} from '@/api/pictureController'

// 图片信息
const pictureInfo = ref<API.PictureDetailVO>({})

// 处理子组件上传图片成功回调
const handleUploadSuccess = (newPicture: API.PictureDetailVO) => {
  pictureInfo.value = newPicture
  // 上传新图片时清空之前的扩图结果
  expandPicUrl.value = ''
  taskId.value = ''
}

// 扩图相关状态
const expandDisabled = ref<boolean>(false)
const expandLoading = ref<boolean>(false)
const expandPicUrl = ref<string>('')
const taskId = ref<string>('')
const uploadLoading = ref<boolean>(false)

// 轮询定时器
let pollingTimer: NodeJS.Timeout | null = null

// 执行扩图
const doExpandPicture = async (picture: API.PictureDetailVO, type: number) => {
  if (!picture.picUrl) {
    message.error('请先上传一张图片')
    return
  }

  // 重置状态
  expandDisabled.value = true
  expandLoading.value = true
  expandPicUrl.value = ''

  try {
    const res = await expandPictureUsingPost({
      picUrl: picture.picUrl,
      expandType: type,
    })

    if (res.code === 0 && res.data) {
      taskId.value = res.data.output.taskId
      message.success('扩图任务已提交，请等待处理...')
      startPolling()
    } else {
      throw new Error(res.message || '扩图任务提交失败')
    }
  } catch (error) {
    message.error(error.message || '扩图任务提交失败')
    resetExpandState()
  }
}

// 开始轮询获取扩图结果
const startPolling = () => {
  if (!taskId.value) {
    message.warning('当前任务已失效')
    resetExpandState()
    return
  }

  // 先立即查询一次
  checkExpandResult()

  // 然后设置定时器
  pollingTimer = setInterval(checkExpandResult, 5000)
}

// 检查扩图结果
const checkExpandResult = async () => {
  if (!taskId.value) return

  try {
    const res = await expandPictureQueryUsingGet({
      taskId: taskId.value,
    })

    if (res.code === 0 && res.data) {
      const taskResult = res.data.output

      if (taskResult.taskStatus === 'SUCCEEDED') {
        message.success('扩图成功')
        expandPicUrl.value = taskResult.outputImageUrl
        resetExpandState()
        clearPolling()
      } else if (taskResult.taskStatus === 'FAILED') {
        throw new Error(res.message || '扩图任务执行失败')
      }
      // 其他状态继续轮询
    } else {
      throw new Error(res.message || '查询扩图结果失败')
    }
  } catch (error) {
    message.error(error.message || '扩图服务异常，请稍后重试！')
    resetExpandState()
    clearPolling()
  }
}

// 上传扩图图片
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
      expandStatus: 2,
      expandTaskId: taskId.value,
      expandOriginUrl: expandPicUrl.value,
    }

    const res = await uploadPictureByUrlUsingPost(params)
    if (res.code === 0 && res.data) {
      message.success('图片上传成功!')
    } else {
      throw new Error(res.message || '图片上传失败')
    }
  } catch (error) {
    message.error(error.message || '图片上传失败!')
    console.error('上传失败:', error)
  } finally {
    uploadLoading.value = false
  }
}

// 重置扩图状态
const resetExpandState = () => {
  expandDisabled.value = false
  expandLoading.value = false
}

// 清除轮询定时器
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// 组件卸载时清理
onUnmounted(() => {
  clearPolling()
})
</script>

<style scoped lang="less">
#expand-picture-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  height: calc(100vh - 64px);

  .expand-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-title {
      text-align: center;
      margin-bottom: 0;
    }
  }

  .content-wrapper {
    flex: 1;
    min-height: 0; // 防止flex容器溢出

    .origin-region {
      flex: 0 0 40%;
      min-width: 0;
    }

    .action-region {
      flex: 0 0 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .ant-btn {
        margin: 8px 0;
        white-space: nowrap;
      }
    }

    .result-region {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;

      .result-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.ant-card-body) {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .image-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 0;

          .ant-image {
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
  }
}
</style>
