import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/picture/PicturePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import AddEditPicturePage from '@/pages/picture/AddEditPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/picture/PictureDetailPage.vue'
import CategoryManagePage from '@/pages/admin/CategoryManagePage.vue'
import GrabPicturePage from '@/pages/picture/GrabPicturePage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import SpacePage from '@/pages/space/SpacePage.vue'
// import SpaceAnalyzePage from '@/pages/SpaceAnalyzePage.vue'
// import SpaceUserManagePage from '@/pages/admin/SpaceUserManagePage.vue'
import UserProfilePage from '@/pages/user/UserProfilePage.vue'
import PersonSpacePage from '@/pages/space/PersonSpacePage.vue'
import PictureReleaseListPage from '@/pages/picture/PictureReleaseListPage.vue'
import ScheduledTaskManagePage from '@/pages/admin/ScheduledTaskManagePage.vue'
import MenuManagePage from '@/pages/admin/MenuManagePage.vue'
import TimelinePage from '@/pages/TimelinePage.vue'
import SearchPicturePage from '@/pages/picture/SearchPicturePage.vue'
import ExpandPicturePage from '@/pages/picture/ExpandPicturePage.vue'
import FeedbackPage from '@/pages/FeedbackPage.vue'
import BatchPictureUpload from '@/pages/picture/BatchPictureUpload.vue'
import TeamSpacePage from '@/pages/space/TeamSpacePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/user/profile',
      name: '用户信息',
      component: UserProfilePage,
    },
    {
      path: '/timeline',
      name: '项目时序',
      component: TimelinePage,
    },
    {
      path: '/feedback',
      name: '建议反馈',
      component: FeedbackPage,
    },
    // 图片页面
    {
      path: '/picture/addEdit',
      name: '上传图片',
      component: AddEditPicturePage,
    },
    {
      path: '/picture/list',
      name: '发布列表',
      component: PictureReleaseListPage,
    },
    {
      path: '/picture/detail/:pictureId',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/picture/grab',
      name: '爬取图片',
      component: GrabPicturePage,
    },
    {
      path: '/picture/search',
      name: '以图搜图',
      component: SearchPicturePage,
    },
    {
      path: '/picture/expand',
      name: 'AI 扩图',
      component: ExpandPicturePage,
    },
    {
      path: '/picture/batch',
      name: '批量上传',
      component: BatchPictureUpload,
    },
    // 空间页面
    {
      path: '/space',
      name: '空间',
      component: SpacePage,
    },
    {
      path: '/space/person',
      name: '个人空间',
      component: PersonSpacePage,
    },
    {
      path: '/space/team/:spaceId',
      name: '团队空间',
      component: TeamSpacePage,
      props: true,
    },
    // 管理页面
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/admin/categoryManage',
      name: '分类管理',
      component: CategoryManagePage,
    },
    {
      path: '/admin/menuManage',
      name: '菜单管理',
      component: MenuManagePage,
    },
    {
      path: '/admin/scheduledTask',
      name: '定时任务',
      component: ScheduledTaskManagePage,
    },
    // {
    //   path: '/space/:id',
    //   name: '空间详情',
    //   component: SpaceDetailPage,
    //   props: true,
    // },
    // {
    //   path: '/search_picture',
    //   name: '图片搜索',
    //   component: SearchPicturePage,
    // },
    // {
    //   path: '/space_analyze',
    //   name: '空间分析',
    //   component: SpaceAnalyzePage,
    // },
    // {
    //   path: '/spaceUserManage/:id',
    //   name: '空间成员管理',
    //   component: SpaceUserManagePage,
    //   props: true,
    // },
  ],
})

export default router
