<template>
  <div class="feedback-page">
    <div class="feedback-header">
      <BulbOutlined class="feedback-icon" />
      <h1>意见反馈</h1>
      <p>感谢你的意见与建议~</p>
    </div>

    <div class="feedback-form">
      <a-form :model="formState" name="feedback" layout="vertical">
        <a-form-item
          label="反馈类型"
          name="feedbackType"
          :rules="[{ required: true, message: '请选择反馈类型' }]"
          :labelCol="{ style: { fontWeight: 'bold' } }"
        >
          <a-radio-group v-model:value="formState.feedbackType">
            <a-radio value="0">使用体验</a-radio>
            <a-radio value="1">功能建议</a-radio>
            <a-radio value="2">BUG错误</a-radio>
            <a-radio value="3">其他</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="反馈内容"
          name="content"
          :rules="[{ required: true, message: '请填写反馈内容' }]"
          :labelCol="{ style: { fontWeight: 'bold' } }"
        >
          <a-textarea
            v-model:value="formState.content"
            placeholder="请详细描述您的问题或建议..."
            :rows="6"
            show-count
            :maxlength="500"
          />
        </a-form-item>

        <a-form-item
          label="联系方式"
          name="contactType"
          :rules="[{ required: true, message: '请填写联系方式' }]"
          :labelCol="{ style: { fontWeight: 'bold' } }"
        >
          <a-input-group compact>
            <a-select v-model:value="formState.contactType" style="width: 120px" size="large">
              <a-select-option value="0">QQ</a-select-option>
              <a-select-option value="1">微信</a-select-option>
              <a-select-option value="2">邮箱</a-select-option>
            </a-select>
            <a-input
              v-model:value="formState.contactInfo"
              :placeholder="getContactPlaceholder()"
              size="large"
              style="width: calc(100% - 120px)"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
          <div class="submit-button-container">
            <a-button type="primary" size="large" @click="submitFeedback" :loading="submitting">
              提交反馈
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <div class="feedback-tips">
      <h3>反馈提示：</h3>
      <ul>
        <li>请尽量详细描述问题，包括操作步骤和预期结果</li>
        <li>如果是功能建议，请说明您的使用场景</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BulbOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import FeedbackAddRequest = API.FeedbackAddRequest
import { addFeedbackUsingPost } from '@/api/feedbackController'

const formState = ref<FeedbackAddRequest>({
  feedbackType: '',
  content: '',
  contactType: '0', // 默认选择QQ
  contactInfo: '',
})

const submitting = ref(false)

const getContactPlaceholder = () => {
  switch (formState.value.contactType) {
    case '0':
      return '请输入QQ号码'
    case '1':
      return '请输入微信号'
    case '2':
      return '请输入邮箱地址'
    default:
      return '请输入联系方式'
  }
}

const submitFeedback = async () => {
  submitting.value = true
  const res = await addFeedbackUsingPost({
    ...formState.value,
  })
  if (res.code === 0) {
    message.success('反馈提交成功！感谢您的支持')
    formState.value = {
      feedbackType: '',
      content: '',
      contactType: '0',
      contactInfo: '',
    }
  } else {
    message.error('反馈提交失败！' + res.message)
  }
  submitting.value = false
}
</script>

<style scoped>
.feedback-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.feedback-header {
  text-align: center;
  margin-bottom: 32px;
}

.feedback-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.feedback-header h1 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.feedback-header p {
  color: #666;
  font-size: 14px;
}

.feedback-form {
  margin-bottom: 40px;
}

.submit-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.feedback-tips {
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.feedback-tips h3 {
  color: #555;
  margin-bottom: 12px;
}

.feedback-tips ul {
  padding-left: 20px;
  color: #666;
  line-height: 1.8;
}

.feedback-tips li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .feedback-page {
    padding: 16px;
  }

  .feedback-header {
    margin-bottom: 24px;
  }

  /* 使输入组在移动端变为垂直布局 */
  .ant-input-group {
    display: flex;
    flex-direction: column;
  }

  .ant-input-group > .ant-select,
  .ant-input-group > .ant-input {
    width: 100% !important;
  }

  .ant-input-group > .ant-select {
    margin-bottom: 8px;
  }
}
</style>
