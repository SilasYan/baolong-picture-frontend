<template>
  <div id="grab-picture-page">
    <!-- 顶部标题 -->
    <a-flex justify="space-between">
      <a-typography>
        <a-typography-title :level="3">
          <BugOutlined />
          爬取图片
        </a-typography-title>
      </a-typography>
    </a-flex>

    <div style="margin-bottom: 20px" />

    <div class="content">
      <!-- 表单部分 -->
      <div class="from-card">
        <a-card>
          <a-form layout="vertical" :model="grabFormParam" @finish="handleGrabPictureSubmit">
            <a-form-item
              label="爬取来源"
              name="grabSource"
              class="custom-form-item bold-label"
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
              class="custom-form-item bold-label"
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
              class="custom-form-item bold-label"
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
              class="custom-form-item bold-label"
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
              class="custom-form-item bold-label"
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
                style="width: 100%"
                :loading="grabLoading"
              >
                开始爬取
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>

      <!-- 爬取图片列表部分 -->
      <div class="list-card" style="background-color: #ececec; padding: 20px; min-height: 350px">
        <a-spin
          v-if="requestSendStatus"
          tip="爬取中，请稍后..."
          :spinning="spinning"
          :style="{
            width: '100%',
            height: '350px',
          }"
        >
          <a-flex justify="flex-start" wrap="wrap" gap="small">
            <a-card
              v-for="(item, index) in grabPictureList"
              :key="index"
              :title="item.imageName"
              :bordered="false"
              :headStyle="{ 'text-align': 'center' }"
              :style="{ width: '320px', height: '350px', margin: '0 20px 20px 0' }"
            >
              <template #actions>
                <div @click="(e) => uploadImage(item)">
                  <CloudUploadOutlined />
                  上传到公共图库
                </div>
                <div @click="(e) => openImage(item)">
                  <ExportOutlined />
                  图片源
                </div>
              </template>
              <template #cover>
                <a-image
                  :src="item.handleImageUrl"
                  fallback="data:image/png;base64,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"
                  :style="{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                  }"
                />
              </template>
            </a-card>
          </a-flex>
        </a-spin>
        <a-empty v-else style="margin-top: 200px">
          <template #description>
            <span>
              {{ emptyDesc }}
            </span>
          </template>
        </a-empty>
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
  pictureDownloadUsingPost,
  uploadPictureByGrabUsingPost,
  uploadPictureByUrlUsingPost,
} from '@/api/pictureController'
import { downloadImage } from '@/utils'

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
#grab-picture-page {
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
}

#grab-picture-page .content {
  flex: 1;
  min-height: 0; /* 关键：允许内容区域收缩 */
  display: flex;
}

#grab-picture-page .list-card {
  flex: 1;
  /* 动态计算高度 */
  height: calc(100vh - 250px) !important;
  overflow-y: auto; /* 添加垂直滚动 */
  background-color: #ececec;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* 调整 Spin 容器高度 */
.list-card >>> .ant-spin-nested-loading {
  height: 100%;
}

.list-card >>> .ant-spin-container {
  height: 100%;
}

/* 调整 Flex 容器高度 */
.list-card >>> .ant-flex {
  height: 100%;
  align-content: flex-start;
  overflow-y: auto;
}

/* 保持顶部和表单区域固定 */
#grab-picture-page .from-card {
  width: 20%;
  min-width: 300px;
  margin-right: 20px;
  height: fit-content; /* 根据内容自适应高度 */
}
</style>
