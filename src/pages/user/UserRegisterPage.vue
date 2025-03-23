<template>
  <div id="userRegisterPage">
    <h2 class="title">暴龙图库 - 用户注册</h2>
    <div class="desc">智能协同云图库</div>
    <a-form
      :model="registerFormData"
      name="basic"
      label-align="left"
      autocomplete="off"
      @finish="handleRegister"
    >
      <a-form-item
        name="userEmail"
        :rules="[
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]"
        required
      >
        <a-input v-model:value="registerFormData.userEmail" placeholder="请输入邮箱" size="large">
        </a-input>
      </a-form-item>
      <a-form-item name="codeValue" :rules="[{ required: true, message: '请输入验证码' }]" required>
        <a-input-group compact>
          <a-input
            v-model:value="registerFormData.codeValue"
            placeholder="请输入验证码"
            size="large"
            style="width: calc(100% - 120px)"
          >
          </a-input>
          <a-button type="primary" size="large" @click="handleSendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
          </a-button>
        </a-input-group>
      </a-form-item>
      <div class="tips">
        已有账号？
        <RouterLink to="/user/login">去登录</RouterLink>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" size="large">
          注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { sendEmailCodeUsingPost, userRegisterUsingPost } from '@/api/userController'
import { useRouter } from 'vue-router'

const router = useRouter()

// 倒计时状态
const countdown = ref(0)
let timer: number | null = null

/**
 * 发送验证码
 */
const handleSendCode = async () => {
  if (!registerFormData.userEmail) {
    message.error('请输入邮箱')
    return
  }

  // 防止重复发送
  if (countdown.value > 0) {
    return
  }

  // 发送验证码请求
  const res = await sendEmailCodeUsingPost({
    userEmail: registerFormData.userEmail,
  })

  if (res.code === 0 && res.data) {
    message.success('验证码发送成功')
    registerFormData.codeKey = res.data

    // 开始倒计时
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer!)
        timer = null
      }
    }, 1000)
  } else {
    message.error(res.message)
  }
}

/**
 * 表单数据
 */
const registerFormData = reactive<API.UserRegisterRequest>({
  userEmail: '',
  codeKey: '',
  codeValue: '',
})

/**
 * 提交表单
 */
const handleRegister = async () => {
  const res = await userRegisterUsingPost(registerFormData)
  // 注册成功，跳转到登录页面
  if (res.code === 0 && res.data) {
    message.success('注册成功')
    await router.push({
      path: '/user/login',
      replace: true,
    })
  } else {
    message.error('注册失败，' + res.message)
  }
}

// 组件卸载时清除定时器
onMounted(() => {
  return () => {
    if (timer) {
      clearInterval(timer)
    }
  }
})
</script>

<style scoped>
#userRegisterPage {
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
  margin-bottom: 24px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
