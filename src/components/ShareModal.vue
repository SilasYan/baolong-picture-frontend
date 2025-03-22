<template>
  <div id="share-modal">
    <a-modal
      v-model:visible="visible"
      title="图片分享"
      :footer="false"
      width="400px"
      @cancel="closeModal"
    >
      <div class="modal-content">
        <!-- 链接复制区块 -->
        <div class="section">
          <h4 class="section-title">{{ name }}</h4>
          <a-typography-link copyable class="copy-link" :content="link">
            <div class="truncate">{{ link }}</div>
          </a-typography-link>
        </div>

        <!-- 二维码区块 -->
        <div class="section">
          <div class="qrcode-container">
            <a-qrcode :value="link" :size="160" color="#1890ff" />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults, defineExpose } from 'vue'

interface Props {
  title: string
  link: string
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  title: () => '分享',
  link: () => 'https://www.baolong.icu/',
  name: () =>
    '一只暴龙呀',
})

const visible = ref(false)

const openModal = () => (visible.value = true)
const closeModal = () => (visible.value = false)

defineExpose({ openModal })
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.section-title {
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  max-width: 300px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  /* 可选添加过渡效果 */
  transition: all 0.2s;
}

/* 鼠标悬停显示完整文字（可选） */
.section-title:hover {
  overflow: visible;
  white-space: normal;
  background: white;
  z-index: 1;
}

.copy-link {
  width: 100%;
  /* max-width: 300px; */
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: center;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qrcode-container {
  padding: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
