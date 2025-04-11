<template>
  <div id="text-to-image-page">
    <a-spin :spinning="generating" tip="图片生成中，请耐心等待...">
      <a-card class="generate-card">
        <!-- 标题 -->
        <a-card-meta>
          <template #title>
            <a-typography-title :level="3" class="page-title">
              <FileImageOutlined />
              文本生图
            </a-typography-title>
          </template>
        </a-card-meta>

        <a-divider />

        <!-- 内容区域 -->
        <a-flex gap="large" vertical class="content-wrapper">
          <!-- 输入区域 -->
          <div class="input-region">
            <a-flex gap="middle" align="center">
              <a-textarea
                v-model:value="prompt"
                placeholder="请输入图片描述，尽可能详细..."
                :rows="4"
                allow-clear
                show-count
                :maxlength="500"
                style="flex: 1"
              />
              <a-select
                v-model:value="selectedSize"
                style="width: 150px"
                placeholder="选择图片尺寸"
              >
                <a-select-option v-for="size in sizeOptions" :key="size.value" :value="size.value">
                  {{ size.label }}
                </a-select-option>
              </a-select>
              <a-button
                type="primary"
                size="large"
                :disabled="!prompt || generating"
                @click="generateImage"
              >
                生成图片
              </a-button>
            </a-flex>
          </div>

          <!-- 生成结果区域 -->
          <div class="result-region">
            <a-empty v-if="!generatedImageUrl" description="输入描述并点击生成按钮创建图片" />
            <a-card v-else title="生成结果" class="result-card">
              <template #extra>
                <a-flex>
                  <a-button type="dashed" :href="generatedImageUrl" target="_blank">
                    <DownloadOutlined />
                    下载图片
                  </a-button>
                </a-flex>
              </template>
              <!-- 生成结果图片 -->
              <div class="image-container">
                <a-image :src="generatedImageUrl" :preview="false" />
              </div>
            </a-card>
          </div>
        </a-flex>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DownloadOutlined, FileImageOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { textGeneratePictureUsingPost } from '@/api/pictureController'

// 输入文本
const prompt = ref<string>(null)

// 尺寸选项
const sizeOptions = ref([
  { value: '0', label: '1:1（1024*1024）' },
  { value: '1', label: '16:9（1024*768）' },
])

// 选中的尺寸
const selectedSize = ref<string>('')

// 生成状态
const generating = ref<boolean>(false)
const generatedImageUrl = ref<string>('')
const taskId = ref<string>('')

// 生成图片
const generateImage = async () => {
  if (!prompt.value) {
    message.error('请输入图片描述')
    return
  }
  if (!selectedSize.value) {
    message.error('请选择图片尺寸')
    return
  }

  generating.value = true
  generatedImageUrl.value = ''

  try {
    const res = await textGeneratePictureUsingPost({
      prompt: prompt.value,
      pictureSize: selectedSize.value,
    })
    if (res.code === 0 && res.data) {
      generatedImageUrl.value = res.data.results.url
      taskId.value = res.data.taskId
      message.success('图片生成成功！')
      generating.value = false
    } else {
      throw new Error(res.message || '图片生成任务提交失败')
    }
  } catch (error) {
    message.error(error.message || '图片生成失败')
    generating.value = false
  }
}
</script>

<style scoped lang="less">
#text-to-image-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  //height: calc(100vh - 64px);

  .generate-card {
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

    .input-region {
      margin-bottom: 24px;
    }

    .result-region {
      flex: 1;
      min-height: 0;
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
