<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo" @click="$router.push('/dashboard')">
        <div class="logo-icon"><el-icon :size="28"><FirstAidKit /></el-icon></div>
        <span v-show="!isCollapse" class="logo-text">MediCare</span>
      </div>
      <el-menu :default-active="currentRoute" :collapse="isCollapse" router class="side-menu">
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
      <div class="sidebar-footer" v-show="!isCollapse">
        <div class="version-info">v2.0 · 创新版</div>
      </div>
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse" :size="22">
            <Fold v-if="!isCollapse" /><Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 小海豚 -->
        <div class="dolphin-area">
          <div class="dolphin-wrap">
            <svg class="dolphin" viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg">
              <!-- 渐变 -->
              <defs>
                <linearGradient id="dolBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#74b9ff"/>
                  <stop offset="40%" stop-color="#5ba4e6"/>
                  <stop offset="100%" stop-color="#4895d4"/>
                </linearGradient>
              </defs>
              <!-- 尾鳍 — 上下摆动 -->
              <g class="tail-fin">
                <path class="tail-upper" d="M18 30 Q8 12 2 16 Q4 24 14 32 Z" fill="#4a9fd4" stroke="#3a8ac0" stroke-width="0.3"/>
                <path class="tail-lower" d="M18 46 Q8 64 2 60 Q4 52 14 44 Z" fill="#4a9fd4" stroke="#3a8ac0" stroke-width="0.3"/>
              </g>
              <!-- 身体 -->
              <ellipse cx="60" cy="38" rx="44" ry="18" fill="url(#dolBody)"/>
              <!-- 头部 -->
              <ellipse cx="96" cy="33" rx="18" ry="14" fill="url(#dolBody)"/>
              <!-- 吻部 -->
              <path d="M108 28 Q122 30 118 36 Q122 33 108 38 Z" fill="url(#dolBody)"/>
              <!-- 腹部浅色 -->
              <ellipse cx="64" cy="44" rx="34" ry="8" fill="rgba(255,255,255,0.25)"/>
              <!-- 背鳍 — 微摆 -->
              <g class="dorsal-fin">
                <path d="M54 20 Q48 2 60 6 Q54 4 52 8 Q58 6 66 20 Z" fill="#4a9fd4" stroke="#3a8ac0" stroke-width="0.3"/>
              </g>
              <!-- 胸鳍 — 划水 -->
              <g class="pectoral-fin">
                <path d="M70 42 Q66 54 76 52 Q74 48 78 44 Z" fill="#4a9fd4" stroke="#3a8ac0" stroke-width="0.3"/>
              </g>
              <!-- 眼睛 -->
              <ellipse cx="104" cy="30" rx="4" ry="4.5" fill="white"/>
              <ellipse cx="105" cy="30" rx="2.3" ry="2.8" fill="#1a1a2e"/>
              <circle cx="106" cy="28.5" r="1" fill="white"/>
              <!-- 微笑 -->
              <path d="M108 36 Q112 41 116 36" fill="none" stroke="#3a8ac0" stroke-width="1" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="bubble b1"></span>
          <span class="bubble b2"></span>
          <span class="bubble b3"></span>
        </div>

        <div class="header-right">
          <!-- 通知中心 -->
          <el-popover placement="bottom" :width="360" trigger="click">
            <template #reference>
              <el-badge :value="unreadCount" :hidden="unreadCount===0" class="notify-badge">
                <el-button circle>
                  <el-icon :size="18"><Bell /></el-icon>
                </el-button>
              </el-badge>
            </template>
            <div class="notify-panel">
              <div class="notify-panel-header">
                <b>消息通知</b>
                <el-button text size="small" type="primary" @click="markAllRead">全部已读</el-button>
              </div>
              <div class="notify-list">
                <div v-for="n in notifications" :key="n.id" class="notify-item" :class="{ unread: !n.read }" @click="readNotify(n)">
                  <div class="notify-icon" :style="{ background: n.color }">
                    <el-icon :size="16"><component :is="n.icon" /></el-icon>
                  </div>
                  <div class="notify-body">
                    <div class="notify-title">{{ n.title }}</div>
                    <div class="notify-desc">{{ n.desc }}</div>
                    <div class="notify-time">{{ n.time }}</div>
                  </div>
                  <div v-if="!n.read" class="notify-dot"></div>
                </div>
              </div>
            </div>
          </el-popover>

          <!-- 用户下拉 -->
          <el-dropdown trigger="click">
            <div class="user-avatar">
              <img :src="userAvatar" class="avatar-img" />
              <span class="user-name">{{ userStore.currentUser?.realName || '未登录' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div style="display:flex;align-items:center;gap:8px;padding:4px 0">
                    <img :src="userAvatar" style="width:36px;height:36px;border-radius:50%" />
                    <div>
                      <div style="font-weight:bold">{{ userStore.currentUser?.realName }}</div>
                      <div style="font-size:12px;color:#909399">{{ roleText }}</div>
                    </div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided @click="$router.push('/settings')">
                  <el-icon><Setting /></el-icon> 系统设置
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'
import { avatarUrl } from '../../utils/avatar'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

const currentRoute = computed(() => '/' + route.path.split('/').filter(Boolean).slice(0, 2).join('/'))
const currentTitle = computed(() => allMenuItems.find(m => currentRoute.value.startsWith(m.path))?.title || '')

const roleMap: Record<string, string> = { admin: '管理员', doctor: '医生', pharmacist: '药剂师' }
const roleText = computed(() => roleMap[userStore.currentUser?.role || ''] || '')

// 头像
const userAvatar = computed(() => {
  const name = userStore.currentUser?.realName || userStore.currentUser?.username || 'User'
  return avatarUrl(name, 80)
})

// ===== 通知系统 =====
const notifications = reactive([
  { id: 1, read: false, icon: 'WarningFilled', color: '#f56c6c', title: '库存预警', desc: '感冒清热颗粒库存仅剩8，低于安全线20', time: '10分钟前' },
  { id: 2, read: false, icon: 'Calendar', color: '#409eff', title: '今日挂号汇总', desc: '已挂号8人，候诊3人，完成5人', time: '30分钟前' },
  { id: 3, read: false, icon: 'Document', color: '#67c23a', title: '处方已开立', desc: '测试患者的处方#3已成功开立 ¥43.00', time: '1小时前' },
  { id: 4, read: true, icon: 'User', color: '#909399', title: '新用户注册', desc: 'doctor1 首次登录系统', time: '2小时前' },
  { id: 5, read: true, icon: 'Check', color: '#67c23a', title: '系统自检完成', desc: '所有模块运行正常，数据库连接正常', time: '3小时前' },
  { id: 6, read: true, icon: 'InfoFilled', color: '#e6a23c', title: '有效期提醒', desc: '2种药品将在30天内过期，请及时处理', time: '昨天' },
])

const unreadCount = computed(() => notifications.filter(n => !n.read).length)

function readNotify(n: any) {
  n.read = true
  if (n.id === 1) router.push('/pharmacy')
  else if (n.id === 2) router.push('/registration')
  else if (n.id === 3) router.push('/prescriptions')
}
function markAllRead() {
  notifications.forEach(n => n.read = true)
  ElMessage.success('全部已读')
}

const allMenuItems = [
  { path: '/dashboard', title: '首页', icon: 'HomeFilled', roles: ['admin', 'doctor', 'pharmacist'] },
  { path: '/patients', title: '患者管理', icon: 'User', roles: ['admin', 'doctor'] },
  { path: '/basic-data', title: '基础数据', icon: 'Folder', roles: ['admin', 'doctor'] },
  { path: '/registration', title: '挂号预约', icon: 'Calendar', roles: ['admin'] },
  { path: '/workstation', title: '医生工作站', icon: 'Stethoscope', roles: ['admin', 'doctor'] },
  { path: '/medical-records', title: '病历管理', icon: 'Document', roles: ['admin', 'doctor'] },
  { path: '/pharmacy', title: '药品库存', icon: 'FirstAidKit', roles: ['admin', 'doctor', 'pharmacist'] },
  { path: '/prescriptions', title: '处方管理', icon: 'Notebook', roles: ['admin', 'doctor', 'pharmacist'] },
  { path: '/settings', title: '系统设置', icon: 'Setting', roles: ['admin', 'doctor', 'pharmacist'] },
]

const menuItems = computed(() => {
  const role = userStore.currentUser?.role || ''
  return allMenuItems.filter((item) => item.roles.includes(role))
})

function handleLogout() {
  userStore.clearUser()
  router.push('/login')
}
</script>

<style scoped>
.main-layout { height: 100vh; }
.sidebar {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  transition: width 0.3s; overflow: hidden; position: relative;
}
.logo { height: 64px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.08); }
.logo-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; color: #fff; }
.logo-text { font-size: 20px; font-weight: bold; color: #fff; white-space: nowrap; letter-spacing: 1px; }
.side-menu { border-right: none; background: transparent; }
.side-menu :deep(.el-menu-item) { color: rgba(255,255,255,0.65); margin: 4px 8px; border-radius: 8px; transition: all 0.3s; }
.side-menu :deep(.el-menu-item:hover) { color: #fff; background: rgba(255,255,255,0.08); }
.side-menu :deep(.el-menu-item.is-active) { color: #fff; background: linear-gradient(135deg, #667eea, #764ba2); }
.sidebar-footer { position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; }
.version-info { color: rgba(255,255,255,0.3); font-size: 12px; }

.header {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(26,26,46,0.55); backdrop-filter: blur(16px);
  padding: 0 20px; height: 56px; z-index: 10;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: relative; overflow: hidden;
}
.header-left .collapse-btn { color: rgba(255,255,255,0.7) !important; }
.header-left .collapse-btn:hover { color: #fff !important; }
.header .el-breadcrumb :deep(.el-breadcrumb__inner) { color: rgba(255,255,255,0.7); }
.header .el-breadcrumb :deep(.el-breadcrumb__inner:hover) { color: #fff; }
.user-name { color: rgba(255,255,255,0.85) !important; }
.header-left { display: flex; align-items: center; gap: 16px; }
.collapse-btn { cursor: pointer; color: #606266; transition: color 0.3s; }
.collapse-btn:hover { color: #409eff; }

/* 小海豚 */
.dolphin-area { flex: 1; height: 100%; position: relative; overflow: hidden; }

/* 外层：匀速水平游动 + 转身 */
.dolphin-wrap {
  position: absolute; top: 0; left: 0; width: 100px; height: 100%;
  animation: dolphinCruise 24s linear infinite;
  z-index: 2;
}
/* 内层：正弦上下浮动 + 微转 */
.dolphin {
  position: absolute; top: 50%; width: 100px; height: 50px; margin-top: -25px;
  animation: dolphinBob 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 10px rgba(74,159,212,0.45));
}

/* 水平游动 — 导航栏内从左到右、从右到左匀速往复 */
@keyframes dolphinCruise {
  0%    { left: 0;                       transform: scaleX(1); }
  48%   { left: calc(100% - 100px);      transform: scaleX(1); }
  52%   { left: calc(100% - 100px);      transform: scaleX(-1); }
  98%   { left: 0;                       transform: scaleX(-1); }
  100%  { left: 0;                       transform: scaleX(1); }
}

/* 上下摆动 — 正弦波，模拟海豚游动时的起伏 */
@keyframes dolphinBob {
  0%   { margin-top: -25px; transform: rotate(-2deg); }
  25%  { margin-top: -30px; transform: rotate(0deg); }
  50%  { margin-top: -25px; transform: rotate(2deg); }
  75%  { margin-top: -20px; transform: rotate(0deg); }
  100% { margin-top: -25px; transform: rotate(-2deg); }
}

/* === 海豚身体各部位独立动画 === */
/* 尾鳍摆动 */
.tail-fin {
  transform-origin: 18px 38px;
  animation: tailWag 1s ease-in-out infinite;
}
@keyframes tailWag {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-12deg); }
  75%  { transform: rotate(12deg); }
  100% { transform: rotate(0deg); }
}

/* 背鳍微摇 */
.dorsal-fin {
  transform-origin: 56px 14px;
  animation: dorsalWiggle 1.3s ease-in-out infinite;
}
@keyframes dorsalWiggle {
  0%   { transform: rotate(0deg); }
  30%  { transform: rotate(-5deg); }
  70%  { transform: rotate(4deg); }
  100% { transform: rotate(0deg); }
}

/* 胸鳍划水 */
.pectoral-fin {
  transform-origin: 70px 42px;
  animation: pectoralFlap 0.9s ease-in-out infinite;
}
@keyframes pectoralFlap {
  0%   { transform: rotate(0deg); }
  40%  { transform: rotate(-14deg); }
  80%  { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
}

/* 水花泡泡 */
.bubble {
  position: absolute; opacity: 0; z-index: 1;
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(126,200,227,0.45); border: 1px solid rgba(255,255,255,0.35);
  animation: bubblePop 2.5s ease-out infinite;
}
.b1 { top: 44%; left: 30%; animation-delay: 0s; }
.b2 { top: 50%; left: 55%; animation-delay: 0.8s; }
.b3 { top: 46%; left: 75%; animation-delay: 1.6s; }
@keyframes bubblePop {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.3); }
  25%  { opacity: 0.6; }
  100% { opacity: 0; transform: translate(5px, -26px) scale(1.1); }
}

.header-right { display: flex; align-items: center; gap: 20px; }
.notify-badge { cursor: pointer; }
.notify-badge :deep(.el-badge__content) { border: none; }

/* 通知面板 */
.notify-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
.notify-list { max-height: 350px; overflow-y: auto; }
.notify-item {
  display: flex; gap: 10px; padding: 10px 8px; border-radius: 8px; cursor: pointer; transition: background 0.2s; position: relative;
}
.notify-item:hover { background: #f5f7fa; }
.notify-item.unread { background: #f0f5ff; }
.notify-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.notify-body { flex: 1; min-width: 0; }
.notify-title { font-weight: 500; font-size: 14px; }
.notify-desc { font-size: 12px; color: #909399; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.notify-time { font-size: 11px; color: #c0c4cc; margin-top: 2px; }
.notify-dot { width: 8px; height: 8px; border-radius: 50%; background: #409eff; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); }

.user-avatar { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background 0.3s; }
.user-avatar:hover { background: #f5f7fa; }
.avatar-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.user-name { font-size: 14px; color: #303133; }
.content { background: transparent; overflow-y: auto; padding: 20px; }
</style>
