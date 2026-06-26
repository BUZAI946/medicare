<template>
  <div class="dashboard">
    <!-- 实时时间 -->
    <div class="time-banner">
      <div class="time-left">
        <span class="time-greeting">{{ greeting }}</span>
        <div>
          <span class="time-clock">{{ currentTime }}</span>
          <span class="time-date">{{ currentDate }}</span>
        </div>
      </div>
      <div class="time-right">
        <div class="time-stat clickable" @click="$router.push('/registration')">
          <span class="time-stat-num">{{ stats.todayRegCount }}</span>
          <span class="time-stat-label">今日挂号</span>
        </div>
        <div class="time-stat clickable" @click="$router.push('/workstation')">
          <span class="time-stat-num">{{ stats.waitingCount }}</span>
          <span class="time-stat-label">候诊中</span>
        </div>
        <div class="time-stat clickable" @click="$router.push('/pharmacy')">
          <span class="time-stat-num">{{ stats.stockAlertCount }}</span>
          <span class="time-stat-label">库存预警</span>
        </div>
        <div class="time-stat clickable" @click="$router.push('/payments')">
          <span class="time-stat-num">{{ stats.pendingPaymentCount || 0 }}</span>
          <span class="time-stat-label">待收费</span>
        </div>
        <el-tag type="success" size="small" effect="dark">● 运行中</el-tag>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <div class="stat-card card-blue" @click="$router.push('/registration')">
          <div class="card-icon"><el-icon :size="40"><Calendar /></el-icon></div>
          <div class="card-info">
            <div class="card-num">{{ stats.todayRegCount }}</div>
            <div class="card-label">今日挂号</div>
          </div>
          <div class="card-spark"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card-orange" @click="$router.push('/workstation')">
          <div class="card-icon"><el-icon :size="40"><Clock /></el-icon></div>
          <div class="card-info">
            <div class="card-num">{{ stats.waitingCount }}</div>
            <div class="card-label">候诊人数</div>
          </div>
          <div class="card-spark"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card-red" @click="$router.push('/pharmacy')">
          <div class="card-icon"><el-icon :size="40"><WarningFilled /></el-icon></div>
          <div class="card-info">
            <div class="card-num">{{ stats.stockAlertCount }}</div>
            <div class="card-label">库存预警</div>
          </div>
          <div class="card-spark"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card-green" @click="$router.push('/reports')">
          <div class="card-icon"><el-icon :size="40"><TrendCharts /></el-icon></div>
          <div class="card-info">
            <div class="card-num">{{ completionRate }}%</div>
            <div class="card-label">就诊完成率</div>
          </div>
          <div class="card-spark"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 大图横幅 -->
    <div class="hero-banner-wrap clickable" style="margin-top:20px" @click="$router.push('/registration')">
      <div class="hero-banner" :style="{ backgroundImage: 'url(' + heroBannerImg + ')' }">
        <div class="hb-overlay">
          <div class="hb-text">
            <h3>🏥 守护每一次心跳</h3>
            <p>每一次诊断 · 每一张处方 · 每一粒药片 · 都是对生命的承诺</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ken Burns 图片横幅 -->
    <div class="kenburns-wrap clickable" style="margin-top:16px" @click="$router.push('/calendar')">
      <div class="kenburns-stage">
        <div class="kenburns-slide kb1"></div>
        <div class="kenburns-slide kb2"></div>
        <div class="kenburns-slide kb3"></div>
        <div class="kenburns-slide kb4"></div>
        <div class="kb-overlay"></div>
      </div>
    </div>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="14">
        <el-card shadow="hover" class="chart-card clickable" @click="$router.push('/registration')">
          <template #header>
            <div class="chart-header">
              <span><el-icon><DataAnalysis /></el-icon> 各科室挂号统计</span>
              <el-tag size="small">实时数据</el-tag>
            </div>
          </template>
          <div class="bar-chart">
            <div v-for="(d, i) in weekData" :key="i" class="bar-item">
              <div class="bar-val">{{ d.count }}</div>
              <div class="bar-fill" :style="{ height: (d.count / maxWeekCount * 150) + 'px' }">
                <div class="bar-glow"></div>
              </div>
              <div class="bar-label">{{ d.day }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover" class="chart-card clickable" @click="$router.push('/registration')">
          <template #header>
            <div class="chart-header">
              <span><el-icon><PieChart /></el-icon> 各科室挂号占比</span>
            </div>
          </template>
          <div class="pie-chart">
            <div class="pie-ring">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#eee" stroke-width="25"/>
                <circle v-for="(s,i) in deptSlices" :key="i"
                  cx="100" cy="100" r="80" fill="none"
                  :stroke="s.color" stroke-width="25"
                  :stroke-dasharray="s.dash + ' ' + (502.65 - s.dash)"
                  :stroke-dashoffset="s.offset"
                  transform="rotate(-90 100 100)"
                  style="transition: all 0.8s ease"/>
              </svg>
              <div class="pie-center">
                <div class="pie-total">{{ totalDept }}</div>
                <div class="pie-sub">总挂号</div>
              </div>
            </div>
            <div class="pie-legend">
              <div v-for="(s,i) in deptSlices" :key="i" class="legend-item">
                <span class="legend-dot" :style="{ background: s.color }"></span>
                <span>{{ s.name }}</span>
                <span class="legend-pct">{{ s.pct }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


    <!-- 快捷入口 + 图片 -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="14">
        <el-card shadow="hover" class="quick-card">
          <template #header><span><el-icon><Star /></el-icon> 快捷操作</span></template>
          <el-row :gutter="10">
            <el-col :span="4" v-for="q in quickActions" :key="q.path">
              <div class="quick-item" @click="$router.push(q.path)">
                <el-icon :size="28" :color="q.color"><component :is="q.icon" /></el-icon>
                <span>{{ q.label }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="5">
        <img :src="dashImgs[0]" class="hero-img clickable" alt="医院" @click="$router.push('/calendar')" />
      </el-col>
      <el-col :span="5">
        <img :src="dashImgs[1]" class="hero-img clickable" alt="医疗" @click="$router.push('/reports')" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getDashboardStats } from '../../api/user'
import { listRegistrations } from '../../api/registration'
import { dashImgs } from '../../utils/images'

const heroBannerImg = 'https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop&dpr=2'

const stats = ref({ todayRegCount: 0, waitingCount: 0, stockAlertCount: 0, pendingPaymentCount: 0, todayPaymentAmount: '0' })
const regList = ref<any[]>([])

// 实时时钟
const currentTime = ref('')
const currentDate = ref('')
let timer: any = null
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric', weekday:'long' })
}
timer = setInterval(updateTime, 1000)
updateTime()

// 就诊完成率
const completionRate = computed(() => {
  if (regList.value.length === 0) return 0
  const done = regList.value.filter(r => r.status === 2).length
  return Math.round(done / regList.value.length * 100)
})

// 科室挂号柱状图（所有科室，含0也显示）
const deptColors = ['#409eff','#67c23a','#e6a23c','#f56c6c','#909399']
const allDeptNames = ['内科','外科','儿科','妇产科','中医科']
const weekData = computed(() => {
  const map: Record<string, number> = {}
  allDeptNames.forEach(d => map[d] = 0)
  regList.value.forEach(r => {
    const dn = r.departmentName || ''
    if (map[dn] !== undefined) map[dn]++
    else map[dn] = 1
  })
  return Object.entries(map).map(([name, count]) => ({ day: name, count }))
})
const maxWeekCount = computed(() => Math.max(...weekData.value.map(d=>d.count), 1))

// 科室占比
const deptSlices = computed(() => {
  const map: Record<string, number> = {}
  regList.value.forEach(r => {
    const dn = r.departmentName || '未知'
    map[dn] = (map[dn]||0) + 1
  })
  const entries = Object.entries(map)
  const total = entries.reduce((s, [,c]) => s + c, 0) || 1
  let cumulative = 0
  return entries.map(([name, count], i) => {
    const pct = Math.round(count / total * 100)
    const dash = (count / total) * 502.65
    const offset = -cumulative
    cumulative += dash
    return { name, count, pct, color: deptColors[i % deptColors.length], dash, offset }
  })
})
const totalDept = computed(() => regList.value.length)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了 🌙'
  if (h < 9) return '早上好 ☀️'
  if (h < 12) return '上午好 🌤️'
  if (h < 14) return '中午好 ☀️'
  if (h < 18) return '下午好 🌈'
  return '晚上好 🌙'
})

const quickActions = [
  { path: '/registration', label: '挂号预约', icon: 'Plus', color: '#409eff' },
  { path: '/workstation', label: '医生工作站', icon: 'Promotion', color: '#67c23a' },
  { path: '/pharmacy', label: '药品库存', icon: 'FirstAidKit', color: '#e6a23c' },
  { path: '/patients', label: '患者管理', icon: 'User', color: '#909399' },
  { path: '/datav', label: '数据大屏', icon: 'Monitor', color: '#9b59b6' },
]

onMounted(async () => {
  try { const r = await getDashboardStats(); stats.value = r.data } catch {}
  try { const r = await listRegistrations(); regList.value = (r.data as any[]) || [] } catch {}
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.dashboard { padding: 0; }
/* 时间横幅 */
.time-banner {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px; color: #fff; margin-bottom: 20px;
}
.time-left { display: flex; align-items: center; gap: 24px; }
.time-greeting { font-size: 30px; line-height: 1; }
.time-clock { font-size: 28px; font-weight: bold; font-family: 'Courier New', monospace; }
.time-date { display: block; font-size: 13px; opacity: 0.8; margin-top: 2px; }
.time-right { display: flex; align-items: center; gap: 20px; }
.time-stat { text-align: center; }
.time-stat-num { display: block; font-size: 22px; font-weight: 700; }
.time-stat-label { display: block; font-size: 11px; opacity: 0.75; }

/* 统计卡片 */
.stat-card {
  display: flex; align-items: center; gap: 16px;
  padding: 24px; border-radius: 16px; color: #fff; cursor: pointer;
  position: relative; overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
.stat-card::before {
  content: ''; position: absolute; right: -30px; top: 50%; width: 100px; height: 100px;
  border-radius: 50%; background: rgba(255,255,255,0.08);
  transform: translateY(-50%); transition: all 0.4s ease;
}
.stat-card::after {
  content: ''; position: absolute; inset: 0; border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  pointer-events: none;
}
.stat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 36px rgba(0,0,0,0.2); }
.stat-card:hover::before { transform: translateY(-50%) scale(1.4); }
.card-blue { background: linear-gradient(135deg, #5b9bd5, #3b7fc4); }
.card-orange { background: linear-gradient(135deg, #f0a840, #d4882f); }
.card-red { background: linear-gradient(135deg, #f87c7c, #e85656); }
.card-green { background: linear-gradient(135deg, #78cc48, #5aaa38); }
.card-icon { opacity: 0.25; }
.card-num { font-size: 32px; font-weight: bold; }
.card-label { font-size: 13px; opacity: 0.85; margin-top: 4px; }
.card-spark {
  position: absolute; right: -20px; top: -20px;
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(255,255,255,0.1);
}

/* 图表卡片 */
.chart-card { border-radius: 12px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; }

/* 柱状图 */
.bar-chart {
  display: flex; align-items: flex-end; justify-content: space-around;
  height: 200px; padding: 0 10px;
}
.bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
.bar-val { font-size: 12px; color: #909399; margin-bottom: 4px; }
.bar-fill {
  width: 32px; background: linear-gradient(180deg, #409eff, #79bbff);
  border-radius: 6px 6px 0 0; min-height: 4px; position: relative;
  transition: height 0.6s ease; overflow: hidden;
}
.bar-glow {
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: rgba(255,255,255,0.6); border-radius: 2px;
}
.bar-label { font-size: 12px; color: #909399; margin-top: 6px; }

/* 饼图 */
.pie-chart { display: flex; align-items: center; gap: 20px; }
.pie-ring { position: relative; width: 180px; height: 180px; flex-shrink: 0; }
.pie-center {
  position: absolute; inset: 0; display: flex;
  flex-direction: column; align-items: center; justify-content: center;
}
.pie-total { font-size: 24px; font-weight: bold; color: #303133; }
.pie-sub { font-size: 12px; color: #909399; }
.pie-legend { flex: 1; }
.legend-item { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-pct { margin-left: auto; color: #909399; font-size: 13px; }

/* 快捷操作 */
.quick-card { border-radius: 12px; }
.quick-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 20px; border-radius: 10px; cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.quick-item:hover { background: #f5f7fa; transform: translateY(-2px); }

/* 可点击 */
.clickable { cursor: pointer; }

/* 图片 */
.hero-img { width: 100%; height: 130px; object-fit: cover; border-radius: 12px; transition: transform 0.3s; }
.hero-img:hover { transform: scale(1.03); }

/* 大图横幅 */
.hero-banner-wrap { border-radius: 16px; overflow: hidden; }
.hero-banner { height: 300px; background-size: cover; background-position: center; position: relative; }
.hb-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(15,23,42,0.6) 0%, transparent 40%, transparent 60%, rgba(15,23,42,0.5) 100%);
  display: flex; align-items: flex-end;
}
.hb-text { padding: 24px 32px; color: #fff; }
.hb-text h3 { margin: 0 0 6px; font-size: 24px; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
.hb-text p { margin: 0; font-size: 14px; opacity: 0.9; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }

/* Ken Burns 运镜横幅 */
.kenburns-wrap { border-radius: 16px; overflow: hidden; }
.kenburns-stage { position: relative; height: 200px; overflow: hidden; background: #0f172a; }
.kenburns-slide { position: absolute; inset: -40px; background-size: cover; background-position: center; animation: kenBurns 24s linear infinite; opacity: 0; }
.kenburns-slide.kb1 { background-image: url('https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'); animation-delay: 0s; }
.kenburns-slide.kb2 { background-image: url('https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'); animation-delay: 6s; }
.kenburns-slide.kb3 { background-image: url('https://images.pexels.com/photos/3952235/pexels-photo-3952235.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'); animation-delay: 12s; }
.kenburns-slide.kb4 { background-image: url('https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop'); animation-delay: 18s; }
@keyframes kenBurns {
  0% { opacity: 0; transform: scale(1) translate(0, 0); }
  3% { opacity: 1; }
  23% { opacity: 1; transform: scale(1.08) translate(-8px, -6px); }
  25% { opacity: 0; transform: scale(1.1) translate(-10px, -8px); }
  100% { opacity: 0; }
}
.kb-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: linear-gradient(135deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.15) 40%, rgba(15,23,42,0.15) 60%, rgba(15,23,42,0.5) 100%); }
.kb-text { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3; padding: 24px 32px; color: #fff; }
.kb-text h3 { margin: 0 0 6px; font-size: 24px; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
.kb-text p { margin: 0; font-size: 14px; opacity: 0.85; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }
</style>
