<template>
  <div class="login-container">
    <!-- 背景动态水波+泡泡 -->
    <div class="login-bg">
      <div v-for="p in particles" :key="p.id" class="bg-particle" :style="p.style"></div>
      <div v-for="b in bubbles" :key="b.id" class="bg-bubble" :style="b.style"></div>
      <div class="bg-wave"></div>
      <div class="bg-wave bg-wave-2"></div>
    </div>

    <!-- 卡片主体，:key 保证每次进入重播动画 -->
    <div class="login-wrapper" :key="'wrap-' + visitKey">
      <!-- 四块碎片从屏幕四角飞入拼成卡片 -->
      <div class="card-piece piece-tl"></div>
      <div class="card-piece piece-tr"></div>
      <div class="card-piece piece-bl"></div>
      <div class="card-piece piece-br"></div>

      <!-- 左侧品牌 -->
      <div class="login-brand">
        <div class="fly-in-l" style="--d:0.75s">
          <div class="brand-icon">
            <el-icon :size="64"><FirstAidKit /></el-icon>
          </div>
        </div>
        <h1 class="brand-title fly-in-l" style="--d:0.79s">MediCare</h1>
        <p class="brand-sub fly-in-l" style="--d:0.82s">智慧医疗门诊管理系统</p>
        <div class="brand-features">
          <div class="feature-item fly-in-bl" style="--d:0.85s">
            <el-icon :size="18"><Calendar /></el-icon>
            <span>预约挂号 · 在线分诊</span>
          </div>
          <div class="feature-item fly-in-bl" style="--d:0.88s">
            <el-icon :size="18"><Document /></el-icon>
            <span>电子病历 · 诊疗记录</span>
          </div>
          <div class="feature-item fly-in-bl" style="--d:0.91s">
            <el-icon :size="18"><FirstAidKit /></el-icon>
            <span>药房管理 · 处方开立</span>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-wrap">
        <div class="form-header">
          <h2 class="shimmer-title fly-in-r" style="--d:0.77s">欢迎回来</h2>
          <p class="shimmer-text fly-in-r" style="--d:0.80s">请登录您的账号</p>
        </div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="0" class="login-form" autocomplete="off" @submit.prevent="handleLogin">
          <!-- 骗浏览器的隐藏字段，阻止自动填充 -->
          <input type="text" style="display:none" autocomplete="off" />
          <input type="password" style="display:none" autocomplete="off" />
          <div class="fly-in-br" style="--d:0.83s">
            <el-form-item prop="username" class="input-wrapper">
              <div class="liquid-input" :class="{ focused: usernameFocused, filled: form.username }">
                <div class="liquid-glow"></div>
                <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  size="large"
                  :prefix-icon="User"
                  autocomplete="off"
                  class="custom-input"
                  @focus="usernameFocused = true"
                  @blur="usernameFocused = false"
                  @input="validateField('username')"
                />
              </div>
              <div v-if="usernameError" class="input-feedback">{{ usernameError }}</div>
              <div v-else-if="form.username && usernameValid" class="input-feedback valid">
                <el-icon><CircleCheckFilled /></el-icon> 用户名正确
              </div>
            </el-form-item>
          </div>

          <div class="fly-in-br" style="--d:0.87s">
            <el-form-item prop="password" class="input-wrapper">
              <div class="liquid-input" :class="{ focused: passwordFocused, filled: form.password }">
                <div class="liquid-glow"></div>
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                  :prefix-icon="Lock"
                  autocomplete="new-password"
                  show-password
                  class="custom-input"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                  @input="validateField('password')"
                  @keyup.enter="handleLogin"
                />
              </div>
              <div v-if="passwordError" class="input-feedback">{{ passwordError }}</div>
              <div v-else-if="form.password && passwordValid" class="input-feedback valid">
                <el-icon><CircleCheckFilled /></el-icon> 密码有效
              </div>
            </el-form-item>
          </div>

          <div class="fly-in-br" style="--d:0.91s">
            <el-form-item>
              <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 欢迎画面 -->
    <transition name="welcome">
      <div v-if="welcomeVisible" class="welcome-overlay">
        <div class="welcome-card">
          <div class="welcome-icon">🏥</div>
          <div class="welcome-title">欢迎回来</div>
          <div class="welcome-name">{{ welcomeName }}</div>
          <div class="welcome-sub">正在进入系统…</div>
          <div class="welcome-bar"><div class="welcome-bar-fill"></div></div>
        </div>
        <div class="welcome-sparkles">
          <span v-for="i in 12" :key="i" class="wsparkle" :style="sparkStyle(i)"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Calendar, Document, FirstAidKit } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { login } from '../../api/auth'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 每次进入 +1，重播动画
const visitKey = ref(0)
onMounted(() => { visitKey.value++ })

// === 泡泡一次性生成 ===
function seededRandom(seed: number) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}
const particles = Array.from({ length: 20 }, (_, i) => {
  const r = seededRandom(i * 7 + 13)
  const size = r() * 6 + 3
  return {
    id: `p${i}`,
    style: { width: size+'px', height: size+'px', left: r()*100+'%', top: r()*100+'%', animationDelay: r()*8+'s', animationDuration: (r()*5+5)+'s' },
  }
})
const bubbles = Array.from({ length: 25 }, (_, i) => {
  const r = seededRandom(i * 31 + 77)
  const hue = (i * 37 + 200) % 360
  const size = r() * 18 + 8
  return {
    id: `b${i}`,
    style: { width: size+'px', height: size+'px', left: r()*100+'%', top: r()*100+'%', animationDelay: r()*10+'s', animationDuration: (r()*6+6)+'s', opacity: r()*0.5+0.3, backgroundColor: `hsla(${hue},70%,75%,0.3)` },
  }
})

// === 表单 ===
const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 2, message: '用户名至少2位', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 3, message: '密码至少3位', trigger: 'blur' }],
}
const usernameFocused = ref(false)
const passwordFocused = ref(false)
const usernameError = ref('')
const passwordError = ref('')
const usernameValid = ref(false)
const passwordValid = ref(false)

function validateField(field: string) {
  if (field === 'username') {
    if (!form.username) { usernameError.value = '请输入用户名'; usernameValid.value = false }
    else if (form.username.length < 2) { usernameError.value = '用户名至少2位'; usernameValid.value = false }
    else { usernameError.value = ''; usernameValid.value = true }
  } else {
    if (!form.password) { passwordError.value = '请输入密码'; passwordValid.value = false }
    else if (form.password.length < 3) { passwordError.value = '密码至少3位'; passwordValid.value = false }
    else { passwordError.value = ''; passwordValid.value = true }
  }
}

const welcomeVisible = ref(false)
const welcomeName = ref('')

function sparkStyle(i: number) {
  const angle = (i / 12) * 360
  return {
    '--angle': angle + 'deg',
    animationDelay: (i * 0.06) + 's',
  }
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await login(form)
    const user = res.data
    userStore.setUser(user)
    welcomeName.value = user.realName || user.username || '用户'
    loading.value = false
    welcomeVisible.value = true
    setTimeout(() => {
      welcomeVisible.value = false
      router.push('/')
    }, 1800)
  } catch (e: any) {
    ElMessage.error(e?.message || e?.response?.data?.message || '用户名或密码错误')
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex; justify-content: center; align-items: center;
  height: 100vh; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #1a1a2e 60%, #16213e 100%);
}

/* ===== 背景 ===== */
.login-bg { position: absolute; inset: 0; overflow: hidden; }
.bg-particle { position: absolute; background: rgba(255,255,255,0.12); border-radius: 50%; animation: floatUp linear infinite; }
@keyframes floatUp {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  20% { opacity: 1; } 80% { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
}
.bg-bubble {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 0 8px rgba(255,255,255,0.15);
  animation: bubbleFloat linear infinite;
}
@keyframes bubbleFloat {
  0% { transform: translateY(105vh) translateX(0) scale(0); opacity: 0; }
  10% { opacity: 1; } 80% { opacity: 1; }
  100% { transform: translateY(-15vh) translateX(30px) scale(1); opacity: 0; }
}
.bg-wave {
  position: absolute; bottom: -50%; left: -10%; right: -10%;
  height: 200%; border-radius: 40%;
  background: linear-gradient(180deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.12) 40%, rgba(102,126,234,0.06) 70%, transparent 100%);
  animation: waveMove 12s linear infinite;
}
.bg-wave-2 { animation-duration: 18s; animation-direction: reverse; opacity: 0.5; }
@keyframes waveMove { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* ===== 卡片主体 ===== */
.login-wrapper {
  display: flex; position: relative; z-index: 1;
  width: 920px; min-height: 540px;
  background: rgba(255,255,255,0.03); border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
  overflow: hidden; backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.12);
}

/* ===== 卡片碎片汇聚 + 内容归位 ===== */

/* 卡片本体 — 碎片拼合时同步浮现 */
.login-wrapper {
  animation: cardRise 1.3s 0.05s cubic-bezier(0.25,0.46,0.45,0.94) both;
}
@keyframes cardRise {
  0%   { opacity: 0; transform: scale(0.88); }
  60%  { opacity: 0.6; }
  100% { opacity: 1; transform: scale(1); }
}

/* 四块碎片 — 慢速从屏幕外飞入聚拢，到位后消融 */
.card-piece {
  position: absolute; z-index: 10; pointer-events: none;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255,255,255,0.2);
  animation: pieceGather 1.2s cubic-bezier(0.25,0.46,0.45,0.94) both;
}
.piece-tl {
  top: 0; left: 0; width: 50%; height: 50%;
  border-radius: 24px 0 0 0; border-right: none; border-bottom: none;
  --px: -25vw; --py: -20vh; animation-delay: 0s;
}
.piece-tr {
  top: 0; right: 0; width: 50%; height: 50%;
  border-radius: 0 24px 0 0; border-left: none; border-bottom: none;
  --px: 25vw; --py: -20vh; animation-delay: 0.06s;
}
.piece-bl {
  bottom: 0; left: 0; width: 50%; height: 50%;
  border-radius: 0 0 0 24px; border-right: none; border-top: none;
  --px: -25vw; --py: 20vh; animation-delay: 0.12s;
}
.piece-br {
  bottom: 0; right: 0; width: 50%; height: 50%;
  border-radius: 0 0 24px 0; border-left: none; border-top: none;
  --px: 25vw; --py: 20vh; animation-delay: 0.18s;
}
@keyframes pieceGather {
  0%   { transform: translate3d(var(--px), var(--py), 0) scale(0.3); opacity: 0; }
  30%  { opacity: 0.9; }
  70%  { opacity: 0.9; }
  100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
}

/* 内容 — 碎片到位后渐显 */
.login-brand, .login-form-wrap {
  animation: contentFade 0.5s 0.7s ease-out both;
}
@keyframes contentFade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* 元素归位 — 从屏幕四角飞来，弹簧落地 */
.fly-in-l  { --sx: -18vw; --sy: -14vh; }
.fly-in-r  { --sx: 18vw;  --sy: -14vh; }
.fly-in-bl { --sx: -18vw; --sy: 14vh;  }
.fly-in-br { --sx: 18vw;  --sy: 14vh;  }
.fly-in-l, .fly-in-r, .fly-in-bl, .fly-in-br {
  animation: elementLand 0.9s var(--d, 0s) cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes elementLand {
  0%   { opacity: 0; transform: translate3d(var(--sx), var(--sy), 0) scale(0.45); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}

/* ===== 左侧品牌 ===== */
.login-brand {
  width: 400px; padding: 60px 40px; color: #fff; text-align: center;
  background: linear-gradient(160deg, rgba(102,126,234,0.35) 0%, rgba(118,75,162,0.35) 100%);
  backdrop-filter: blur(8px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.brand-icon {
  margin-bottom: 16px; opacity: 0.9;
  animation: pulse 2s infinite, iconShimmer 3s linear infinite;
  filter: drop-shadow(0 0 8px rgba(196,181,253,0.6)) drop-shadow(0 0 20px rgba(168,85,247,0.4));
}
@keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.1)} }
@keyframes iconShimmer {
  0%   { color: #c4b5fd; }
  25%  { color: #f9a8d4; }
  50%  { color: #fde68a; }
  75%  { color: #67e8f9; }
  100% { color: #c4b5fd; }
}
.brand-title {
  font-size: 36px; font-weight: bold; margin: 0 0 8px; letter-spacing: 2px;
  background: linear-gradient(90deg, #c4b5fd 0%, #e9d5ff 20%, #f9a8d4 40%, #fed7aa 60%, #c4b5fd 80%, #a5b4fc 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmerFlow 4s linear infinite;
  filter: drop-shadow(0 0 12px rgba(196,181,253,0.5)) drop-shadow(0 0 30px rgba(168,85,247,0.3));
}
.brand-title.fly-in-l {
  animation: shimmerFlow 4s linear infinite, elementLand 0.9s var(--d, 0s) cubic-bezier(0.34,1.56,0.64,1) both;
}
.brand-sub {
  font-size: 16px; opacity: 0.85; margin: 0 0 30px;
  background: linear-gradient(90deg, #a5b4fc 0%, #c4b5fd 15%, #f9a8d4 30%, #fde68a 45%, #a5b4fc 55%, #67e8f9 70%, #c4b5fd 85%, #a5b4fc 100%);
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.brand-sub.fly-in-l {
  animation: shimmerFlow 3.5s linear infinite, elementLand 0.9s var(--d, 0s) cubic-bezier(0.34,1.56,0.64,1) both;
}
.brand-features { width: 100%; }
.feature-item {
  margin: 10px 0; font-size: 14px; display: flex; align-items: center; gap: 8px;
  opacity: 0.9; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 8px;
}
.feature-item span {
  background: linear-gradient(90deg, #a5b4fc 0%, #c4b5fd 30%, #f9a8d4 60%, #c4b5fd 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmerFlow 3s linear infinite;
}

/* ===== 右侧表单 ===== */
.login-form-wrap {
  flex: 1; padding: 60px 52px; display: flex; flex-direction: column; justify-content: center; align-items: center;
  background: rgba(255,255,255,0.02); backdrop-filter: blur(12px);
}
.login-form-wrap :deep(.el-form-item__content) { margin-left: 0 !important; }
.login-form { padding: 0 50px; }
.form-header { margin-bottom: 48px; text-align: center; }
.form-header h2 { font-size: 38px; margin: 0 0 12px; }

/* h2 流光 */
.shimmer-title {
  font-weight: 700; letter-spacing: 2px;
  background: linear-gradient(90deg, #c4b5fd 0%, #e9d5ff 20%, #f9a8d4 40%, #fed7aa 60%, #c4b5fd 80%, #a5b4fc 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(196,181,253,0.5)) drop-shadow(0 0 30px rgba(168,85,247,0.3));
}
.shimmer-title.fly-in-r {
  animation: shimmerFlow 4s linear infinite, elementLand 0.9s var(--d, 0s) cubic-bezier(0.34,1.56,0.64,1) both;
}

/* 副标题流光 */
.shimmer-text {
  margin: 0; font-size: 18px; font-weight: 500; letter-spacing: 3px;
  background: linear-gradient(90deg, #a5b4fc 0%, #c4b5fd 15%, #f9a8d4 30%, #fde68a 45%, #a5b4fc 55%, #67e8f9 70%, #c4b5fd 85%, #a5b4fc 100%);
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(165,180,252,0.4)) drop-shadow(0 0 25px rgba(196,181,253,0.25));
}
.shimmer-text.fly-in-r {
  animation: shimmerFlow 3.5s linear infinite, elementLand 0.9s var(--d, 0s) cubic-bezier(0.34,1.56,0.64,1) both;
}

@keyframes shimmerFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 输入框 */
.liquid-input { position: relative; border-radius: 12px; transition: all 0.4s ease; }
.liquid-input .liquid-glow {
  position: absolute; inset: -2px; border-radius: 14px; z-index: 0;
  background: transparent; transition: all 0.4s ease; pointer-events: none;
}
.liquid-input.focused .liquid-glow {
  background: linear-gradient(135deg, rgba(102,126,234,0.4), rgba(118,75,162,0.4), rgba(59,130,246,0.4));
  filter: blur(8px); animation: glowPulse 1.5s ease-in-out infinite;
}
@keyframes glowPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
.liquid-input :deep(.el-input__wrapper) {
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.12) !important; border-radius: 12px !important;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.15) !important;
  transition: all 0.4s ease !important;
}
.liquid-input.focused :deep(.el-input__wrapper) {
  background: rgba(255,255,255,0.2) !important;
  box-shadow: 0 0 0 2px rgba(102,126,234,0.35), 0 0 20px rgba(102,126,234,0.2) !important;
}
.liquid-input.filled :deep(.el-input__wrapper) { box-shadow: 0 0 0 1px rgba(103,194,58,0.4) !important; }
.liquid-input :deep(.el-input__inner) { color: #fff !important; }
.liquid-input :deep(.el-input__inner::placeholder) { color: rgba(255,255,255,0.4) !important; }
.liquid-input :deep(.el-input__prefix .el-icon) { color: rgba(255,255,255,0.5) !important; transition: color 0.3s; }
.liquid-input.focused :deep(.el-input__prefix .el-icon) { color: rgba(255,255,255,0.9) !important; }

.input-feedback { font-size: 12px; padding: 4px 8px 0; transition: all 0.3s; }
.input-feedback { color: #f56c6c; }
.input-feedback.valid { color: #67c23a; display: flex; align-items: center; gap: 4px; }
.input-wrapper { margin-bottom: 0; }
.login-form-wrap :deep(.el-form-item) { margin-bottom: 40px; }
.login-form-wrap :deep(.el-form-item:last-child) { margin-bottom: 0; margin-top: 16px; }

.login-btn {
  width: 100%; border-radius: 12px; height: 46px; font-size: 16px; letter-spacing: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2); border: none;
  transition: transform 0.2s, box-shadow 0.3s;
}
.login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(102,126,234,0.35); }

/* ===== 欢迎画面 ===== */
.welcome-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: radial-gradient(ellipse at center, #0f1b3d 0%, #060b1f 100%);
  display: flex; align-items: center; justify-content: center;
}
.welcome-card {
  text-align: center; position: relative; z-index: 2;
  animation: welcomeCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes welcomeCardIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.welcome-icon { font-size: 80px; margin-bottom: 12px; animation: welcomeIconBounce 0.6s 0.1s ease-out both; }
@keyframes welcomeIconBounce {
  0% { transform: scale(0) rotate(-20deg); }
  100% { transform: scale(1) rotate(0); }
}
.welcome-title {
  font-size: 42px; font-weight: 700; color: #c4b5fd;
  text-shadow: 0 0 30px rgba(196,181,253,0.5);
  animation: welcomeFadeUp 0.5s 0.25s ease-out both;
}
.welcome-name {
  font-size: 36px; font-weight: 700; margin: 8px 0 16px;
  background: linear-gradient(90deg, #f9a8d4, #c4b5fd, #67e8f9);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: welcomeFadeUp 0.5s 0.4s ease-out both;
}
.welcome-sub {
  font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 20px;
  animation: welcomeFadeUp 0.5s 0.55s ease-out both;
}
@keyframes welcomeFadeUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 进度条 */
.welcome-bar {
  width: 200px; height: 3px; margin: 0 auto;
  background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  animation: welcomeFadeUp 0.5s 0.7s ease-out both;
}
.welcome-bar-fill {
  height: 100%; background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px; animation: welcomeBarFill 1.2s 0.8s ease-out both;
}
@keyframes welcomeBarFill {
  0% { width: 0%; }
  100% { width: 100%; }
}

/* 星光粒子 */
.welcome-sparkles { position: absolute; inset: 0; pointer-events: none; }
.wsparkle {
  position: absolute; top: 50%; left: 50%;
  width: 4px; height: 4px; border-radius: 50%; background: #c4b5fd;
  animation: sparkleBurst 1.2s ease-out both;
}
@keyframes sparkleBurst {
  0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(200px); opacity: 0; }
}

/* Vue 过渡 */
.welcome-enter-active { transition: opacity 0.3s; }
.welcome-leave-active { transition: opacity 0.5s; }
.welcome-enter-from, .welcome-leave-to { opacity: 0; }
</style>
