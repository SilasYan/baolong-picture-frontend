<template>
  <div id="search-picture-page">
    <!-- 顶部标题 -->
    <a-flex justify="space-between" align="center" class="page-header">
      <a-typography-title :level="3" class="header-title">
        <BugOutlined />
        爬取图片
      </a-typography-title>
    </a-flex>

    <div class="content-container">
      <!-- 表单部分 -->
      <div class="form-section">
        <a-card class="form-card" :bordered="false">
          <a-form layout="vertical" :model="grabFormParam" @finish="handleGrabPictureSubmit">
            <a-form-item
              label="爬取来源"
              name="grabSource"
              :rules="[{ required: true, message: '请选择爬取来源' }]"
            >
              <a-select
                v-model:value="grabFormParam.grabSource"
                :options="grabSourceList"
                placeholder="请选择爬取来源"
                allowClear
                size="large"
              >
                <a-select-option value="BING">必应</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="图片关键词"
              name="keyword"
              :rules="[{ required: true, message: '请输入图片关键词' }]"
            >
              <a-input
                size="large"
                v-model:value="grabFormParam.keyword"
                placeholder="请输入图片关键词"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              label="图片名称前缀（可选）"
              name="namePrefix"
            >
              <a-input
                size="large"
                v-model:value="grabFormParam.namePrefix"
                placeholder="请输入图片名称前缀"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              label="随机种子（输入 0-100 的数）"
              name="randomSeed"
            >
              <a-input-number
                size="large"
                v-model:value="grabFormParam.randomSeed"
                placeholder="请输入 0-100 的数"
                :min="1"
                :max="100"
                allow-clear
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item
              label="抓取数量（默认 15 张）"
              name="grabCount"
            >
              <a-input-number
                size="large"
                v-model:value="grabFormParam.grabCount"
                placeholder="请输入抓取数量"
                :min="1"
                :max="30"
                allow-clear
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item>
              <a-button
                size="large"
                type="primary"
                html-type="submit"
                block
                :loading="grabLoading"
                class="submit-btn"
              >
                开始爬取
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>

      <!-- 爬取图片列表部分 -->
      <div class="results-section">
        <a-card class="results-card" :bordered="false">
          <a-spin
            v-if="requestSendStatus"
            tip="爬取中，请稍后..."
            :spinning="spinning"
            class="results-spinner"
          >
            <a-flex justify="flex-start" wrap="wrap" gap="middle" class="image-grid">
              <a-card
                v-for="(item, index) in grabPictureList"
                :key="index"
                :title="item.imageName"
                :bordered="false"
                class="image-card"
              >
                <template #actions>
                  <div @click="(e) => uploadImage(item)" class="card-action">
                    <CloudUploadOutlined />
                    <span>上传到公共图库</span>
                  </div>
                  <div @click="(e) => openImage(item)" class="card-action">
                    <ExportOutlined />
                    <span>图片源</span>
                  </div>
                </template>
                <template #cover>
                  <a-image
                    :src="item.handleImageUrl"
                    class="image-preview"
                  />
                </template>
              </a-card>
            </a-flex>
          </a-spin>
          <a-empty v-else class="empty-state">
            <template #description>
              <span class="empty-text">
                {{ emptyDesc }}
              </span>
            </template>
          </a-empty>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { BugOutlined, ExportOutlined, CloudUploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  grabPictureUsingPost,
  uploadPictureByGrabUsingPost,
} from '@/api/pictureController'

/**
 * 爬取表单参数
 */
const grabFormParam = reactive<API.PictureGrabRequest>({})

/**
 * 显示描述
 */
const emptyDesc = ref<string>('请先在左边填写信息后点击开始爬取即可执行')
/**
 * 请求状态
 */
const requestSendStatus = ref<boolean>(false)
/**
 * 爬取按钮加载中
 */
const grabLoading = ref(false)
/**
 * 处理爬取图片表单
 */
const handleGrabPictureSubmit = async () => {
  grabLoading.value = true
  requestSendStatus.value = true
  await getGrabPictureListData()
}

/**
 * 爬取图片列表加载中
 */
const spinning = ref<boolean>(false)
/**
 * 爬取图片列表
 */
const grabPictureList = ref<API.GrabPictureResult>([])
/**
 * 获取爬取的图片列表数据
 */
const getGrabPictureListData = async () => {
  spinning.value = true
  setTimeout(async () => {
    try {
      const res = await grabPictureUsingPost(grabFormParam)
      if (res.code === 0 && res.data) {
        grabPictureList.value = res.data ?? []
      } else {
        message.error('爬取图片失败，稍后重试！')
      }
    } catch (e) {
      message.error('爬取图片失败，稍后重试！')
    } finally {
      spinning.value = false
      grabLoading.value = false
      if (grabPictureList.value.length === 0) {
        requestSendStatus.value = false
        emptyDesc.value = '暂时没有爬取到对应的图片！'
      }
    }
  }, 3000)
}

/**
 * 上传到公共图库
 * @param picture
 */
const uploadImage = async (picture: API.GrabPictureResult) => {
  spinning.value = true
  try {
    const res = await uploadPictureByGrabUsingPost({
      pictureUrl: picture.handleImageUrl,
      picName: picture.imageName,
    })
    if (res.code === 0 && res.data) {
      message.success('图片上传成功!')
    } else {
      message.error('图片上传失败! ' + res.message)
    }
  } finally {
    spinning.value = false
  }
}
/**
 * 打开图片源
 * @param picture
 */
const openImage = (picture: API.GrabPictureResult) => {
  const link = document.createElement('a')
  link.href = picture.imageUrl
  link.download = picture.imageName || `download_${Date.now()}.jpg`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
#search-picture-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.header-title {
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
}

.content-container {
  display: flex;
  flex: 1;
  gap: 20px;
  height: calc(100% - 60px);
}

.form-section {
  width: 320px;
  min-width: 320px;
}

.form-card {
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  border-radius: 8px;
}

.form-card :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.submit-btn {
  height: 40px;
  font-weight: 500;
}

.results-section {
  flex: 1;
  min-width: 0;
}

.results-card {
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  border-radius: 8px;
  background-color: #fff;
}

.results-spinner {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-grid {
  padding: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.image-card {
  width: 320px;
  height: 350px;
  text-align: center;
  margin:0 20px 20px 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.image-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.image-preview {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

/* 图片样式：完全自适应 */
.image-preview :deep(.ant-image) {
  width: 100%;
  height: 350px;
}

.image-preview :deep(.ant-image .ant-image-img) {
  width: auto;
  height: 350px;
  margin: 0 auto;
  transition: transform 0.3s ease;
}

.card-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.card-action:hover {
  color: #1890ff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 300px);
}

.empty-text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
}
</style>
