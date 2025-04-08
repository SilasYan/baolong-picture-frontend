<template>
  <div id="batch-picture-upload">
    <!-- 顶部标题 -->
    <div class="custom-div">
      <a-flex justify="space-between">
        <a-typography-title :level="3">
          <SendOutlined />
          批量发布图片
        </a-typography-title>

        <a-space v-if="fileList.length > 0">
          <a-button type="primary" size="large" @click="handleUploadPicture">
            <SendOutlined />
            点我上传
          </a-button>
        </a-space>
      </a-flex>
      <a-typography-paragraph v-if="spaceId && spaceId != 0" type="secondary">
        <a-typography-paragraph style="color: #666666">
          图片将上传至{{ spaceType == SPACE_TYPE_ENUM.PRIVATE ? '个人空间' : '团队空间' }}:
          <router-link
            :to="Number(spaceType) === SPACE_TYPE_ENUM.PRIVATE ? '/space/person' : `/space/team/${spaceId}`"
          >
            {{ spaceName }}
            （点击回到{{ spaceType == SPACE_TYPE_ENUM.PRIVATE ? '个人空间' : '团队空间' }}）
          </router-link>
        </a-typography-paragraph>
      </a-typography-paragraph>
      <a-typography-paragraph v-else type="secondary">
        <a-typography-paragraph style="color: #666666">
          图片将上传至公共图库
        </a-typography-paragraph>
      </a-typography-paragraph>
    </div>

    <a-upload-dragger
      v-model:file-list="fileList"
      :multiple="true"
      :maxCount="maxUploadNum"
      accept=".jpg,.jpeg,.png,.gif,.webp"
      :before-upload="beforeUploadPicture"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
      <p class="ant-upload-hint">支持单次或批量上传</p>
    </a-upload-dragger>

    <div v-if="successFileList.length > 0">
      <a-divider />
      <a-typography-title :level="3"> 已上传列表： </a-typography-title>

      <a-upload
        class="showList"
        v-model:file-list="successFileList"
        list-type="picture-card"
        @preview="handlePreview"
      >
      </a-upload>
      <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { SendOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { SPACE_TYPE_ENUM } from '@/constants/space'
import { uploadPictureByFileUsingPost } from '@/api/pictureController'
import type { Props } from 'ant-design-vue/es/form/useForm'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

/**
 * 空间 ID
 */
const spaceId = computed(() => route.query?.sid)
/**
 * 空间类型
 */
const spaceType = computed(() => route.query?.t)
/**
 * 空间名称
 */
const spaceName = computed(() => route.query?.n)

const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

const fileList = ref<UploadProps['fileList']>([])
const successFileList = ref<UploadProps['successFileList']>([])

const loginUser = useLoginUserStore().loginUser

/**
 * 上传图片
 */
const handleUploadPicture = () => {
  if (fileList.value <= 0) {
    message.error('请选择至少一张图片!')
    return
  }
  fileList.value.forEach(async (file: any) => {
    try {
      const res = await uploadPictureByFileUsingPost(
        { spaceId: spaceId.value },
        {},
        file.originFileObj,
      )
      if (res.code === 0 && res.data) {
        // 删除 fileList 中 uid = file.uid 的数据
        fileList.value.pop((item: any) => item.uid === file.uid)
        message.success('图片上传成功!')
        successFileList.value.push({
          uid: res.data.pictureId,
          name: res.data.picName,
          status: 'done',
          response: 'success',
          url: res.data.picUrl,
        })
        // count++
      } else {
        message.error('图片上传失败! ' + res.message)
      }
    } catch (error) {
      console.error(error)
      message.error('图片上传失败!')
    }
  })
}

// 最大上传数量
const maxUploadNum = loginUser.vipSign ? 999 : 8
// 上传图片校验
const beforeUploadPicture = (file: File) => {
  if (fileList.value.length >= maxUploadNum) {
    message.error(`一次最多上传${maxUploadNum}张图片！`)
    return false
  }
}

const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}
const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>

<style scoped>
#batch-picture-upload {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px;
}

.showList :deep(.ant-upload-list .ant-upload-list-item-container) {
  min-width: 200px !important;
  min-height: 200px !important;
}
</style>
