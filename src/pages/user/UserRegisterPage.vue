<template>
  <div id="userRegisterPage">
    <div class="register-container">
      <div class="register-header">
        <h2 class="title">暴龙图库 - 注册</h2>
      </div>

      <a-form
        :model="registerFormData"
        name="basic"
        label-align="left"
        autocomplete="off"
        @finish="handleRegister"
        class="register-form"
      >
        <a-form-item
          name="userEmail"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]"
        >
          <a-input
            v-model:value="registerFormData.userEmail"
            placeholder="邮箱地址"
            class="register-input"
          >
            <template #prefix>
              <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="codeValue"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <a-input-group compact class="code-input-group">
            <a-input
              v-model:value="registerFormData.codeValue"
              placeholder="验证码"
              class="register-input code-input"
            >
              <template #prefix>
                <SafetyOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
            <a-button
              type="primary"
              @click="handleSendCode"
              :disabled="countdown > 0"
              class="code-btn"
              :loading="sending"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </a-button>
          </a-input-group>
        </a-form-item>

        <div class="register-footer">
          <a-button
            type="primary"
            html-type="submit"
            class="register-btn"
            :loading="registering"
          >
            注册
          </a-button>

          <div class="register-actions">
            <router-link to="/user/login" class="login-link">
              已有账号？立即登录
            </router-link>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { MailOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { sendEmailCodeUsingPost, userRegisterUsingPost } from '@/api/userController'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(0)
const sending = ref(false)
const registering = ref(false)
let timer: number | null = null

const registerFormData = reactive<API.UserRegisterRequest>({
  userEmail: '',
  codeKey: '',
  codeValue: '',
})

const handleSendCode = async () => {
  if (!registerFormData.userEmail) {
    message.error('请输入邮箱地址')
    return
  }

  if (countdown.value > 0) return

  sending.value = true
  try {
    const res = await sendEmailCodeUsingPost({
      userEmail: registerFormData.userEmail,
    })

    if (res.code === 0 && res.data) {
      message.success('验证码已发送至邮箱')
      registerFormData.codeKey = res.data
      startCountdown()
    } else {
      message.error(res.message)
    }
  } finally {
    sending.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
}

const handleRegister = async () => {
  registering.value = true
  try {
    const res = await userRegisterUsingPost(registerFormData)
    if (res.code === 0 && res.data) {
      message.success('注册成功')
      router.push({ path: '/user/login', replace: true })
    } else {
      message.error('注册失败: ' + res.message)
    }
  } finally {
    registering.value = false
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
#userRegisterPage {
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

.register-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  padding: 40px;
  animation: fadeIn 0.5s ease;
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.register-form {
  margin-top: 24px;
}

.register-input {
  height: 44px;
  border-radius: 6px;
}

.register-input :deep(.ant-input-prefix) {
  margin-right: 8px;
}

.code-input-group {
  display: flex;
}

.code-input {
  flex: 1;
  min-width: 0;
}

.code-btn {
  height: 44px;
  margin-left: 8px;
  border-radius: 6px;
}

.register-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  margin-top: 8px;
}

.register-footer {
  margin-top: 24px;
}

.register-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.login-link {
  color: #1890ff;
  font-size: 14px;
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
  .register-container {
    padding: 30px 20px;
  }

  .code-input-group {
    flex-direction: column;
  }

  .code-btn {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
  }
}
</style>
