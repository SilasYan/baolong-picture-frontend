<template>
  <div id="home-picture-list">
    <!-- 图片列表 -->
    <Waterfall
      v-if="pictureList.length > 0"
      :list="pictureList"
      :width="300"
      :breakpoints="breakpoints"
    >
      <template #default="{ item, url, index }">
        <a-card>
          <template #cover>
            <!-- @dragstart="handleDragStart" 禁止拖拽 -->
            <div @dragstart="handleDragStart" @click="doClickPicture(item)">
              <LazyImg :url="item.picUrl" />
            </div>
          </template>
          <a-card-meta
            :title="item.picName"
            :description="`作者: ${item.userName}`"
            :bodyStyle="{ color: '#fff' }"
          >
            <template #avatar>
              <a-avatar size="large" v-if="item.userAvatar" :src="item.userAvatar" />
              <a-avatar size="large" v-else>
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
            </template>
          </a-card-meta>
          <template #actions>
            <div v-if="showView">
              <EyeOutlined />
              {{ item.viewQuantity }}
            </div>
            <div v-if="showLike" @click="(e) => doLike(item)">
              <LikeFilled v-if="item.loginUserIsLike" />
              <LikeOutlined v-else />
              {{ item.likeQuantity }}
            </div>
            <div v-if="showCollect" @click="(e) => doCollect(item)">
              <StarFilled v-if="item.loginUserIsCollect" />
              <StarOutlined v-else />
              {{ item.collectQuantity }}
            </div>
            <div v-if="showShare" @click="(e) => doSharePicture(item)">
              <ShareAltOutlined />
              {{ item.shareQuantity }}
            </div>
          </template>
        </a-card>
      </template>
    </Waterfall>
    <!-- 分享弹框组件 -->
    <ShareModal ref="shareModal" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  EyeOutlined,
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { encrypt, handleDragStart } from '@/utils'
import { pictureLikeOrCollectUsingPost, pictureShareUsingPost } from '@/api/pictureController'
import { PIC_INTERACTION_TYPE_ENUM } from '@/constants/picture'

/**
 * 定义 Props 接口
 */
interface Props {
  pictureList?: API.PictureHomeVO[]
  loading?: boolean
  showView?: boolean
  showLike?: boolean
  showCollect?: boolean
  showShare?: boolean
}

/**
 * 使用 defineProps 声明 props 并指定类型
 */
const props = withDefaults(defineProps<Props>(), {
  pictureList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

/**
 * 路由组件中的路由对象
 */
const router = useRouter()

/**
 * 瀑布流布局
 */
const breakpoints = ref({
  3000: {
    //当屏幕宽度小于等于3000
    rowPerView: 5, // 一行8图
  },
  1800: {
    rowPerView: 5,
  },
  1500: {
    rowPerView: 4,
  },
  1200: {
    rowPerView: 3,
  },
  1000: {
    rowPerView: 2,
  },
  800: {
    rowPerView: 2,
  },
  700: {
    rowPerView: 1,
  },
  500: {
    rowPerView: 1,
  },
  300: {
    rowPerView: 1,
  },
})

/**
 * 点击图片跳转到图片详情
 * @param picture
 */
const doClickPicture = (picture) => {
  // 跳转路由
  const r = router.resolve({
    path: `/picture/detail/${picture.pictureId}`,
  })
  // 在新页面打开
  window.open(r.href, '_blank')
}


/**
 * 点赞状态
 */
const isLike = ref<boolean>(true)
/**
 * 处理点赞
 */
const doLike = async (picture: API.PictureHomeVO) => {
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
const doCollect = async (picture: API.PictureHomeVO) => {
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
 * 处理分享
 * @param picture
 * @param e
 */
const doSharePicture = async (picture: API.PictureDetailVO, e: Event) => {
  if (!isShare.value) {
    message.warn('已分享！')
    return
  }
  const pictureId = picture.pictureId
  const res = await pictureShareUsingPost({ pictureId })
  if (res.code === 0 && res.data) {
    shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${pictureId}`
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
</script>

<style scoped>
#home-picture-list {
  margin: 0 auto;
}

::v-deep .ant-card-meta-title {
  font-size: 16px;
  color: #696868;
}
</style>
