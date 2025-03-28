<template>
  <div id="userLoginPage">
    <div class="login-container">
      <div class="login-header">
        <h2 class="title">暴龙图库</h2>
      </div>

      <a-form
        :model="loginFormData"
        name="basic"
        autocomplete="off"
        @finish="handleLogin"
        class="login-form"
      >
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入邮箱/账号' }]">
          <a-input
            v-model:value="loginFormData.userAccount"
            placeholder="邮箱/账号"
            class="login-input"
          >
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
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
            placeholder="密码"
            class="login-input"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="captchaCode" :rules="[{ required: true, message: '请输入验证码' }]">
          <a-input
            v-model:value="loginFormData.captchaCode"
            placeholder="验证码"
            class="login-input captcha-input"
          >
            <template #prefix>
              <SafetyOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
            <template #suffix>
              <a-image
                :width="100"
                :src="captchaImage"
                :preview="false"
                @click="captcha"
                class="captcha-image"
              />
            </template>
          </a-input>
        </a-form-item>

        <div class="login-footer">
          <a-button
            type="primary"
            html-type="submit"
            class="login-btn"
            :loading="loading"
          >
            登录
          </a-button>

          <div class="login-actions">
            <router-link to="/user/register" class="register-link">
              没有账号？立即注册
            </router-link>
            <!--<router-link to="/user/forget" class="forget-link">-->
            <a class="forget-link" @click="message.warning('请联系管理员重置密码')">
              忘记密码？
            </a>
            <!--</router-link>-->
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
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
const loginUserStore = useLoginUserStore()
const key = ref<string>()
const captchaImage = ref<string>()
const loading = ref(false)

const captcha = async () => {
  const res = await captchaUsingGet()
  if (res.code === 0 && res.data) {
    loginFormData.captchaKey = res.data.captchaKey
    captchaImage.value = res.data.captchaImage
  } else {
    message.error('加载验证码失败，' + res.message)
  }
}

onMounted(() => {
  captcha()
})

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await userLoginUsingPost(loginFormData)
    if (res.code === 0 && res.data) {
      message.success('登录成功')
      loginUserStore.setLoginUser(res.data)
      await router.push({ path: '/', replace: true })
    } else {
      await captcha()
      message.error('登录失败，' + res.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#userLoginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* 使用fixed定位确保不产生滚动 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; /* 撑满整个视口 */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* 确保不会出现滚动条 */
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  padding: 40px;
  animation: fadeIn 0.5s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.login-form {
  margin-top: 24px;
}

.login-input {
  height: 44px;
  border-radius: 6px;
}

.login-input :deep(.ant-input-prefix) {
  margin-right: 8px;
}

.captcha-input :deep(.ant-input-suffix) {
  display: flex;
  align-items: center;
}

.captcha-image {
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #eee;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  margin-top: 8px;
}

.login-footer {
  margin-top: 24px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.register-link {
  color: #1890ff;
  font-size: 14px;
}

.forget-link {
  color: #666;
  font-size: 14px;
}

.forget-link:hover {
  color: #1890ff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }
}
</style>
