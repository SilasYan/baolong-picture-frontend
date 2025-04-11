<template>
  <div class="timeline-page">
    <div class="header">
      <h1>项目开发历程</h1>
      <p class="subtitle">记录每个重要里程碑和迭代</p>
    </div>

    <div class="timeline-wrapper">
      <a-timeline mode="left" :reverse="true">
        <a-timeline-item
          v-for="(item, index) in timelineData"
          :key="index"
          :color="getStatusColor(item.status)"
          class="timeline-item"
        >
          <div class="item-content">
            <div class="item-header">
              <div class="date">{{ item.date }}</div>
              <div class="status-badge" :class="item.status">
                {{ getStatusText(item.status) }}
              </div>
            </div>
            <h3 class="title">{{ item.title }}</h3>

            <ul v-if="item.content?.length" class="content-list">
              <li v-for="(content, i) in item.content" :key="i">
                {{ content }}
              </li>
            </ul>

            <div v-if="item.links?.length" class="links">
              <a
                v-for="(link, i) in item.links"
                :key="'link' + i"
                :href="link.url"
                target="_blank"
                class="link"
              >
                <LinkOutlined />
                {{ link.text }}
              </a>
            </div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LinkOutlined } from '@ant-design/icons-vue'

type TimelineItem = {
  date?: string
  title: string
  content?: string[]
  links?: { text: string; url: string }[]
  status: 'completed' | 'progress' | 'pending' | 'refactor'
}

const timelineData: TimelineItem[] = [
  {
    date: '2025-02-14',
    title: '项目初始化',
    content: ['项目基础架构搭建'],
    status: 'completed',
  },
  {
    date: '2025-02-15',
    title: '核心模块开发',
    content: ['用户管理模块前后端', '图片管理模块前后端', '分类标签管理完善', '图片审核功能'],
    status: 'completed',
  },
  {
    date: '2025-02-16',
    title: '功能优化',
    content: [
      '批量爬取网络图片并上传',
      '图片查询优化',
      '图片上传优化',
      '删除图片时删除对应存储服务器的图片',
      '配置 Session 存储方式为 Redis',
    ],
    status: 'completed',
  },
  {
    date: '2025-02-19',
    title: '个人空间开发',
    content: ['个人空间功能实现'],
    status: 'completed',
  },
  {
    date: '2025-02-20',
    title: '以图搜图开发',
    content: ['以图搜图功能开发', '完成以图搜图代替方案'],
    status: 'completed',
  },
  {
    date: '2025-02-24',
    title: '颜色搜索功能',
    content: ['根据图片颜色搜索图片功能'],
    status: 'completed',
  },
  {
    date: '2025-02-25',
    title: '图片编辑功能',
    content: [
      '图片基础编辑功能',
      'AI 扩图功能',
      '修复 URL 上传图片时图片后缀丢失问题',
      '优化腾讯云对象存储服务',
    ],
    status: 'completed',
  },
  {
    date: '2025-02-28',
    title: '图库分析',
    content: ['图库分析功能开发'],
    status: 'completed',
  },
  {
    date: '2025-03-01',
    title: '团队空间',
    content: ['团队空间功能开发'],
    status: 'completed',
  },
  {
    date: '2025-03-02',
    title: '协同编辑',
    content: ['图片协同编辑功能开发'],
    status: 'completed',
  },
  {
    date: '2025-03-03',
    title: '项目上线',
    content: ['用户会员简洁版', '打包修改'],
    links: [{ text: '项目上线', url: 'https://picture.baolong.icu/' }],
    status: 'completed',
  },
  {
    date: '2025-03-04',
    title: '用户功能完善',
    content: [
      '用户信息功能开发',
      '会员兑换功能开发',
      'VIP 取消 2M 图片限制',
      '图片详情未登录也允许查看',
    ],
    status: 'completed',
  },
  {
    title: '项目开发完成',
    status: 'progress',
  },
  {
    title: '准备 DDD 重构',
    status: 'progress',
  },
  {
    title: '重构（参考教程）',
    status: 'refactor',
  },
  {
    title: '重构（其他重构）',
    status: 'refactor',
  },
  {
    title: '重构（基本完成）',
    status: 'refactor',
  },
  {
    date: '2025-03-20',
    title: '重新重构',
    content: ['DDD 架构重构开始'],
    links: [
      { text: '后端代码初始化', url: 'https://github.com/SilasYan/baolong-picture-backend' },
      { text: 'DDD 分支', url: 'https://github.com/SilasYan/baolong-picture-backend/tree/ddd' },
      { text: '前端代码初始化', url: 'https://github.com/SilasYan/baolong-picture-frontend' },
    ],
    status: 'completed',
  },
  {
    date: '2025-03-20',
    title: '用户相关 DDD 重构',
    content: ['用户模块 DDD 重构'],
    status: 'completed',
  },
  {
    date: '2025-03-21',
    title: '完成 DDD 重构',
    status: 'completed',
  },
  {
    date: '2025-03-22',
    title: '功能完善',
    content: [
      '爬取图片功能完善',
      '定时任务动态增删改查',
      '菜单增删改',
      '前端审核状态显示',
      '修复发布图片选择标签失效问题',
      '其他细节优化',
    ],
    status: 'completed',
  },
  {
    date: '2025-03-23',
    title: '以图搜图重构',
    content: ['以图搜图功能重构', '线程池配置优化'],
    status: 'completed',
  },
  {
    date: '2025-03-26',
    title: 'AI 功能重构',
    content: ['AI 扩图重构', '以图搜图重构', 'OkHttp 配置'],
    status: 'completed',
  },
  {
    date: '2025-03-28',
    title: '新增用户反馈页面',
    content: [],
    status: 'completed',
  },
  {
    date: '2025-04-08',
    title: '批量上传图片上线',
    content: ['批量上传仅于个人空间、团队空间可使用', '普通用户一次上传仅限8张', 'VIP用户无限制'],
    status: 'completed',
  },
  {
    date: '2025-04-08',
    title: '团队空间重新开放',
    content: [
      '每个用户都属于共享空间编辑者权限',
      '只有开通了个人空间的用户才会自动加入官方共享空间',
    ],
    status: 'completed',
  },
  {
    date: '2025-04-12',
    title: '文本生图上线',
    content: ['每个用户每天一次机会', 'AI 扩图也改为每天一次'],
    status: 'completed',
  },
  {
    title: '预计添加的新功能',
    content: ['空间分析', '协同开发', '图片修复', '消息通知'],
    status: 'pending',
  },
]

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'var(--success-color)',
    progress: 'var(--processing-color)',
    pending: 'var(--warning-color)',
    refactor: 'var(--error-color)',
  }
  return colors[status] || 'gray'
}

const getStatusText = (status: string) => {
  const texts = {
    completed: '已完成',
    progress: '进行中',
    pending: '规划中',
    refactor: '重构中',
  }
  return texts[status] || ''
}
</script>

<style scoped>
.timeline-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.timeline-wrapper {
  position: relative;
}

.timeline-item {
  padding-bottom: 2.5rem;
}

.item-content {
  background: white;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12); /* 加深阴影效果 */
  border-left: 3px solid var(--border-color);
  transition: all 0.2s ease;
  position: relative;
  margin-left: 24px;
}

.timeline-item:hover .item-content {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* 悬停时阴影更深 */
  transform: translateY(-3px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.date {
  color: #666;
  font-size: 0.85rem;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background: #f6ffed;
  color: #389e0d;
}

.status-badge.progress {
  background: #e6f7ff;
  color: #096dd9;
}

.status-badge.pending {
  background: #fff7e6;
  color: #d46b08;
}

.status-badge.refactor {
  background: #fff1f0;
  color: #cf1322;
}

.title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f1f1f;
  margin-bottom: 1rem;
}

.content-list {
  padding-left: 1.25rem;
  margin: 0.5rem 0 1rem;
  color: #444;
}

.content-list li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #1677ff;
  font-size: 0.85rem;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* 时间线样式覆盖 - 加强颜色效果 */
:deep(.ant-timeline-item-tail) {
  left: 12px;
  border-left: 2px solid #e8e8e8;
}

:deep(.ant-timeline-item-head) {
  width: 16px;
  height: 16px;
  left: 4px;
  background: white;
  border: 4px solid transparent;
  box-shadow: 0 0 0 2px white; /* 添加白色边框使颜色更突出 */
}

:deep(.ant-timeline-item-head-blue) {
  border-color: var(--processing-color);
  background-color: var(--processing-color);
}

:deep(.ant-timeline-item-head-green) {
  border-color: var(--success-color);
  background-color: var(--success-color);
}

:deep(.ant-timeline-item-head-red) {
  border-color: var(--error-color);
  background-color: var(--error-color);
}

:deep(.ant-timeline-item-head-gray) {
  border-color: #bfbfbf;
  background-color: #bfbfbf;
}

/* 添加时间线节点的发光效果 */
:deep(.ant-timeline-item-head)::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .timeline-page {
    padding: 1.5rem 1rem;
  }

  :deep(.ant-timeline-item-content) {
    margin-left: 36px;
  }

  .item-content {
    margin-left: 16px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  }
}
</style>
