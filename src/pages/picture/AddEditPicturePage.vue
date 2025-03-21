<template>
  <div id="add-picture-page">
    <!-- 顶部标题 -->
    <div class="custom-div">
      <div v-if="!pictureId">
        <a-typography-title :level="3">
          <SendOutlined />
          发布图片
        </a-typography-title>
        <a-typography-paragraph v-if="spaceId && spaceId != 0" type="secondary">
          <a-typography-paragraph>
            <blockquote>
              图片上传至{{ spaceType == SPACE_TYPE_ENUM.PRIVATE ? '个人空间' : '团队空间' }}:
              <router-link to="/space/person">
                {{ spaceName }}
                （点击回到{{ spaceType == SPACE_TYPE_ENUM.PRIVATE ? '个人空间' : '团队空间' }} ）
              </router-link>
            </blockquote>
          </a-typography-paragraph>
        </a-typography-paragraph>
        <a-typography-paragraph v-else type="secondary">
          <a-typography-paragraph>
            <blockquote>图片上传至公共图库！</blockquote>
          </a-typography-paragraph>
        </a-typography-paragraph>
      </div>
      <div v-else>
        <a-typography-title :level="3">
          <CloudUploadOutlined />
          修改图片
        </a-typography-title>
        <a-typography-paragraph v-if="spaceId && spaceId != 0" type="secondary">
          <a-typography-paragraph>
            <blockquote>
              图片属于{{ spaceType == SPACE_TYPE_ENUM.PRIVATE ? '个人空间' : '团队空间' }}:
              <router-link to="/space/person">
                {{ spaceName }}
                （点击回到{{ spaceType == SPACE_TYPE_ENUM.PRIVATE ? '个人空间' : '团队空间' }} ）
              </router-link>
            </blockquote>
          </a-typography-paragraph>
        </a-typography-paragraph>
        <a-typography-paragraph v-else type="secondary">
          <a-typography-paragraph>
            <blockquote>图片属于公共图库！</blockquote>
          </a-typography-paragraph>
        </a-typography-paragraph>
      </div>
    </div>

    <!-- 上传选择 Tab -->
    <a-card :headStyle="{ 'text-align': 'center' }">
      <!-- 选择上传方式 -->
      <a-tabs v-model:activeKey="uploadType"
        >>
        <a-tab-pane key="file" tab="文件上传">
          <PictureUpload
            :picture="pictureInfo"
            :spaceId="spaceId"
            :uploadSuccess="handleUploadSuccess"
          />
        </a-tab-pane>
        <a-tab-pane key="url" tab="地址上传" force-render>
          <UrlPictureUpload
            :picture="pictureInfo"
            :spaceId="spaceId"
            :uploadSuccess="handleUploadSuccess"
          />
        </a-tab-pane>
      </a-tabs>

      <!-- 操作按钮 -->
      <template #actions v-if="pictureInfo">
        <div @click="(e) => handleImageCropper()" style="color: #118ab2">
          <EditOutlined />
          编辑图片
        </div>
        <div @click="(e) => doImagePainting()" style="color: #118ab2">
          <FullscreenOutlined />
          AI 扩图
        </div>
        <div @click="(e) => doImagePainting1()" style="color: #118ab2">
          <SmileOutlined />
          高清修复
        </div>
      </template>
    </a-card>

    <div style="margin-bottom: 16px" />

    <!-- 图片信息相关 -->
    <a-form layout="vertical" :model="pictureEditForm" @finish="handlePictureEditSubmit">
      <!-- 表单部分 -->
      <a-form-item
        label="图片名称"
        name="picName"
        :rules="[{ required: true, message: '请输入图片名称' }]"
        required
      >
        <a-input
          size="large"
          v-model:value="pictureEditForm.picName"
          placeholder="请输入图片名称"
          allowClear
        />
      </a-form-item>
      <a-form-item label="图片介绍" name="picDesc">
        <a-textarea
          v-model:value="pictureEditForm.picDesc"
          placeholder="请输入图片介绍"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="categoryId">
        <a-select
          v-model:value="pictureEditForm.categoryId"
          :options="categoryList"
          placeholder="请选择图片分类"
          allowClear
          size="large"
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureEditForm.tags"
          :options="tagList"
          mode="tags"
          placeholder="请输入图片标签"
          allowClear
          size="large"
        />
      </a-form-item>

      <!-- 不可修改部分 -->
      <a-descriptions v-if="pictureInfo" bordered title="图片信息（不可以修改）">
        <a-descriptions-item v-if="pictureInfo.originColor" label="主色调">
          <a-space>
            <div
              :style="{
                backgroundColor: toHexColor(pictureInfo.originColor),
                width: '36px',
                height: '20px',
              }"
            />
            【{{ toHexColor(pictureInfo.originColor) }}】
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="原图大小">
          {{ formatPictureSize(pictureInfo.originSize) }}
        </a-descriptions-item>
        <a-descriptions-item label="原图格式">
          <a-tag v-if="pictureInfo.originFormat" color="cyan">
            {{ pictureInfo.originFormat }}
          </a-tag>
          <span v-else>-</span>
        </a-descriptions-item>
        <a-descriptions-item
          v-if="pictureInfo.originWidth && pictureInfo.originHeight"
          label="原图宽高"
        >
          {{ pictureInfo.originWidth }} × {{ pictureInfo.originHeight }}
        </a-descriptions-item>
        <a-descriptions-item v-if="pictureInfo.originScale" label="原图比例">
          {{ pictureInfo.originScale }}
        </a-descriptions-item>
      </a-descriptions>

      <div style="margin-bottom: 16px" />

      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" style="width: 100%">
          {{ pictureId ? '修改' : '保存' }}
        </a-button>
      </a-form-item>
    </a-form>

    <!-- 图片裁剪组件 -->
    <ImageCropper
      ref="imageCropperModal"
      :picture="pictureInfo"
      :spaceId="spaceId"
      :cropSuccess="cropSuccessEvent"
    />

    <!-- AI 扩图组件 -->
    <ImageOutPainting
      ref="imageOutPaintingModal"
      :picture="pictureInfo"
      :spaceId="spaceId"
      :onSuccess="onImageOutPaintingSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import PictureUpload from '@/components/picture/FilePictureUpload.vue'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/picture/UrlPictureUpload.vue'
import ImageCropper from '@/components/picture/ImageCropper.vue'
import {
  CloudUploadOutlined,
  EditOutlined,
  FullscreenOutlined,
  SmileOutlined,
  SendOutlined,
} from '@ant-design/icons-vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'
import { decrypt, formatPictureSize, toHexColor } from '@/utils'
import { getCategoryListAsHomeUsingGet } from '@/api/categoryController'
import { editPictureUsingPost, getPictureDetailByIdUsingGet } from '@/api/pictureController'
import { SPACE_TYPE_ENUM } from '@/constants/space'

const router = useRouter()
const route = useRoute()

/**
 * 初始化页面
 */
onMounted(() => {
  getCategoryListData()
  getOldPictureInfo()
})

/**
 * 图片 ID
 */
const pictureId = computed(() => route.query?.pId)
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

/**
 * 上传类型
 */
const uploadType = ref<'file' | 'url'>('file')
/**
 * 处理子组件上传图片成功回调
 * @param newPicture
 */
const handleUploadSuccess = (newPicture: API.PictureDetailVO) => {
  pictureInfo.value = newPicture
  pictureEditForm.picName = newPicture.picName
}

/**
 * 图片信息
 */
const pictureInfo = ref<API.PictureDetailVO>()
/**
 * 获取老图片数据
 */
const getOldPictureInfo = async () => {
  const pictureId = route.query?.pId
  if (!pictureId) return
  const res = await getPictureDetailByIdUsingGet({ pictureId: pictureId })
  if (res.code === 0 && res.data) {
    const data = res.data
    pictureInfo.value = data
    pictureEditForm.picName = data.picName
    pictureEditForm.picDesc = data.picDesc
    pictureEditForm.categoryId = data.categoryId
    pictureEditForm.tags = data.tags ?? []
  }
}

/**
 * 分类列表
 */
const categoryList = ref<API.CategoryVO[]>([])
/**
 * 获取分类列表
 */
const getCategoryListData = async () => {
  const res = await getCategoryListAsHomeUsingGet()
  if (res.code === 0 && res.data) {
    categoryList.value = (res.data ?? []).map((data: API.CategoryVO) => {
      return {
        value: data.categoryId,
        label: data.name,
      }
    })
  } else {
    message.error('分类加载失败!')
  }
}

/**
 * 图片编辑表单
 */
const pictureEditForm = reactive<API.PictureEditRequest>({})
/**
 * 处理图片编辑
 * @param values
 */
const handlePictureEditSubmit = async (values: any) => {
  const pictureId = pictureInfo.value.pictureId
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    pictureId: pictureId,
    spaceId: spaceId.value,
    ...values,
  })
  if (res.code === 0 && res.data) {
    message.success('保存成功!')
    // 如果当前是新增逻辑，则跳转到图片详情页，否则需要跳转回上一个页面
    if (!pictureId) {
      await router.push({
        path: `/picture/detail/${pictureId}`,
      })
    } else {
      // 获取地址中的加密信息
      const ed = route.query.ed
      if (ed) {
        const decryptData = decrypt(decodeURIComponent(ed as string), 'source')
        const data = decryptData.split('=')
        await router.push({
          path: `${data[0]}`,
          query: {
            pictureId: pictureId.value,
            ed: data[1],
          },
        })
      } else {
        await router.push({
          path: `/picture/detail/${pictureId}`,
        })
      }
    }
  } else {
    message.error('保存失败!')
  }
}

/**
 * 图片裁剪弹窗
 */
const imageCropperModal = ref()
/**
 * 处理图片裁剪
 */
const handleImageCropper = () => {
  if (imageCropperModal.value) {
    imageCropperModal.value.openModal()
  }
}
/**
 * 图片裁剪成功事件
 * @param newPicture
 */
const cropSuccessEvent = (newPicture: API.PictureDetailVO) => {
  pictureInfo.value = newPicture
}

//  TODO 下面的还没有实现

// AI 扩图弹窗
const imageOutPaintingModal = ref()

// AI 扩图
const doImagePainting = () => {
  if (imageOutPaintingModal.value) {
    imageOutPaintingModal.value.openModal()
  }
}

// AI 扩图 编辑成功事件
const onImageOutPaintingSuccess = (newPicture: API.PictureVO) => {
  pictureInfo.value = newPicture
}
</script>

<style scoped>
#add-picture-page {
  max-width: 720px;
  margin: 0 auto;
}

#add-picture-page .edit-bar {
  text-align: center;
  margin: 16px 0;
}
</style>
