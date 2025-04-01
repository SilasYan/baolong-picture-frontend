<template>
  <div id="userProfilePage" class="profile-container">
    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <a-card :loading="userInfoLoading" :bordered="false">
        <!-- 卡片头部 -->
        <template #title>
          <div class="card-header">
            <h2 class="header-title">个人资料</h2>
            <div class="action-buttons">
              <a-button type="primary" ghost @click="openEditUserInfoModal" size="small">
                <template #icon><EditOutlined /></template>
                编辑资料
              </a-button>
              <a-button type="text" @click="openEditPasswordModal" size="small">
                <template #icon><LockOutlined /></template>
                修改密码
              </a-button>
            </div>
          </div>
        </template>

        <!-- 主体内容 -->
        <div class="profile-content">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUploadAvatar"
              :custom-request="handleUploadAvatar"
              class="avatar-uploader"
            >
              <div class="avatar-wrapper">
                <a-badge :count="userInfo.vipNumber ? 'VIP' : null" :color="userInfo.vipNumber ? '#722ed1' : ''">
                  <a-avatar :size="120" :src="userAvatar" class="profile-avatar">
                    <template v-if="!userAvatar" #icon>
                      <UserOutlined />
                    </template>
                  </a-avatar>
                </a-badge>
                <div class="upload-text">
                  <span>点击上传头像</span>
                </div>
              </div>
            </a-upload>
          </div>

          <!-- 基本信息区域 -->
          <div class="info-section">
            <div class="user-name">
              <h2>{{ userInfo.userName || '未设置昵称' }}</h2>
              <span class="username">@{{ userInfo.userAccount }}</span>
            </div>

            <a-divider class="divider" />

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label"><MailOutlined /> 邮箱</span>
                <span class="info-value">{{ userInfo.userEmail || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><PhoneOutlined /> 手机</span>
                <span class="info-value">{{ userInfo.userPhone || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><CalendarOutlined /> 生日</span>
                <span class="info-value">
                  {{ userInfo.birthday ? dayjs(userInfo.birthday).format('YYYY-MM-DD') : '未设置' }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label"><ClockCircleOutlined /> 注册时间</span>
                <span class="info-value">
                  {{ dayjs(userInfo.createTime).format('YYYY-MM-DD HH:mm') }}
                </span>
              </div>
            </div>

            <!-- 个人简介 -->
            <div class="bio-section" v-if="userInfo.userProfile">
              <a-divider class="divider" />
              <div class="bio-content">
                <span class="info-label"><ProfileOutlined /> 个人简介</span>
                <p>{{ userInfo.userProfile }}</p>
              </div>
            </div>

            <!-- 会员信息 -->
            <div class="vip-section" v-if="userInfo.vipNumber">
              <a-divider class="divider" />
              <div class="vip-card">
                <div class="vip-badge">
                  <crown-two-tone two-tone-color="#fadb14" />
                  <span>VIP会员</span>
                </div>
                <div class="vip-details">
                  <p><span>会员编号:</span> {{ userInfo.vipNumber }}</p>
                  <p><span>会员类型:</span> {{ userInfo.vipSign }}</p>
                  <p><span>到期时间:</span> {{ dayjs(userInfo.vipExpireTime).format('YYYY-MM-DD') }}</p>
                </div>
              </div>
            </div>
            <div class="vip-section" v-else>
              <a-divider class="divider" />
              <div class="upgrade-card">
                <p>升级为会员享受更多特权</p>
                <a-button type="primary" @click="openExchangeVipModal" size="small">
                  <template #icon><CrownOutlined /></template>
                  立即升级
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 编辑用户信息模态框 -->
    <a-modal
      v-model:open="editUserInfoModal"
      title="编辑个人信息"
      centered
      width="600px"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-form
        layout="vertical"
        :model="editUserInfoForm"
        @finish="editUserInfoSubmit"
        class="edit-form"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" name="userAccount">
              <a-input
                v-model:value="editUserInfoForm.userAccount"
                placeholder="请输入用户名"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="昵称" name="userName">
              <a-input
                v-model:value="editUserInfoForm.userName"
                placeholder="请输入昵称"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="邮箱" name="userEmail">
          <a-input
            v-model:value="editUserInfoForm.userEmail"
            placeholder="请输入邮箱"
            size="large"
            disabled
          />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="手机号" name="userPhone">
              <a-input
                v-model:value="editUserInfoForm.userPhone"
                placeholder="请输入手机号"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="出生日期" name="birthday">
              <a-date-picker
                v-model:value="editUserInfoForm.birthday"
                style="width: 100%"
                size="large"
                placeholder="选择出生日期"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="个人简介" name="userProfile">
          <a-textarea
            v-model:value="editUserInfoForm.userProfile"
            placeholder="介绍一下自己..."
            :rows="4"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>

      <template #footer>
        <div class="modal-footer">
          <a-button @click="editUserInfoModal = false">取消</a-button>
          <a-button type="primary" @click="editUserInfoSubmit">保存更改</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 修改密码模态框 -->
    <a-modal
      v-model:open="editPasswordModal"
      title="修改密码"
      centered
      width="500px"
      :maskClosable="false"
    >
      <a-form
        layout="vertical"
        :model="editPasswordForm"
        @finish="editPasswordSubmit"
        class="password-form"
      >
        <a-form-item label="当前密码" name="originPassword">
          <a-input-password
            v-model:value="editPasswordForm.originPassword"
            placeholder="请输入当前密码"
            size="large"
          />
        </a-form-item>

        <a-form-item label="新密码" name="newPassword">
          <a-input-password
            v-model:value="editPasswordForm.newPassword"
            placeholder="请输入新密码 (至少8位)"
            size="large"
          />
        </a-form-item>

        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input-password
            v-model:value="editPasswordForm.confirmPassword"
            placeholder="请再次输入新密码"
            size="large"
          />
        </a-form-item>
      </a-form>

      <template #footer>
        <div class="modal-footer">
          <a-button @click="editPasswordModal = false">取消</a-button>
          <a-button type="primary" @click="editPasswordSubmit">确认修改</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 兑换会员模态框 -->
    <a-modal
      v-model:open="openVipModal"
      title="升级会员"
      centered
      width="450px"
      :footer="null"
      :maskClosable="false"
    >
      <div class="vip-modal-content">
        <div class="vip-header">
          <crown-two-tone two-tone-color="#fadb14" class="vip-icon" />
          <h3>会员特权</h3>
        </div>

        <div class="vip-benefits">
          <div class="benefit-item">
            <check-circle-outlined class="benefit-icon" />
            <span>专属标识与徽章</span>
          </div>
          <div class="benefit-item">
            <check-circle-outlined class="benefit-icon" />
            <span>高级功能使用权</span>
          </div>
          <div class="benefit-item">
            <check-circle-outlined class="benefit-icon" />
            <span>优先客服支持</span>
          </div>
        </div>

        <a-form layout="vertical" class="vip-form">
          <a-form-item>
            <a-input
              v-model:value="userVipForm.vipCode"
              placeholder="请输入会员兑换码"
              size="large"
              allowClear
            >
              <template #prefix>
                <gift-outlined />
              </template>
            </a-input>
          </a-form-item>
        </a-form>

        <div class="vip-actions">
          <a-button type="primary" block @click="exchangeVipSubmit" size="large">
            立即兑换
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import {
  editUserPasswordUsingPost,
  editUserUsingPost,
  getUserDetailByIdUsingGet,
  uploadAvatarUsingPost,
} from '@/api/userController'
import { imageValidator } from '@/utils'
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  CrownOutlined,
  CrownTwoTone,
  CheckCircleOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

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
  try {
    const res = await getUserDetailByIdUsingGet({
      userId: loginUserStore.loginUser.userId,
    })
    if (res.code === 0 && res.data) {
      userInfo.value = res.data
      userAvatar.value = res.data.userAvatar
    }
  } finally {
    userInfoLoading.value = false
  }
}

/**
 * 编辑信息弹出框
 */
const editUserInfoModal = ref<boolean>(false)
/**
 * 打开编辑用户信息弹出框
 */
const openEditUserInfoModal = () => {
  editUserInfoModal.value = true
  editUserInfoForm.userId = userInfo.value.userId
  editUserInfoForm.userEmail = userInfo.value.userEmail
  editUserInfoForm.userAccount = userInfo.value.userAccount
  editUserInfoForm.userName = userInfo.value.userName
  editUserInfoForm.userPhone = userInfo.value.userPhone
  editUserInfoForm.birthday = userInfo.value.birthday ? dayjs(userInfo.value.birthday) : undefined
  editUserInfoForm.userProfile = userInfo.value.userProfile
}
/**
 * 用户信息表单
 */
const editUserInfoForm = reactive<API.UserEditRequest>({})
/**
 * 提交编辑用户信息表单
 */
const editUserInfoSubmit = async () => {
  const userId = editUserInfoForm.userId
  if (!userId) {
    return
  }
  const res = await editUserUsingPost(editUserInfoForm)
  if (res.code === 0 && res.data) {
    message.success('修改成功')
    editUserInfoModal.value = false
    await fetchUserInfo()
  } else {
    message.error('修改失败, ' + res.message)
  }
}

/**
 * 密码修改弹出框
 */
const editPasswordModal = ref<boolean>(false)
/**
 * 打开密码修改弹出框
 */
const openEditPasswordModal = () => {
  editPasswordModal.value = true
  editPasswordForm.originPassword = ''
  editPasswordForm.newPassword = ''
  editPasswordForm.confirmPassword = ''
}
/**
 * 密码表单
 */
const editPasswordForm = reactive<API.UserEditPasswordRequest>({})
/**
 * 提交密码表单
 */
const editPasswordSubmit = async () => {
  if (editPasswordForm.newPassword !== editPasswordForm.confirmPassword) {
    message.error('两次输入的新密码不一致')
    return
  }
  if (editPasswordForm.newPassword.length < 8) {
    message.error('新密码长度不能少于8位')
    return
  }
  const res = await editUserPasswordUsingPost(editPasswordForm)
  if (res.code === 0 && res.data) {
    message.success('密码修改成功')
    editPasswordModal.value = false
  } else {
    message.error(res.message)
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
  userVipForm.vipCode = ''
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

<style scoped lang="less">
@primary-color: #1890ff;
@vip-color: #722ed1;
@border-color: #f0f0f0;
@text-color: rgba(0, 0, 0, 0.85);
@text-color-secondary: rgba(0, 0, 0, 0.45);

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;

  .profile-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      //padding-bottom: 16px;
      //border-bottom: 1px solid @border-color;
      flex-wrap: wrap; /* 允许在小屏幕上换行 */

      .header-title {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        flex: 1; /* 占据剩余空间 */
        min-width: 100px; /* 防止标题过小 */
      }

      .action-buttons {
        display: flex;
        gap: 8px;
        margin-top: 8px; /* 小屏幕下增加上边距 */

        /* 小屏幕下的按钮调整 */
        @media (max-width: 480px) {
          width: 100%;
          justify-content: flex-end;
        }
      }
    }

    .profile-content {
      padding: 24px;

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 24px;

        .profile-avatar {
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;

          &:hover {
            transform: scale(1.05);
          }
        }

        .avatar-upload-hint {
          margin-top: 8px;
          color: @text-color-secondary;
          font-size: 12px;
          cursor: pointer;
        }
      }

      .info-section {
        .user-name {
          text-align: center;
          margin-bottom: 16px;

          h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 500;
          }

          .username {
            color: @text-color-secondary;
            font-size: 14px;
          }
        }

        .divider {
          margin: 16px 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;

          .info-item {
            display: flex;
            flex-direction: column;

            .info-label {
              color: @text-color-secondary;
              font-size: 12px;
              margin-bottom: 4px;

              .anticon {
                margin-right: 6px;
              }
            }

            .info-value {
              font-size: 14px;
              word-break: break-word;
            }
          }
        }

        .bio-section {
          margin-top: 16px;

          .bio-content {
            p {
              margin: 8px 0 0;
              color: @text-color;
              line-height: 1.6;
            }
          }
        }

        .vip-section {
          .vip-card {
            background: linear-gradient(135deg, #f9f0ff 0%, #e6f7ff 100%);
            border-radius: 8px;
            padding: 16px;
            border-left: 3px solid @vip-color;

            .vip-badge {
              display: flex;
              align-items: center;
              margin-bottom: 8px;

              .anticon {
                font-size: 18px;
                margin-right: 8px;
              }

              span {
                font-weight: 500;
                color: @vip-color;
              }
            }

            .vip-details {
              p {
                margin: 4px 0;
                font-size: 13px;

                span {
                  color: @text-color-secondary;
                  margin-right: 8px;
                }
              }
            }
          }

          .upgrade-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            background-color: #fafafa;
            border-radius: 8px;

            p {
              margin-bottom: 12px;
              color: @text-color-secondary;
            }
          }
        }
      }
    }
  }



  .avatar-uploader {
    display: flex;
    justify-content: center;
    width: 100%;

    .avatar-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .profile-avatar {
        border: 3px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;

        &:hover {
          transform: scale(1.05);
        }
      }

      .upload-text {
        color: @text-color-secondary;
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .vip-modal-content {
      .vip-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;

        .vip-icon {
          font-size: 24px;
          margin-right: 8px;
        }

        h3 {
          margin: 0;
          font-size: 18px;
        }
      }

      .vip-benefits {
        margin-bottom: 24px;

        .benefit-item {
          display: flex;
          align-items: center;
          padding: 8px 0;

          .benefit-icon {
            color: #52c41a;
            margin-right: 8px;
          }
        }
      }

      .vip-actions {
        margin-top: 24px;
      }
    }
  }


  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .vip-modal-content {
    .vip-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;

      .vip-icon {
        font-size: 24px;
        margin-right: 8px;
      }

      h3 {
        margin: 0;
        font-size: 18px;
      }
    }

    .vip-benefits {
      margin-bottom: 24px;

      .benefit-item {
        display: flex;
        align-items: center;
        padding: 8px 0;

        .benefit-icon {
          color: #52c41a;
          margin-right: 8px;
        }
      }
    }

    .vip-actions {
      margin-top: 24px;
    }
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 12px;

    .profile-card {
      .profile-content {
        padding: 16px;

        .info-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>
