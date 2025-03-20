<template>
  <div id="userLoginPage">
    <h2 class="title">暴龙图库 - 用户登录</h2>
    <div class="desc">智能协同云图库</div>
    <a-form :model="loginFormData" name="basic" autocomplete="off" @finish="handleLogin">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入邮箱/账号' }]">
        <a-input
          v-model:value="loginFormData.userAccount"
          placeholder="请输入邮箱/账号"
          style="height: 40px"
        />
      </a-form-item>
      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码不能小于 8 位' },
        ]"
      >
        <a-input-password
          v-model:value="loginFormData.userPassword"
          placeholder="请输入密码"
          style="height: 40px"
        />
      </a-form-item>
      <a-form-item name="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
        <a-input
          v-model:value="loginFormData.captchaCode"
          placeholder="请输入账号"
          style="height: 40px"
        >
          <template #prefix> 验证码</template>
          <template #suffix>
            <a-image :width="100" :src="captchaImage" :preview="false" @click="captcha" />
          </template>
        </a-input>
      </a-form-item>
      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRouter } from 'vue-router'
import { captchaUsingGet } from '@/api/mainController'

const loginFormData = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
  captchaKey: '',
  captchaCode: '',
})

const router = useRouter()

// 登录用户仓库
const loginUserStore = useLoginUserStore()

// 图形验证码图片 key
const key = ref<string>()
// 图形验证码图片地址
const captchaImage = ref<string>()

/**
 * 获取图形验证码
 */
const captcha = async () => {
  const res = await captchaUsingGet()
  console.log(res)
  if (res.code === 0 && res.data) {
    loginFormData.captchaKey = res.data.captchaKey
    captchaImage.value = res.data.captchaImage
  } else {
    message.error('加载验证码失败，' + res.message)
  }
}

/**
 * 初始化页面
 */
onMounted(() => {
  captcha()
})

/**
 * 提交登录表单
 */
const handleLogin = async () => {
  const res = await userLoginUsingPost(loginFormData)
  // 登录成功，把登录态保存到全局状态中
  if (res.code === 0 && res.data) {
    message.success('登录成功')
    console.log(res.data)
    loginUserStore.setLoginUser(res.data)
    await router.push({
      path: '/',
      replace: true,
    })
  } else {
    await captcha()
    message.error('登录失败，' + res.message)
  }
}
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
