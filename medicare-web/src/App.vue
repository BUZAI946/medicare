<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleKeydown(e: KeyboardEvent) {
  const ctrl = e.ctrlKey || e.metaKey
  if (ctrl && e.key === 'd') { e.preventDefault(); router.push('/dashboard') }
  if (ctrl && e.key === 'k') { e.preventDefault(); }
  if (e.key === 'Escape') { }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // 初始化主题渐变变量
  if (!document.documentElement.style.getPropertyValue('--g1')) {
    document.documentElement.style.setProperty('--g1', '#ff4757')
    document.documentElement.style.setProperty('--g2', '#7c3aed')
    document.documentElement.style.setProperty('--g3', '#3b82f6')
    document.documentElement.style.setProperty('--g4', '#8b5cf6')
    document.documentElement.style.setProperty('--g5', '#ef4444')
  }
})
onUnmounted(() => { document.removeEventListener('keydown', handleKeydown) })
</script>

<style>
:root {
  --g1: #ff4757;
  --g2: #7c3aed;
  --g3: #3b82f6;
  --g4: #8b5cf6;
  --g5: #ef4444;
}

html, body, #app {
  margin: 0; padding: 0; height: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}

/* 全局动态渐变背景 — CSS变量控制配色，30s缓慢流动 */
body {
  background: linear-gradient(270deg, var(--g1), var(--g2), var(--g3), var(--g4), var(--g5));
  background-size: 600% 600%;
  animation: gradientShift 30s ease infinite;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 0%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 100%; }
  100% { background-position: 0% 50%; }
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c0c4cc; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #909399; }
.fade-slide-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.fade-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(16px) scale(0.96); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px) scale(0.98); }

<<<<<<< HEAD
/* 卡片 — 玻璃质感 */
.el-card {
  border-radius: 14px !important;
  background: rgba(255,255,255,0.78) !important;
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(255,255,255,0.6) !important;
  transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; overflow: hidden;
}
.el-card::after {
  content: ''; position: absolute; inset: 0; border-radius: 14px; pointer-events: none;
  background: linear-gradient(135deg, rgba(102,126,234,0.04) 0%, rgba(118,75,162,0.02) 100%);
  opacity: 0; transition: opacity 0.35s;
}
.el-card:hover {
  transform: translateY(-4px) scale(1.008);
  box-shadow: 0 12px 32px rgba(102,126,234,0.12), 0 4px 10px rgba(0,0,0,0.06);
}
.el-card:hover::after { opacity: 1; }
=======
/* 卡片 */
.el-card {
  border-radius: 10px !important; background: rgba(255,255,255,0.75) !important;
  backdrop-filter: blur(10px); transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.el-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
>>>>>>> a1ddc93abd8e47462da248ece3db69498a648e13

/* 按钮点击反馈 */
.el-button { border-radius: 8px !important; transition: all 0.2s ease; position: relative; overflow: hidden; }
.el-button:active { transform: scale(0.95) !important; }
.el-button::after {
  content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.2);
  opacity: 0; transition: opacity 0.2s;
}
.el-button:active::after { opacity: 1; }

/* 表格行反馈 */
.el-table tbody tr { transition: background 0.15s ease, transform 0.15s ease; }
.el-table tbody tr:active { transform: scale(0.99); background: rgba(64,158,255,0.08); }
.el-table__body tr:hover > td { background: rgba(64,158,255,0.04) !important; }

/* 输入框聚焦 */
.el-input .el-input__wrapper {
  border-radius: 8px !important; background: rgba(255,255,255,0.7) !important;
  transition: all 0.3s ease;
}
.el-input .el-input__wrapper:focus-within { transform: translateY(-1px); }

/* 菜单项 */
.el-menu-item { transition: all 0.25s ease; }

/* 标签 */
.el-tag { border-radius: 6px !important; transition: transform 0.15s ease; cursor: default; }
.el-tag:hover { transform: scale(1.05); }
.el-select .el-select__wrapper { border-radius: 8px !important; transition: all 0.3s ease; }
.el-table { border-radius: 8px; overflow: hidden; }
.el-table .el-table__header-wrapper { background: rgba(255,255,255,0.5); }
.el-dialog { border-radius: 14px !important; animation: dialogIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes dialogIn { from { opacity:0; transform:scale(0.9) translateY(-20px); } to { opacity:1; transform:scale(1) translateY(0); } }
.el-message {
  border-radius: 10px !important;
  animation: msgSlide 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes msgSlide { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }

/* 统计卡片点击 */
.stat-card:active { transform: scale(0.96) !important; }

/* 图片 */
.hero-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; transition: transform 0.3s, box-shadow 0.3s; }
.hero-img:hover { transform: scale(1.04); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }

/* 页面内容整体进入动画 */
.el-main > div { animation: contentFadeIn 0.4s ease; }
@keyframes contentFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
<<<<<<< HEAD

/* ===== 暗色模式 ===== */
.dark-mode body, .dark-mode #app { background: #0d1117 !important; }
.dark-mode .el-card { background: rgba(30,35,45,0.85) !important; border-color: rgba(255,255,255,0.06) !important; }
.dark-mode .el-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important; }
.dark-mode .el-table { --el-table-bg-color: rgba(30,35,45,0.7); --el-table-tr-bg-color: rgba(30,35,45,0.7); }
.dark-mode .el-table th.el-table__cell { background: rgba(20,24,30,0.8) !important; color: rgba(255,255,255,0.7) !important; }
.dark-mode .el-table td.el-table__cell { color: rgba(255,255,255,0.75) !important; }
.dark-mode .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell { background: rgba(40,46,55,0.5) !important; }
.dark-mode .el-input__wrapper { background: rgba(255,255,255,0.06) !important; box-shadow: 0 0 0 1px rgba(255,255,255,0.1) !important; }
.dark-mode .el-input__inner { color: rgba(255,255,255,0.85) !important; }
.dark-mode .el-select .el-input__wrapper { background: rgba(255,255,255,0.06) !important; }
.dark-mode .el-dialog { background: #1a1d24 !important; }
.dark-mode .el-pagination button, .dark-mode .el-pager li { background: rgba(30,35,45,0.7) !important; color: rgba(255,255,255,0.7) !important; }
.dark-mode .el-tag { border-color: transparent !important; }
.dark-mode .page-hero { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.dark-mode .header { background: rgba(13,17,23,0.8) !important; border-bottom-color: rgba(255,255,255,0.06) !important; }
.dark-mode .sidebar { background: linear-gradient(180deg, #0d1117 0%, #111820 50%, #0f1923 100%) !important; }
=======
>>>>>>> a1ddc93abd8e47462da248ece3db69498a648e13
</style>
