<template>
  <div id="userProfilePage">
    <!-- 个人信息 -->
    <div class="basicInfo">
      <a-card title="基础信息" :headStyle="{ 'text-align': 'center' }" :loading="userInfoLoading">
        <template #extra><a @click="openEditUserInfoModal">修改</a></template>
        <div class="avatar">
          <a-upload
            :show-upload-list="false"
            :before-upload="beforeUploadAvatar"
            :custom-request="handleUploadAvatar"
          >
            <a-avatar
              v-if="userAvatar"
              :size="{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 100 }"
              :src="userAvatar"
            >
              <template #icon>
                <AntDesignOutlined />
              </template>
            </a-avatar>
            <div v-else>
              <LoadingOutlined v-if="loading" />
              <PlusOutlined v-else />
              <div class="ant-upload-text">上传头像</div>
            </div>
          </a-upload>
        </div>
        <div style="margin-bottom: 16px" />
        <div class="info">
          <a-descriptions title="" bordered :labelStyle="{ 'text-align': 'center' }">
            <a-descriptions-item label="昵 称" :span="2">
              {{ userInfo.userName }}
            </a-descriptions-item>
            <a-descriptions-item label="用户名" :span="1">
              {{ userInfo.userAccount }}
            </a-descriptions-item>
            <a-descriptions-item label="邮 箱" :span="2">
              {{ userInfo.userEmail }}
            </a-descriptions-item>
            <a-descriptions-item label="手机号" :span="1">
              {{ userInfo.userPhone }}
            </a-descriptions-item>
            <a-descriptions-item label="出生日期" :span="2">
              {{ dayjs(userInfo.birthday).format('YYYY-MM-DD') }}
            </a-descriptions-item>
            <a-descriptions-item label="注册时间" :span="3">
              {{ dayjs(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </a-descriptions-item>
            <a-descriptions-item label="个人介绍" :span="3">
              {{ userInfo.userProfile }}
            </a-descriptions-item>
            <a-descriptions-item label="会员信息">
              <div v-if="userInfo.vipNumber">
                <p>会员编号: {{ userInfo.vipNumber }}</p>
                <p>会员类型: {{ userInfo.vipSign }}</p>
                <p>到期时间: {{ dayjs(userInfo.vipExpireTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              </div>
              <div v-else>暂未开通会员 <a @click="openExchangeVipModal">去开通?</a></div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-card>
    </div>
    <div style="margin-bottom: 16px" />

    <!-- 编辑用户信息弹出框 -->
    <a-modal
      v-model:open="editUserInfoModal"
      title="修改基础信息"
      centered
      cancelText="取消"
      okText="提交"
      @ok="editUserInfoSubmit"
      :maskClosable="false"
    >
      <a-form layout="vertical" :model="userInfoForm" @finish="handleSubmit">
        <a-form-item
          label="邮 箱"
          name="userEmail"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]"
          required
        >
          <a-input v-model:value="userInfoForm.userEmail" placeholder="请输入邮箱" disabled />
        </a-form-item>
        <a-form-item label="账 号（登录用户名）" name="userAccount" required>
          <a-input v-model:value="userInfoForm.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="昵 称" name="userName">
          <a-input v-model:value="userInfoForm.userName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="手机号" name="userPhone">
          <a-input v-model:value="userInfoForm.userPhone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="出生日期" name="birthday">
          <a-date-picker
            style="width: 100%"
            v-model:value="userInfoForm.birthday"
            format="YYYY/MM/DD"
            placeholder="请选择出生日期"
          />
        </a-form-item>
        <a-form-item label="个人介绍" name="userProfile">
          <a-textarea
            v-model:value="userInfoForm.userProfile"
            placeholder="请输入个人介绍"
            :rows="5"
            autoSize
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 兑换会员弹出框 -->
    <a-modal
      v-model:open="openVipModal"
      centered
      :maskClosable="false"
      :width="600"
      cancelText="取消"
      okText="提交"
      @ok="exchangeVipSubmit"
    >
      <!-- 自定义标题带图标 -->
      <template #title>
        <div class="custom-title">
          <icon>
            <template #component>
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
              >
                <path
                  d="M663.864 147.333H362.136c-34.421 0-67.432 13.998-91.773 38.916l-207.86 212.78c-19.338 19.798-19.338 51.893 0 71.691l404.102 413.673c25.623 26.229 67.165 26.229 92.788 0L963.495 470.72c19.338-19.798 19.338-51.893 0-71.691l-207.862-212.78c-24.337-24.918-57.348-38.916-91.769-38.916z"
                  fill="#FFA820"
                ></path>
                <path
                  d="M62.504 399.028c-19.338 19.798-19.338 51.893 0 71.691l8.667 8.873c2.085-38.628 9.355-75.876 21.127-111.063l-29.794 30.499zM963.496 399.028L861.313 294.427c34.885 61.489 54.811 132.578 54.811 208.323 0 5.627-0.113 11.228-0.33 16.802l47.704-48.833c19.337-19.798 19.337-51.893-0.002-71.691z"
                  fill="#FEAC33"
                ></path>
                <path
                  d="M160.006 299.218l-67.708 69.311c-11.772 35.187-19.041 72.435-21.127 111.063l41.377 42.357a368.9 368.9 0 0 1-2.075-39.073c0-66.966 18.046-129.715 49.533-183.658zM861.313 294.427L755.635 186.248c-24.339-24.917-57.35-38.916-91.771-38.916h-45.019C749 203.074 840.189 332.323 840.189 482.875c0 51.345-10.611 100.209-29.752 144.528l105.356-107.851c0.218-5.574 0.33-11.175 0.33-16.802 0-75.746-19.925-146.835-54.81-208.323zM427.792 844.659l38.814 39.733c25.623 26.229 67.165 26.229 92.788 0l68.278-69.895c-46.362 21.333-97.961 33.236-152.341 33.236a368.23 368.23 0 0 1-47.539-3.074z"
                  fill="#FEB133"
                ></path>
                <path
                  d="M618.845 147.333H362.136c-34.421 0-67.432 13.998-91.773 38.916l-110.358 112.97c-31.487 53.943-49.533 116.692-49.533 183.657 0 13.2 0.708 26.235 2.075 39.073l64.293 65.816c-16.982-38.122-26.436-80.336-26.436-124.763 0-169.51 137.415-306.925 306.925-306.925s306.925 137.415 306.925 306.925S626.839 769.926 457.33 769.926c-46.985 0-91.495-10.573-131.306-29.445L427.792 844.66a368.23 368.23 0 0 0 47.539 3.074c54.38 0 105.979-11.903 152.341-33.236l182.765-187.094c19.14-44.319 29.752-93.184 29.752-144.528 0-150.553-91.189-279.802-221.344-335.543z"
                  fill="#FEB633"
                ></path>
                <path
                  d="M764.254 463.001c0-169.51-137.415-306.925-306.925-306.925S150.405 293.491 150.405 463.001c0 44.427 9.453 86.642 26.436 124.763L326.024 740.48c39.81 18.872 84.321 29.445 131.306 29.445 169.509 0.001 306.924-137.414 306.924-306.924z m-573.917-19.875c0-137.514 111.477-248.991 248.991-248.991S688.32 305.612 688.32 443.126 576.842 692.118 439.328 692.118 190.337 580.641 190.337 443.126z"
                  fill="#FFBC34"
                ></path>
                <path
                  d="M688.32 443.126c0-137.514-111.477-248.991-248.991-248.991S190.337 305.612 190.337 443.126s111.477 248.991 248.991 248.991S688.32 580.641 688.32 443.126zM421.327 614.31c-105.518 0-191.058-85.54-191.058-191.058s85.54-191.058 191.058-191.058 191.058 85.54 191.058 191.058S526.846 614.31 421.327 614.31z"
                  fill="#FFC134"
                ></path>
                <path
                  d="M421.327 232.194c-105.518 0-191.058 85.54-191.058 191.058s85.54 191.058 191.058 191.058 191.058-85.54 191.058-191.058-85.539-191.058-191.058-191.058z m-18.001 304.308c-73.523 0-133.125-59.602-133.125-133.125s59.602-133.125 133.125-133.125 133.125 59.602 133.125 133.125-59.602 133.125-133.125 133.125z"
                  fill="#FFC634"
                ></path>
                <path
                  d="M403.326 403.378m-133.125 0a133.125 133.125 0 1 0 266.25 0 133.125 133.125 0 1 0-266.25 0Z"
                  fill="#FFCB34"
                ></path>
                <path
                  d="M663.864 165.333c14.702 0 29.048 2.922 42.639 8.686 13.62 5.775 25.818 14.122 36.256 24.808L950.62 411.606c12.532 12.83 12.532 33.706 0.001 46.535L546.518 871.814c-8.977 9.189-20.881 14.25-33.518 14.25-12.638 0-24.542-5.061-33.518-14.25L75.38 458.141c-12.532-12.83-12.532-33.706-0.001-46.535l207.86-212.78c10.439-10.686 22.637-19.033 36.257-24.808 13.591-5.763 27.937-8.686 42.639-8.686h301.729m0-17.999H362.136c-34.421 0-67.432 13.998-91.772 38.915l-207.86 212.78c-19.338 19.798-19.338 51.893 0 71.691l404.102 413.673c12.811 13.115 29.603 19.672 46.394 19.672s33.583-6.557 46.394-19.672l404.102-413.673c19.338-19.798 19.338-51.893 0-71.691l-207.862-212.78c-24.338-24.917-57.349-38.915-91.77-38.915z"
                  fill="#FFA820"
                ></path>
                <path
                  d="M585.506 299.37H440.494c-16.543 0-32.407 6.686-44.106 18.584L296.49 419.583c-9.294 9.454-9.294 24.783 0 34.237l194.213 197.576a31.154 31.154 0 0 0 44.593 0L729.509 453.82c9.294-9.454 9.294-24.783 0-34.237l-99.896-101.629c-11.698-11.898-27.564-18.584-44.107-18.584z"
                  fill="#FFE3B4"
                ></path>
                <path
                  d="M222.012 346.805a17.94 17.94 0 0 1-12.677-5.222c-7.057-7.001-7.102-18.398-0.101-25.456l87.419-88.112c7.002-7.057 18.398-7.102 25.456-0.1 7.057 7.001 7.102 18.398 0.101 25.456l-87.419 88.112a17.945 17.945 0 0 1-12.779 5.322zM172.371 396.84a17.94 17.94 0 0 1-12.677-5.222c-7.058-7.001-7.103-18.398-0.101-25.456l7.428-7.487c7.002-7.058 18.399-7.103 25.456-0.101 7.058 7.001 7.103 18.398 0.101 25.456l-7.428 7.487a17.946 17.946 0 0 1-12.779 5.323z"
                  fill="#FFFFFF"
                ></path>
              </svg>
            </template>
          </icon>
          <span style="margin-left: 8px">兑换会员</span>
        </div>
      </template>

      <!-- 内容区域 -->
      <div class="modal-content">
        <!-- 表单容器 -->
        <a-form layout="vertical" class="vip-form">
          <a-form-item>
            <div class="input-container">
              <a-input
                v-model:value="userVipForm.vipCode"
                placeholder="请输入会员兑换码"
                allowClear
                size="large"
              />
            </div>
          </a-form-item>
        </a-form>
      </div>

      <!-- 自定义底部按钮 -->
      <template #footer>
        <div class="custom-footer">
          <a-button @click="openVipModal = false">取消</a-button>
          <a-button type="primary" @click="exchangeVipSubmit">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message, type UploadProps } from 'ant-design-vue'
import Icon, {
  LoadingOutlined,
  PlusOutlined,
  AntDesignOutlined,
  StarTwoTone,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import {
  editUserUsingPost,
  getUserDetailByIdUsingGet,
  uploadAvatarUsingPost,
} from '@/api/userController'
import { imageValidator } from '@/utils'

/**
 * 初始化页面
 */
onMounted(() => {
  fetchUserInfo()
})

// 登录用户信息
const loginUserStore = useLoginUserStore()

// 用户信息加载状态
const userInfoLoading = ref<boolean>(true)
// 用户信息
const userInfo = ref<API.UserVO>({})
// 用户头像
const userAvatar = ref<string>('')

/**
 * 获取用户信息
 */
const fetchUserInfo = async () => {
  userInfoLoading.value = true
  const res = await getUserDetailByIdUsingGet({
    id: loginUserStore.loginUser.id,
  })
  if (res.code === 0 && res.data) {
    userInfo.value = res.data
    userAvatar.value = res.data.userAvatar
    userInfoLoading.value = false
  }
}

// 编辑信息弹出框
const editUserInfoModal = ref<boolean>(false)
//打开编辑用户信息弹出框
const openEditUserInfoModal = () => {
  editUserInfoModal.value = true
  userInfoForm.id = userInfo.value.id
  userInfoForm.userEmail = userInfo.value.userEmail
  userInfoForm.userAccount = userInfo.value.userAccount
  userInfoForm.userName = userInfo.value.userName
  userInfoForm.userPhone = userInfo.value.userPhone
  userInfoForm.birthday = userInfo.value.birthday ? dayjs(userInfo.value.birthday) : undefined
  userInfoForm.userProfile = userInfo.value.userProfile
}
// 用户信息表单
const userInfoForm = reactive<API.UserUpdateRequest>({})
/**
 * 提交编辑用户信息表单
 */
const editUserInfoSubmit = async () => {
  const userId = userInfoForm.id
  if (!userId) {
    return
  }
  const res = await editUserUsingPost(userInfoForm)
  if (res.code === 0 && res.data) {
    message.success('修改成功')
    // 跳转到图片详情页
    editUserInfoModal.value = false
    await fetchUserInfo()
  } else {
    message.error('修改失败, ' + res.message)
  }
}

/**
 * 上传头像校验
 * @param file
 */
const beforeUploadAvatar = (file: File) => imageValidator(file)
/**
 * 上传头像
 * @param file
 */
const handleUploadAvatar = async ({ file }: any) => {
  userInfoLoading.value = true
  try {
    const res = await uploadAvatarUsingPost({}, file)
    console.log(res)
    if (res.code === 0 && res.data) {
      message.success('头像上传成功!')
      userAvatar.value = res.data
      await loginUserStore.fetchLoginUser(true)
    } else {
      message.error('头像上传失败! ' + res.data.message)
    }
  } finally {
    userInfoLoading.value = false
  }
}

// 兑换会员弹出框
const openVipModal = ref<boolean>(false)
// 打开兑换VIP弹出框
const openExchangeVipModal = () => {
  openVipModal.value = true
}
// 兑换VIP表单
const userVipForm = reactive<API.UserVipExchangeRequest>({})

/**
 * 提交兑换VIP表单
 */
const exchangeVipSubmit = async () => {
  if (!userVipForm.vipCode) {
    message.error('请输入会员兑换码')
    return
  }
  alert('兑换成功')
  // const res = await exchangeVipUsingPost(userVipForm)
  // if (res.data.code === 0 && res.data.data) {
  //   message.success('兑换成功')
  //   fetchUserInfo()
  // } else {
  //   message.error('兑换失败，' + res.data.message)
  // }
}
</script>

<style scoped>
#userProfilePage {
  max-width: 720px;
  margin: 0 auto;
}

#userProfilePage .basicInfo .avatar {
  text-align: center;
}

/* 模态框标题样式 */
.custom-title {
  display: flex;
  align-items: center;
  font-size: 16px;
}

/* 内容容器 */
.modal-content {
  /* padding: 24px 0; */
  min-height: 100px; /* 保证垂直居中效果 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模态框底部按钮居中 */
.custom-footer {
  display: flex;
  justify-content: center;
  gap: 16px; /* 按钮间距 */
}

/* 表单样式 */
.vip-form {
  width: 100%;
}

/* 输入框容器 */
.input-container {
  width: 80%;
  margin: 0 auto;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .input-container {
    width: 100%;
  }

  .custom-footer {
    flex-direction: column; /* 小屏幕下按钮垂直排列 */
    gap: 12px;
  }
}
</style>
