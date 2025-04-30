<template>
  <div id="space-page" v-if="existedPersonSpace">
    <!--<div id="space-page">-->
    <a-typography-title :level="3" style="text-align: center; margin-bottom: 50px">
      目前暂未开通{{ spaceType && spaceType == 1 ? '团队' : '个人' }}空间，请先开通{{
        spaceType && spaceType == 1 ? '团队' : '个人'
      }}空间
    </a-typography-title>
    <a-form class="custom-form" layout="vertical" :model="openPersonSpaceForm">
      <a-form-item
        label=""
        name="spaceName"
        :rules="[
          {
            required: true,
            message: `请输入${spaceType && spaceType == 1 ? '团队' : '个人'}空间名称`,
          },
        ]"
      >
        <a-input-search
          v-model:value="openPersonSpaceForm.spaceName"
          :placeholder="`请输入${spaceType && spaceType == 1 ? '团队' : '个人'}空间名称`"
          enter-button="立即开通"
          size="large"
          @search="handleOpenPersonSpace"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import {
  activateSpaceUsingPost,
  getSpaceDetailByLoginUserUsingGet, getTeamSpaceByUserIdUsingGet,
  getTeamSpacesByLoginUserUsingGet
} from '@/api/spaceController'
import { message } from 'ant-design-vue'

/**
 * 初始化页面
 */
onMounted(() => {
  if (spaceType.value && spaceType.value == 1) {
    checkUserTeamSpace()
  } else {
    console.log('个人空间')
    checkUserSpace()
  }
})

const router = useRouter()
const route = useRoute()

/**
 * 空间类型
 */
const spaceType = computed(() => route.query?.type)

// 如果 spaceType 则调用 checkUserSpace
watch(
  () => spaceType.value,
  () => {
    if (spaceType.value && spaceType.value == 1) {
      checkUserTeamSpace()
    } else {
      console.log('个人空间')
      checkUserSpace()
    }
  },
)

/**
 * 登录用户信息
 */
const loginUserStore = useLoginUserStore()

/**
 * 用户空间是否存在
 */
const existedPersonSpace = ref<boolean>(false)

/**
 * 检查用户空间
 */
const checkUserSpace = async () => {
  const res = await getSpaceDetailByLoginUserUsingGet()
  if (res.code === 0 && res.data) {
    if (res.data.spaceId) {
      await router.push('/space/person')
    } else {
      existedPersonSpace.value = true
    }
  } else {
    existedPersonSpace.value = true
  }
}

/**
 * 检查用户空间
 */
const checkUserTeamSpace = async () => {
  const res = await getTeamSpaceByUserIdUsingGet()
  if (res.code === 0 && res.data) {
    if (res.data.spaceId) {
      await router.replace('/space/team?sid=' + res.data.spaceId)
    } else {
      existedPersonSpace.value = true
    }
  } else {
    existedPersonSpace.value = true
  }
}

/**
 * 开通个人空间表单
 */
const openPersonSpaceForm = reactive<API.SpaceActivateRequest>({
  spaceName: loginUserStore.loginUser.userName + `的${spaceType && spaceType == 1 ? '团队' : '个人'}空间`,
  spaceType: spaceType.value,
})
/**
 * 处理开通个人空间
 */
const handleOpenPersonSpace = async () => {
  try {
    const res = await activateSpaceUsingPost(openPersonSpaceForm)
    if (res.code === 0 && res.data) {
      message.success('开通成功！')
      if (spaceType.value && spaceType.value == 1) {
        await checkUserTeamSpace()
      } else {
        await checkUserSpace()
      }
    } else {
      message.error('开通失败！')
    }
  } catch (e) {
    message.error('开通失败！')
  }
}
</script>

<style scoped>
#space-page {
  max-width: 720px;
  margin: 0 auto;
  padding-top: 350px;
}
</style>
