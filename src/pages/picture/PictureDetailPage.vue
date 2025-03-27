<template>
  <div id="picture-detail-page">
    <div class="image-detail">
      <a-spin :spinning="pictureDetailLoading">
        <!-- 面包屑区域 -->
        <a-typography-title v-if="!isMobile && sourcePath && sourceName" :level="5">
          <a :href="sourcePath" style="color: #666666">
            <RollbackOutlined />&nbsp; 回到【<span>{{ sourceName }}</span
            >】
          </a>
        </a-typography-title>

        <!-- 核心区域 -->
        <a-row :gutter="[16, 16]">
          <!-- 左侧图片部分 -->
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="18">
            <a-card :headStyle="{ 'text-align': 'center' }" :title="pictureDetailInfo.picName">
              <template #extra>
                <a-flex>
                  <div
                    v-if="pictureDetailInfo.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS"
                    @click="(e) => doDownload(pictureDetailInfo)"
                  >
                    <a-button type="dashed">
                      <DownloadOutlined />
                      下载图片（{{ formatNumber(downloadCount) }}）
                    </a-button>
                  </div>
                </a-flex>
              </template>
              <!-- 图片 -->
              <div class="image-detail-content" @dragstart="handleDragStart">
                <a-image :src="pictureDetailInfo.picUrl" />
              </div>
              <!-- 操作按钮 -->
              <template
                #actions
                v-if="!isMobile && pictureDetailInfo.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS"
              >
                <div>
                  <EyeOutlined />
                  {{ formatNumber(viewCount) }}
                </div>
                <div @click="(e) => doLike(pictureDetailInfo, e)">
                  <LikeFilled v-if="pictureDetailInfo.loginUserIsLike" />
                  <LikeOutlined v-else />
                  {{ formatNumber(likeCount) }}
                </div>
                <div @click="(e) => doCollect(pictureDetailInfo, e)">
                  <StarFilled v-if="pictureDetailInfo.loginUserIsCollect" />
                  <StarOutlined v-else />
                  {{ formatNumber(collectCount) }}
                </div>
                <div @click="(e) => doSharePicture(pictureDetailInfo, e)">
                  <ShareAltOutlined />
                  {{ formatNumber(shareCount) }}
                </div>
              </template>
            </a-card>
          </a-col>

          <!-- 右侧图片信息部分 -->
          <a-col :xs="0" :sm="0" :md="0" :lg="0" :xl="0" :xxl="6">
            <!-- 作者信息部分 -->
            <a-card title="作者信息">
              <a-list item-layout="horizontal">
                <a-list-item>
                  <a-list-item-meta
                    :description="`作者介绍：${pictureDetailInfo.userProfile ?? '暂无'}`"
                  >
                    <template #title>
                      <a href="#"> {{ pictureDetailInfo.userName ?? '未命名' }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar :src="pictureDetailInfo.userAvatar" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
            <div style="margin-bottom: 16px" />
            <!-- 图片信息部分 -->
            <a-card :title="`图片信息`">
              <template #extra v-if="pictureDetailInfo.reviewStatus !== null">
                <a-tag :color="PIC_STATUS_TAG_COLOR[pictureDetailInfo.reviewStatus]">
                  {{ PIC_REVIEW_STATUS_MAP[pictureDetailInfo.reviewStatus] }}
                </a-tag>
                <a-tag v-if="pictureDetailInfo.expandStatus == 2" color="#4797f4"> AI 生成 </a-tag>
              </template>

              <a-descriptions :column="1">
                <a-descriptions-item label="名称">
                  {{ pictureDetailInfo.picName ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.picDesc" label="描述">
                  {{ pictureDetailInfo.picDesc ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.categoryName" label="分类">
                  <a-tag color="green">{{ pictureDetailInfo.categoryName }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.tagList" label="标签">
                  <a-tag v-for="tag in pictureDetailInfo.tagList" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.originColor" label="主色调">
                  <a-space>
                    <div
                      :style="{
                        backgroundColor: toHexColor(pictureDetailInfo.originColor),
                        width: '36px',
                        height: '20px',
                      }"
                    />
                    【{{ toHexColor(pictureDetailInfo.originColor) }}】
                  </a-space>
                </a-descriptions-item>
                <a-descriptions-item label="原图大小">
                  {{ formatPictureSize(pictureDetailInfo.originSize) }}
                </a-descriptions-item>
                <a-descriptions-item label="原图格式">
                  <a-tag v-if="pictureDetailInfo.originFormat" color="cyan">
                    {{ pictureDetailInfo.originFormat }}
                  </a-tag>
                  <span v-else>-</span>
                </a-descriptions-item>
                <a-descriptions-item
                  v-if="pictureDetailInfo.originWidth && pictureDetailInfo.originHeight"
                  label="原图宽高"
                >
                  {{ pictureDetailInfo.originWidth }} × {{ pictureDetailInfo.originHeight }}
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.originScale" label="原图比例">
                  {{ pictureDetailInfo.originScale }}
                </a-descriptions-item>
              </a-descriptions>
              <!-- 操作按钮 -->
              <template
                #actions
                v-if="loginUserStore.loginUser?.userId === pictureDetailInfo.userId"
              >
                <div @click="doEditPicture(pictureDetailInfo.pictureId)">
                  <EditOutlined />
                  编辑
                </div>
                <div @click="doDeletePicture(pictureDetailInfo.pictureId)">
                  <DeleteOutlined />
                  删除
                </div>
                <div @click="(e) => doSearchPicture(pictureDetailInfo)">
                  <SearchOutlined />
                  以图搜图
                </div>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <div style="margin-bottom: 16px" />

        <!-- 视口窗口小时显示 -->
        <a-row v-if="!isMobile" :gutter="[16, 16]">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="0">
            <!-- 作者信息部分 -->
            <a-card title="作者信息">
              <a-list item-layout="horizontal">
                <a-list-item>
                  <a-list-item-meta
                    :description="`作者介绍：${pictureDetailInfo.userProfile ?? '暂无'}`"
                  >
                    <template #title>
                      <a href="#"> {{ pictureDetailInfo.userName ?? '未命名' }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar :src="pictureDetailInfo.userAvatar" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
            <div style="margin-bottom: 16px" />
            <!-- 图片信息部分 -->
            <a-card title="图片信息">
              <a-descriptions :column="1">
                <a-descriptions-item label="名称">
                  {{ pictureDetailInfo.picName ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.picDesc" label="描述">
                  {{ pictureDetailInfo.picDesc ?? '-' }}
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.categoryName" label="分类">
                  <a-tag color="green">{{ pictureDetailInfo.categoryName }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.tagList" label="标签">
                  <a-tag v-for="tag in pictureDetailInfo.tagList" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.originColor" label="主色调">
                  <a-space>
                    <div
                      :style="{
                        backgroundColor: toHexColor(pictureDetailInfo.originColor),
                        width: '36px',
                        height: '20px',
                      }"
                    />
                    【{{ toHexColor(pictureDetailInfo.originColor) }}】
                  </a-space>
                </a-descriptions-item>
                <a-descriptions-item label="原图大小">
                  {{ formatPictureSize(pictureDetailInfo.originSize) }}
                </a-descriptions-item>
                <a-descriptions-item label="原图格式">
                  <a-tag v-if="pictureDetailInfo.originFormat" color="cyan">
                    {{ pictureDetailInfo.originFormat }}
                  </a-tag>
                  <span v-else>-</span>
                </a-descriptions-item>
                <a-descriptions-item
                  v-if="pictureDetailInfo.originWidth && pictureDetailInfo.originHeight"
                  label="原图宽高"
                >
                  {{ pictureDetailInfo.originWidth }} × {{ pictureDetailInfo.originHeight }}
                </a-descriptions-item>
                <a-descriptions-item v-if="pictureDetailInfo.originScale" label="原图比例">
                  {{ pictureDetailInfo.originScale }}
                </a-descriptions-item>
              </a-descriptions>
              <!-- 操作按钮 -->
              <template
                #actions
                v-if="loginUserStore.loginUser?.userId === pictureDetailInfo.userId"
              >
                <div @click="doEditPicture(pictureDetailInfo.pictureId)">
                  <EditOutlined />
                  编辑
                </div>
                <div @click="doDeletePicture(pictureDetailInfo.pictureId)">
                  <DeleteOutlined />
                  删除
                </div>
                <div @click="(e) => doSearchPicture(pictureDetailInfo)">
                  <SearchOutlined />
                  以图搜图
                </div>
              </template>
            </a-card>
          </a-col>
          <!-- 无用处，仅占位 -->
          <a-col :xs="0" :sm="0" :md="0" :lg="0" :xl="0" :xxl="0" />
        </a-row>
      </a-spin>
    </div>

    <!-- 分享弹框组件 -->
    <ShareModal ref="shareModal" :link="shareLink" :name="picName" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import Icon, {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  DownloadOutlined,
  RollbackOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import {
  decrypt,
  downloadImage,
  encrypt,
  formatNumber,
  formatPictureSize,
  handleDragStart,
  toHexColor,
} from '@/utils'
import ShareModal from '@/components/ShareModal.vue'
import {
  deletePictureUsingPost,
  getPictureDetailByIdUsingGet,
  pictureDownloadUsingPost,
  pictureLikeOrCollectUsingPost,
  pictureShareUsingPost,
} from '@/api/pictureController'
import { useRoute, useRouter } from 'vue-router'
import {
  PIC_INTERACTION_TYPE_ENUM,
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_STATUS_TAG_COLOR,
} from '@/constants/picture'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// 新增移动端检测
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

/**
 * 路由组件中的路由对象
 */
const router = useRouter()
/**
 * 路由组件中的路径对象
 */
const route = useRoute()

/**
 * 登录用户信息
 */
const loginUserStore = useLoginUserStore()

/**
 * 来源路径
 */
const sourcePath = ref<string>('')
/**
 * 来源名称
 */
const sourceName = ref<string>('')
/**
 * 加密数据
 */
const encryptData = ref<string>('')

/**
 * 使用 defineProps 声明 props 并指定类型
 */
const props = defineProps<{ pictureId: string | number }>()

/**
 * 图片详情加载中
 */
const pictureDetailLoading = ref(true)

/**
 * 初始化页面
 */
onMounted(() => {
  getPictureDetail()
  // 获取地址中的加密信息
  const ed = route.query.ed
  if (ed) {
    encryptData.value = decodeURIComponent(ed as string)
    const decryptData = decrypt(encryptData.value, 'source')
    const data = decryptData.split('=')
    sourcePath.value = data[0]
    sourceName.value = data[1]
  }
  pictureDetailLoading.value = false
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
    pictureId: props.pictureId,
  })
  if (res.code === 0 && res.data) {
    pictureDetailInfo.value = res.data
  } else {
    message.error('获取图片详情失败! ' + res.message)
  }
}

/**
 * 查看数量
 */
const viewCount = computed(() => {
  return `${pictureDetailInfo.value.viewQuantity ?? 0}`
})
/**
 * 点赞数量
 */
const likeCount = computed(() => {
  return `${pictureDetailInfo.value.likeQuantity ?? 0}`
})
/**
 * 收藏数量
 */
const collectCount = computed(() => {
  return `${pictureDetailInfo.value.collectQuantity ?? 0}`
})
/**
 * 分享数量
 */
const shareCount = computed(() => {
  return `${pictureDetailInfo.value.shareQuantity ?? 0}`
})
/**
 * 下载数量
 */
const downloadCount = computed(() => {
  return `${pictureDetailInfo.value.downloadQuantity ?? 0}`
})

/**
 * 点赞状态
 */
const isLike = ref<boolean>(true)
/**
 * 处理点赞
 */
const doLike = async (picture: API.PictureDetailVO) => {
  useLoginUserStore().checkLogin()
  if (!isLike.value) {
    message.warn('点太快啦！')
    return
  }
  const res = await pictureLikeOrCollectUsingPost({
    pictureId: picture.pictureId,
    interactionType: PIC_INTERACTION_TYPE_ENUM.LIKE,
    interactionStatus: picture.loginUserIsLike ? 1 : 0,
  })
  if (res.code === 0 && res.data) {
    message.success(`${picture.loginUserIsLike ? '取消点赞！' : '点赞成功！'}`)
    picture.loginUserIsLike ? picture.likeQuantity-- : picture.likeQuantity++
    picture.loginUserIsLike = !picture.loginUserIsLike
    isLike.value = false
    setTimeout(() => {
      isLike.value = true
    }, 3000)
  } else {
    message.error(res.message)
  }
}

/**
 * 收藏状态
 */
const isCollect = ref<boolean>(true)
/**
 * 处理收藏
 */
const doCollect = async (picture: API.PictureDetailVO) => {
  useLoginUserStore().checkLogin()
  if (!isCollect.value) {
    message.warn('点太快啦！')
    return
  }
  const res = await pictureLikeOrCollectUsingPost({
    pictureId: picture.pictureId,
    interactionType: PIC_INTERACTION_TYPE_ENUM.COLLECT,
    interactionStatus: picture.loginUserIsCollect ? 1 : 0,
  })
  if (res.code === 0 && res.data) {
    message.success(`${picture.loginUserIsCollect ? '取消收藏！' : '收藏成功！'}`)
    picture.loginUserIsCollect ? picture.collectQuantity-- : picture.collectQuantity++
    picture.loginUserIsCollect = !picture.loginUserIsCollect
    isCollect.value = false
    setTimeout(() => {
      isCollect.value = true
    }, 3000)
  } else {
    message.error(res.message)
  }
}

/**
 * 下载状态
 */
const isDownload = ref<boolean>(true)
/**
 * 处理下载
 * @param picture
 */
const doDownload = async (picture: API.PictureDetailVO) => {
  useLoginUserStore().checkLogin()
  if (!isDownload.value) {
    message.warn('重复下载！')
    return
  }
  const res = await pictureDownloadUsingPost({ pictureId: picture.pictureId })
  if (res.code === 0 && res.data) {
    await downloadImage(res.data, picture.picName)
    message.success('下载成功！')
    isDownload.value = false
    setTimeout(() => {
      isDownload.value = true
    }, 3000)
  } else {
    message.error(res.message)
  }
}

/**
 * 分享状态
 */
const isShare = ref<boolean>(true)
/**
 * 分享弹窗
 */
const shareModal = ref()
/**
 * 分享链接
 */
const shareLink = ref<string>()
/**
 * 图片名称
 */
const picName = ref<string>()
/**
 * 处理分享
 * @param picture
 */
const doSharePicture = async (picture: API.PictureDetailVO) => {
  useLoginUserStore().checkLogin()
  if (!isShare.value) {
    message.warn('已分享！')
    return
  }
  const pictureId = picture.pictureId
  const res = await pictureShareUsingPost({ pictureId })
  if (res.code === 0 && res.data) {
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/detail/${pictureId}`
    picName.value = picture.picName
    if (shareModal.value) {
      shareModal.value.openModal()
    }
    setTimeout(() => {
      isDownload.value = true
    }, 3000)
  } else {
    message.error(res.message)
  }
}

/**
 * 以图搜图
 * @param picture
 */
const doSearchPicture = async (picture: API.PictureDetailVO) => {
  await router.push({
    path: '/picture/search',
    query: {
      pictureId: picture.pictureId,
    },
  })
}

/**
 * 编辑图片
 */
const doEditPicture = (pictureId: number) => {
  if (!pictureId) {
    return
  }
  router.push({
    path: '/picture/addEdit',
    query: {
      pId: pictureId,
      sid: pictureDetailInfo.value.spaceId,
      t: pictureDetailInfo.value.spaceType,
      n: pictureDetailInfo.value.spaceName,
      ed: encodeURIComponent(encrypt(route.path + '=' + encryptData.value, 'source')),
    },
  })
}

/**
 * 删除图片
 */
const doDeletePicture = async (pictureId: number) => {
  if (!pictureId) {
    return
  }
  // 确认弹窗
  Modal.confirm({
    title: '删除图片',
    content: '确定要删除该图片吗？删除后不可恢复！',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deletePictureUsingPost({ id: pictureId })
        if (res.code === 0) {
          message.success('删除成功！')
          if (encryptData.value) {
            const decryptData = decrypt(encryptData.value, 'source')
            const data = decryptData.split('=')
            await router.push({
              path: data[0],
            })
          } else {
            await router.push({
              path: '/',
            })
          }
        } else {
          message.error('删除失败！')
        }
      } catch (e) {
        console.log(e)
        message.error('删除失败！')
      }
    },
    onCancel: () => {
      message.info('取消删除！')
    },
  })
}
</script>

<style scoped>
#picture-detail-page .image-detail {
  width: 80%;
  margin: 0 auto 40px;
}

/* 图片容器：使用min-height而非height */
#picture-detail-page .image-detail .image-detail-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px; /* 最小高度 */
  max-height: 80vh; /* 最大高度为视口的80% */
  overflow: hidden; /* 确保不会溢出 */
}

/* 图片样式：完全自适应 */
.image-detail-content :deep(.ant-image) {
  display: block;
  width: 100%;
  height: 100%;
}

.image-detail-content :deep(.ant-image .ant-image-img) {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 70vh; /* 与容器一致 */
  object-fit: scale-down; /* 关键修改：使用scale-down */
  margin: 0 auto;
  transition: transform 0.3s ease;
}

/* 移动端特定样式 */
@media (max-width: 768px) {
  #picture-detail-page .image-detail {
    width: 100%;
    margin: 0 auto;
    padding: 0 8px;
  }

  .image-detail-content {
    max-height: 80vh !important;
  }

  /* 隐藏卡片边框和阴影 */
  :deep(.ant-card) {
    border: none !important;
    box-shadow: none !important;
  }

  /* 图片全屏显示 */
  .image-detail-content :deep(.ant-image-img) {
    max-height: 80vh !important;
    width: 100% !important;
  }
}
</style>
