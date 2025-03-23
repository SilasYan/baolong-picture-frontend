<template>
  <div id="=timeline-page">
    <a-timeline pending="更多功能等待发布..." :reverse="true">
      <a-timeline-item>
        <a-typography-title :level="5">2025-02-14</a-typography-title>
        <a-typography-paragraph>项目初始化</a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-15</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>用户管理模块前后端</li>
            <li>图片管理模块前后端</li>
            <li>拓展：分类标签管理完善、处理标签回显问题</li>
            <li>图片审核功能</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-16</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>批量爬取网络图片并上传</li>
            <li>图片查询优化</li>
            <li>图片上传优化</li>
            <li>拓展：删除图片时删除对应存储服务器的图片</li>
            <li>配置 Session 存储方式为 Redis</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-19</a-typography-title>
        <a-typography-paragraph>个人空间开发</a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-20</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>以图搜图开发</li>
            <li>完成以图搜图代替方案</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-24</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>根据图片颜色搜索图片</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-25</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>图片基础编辑功能</li>
            <li>AI 扩图功能</li>
            <li>BUG：修复 URL 上传图片时图片后缀丢失问题</li>
            <li>优化：腾讯云对象存储服务</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-02-28</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>开发：图库分析</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-01</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>开发：团队空间</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-02</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>开发：图片协同编辑</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-03</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>开发：用户会员简洁版、逻辑优化</li>
            <li>打包修改</li>
            <li>
              <a-typography-link href="https://picture.baolong.icu/" target="_blank"
                >项目上线
              </a-typography-link>
            </li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-04</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>开发：用户信息</li>
            <li>开发：会员兑换</li>
            <li>优化：VIP 取消 2M 图片限制</li>
            <li>优化：图片详情未登录也允许查看</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <SmileOutlined class="progress" />
        </template>
        <a-typography-title :level="5">项目开发完成</a-typography-title>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <SmileOutlined class="progress" />
        </template>
        <a-typography-title :level="5">准备 DDD 重构</a-typography-title>
      </a-timeline-item>
      <a-timeline-item color="gray">重构（参考教程）</a-timeline-item>
      <a-timeline-item>重构（其他重构）</a-timeline-item>
      <a-timeline-item color="red">重构...</a-timeline-item>
      <a-timeline-item color="green">重构（基本完成）</a-timeline-item>
      <a-timeline-item color="orange">重构（理解不到位）</a-timeline-item>
      <!---->
      <a-timeline-item>
        <template #dot>
          <SmileOutlined class="progress" />
        </template>
        <a-typography-title :level="5">2025-03-20 重新重构</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>
              <a-typography-link
                href="https://github.com/SilasYan/baolong-picture-backend"
                target="_blank"
                >暴龙图库 DDD 后端代码初始化
              </a-typography-link>
            </li>
            <li>
              <a-typography-link
                href="https://github.com/SilasYan/baolong-picture-backend/tree/ddd"
                target="_blank"
                >创建新分支 ddd
              </a-typography-link>
            </li>
            <li>
              <a-typography-link
                href="https://github.com/SilasYan/baolong-picture-frontend"
                target="_blank"
                >暴龙图库（后端 DDD 版本）前端代码初始化
              </a-typography-link>
            </li>
            <!--  完成适配 DDD 重构-->
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-20</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>用户相关 DDD 重构</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-21 完成 DDD 重构</a-typography-title>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-22</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>开发：爬取图片功能完善</li>
            <li>开发：定时任务动态增删改查</li>
            <li>开发：菜单增删改</li>
            <li>开发：前端审核状态显示</li>
            <li>BUG：修复发布图片选择标签失效问题</li>
            <li>优化：其他细节优化</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <CheckCircleOutlined class="complete" />
        </template>
        <a-typography-title :level="5">2025-03-23</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>前端、后端：以图搜图重构</li>
            <li>后端：线程池配置</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <QuestionCircleOutlined class="confirmed" />
        </template>
        <a-typography-title :level="5">需要重构的功能</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>团队空间</li>
            <li>空间分析</li>
            <li>协同开发</li>
            <li>AI 扩图</li>
            <li>以图搜图</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>
      <a-timeline-item>
        <template #dot>
          <QuestionCircleOutlined class="confirmed" />
        </template>
        <a-typography-title :level="5">预计添加的新功能</a-typography-title>
        <a-typography-paragraph>
          <ul>
            <li>文生图</li>
            <li>图片修复</li>
            <li>消息通知</li>
          </ul>
        </a-typography-paragraph>
      </a-timeline-item>

      <!--<a-timeline-item>-->
      <!--  <template #dot>-->
      <!--    <CloseCircleOutlined class="lose" />-->
      <!--  </template>-->
      <!--  Network problems being solved 2015-09-01-->
      <!--</a-timeline-item>-->
    </a-timeline>
  </div>
</template>

<script lang="ts" setup>
import {
  SmileOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'
import { onMounted } from 'vue'
import { searchPictureUsingPost } from '@/api/pictureController'

onMounted(()=>{
  const res = searchPictureUsingPost({
    pictureId: 1
  })
  console.log(res)
})
</script>

<style scoped>
.complete {
  font-size: 20px;
  color: green;
}

.progress {
  font-size: 20px;
  color: deepskyblue;
}

.confirmed {
  font-size: 20px;
  color: orange;
}

.lose {
  font-size: 20px;
  color: gray;
}
</style>
