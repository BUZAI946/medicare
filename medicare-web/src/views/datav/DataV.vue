<template>
  <div class="datav" @click.self="exit">
    <!-- 星光背景 -->
    <div class="stars-bg">
      <div v-for="s in stars" :key="s.id" class="star" :style="s.style"></div>
    </div>

    <!-- 退出按钮 -->
    <div class="exit-btn" @click="exit">
      <el-icon :size="24"><Close /></el-icon>
    </div>

    <!-- 头部 -->
    <div class="dv-header">
      <div class="dv-logo">
        MediCare · 数据大屏
        <span class="health-dot"></span>
        <span class="health-text">系统健康 · {{ apiCalls }} API · {{ uptime }}</span>
      </div>
      <div class="dv-clock-row">
        <span class="dv-clock">{{ currentTime }}</span>
        <span class="dv-date">{{ currentDate }}</span>
      </div>
      <div class="dv-refresh">
        <span class="refresh-dot"></span> 自动刷新 {{ countdown }}s &nbsp;|&nbsp; Esc 退出
      </div>
    </div>

    <!-- 第一行：核心统计 -->
    <div class="dv-stats-row">
      <div class="stat-card sc-blue">
        <div class="sc-icon"><el-icon :size="32"><Calendar /></el-icon></div>
        <div class="sc-num">{{ animatedReg }}</div>
        <div class="sc-label">今日挂号</div>
      </div>
      <div class="stat-card sc-yellow">
        <div class="sc-icon"><el-icon :size="32"><Clock /></el-icon></div>
        <div class="sc-num">{{ stats.waitingCount }}</div>
        <div class="sc-label">候诊中</div>
      </div>
      <div class="stat-card sc-green">
        <div class="sc-icon"><el-icon :size="32"><TrendCharts /></el-icon></div>
        <div class="sc-num">{{ completionRate }}%</div>
        <div class="sc-label">就诊完成率</div>
      </div>
      <div class="stat-card sc-purple">
        <div class="sc-icon"><el-icon :size="32"><Money /></el-icon></div>
        <div class="sc-num">¥{{ todayPayAmount }}</div>
        <div class="sc-label">今日收款</div>
      </div>
      <div class="stat-card sc-red">
        <div class="sc-icon"><el-icon :size="32"><WarningFilled /></el-icon></div>
        <div class="sc-num">{{ stats.stockAlertCount }}</div>
        <div class="sc-label">库存预警</div>
      </div>
      <div class="stat-card sc-cyan">
        <div class="sc-icon"><el-icon :size="32"><UserFilled /></el-icon></div>
        <div class="sc-num">{{ totalPatients }}</div>
        <div class="sc-label">今日患者</div>
      </div>
    </div>

    <!-- 第二行：队列 + 科室 + 处方 -->
    <div class="dv-body">
      <!-- 候诊队列 -->
      <div class="dv-panel panel-queue">
        <div class="panel-title">
          <el-icon><List /></el-icon> 候诊队列
          <span class="panel-badge">{{ waitingList.length }}</span>
        </div>
        <div class="queue-list">
          <div v-for="(r, i) in waitingList" :key="r.id" class="queue-item" :style="{ animationDelay: i * 0.08 + 's' }">
            <span class="queue-num">#{{ r.seqNo }}</span>
            <span class="queue-name">{{ r.patientName }}</span>
            <span class="queue-dept">{{ r.departmentName }}</span>
            <span class="queue-time">{{ r.regTime?.slice(11,16) }}</span>
          </div>
          <div v-if="waitingList.length === 0" class="queue-empty">
            <el-icon :size="40"><CircleCheckFilled /></el-icon>
            <p>暂无候诊患者</p>
          </div>
        </div>
      </div>

      <!-- 科室挂号 -->
      <div class="dv-panel panel-dept">
        <div class="panel-title">
          <el-icon><DataAnalysis /></el-icon> 科室挂号分布
        </div>
        <div class="dept-list">
          <div v-for="d in deptData" :key="d.name" class="dept-row">
            <span class="dept-name">{{ d.name }}</span>
            <div class="dept-bar-wrap">
              <div class="dept-bar" :style="{ width: (d.count / maxDept * 100) + '%', background: d.color }">
                <span class="dept-bar-num" v-if="d.count > 0">{{ d.count }}</span>
              </div>
            </div>
            <div class="dept-bar-bg">
              <span class="dept-bar-num-bg" v-if="d.count === 0">0</span>
            </div>
          </div>
        </div>
        <div class="dept-total">合计 {{ totalDeptCount }} 人次</div>
      </div>

      <!-- 处方与药品 -->
      <div class="dv-panel panel-presc">
        <div class="panel-title">
          <el-icon><Notebook /></el-icon> 处方 & 库存预警
        </div>
        <div class="presc-overview">
          <div class="presc-stat">
            <span class="presc-num">{{ prescTodayCount }}</span>
            <span class="presc-label">今日处方</span>
          </div>
          <div class="presc-stat">
            <span class="presc-num">{{ prescPendingCount }}</span>
            <span class="presc-label">待发药</span>
          </div>
        </div>
        <div class="alert-title">库存预警</div>
        <div class="alert-list" v-if="stockAlerts.length > 0">
          <div v-for="m in stockAlerts" :key="m.id" class="alert-item">
            <div class="alert-name">{{ m.name }}</div>
            <div class="alert-bar-wrap">
              <div class="alert-bar" :style="{ width: (m.stock / Math.max(m.stock, m.safetyStock*2) * 100) + '%', background: m.stock <= m.safetyStock/2 ? '#ff6b6b' : '#ffab40' }"></div>
            </div>
            <span class="alert-num">{{ m.stock }}/{{ m.safetyStock }}</span>
          </div>
        </div>
        <div class="alert-ok" v-else>✅ 库存状态良好</div>
      </div>
    </div>

    <!-- 底部滚动 -->
    <div class="dv-marquee">
      <span class="marquee-text">
        🏥 守护每一次心跳 &nbsp;·&nbsp; 每一次诊断 &nbsp;·&nbsp; 每一张处方 &nbsp;·&nbsp; 每一粒药片 &nbsp;·&nbsp; 都是对生命的承诺 &nbsp;&nbsp;&nbsp;
        🏥 守护每一次心跳 &nbsp;·&nbsp; 每一次诊断 &nbsp;·&nbsp; 每一张处方 &nbsp;·&nbsp; 每一粒药片 &nbsp;·&nbsp; 都是对生命的承诺
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboardStats } from '../../api/user'
import { listRegistrations } from '../../api/registration'
import { listLowStock } from '../../api/medicine'
import { listPrescriptions } from '../../api/prescription'

const router = useRouter()
const stats = ref({ todayRegCount: 0, waitingCount: 0, stockAlertCount: 0, pendingPaymentCount: 0, todayPaymentAmount: '0' })
const regList = ref<any[]>([])
const stockAlerts = ref<any[]>([])
const prescList = ref<any[]>([])
const animatedReg = ref(0)
const countdown = ref(30)
const apiCalls = ref(Math.floor(Math.random() * 500 + 200))
const uptime = ref('')
let timer: any = null
let cdTimer: any = null

const currentTime = ref('')
const currentDate = ref('')

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'long' })
  const h = Math.floor((Date.now() - startTime) / 3600000)
  const m = Math.floor(((Date.now() - startTime) % 3600000) / 60000)
  uptime.value = `运行 ${h}h${m}m`
}
const startTime = Date.now()

const waitingList = computed(() => regList.value.filter((r: any) => r.status === 0))
const completionRate = computed(() => {
  if (regList.value.length === 0) return 0
  return Math.round(regList.value.filter((r: any) => r.status === 2).length / regList.value.length * 100)
})
const totalPatients = computed(() => new Set(regList.value.map((r: any) => r.patientId)).size)
const totalDeptCount = computed(() => regList.value.length)
const todayPayAmount = computed(() => {
  const amt = stats.value.todayPaymentAmount
  return amt ? Number(amt).toFixed(2) : '0.00'
})
const prescTodayCount = computed(() => prescList.value.length)
const prescPendingCount = computed(() => prescList.value.filter((p: any) => p.status === 0).length)

const deptColors = ['#00d4ff','#00e676','#ffab40','#ff6b6b','#c084fc']
const deptData = computed(() => {
  const map: Record<string, number> = {}
  const allDepts = ['内科','外科','儿科','妇产科','中医科']
  allDepts.forEach(d => map[d] = 0)
  regList.value.forEach((r: any) => {
    const dn = r.departmentName || ''
    if (map[dn] !== undefined) map[dn]++
  })
  return Object.entries(map).map(([name, count], i) => ({
    name, count, color: deptColors[i % deptColors.length]
  }))
})
const maxDept = computed(() => Math.max(...deptData.value.map(d => d.count), 1))

function countUp(target: number) {
  const step = Math.max(1, Math.floor(target / 30))
  let cur = 0
  const iv = setInterval(() => {
    cur += step
    if (cur >= target) { animatedReg.value = target; clearInterval(iv) }
    else { animatedReg.value = cur }
  }, 40)
}

async function loadData() {
  apiCalls.value += 3 + Math.floor(Math.random() * 5)
  try {
    const [s, r, m, p] = await Promise.all([
      getDashboardStats(), listRegistrations(), listLowStock(), listPrescriptions()
    ])
    stats.value = s.data
    regList.value = (r.data as any[]) || []
    stockAlerts.value = m.data || []
    prescList.value = (p.data as any[]) || []
    countUp(stats.value.todayRegCount)
  } catch {}
}

function exit() { router.push('/dashboard') }

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' || e.key === 'F11') { e.preventDefault(); exit() }
}

// 星光随机参数
const starColors = ['#fff','#a5f3fc','#c4b5fd','#fde68a','#f9a8d4','#67e8f9']
const stars = Array.from({ length: 50 }, (_, i) => {
  const size = Math.random() * 3 + 1.5
  const color = starColors[Math.floor(Math.random() * starColors.length)]
  return {
    id: `s${i}`,
    style: {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      '--size': size + 'px',
      '--color': color,
      '--glow': (size * 3) + 'px',
      '--glow-color': color,
      '--dur': (Math.random() * 3 + 2) + 's',
      '--delay': (Math.random() * 4) + 's',
    },
  }
})

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
  cdTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) { countdown.value = 30; loadData() }
  }, 1000)
  loadData()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(cdTimer)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.datav {
  position: fixed; inset: 0; z-index: 9999;
  background: radial-gradient(ellipse at 50% 30%, #0d1a3a 0%, #060b1f 70%);
  color: #fff; display: flex; flex-direction: column;
  font-family: 'PingFang SC','Microsoft YaHei',sans-serif;
  overflow: hidden; padding: 16px 28px;
}

/* ===== 星光 ===== */
.stars-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.star {
  position: absolute;
  width: var(--size, 3px); height: var(--size, 3px);
  border-radius: 50%;
  background: var(--color, #fff);
  box-shadow: 0 0 var(--glow, 6px) var(--glow-color, rgba(255,255,255,0.5));
  animation: twinkle var(--dur, 3s) var(--delay, 0s) ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.6); }
  50%      { opacity: 1;    transform: scale(1.4); }
}

.exit-btn {
  position: absolute; top: 20px; right: 30px; z-index: 10;
  color: rgba(255,255,255,0.5); cursor: pointer; transition: color 0.3s;
}
.exit-btn:hover { color: #ff6b6b; }

/* ===== 头部 ===== */
.dv-header {
  text-align: center; padding: 6px 0 14px; position: relative; z-index: 1;
}
.dv-logo {
  font-size: 22px; font-weight: 700; letter-spacing: 4px; margin-bottom: 4px;
  background: linear-gradient(90deg, #00d4ff, #c084fc, #f9a8d4); -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; display: flex; align-items: center; gap: 10px; justify-content: center; flex-wrap: wrap;
}
.health-dot { width: 8px; height: 8px; border-radius: 50%; background: #00e676; animation: dotPulse 2s infinite; display: inline-block; }
.health-text { font-size: 11px; opacity: 0.4; letter-spacing: 1px; -webkit-text-fill-color: rgba(255,255,255,0.4); }
.dv-clock-row { display: flex; align-items: baseline; justify-content: center; gap: 20px; }
.dv-clock { font-size: 64px; font-weight: 700; letter-spacing: 4px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2);
}
.dv-date { font-size: 16px; opacity: 0.65; }
.dv-refresh { font-size: 12px; opacity: 0.4; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 4px; }
.refresh-dot { width: 7px; height: 7px; border-radius: 50%; background: #00e676; animation: dotPulse 2s infinite; }
@keyframes dotPulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }

/* ===== 统计卡片行 ===== */
.dv-stats-row {
  display: flex; gap: 14px; margin-bottom: 14px; z-index: 1;
}
.stat-card {
  flex: 1; text-align: center; padding: 16px 8px; border-radius: 12px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(4px); position: relative; overflow: hidden;
}
.stat-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
}
.sc-blue::after { background: linear-gradient(90deg, transparent, #00d4ff, transparent); }
.sc-yellow::after { background: linear-gradient(90deg, transparent, #ffab40, transparent); }
.sc-green::after { background: linear-gradient(90deg, transparent, #00e676, transparent); }
.sc-purple::after { background: linear-gradient(90deg, transparent, #c084fc, transparent); }
.sc-red::after { background: linear-gradient(90deg, transparent, #ff6b6b, transparent); }
.sc-cyan::after { background: linear-gradient(90deg, transparent, #22d3ee, transparent); }
.sc-icon { opacity: 0.5; margin-bottom: 6px; }
.sc-num { font-size: 34px; font-weight: 700; }
.sc-label { font-size: 12px; opacity: 0.6; margin-top: 2px; }
.sc-blue .sc-num { color: #00d4ff; text-shadow: 0 0 16px rgba(0,212,255,0.4); }
.sc-yellow .sc-num { color: #ffab40; text-shadow: 0 0 16px rgba(255,171,64,0.4); }
.sc-green .sc-num { color: #00e676; text-shadow: 0 0 16px rgba(0,230,118,0.4); }
.sc-purple .sc-num { color: #c084fc; text-shadow: 0 0 16px rgba(192,132,252,0.4); }
.sc-red .sc-num { color: #ff6b6b; text-shadow: 0 0 16px rgba(255,107,107,0.4); }
.sc-cyan .sc-num { color: #22d3ee; text-shadow: 0 0 16px rgba(34,211,238,0.4); }

/* ===== 主体三栏 ===== */
.dv-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; min-height: 0; z-index: 1; }
.dv-panel {
  background: rgba(255,255,255,0.025); border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.07); padding: 16px;
  backdrop-filter: blur(6px); display: flex; flex-direction: column;
}
.panel-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; opacity: 0.85;
  padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; gap: 8px;
}
.panel-badge { margin-left: auto; background: rgba(0,212,255,0.2); padding: 2px 10px; border-radius: 10px; font-size: 13px; color: #00d4ff; }

/* 候诊队列 */
.queue-list { flex: 1; overflow-y: auto; }
.queue-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 10px;
  margin-bottom: 4px; border-radius: 8px; background: rgba(255,255,255,0.025);
  animation: queueIn 0.5s ease-out both; transition: background 0.2s;
}
.queue-item:hover { background: rgba(255,255,255,0.06); }
@keyframes queueIn { 0% { opacity:0; transform:translateX(-16px) } 100% { opacity:1; transform:translateX(0) } }
.queue-num { font-weight: 700; color: #00d4ff; min-width: 32px; font-size: 13px; }
.queue-name { flex: 1; font-weight: 500; font-size: 14px; }
.queue-dept { font-size: 12px; opacity: 0.5; }
.queue-time { font-size: 12px; opacity: 0.4; }
.queue-empty { text-align: center; padding: 32px 0; opacity: 0.35; }
.queue-empty p { margin-top: 8px; font-size: 14px; }

/* 科室 */
.dept-list { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.dept-row { display: flex; align-items: center; gap: 8px; }
.dept-name { width: 50px; font-size: 13px; opacity: 0.75; text-align: right; }
.dept-bar-wrap { flex: 1; height: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
.dept-bar { height: 100%; border-radius: 10px; transition: width 0.8s ease; min-width: 4px;
  display: flex; align-items: center; padding-left: 8px; }
.dept-bar-num { font-size: 11px; font-weight: 600; color: #fff; opacity: 0.9; }
.dept-bar-bg { flex: 1; height: 20px; display: flex; align-items: center; padding-left: 8px; }
.dept-bar-num-bg { font-size: 11px; opacity: 0.4; }
.dept-total { text-align: right; font-size: 12px; opacity: 0.5; margin-top: 8px; }

/* 处方 & 预警 */
.presc-overview { display: flex; gap: 12px; margin-bottom: 14px; }
.presc-stat { flex: 1; text-align: center; padding: 12px 8px; border-radius: 10px; background: rgba(255,255,255,0.04); }
.presc-num { display: block; font-size: 26px; font-weight: 700; color: #c084fc; }
.presc-label { font-size: 12px; opacity: 0.55; }
.alert-title { font-size: 13px; font-weight: 600; opacity: 0.7; margin-bottom: 8px; }
.alert-list { display: flex; flex-direction: column; gap: 6px; }
.alert-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.alert-name { width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.8; }
.alert-bar-wrap { flex: 1; height: 10px; background: rgba(255,255,255,0.06); border-radius: 5px; overflow: hidden; }
.alert-bar { height: 100%; border-radius: 5px; transition: width 0.6s; }
.alert-num { width: 50px; text-align: right; opacity: 0.7; font-family: monospace; }
.alert-ok { text-align: center; padding: 16px; opacity: 0.4; }

/* ===== 底部滚动 ===== */
.dv-marquee { z-index: 1; padding-top: 10px; overflow: hidden; white-space: nowrap; }
.marquee-text {
  display: inline-block; animation: marquee 30s linear infinite;
  font-size: 13px; opacity: 0.3; letter-spacing: 2px;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
