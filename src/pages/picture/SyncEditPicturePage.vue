<template>
  <div id="sync-edit-picture-page">
    <!-- 顶部标题 -->
    <a-typography-title :level="5">
      <a :href="sourcePath" style="color: #666666">
        <RollbackOutlined />&nbsp; 回到【<span>{{ sourceName }}</span
        >】
      </a>
    </a-typography-title>
    <a-flex justify="space-between" align="center">
      <a-typography-title :level="3">
        <MacCommandOutlined />
        协同编辑
      </a-typography-title>
      <a-alert :message="editingUser?.userName ? `${editingUser.userName} 正在编辑` : '暂无人编辑'" type="success" />
      <!--<a-button  disabled> xxx正在编辑</a-button>-->
      <a-space size="large">
        <a-button :disabled="!canEnterEdit" type="primary" size="large" ghost @click="enterEdit">进入编辑</a-button>
        <a-button v-if="!canEnterEdit" :disabled="!canExitEdit" danger size="large" ghost @click="exitEdit">退出编辑</a-button>
      </a-space>
    </a-flex>

    <div class="custom-div image-cropper">
      <vue-cropper
        ref="cropperRef"
        :img="pictureInfo?.picUrl"
        :autoCrop="true"
        :fixedBox="false"
        :centerBox="true"
        :can-move="false"
        :canMoveBox="true"
        :info="true"
        outputType="png"
      />
    </div>

    <!-- 图片操作 -->
    <div class="image-cropper-actions">
      <a-space>
        <a-button size="large" :disabled="!canEdit" @click="rotateLeft">向左旋转</a-button>
        <a-button size="large" :disabled="!canEdit" @click="rotateRight">向右旋转</a-button>
        <a-button size="large" :disabled="!canEdit" @click="changeScale(1)">放大</a-button>
        <a-button size="large" :disabled="!canEdit" @click="changeScale(-1)">缩小</a-button>
        <a-button size="large" :disabled="!canEdit" type="primary" @click="handleImageCrop">
          确认
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { MacCommandOutlined, RollbackOutlined, SendOutlined } from '@ant-design/icons-vue'
import { getPictureDetailByIdUsingGet, uploadPictureByFileUsingPost } from '@/api/pictureController'
import { PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM } from '@/constants/picture'
import { SPACE_ROLE_ENUM } from '@/constants/space'
import { decrypt } from '@/utils'
import WsPictureEdit from '@/ws/WsPictureEdit'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const router = useRouter()
const route = useRoute()

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
 * 初始化页面
 */
onMounted(() => {
  getOldPictureInfo()
  // 获取地址中的加密信息
  const ed = route.query.ed
  if (ed) {
    encryptData.value = decodeURIComponent(ed as string)
    const decryptData = decrypt(encryptData.value, 'source')
    const data = decryptData.split('=')
    sourcePath.value = data[0] + '?sid=' + route.query.sid
    sourceName.value = data[1]
  }
})

/**
 * 图片信息
 */
const pictureInfo = ref<API.PictureDetailVO>({})
/**
 * 获取老图片数据
 */
const getOldPictureInfo = async () => {
  const pictureId = route.query?.pId
  if (!pictureId) {
    return
  }
  const res = await getPictureDetailByIdUsingGet({ pictureId: pictureId })
  if (res.code === 0 && res.data) {
    pictureInfo.value = res.data
  }
}

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


// 当前登录的用户
const loginUserStore = useLoginUserStore()
let loginUser = loginUserStore.loginUser

// 编辑中的用户信息
const editingUser = ref<API.UserVO>()
// 没有用户正在编辑中，可进入编辑
const canEnterEdit = computed(() => {
  return !editingUser.value?.userId
})
// 正在编辑的用户是本人，可退出编辑
const canExitEdit = computed(() => {
  return editingUser.value?.userId === loginUser.userId
})
// 可以编辑
const canEdit = computed(() => {
  return editingUser.value?.userId === loginUser.userId
})

// region WebSocket 相关代码

let websocket: WsPictureEdit | null

// 初始化 WebSocket 连接，绑定事件
const initWebsocket = () => {
  const pictureId = pictureInfo.value?.pictureId
  if (!pictureId) {
    return
  }
  // 防止之前的连接未释放
  if (websocket) {
    websocket.disconnect()
  }
  // 创建 WebSocket 实例
  websocket = new WsPictureEdit(pictureId)
  // 建立 WebSocket 连接
  websocket.connect(loginUser.token)

  // 监听通知消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    // console.log('收到正常消息：', msg)
    message.info(msg.message)
    // 如果进来的时候有用户正在编辑，则显示该用户信息
    if (msg.inUser) {
      editingUser.value = msg.inUser
    }
  })

  // 监听错误消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    // console.log('收到错误消息：', msg)
    message.error(msg.message)
  })

  // 监听进入编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    // console.log('收到进入编辑状态消息：', msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })

  // 监听完成编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.COMPLETE, (msg) => {
    // console.log('收到完成编辑状态消息：', msg)
    message.info(msg.message)
    // 刷新
  })

  // 监听编辑操作消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    // console.log('收到编辑操作消息：', msg)
    message.info(msg.message)
    switch (msg.action) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
    }
  })

  // 监听退出编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    // console.log('收到退出编辑状态消息：', msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
}


// 进入编辑状态
const enterEdit = () => {
  if (websocket) {
    // 发送进入编辑状态的消息
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
    })
  }
}

// 编辑图片操作
const editAction = (action: string) => {
  if (websocket) {
    // 发送编辑操作的请求
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      action: action,
    })
  }
}

// 退出编辑状态
const exitEdit = () => {
  if (websocket) {
    // 发送退出编辑状态的消息
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
    })
  }
}

// 完成图片操作
const completeAction = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.COMPLETE,
    })
  }
}

watchEffect(() => {
  // 团队空间才初始化
  if (pictureInfo.value) {
    initWebsocket()
  }
})

onUnmounted(() => {
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})

// endregion WebSocket 相关代码

// 保存请求的变量
const saving = ref<boolean>(false)
/**
 * 处理图片裁剪
 */
const handleImageCrop = () => {
  try {
    saving.value = true
    cropperRef.value.getCropBlob(async (blob: Blob) => {
      try {
        const fileName = (pictureInfo.value?.picName || 'image') + '.png'
        const file = new File([blob], fileName, { type: blob.type })
        // 发送上传图片请求
        const params = pictureInfo.value ? { pictureId: pictureInfo.value.pictureId, spaceId: pictureInfo.value.spaceId } : {}
        const res = await uploadPictureByFileUsingPost(params, {}, file)
        if (res.code === 0 && res.data) {
          message.success('图片上传成功!')
          // 这里需要发送编辑完成的事件，让协同编辑的用户知道
          await completeAction()
          await getOldPictureInfo()
          if (websocket) {
            editingUser.value = undefined
          }
        } else {
          message.error('图片上传失败! ' + res.message)
        }
      } finally {
        saving.value = false
      }
    })
  } catch (error) {
    message.error('图片裁剪失败！')
  }
}

</script>

<style scoped>
#sync-edit-picture-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-div {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-cropper {
  text-align: center;
  height: 500px;
  margin: 20px 0;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-cropper-actions {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.image-cropper-actions .ant-space {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.image-cropper-actions .ant-btn {
  min-width: 100px;
  transition: all 0.3s ease;
}

.image-cropper-actions .ant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-typography-title {
  color: #1890ff;
  margin-bottom: 0 !important;
}

.ant-spin {
  width: 100%;
}

.ant-spin-container {
  display: flex;
  justify-content: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  #sync-edit-picture-page {
    padding: 16px;
  }

  .image-cropper {
    height: 350px;
  }

  .image-cropper-actions .ant-space {
    gap: 8px;
  }

  .image-cropper-actions .ant-btn {
    min-width: 80px;
    padding: 0 8px;
  }
}
</style>
