<template>
  <div id="search-picture-page">
    <!-- 顶部标题 -->
    <a-flex justify="space-between">
      <a-typography>
        <a-typography-title :level="3">
          <SearchOutlined />
          以图搜图
        </a-typography-title>
      </a-typography>
    </a-flex>

    <div style="margin-bottom: 20px" />

    <div class="content">
      <div class="from-card">
        <!-- 原图部分 -->
        <div class="custom-div">
          <a-card hoverable @click="doClickPicture(picture)">
            <div class="image-detail-content" @dragstart="handleDragStart">
              <a-image :src="pictureDetailInfo.picUrl" height="250px" />
            </div>
          </a-card>
        </div>
        <!-- 表单部分 -->
        <a-card>
          <a-form layout="vertical" :model="searchFormParam" @finish="handleGrabPictureSubmit">
            <a-form-item
              label="搜索源"
              name="searchSource"
              class="custom-form-item bold-label"
              :rules="[{ required: true, message: '请选择搜索源' }]"
            >
              <a-select
                v-model:value="searchFormParam.searchSource"
                :options="grabSourceList"
                placeholder="请选择搜索来源"
                allowClear
                size="large"
              >
                <a-select-option value="so">360以图搜图</a-select-option>
                <a-select-option value="baidu">百度以图搜图</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="随机种子（输入 0-100 的数）"
              name="randomSeed"
              class="custom-form-item bold-label"
            >
              <a-input-number
                size="large"
                v-model:value="searchFormParam.randomSeed"
                placeholder="请输入 0-100 的数"
                :min="1"
                :max="100"
                allow-clear
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item
              label="搜索数量（默认 15 张）"
              name="searchCount"
              class="custom-form-item bold-label"
            >
              <a-input-number
                size="large"
                v-model:value="searchFormParam.searchCount"
                placeholder="请输入搜索数量"
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
                开始搜索
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </div>

      <!-- 搜索图片列表部分 -->
      <div class="list-card" style="background-color: #ececec; padding: 20px; min-height: 350px">
        <a-spin
          v-if="requestSendStatus"
          tip="搜索中，请稍后..."
          :spinning="spinning"
          :style="{
            width: '100%',
            height: '350px',
          }"
        >
          <a-flex justify="flex-start" wrap="wrap" gap="small">
            <a-card
              v-for="(item, index) in searchPictureList"
              :key="index"
              :title="`${item.imageName ?? '图片_' + item.imageKey}`"
              :bordered="false"
              :headStyle="{ 'text-align': 'center' }"
              :style="{ width: '320px', height: '350px', margin: '0 20px 20px 0' }"
            >
              <template #actions>
                <!--<div @click="(e) => uploadImage(item)">-->
                <!--  <CloudUploadOutlined />-->
                <!--  上传到公共图库-->
                <!--</div>-->
                <div @click="(e) => openImage(item)">
                  <ExportOutlined />
                  图片源
                </div>
              </template>
              <template #cover>
                <a-image
                  :src="item.imageUrl"
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
import { onMounted, reactive, ref } from 'vue'
import { SearchOutlined, ExportOutlined, CloudUploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  getPictureDetailByIdUsingGet,
  grabPictureUsingPost,
  searchPictureUsingPost,
  uploadPictureByGrabUsingPost,
} from '@/api/pictureController'
import { handleDragStart } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

/**
 * 路由组件中的路由对象
 */
const router = useRouter()
/**
 * 路由组件中的路径对象
 */
const route = useRoute()

/**
 * 初始化页面
 */
onMounted(() => {
  getPictureDetail()
})

/**
 * 图片详情信息
 */
const pictureDetailInfo = ref<API.PictureDetailVO>({})
/**
 * 获取图片详情
 */
const getPictureDetail = async () => {
  const res = await getPictureDetailByIdUsingGet({
    pictureId: route.query.pictureId,
  })
  if (res.code === 0 && res.data) {
    pictureDetailInfo.value = res.data
  } else {
    message.error('获取图片详情失败! ' + res.message)
  }
}

/**
 * 搜索表单参数
 */
const searchFormParam = reactive<API.PictureSearchRequest>({})

/**
 * 显示描述
 */
const emptyDesc = ref<string>('请先在左边填写信息后点击开始搜索即可执行')
/**
 * 请求状态
 */
const requestSendStatus = ref<boolean>(false)
/**
 * 搜索按钮加载中
 */
const grabLoading = ref(false)
/**
 * 处理搜索图片表单
 */
const handleGrabPictureSubmit = async () => {
  grabLoading.value = true
  requestSendStatus.value = true
  await getGrabPictureListData()
}

/**
 * 搜索图片列表加载中
 */
const spinning = ref<boolean>(false)
/**
 * 搜索图片列表
 */
const searchPictureList = ref<API.GrabPictureResult>([])
/**
 * 获取搜索的图片列表数据
 */
const getGrabPictureListData = async () => {
  const pictureId = pictureDetailInfo.value.pictureId
  if (!pictureId) return
  spinning.value = true
  setTimeout(async () => {
    try {
      const res = await searchPictureUsingPost({
        pictureId,
        ...searchFormParam,
      })
      if (res.code === 0 && res.data) {
        searchPictureList.value = res.data ?? []
      } else {
        message.error('搜索图片失败，稍后重试！')
      }
    } catch (e) {
      message.error('搜索图片失败，稍后重试！')
    } finally {
      spinning.value = false
      grabLoading.value = false
      if (searchPictureList.value.length === 0) {
        requestSendStatus.value = false
        emptyDesc.value = '暂时没有搜索到对应的图片！'
      }
    }
  }, 3000)
}

// /**
//  * 上传到公共图库
//  * @param picture
//  */
// const uploadImage = async (picture: API.GrabPictureResult) => {
//   spinning.value = true
//   try {
//     const res = await uploadPictureByGrabUsingPost({
//       pictureUrl: picture.handleImageUrl,
//       picName: picture.imageName,
//     })
//     if (res.code === 0 && res.data) {
//       message.success('图片上传成功!')
//     } else {
//       message.error('图片上传失败! ' + res.message)
//     }
//   } finally {
//     spinning.value = false
//   }
// }

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
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
}

#search-picture-page .content {
  flex: 1;
  min-height: 0; /* 关键：允许内容区域收缩 */
  display: flex;
}

#search-picture-page .list-card {
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
#search-picture-page .from-card {
  width: 20%;
  min-width: 300px;
  margin-right: 20px;
  height: fit-content; /* 根据内容自适应高度 */
}

#search-picture-page .image-detail-content {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 确保容器宽度占满父容器 */
}

.search-picture-page .ant-image {
  max-width: 100%; /* 防止图片超出容器 */
  max-height: 100%; /* 防止图片超出容器 */
}
</style>
