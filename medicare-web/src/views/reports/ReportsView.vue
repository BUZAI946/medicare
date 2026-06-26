<template>
  <div class="reports-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><DataAnalysis /></el-icon>
        <div><h2>智能报表中心</h2><p>营收分析 · 工作量统计 · 药品消耗趋势</p></div>
      </div>
      <el-tag size="large" effect="dark" type="warning">📅 {{ todayLabel }}</el-tag>
    </div>

    <!-- 营收概览 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="c in topCards" :key="c.label">
        <div class="report-card" :style="{ background: c.bg }">
          <div class="rc-icon">{{ c.icon }}</div>
          <div class="rc-num">{{ c.value }}</div>
          <div class="rc-label">{{ c.label }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="hover" class="r-card">
          <template #header><span><el-icon><TrendCharts /></el-icon> 科室挂号排行</span></template>
          <div class="bar-list">
            <div v-for="(d,i) in deptRank" :key="d.name" class="bar-row">
              <span class="bar-rank">#{{ i+1 }}</span>
              <span class="bar-name">{{ d.name }}</span>
              <div class="bar-track"><div class="bar-fill" :style="{ width: (d.count/maxDept*100)+'%', background: deptColors[i] }"></div></div>
              <span class="bar-val">{{ d.count }}人</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="r-card">
          <template #header><span><el-icon><PieChart /></el-icon> 医生工作量排行</span></template>
          <div class="doc-list">
            <div v-for="(d,i) in docRank" :key="d.name" class="doc-row">
              <span class="doc-rank" :style="{ color: i<3 ? ['#f56c6c','#e6a23c','#409eff'][i] : '#909399' }">{{ i<3 ? ['🥇','🥈','🥉'][i] : i+1 }}</span>
              <span class="doc-name">{{ d.name }}</span>
              <span class="doc-dept">{{ d.dept }}</span>
              <span class="doc-count">{{ d.count }}诊</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 药品消耗 -->
    <el-row :gutter="16" style="margin-top:16px">
      <el-col :span="24">
        <el-card shadow="hover" class="r-card">
          <template #header><span><el-icon><FirstAidKit /></el-icon> 药品消耗趋势（今日处方）</span></template>
          <div class="med-trend">
            <div v-for="m in medUsage" :key="m.name" class="med-item">
              <span class="med-name">{{ m.name }}</span>
              <span class="med-qty">×{{ m.count }}</span>
              <span class="med-amount">¥{{ m.amount.toFixed(2) }}</span>
            </div>
            <el-empty v-if="medUsage.length===0" description="今日暂无处方数据" :image-size="50" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDashboardStats } from '../../api/user'
import { listRegistrations } from '../../api/registration'
import { listPrescriptions } from '../../api/prescription'
import { listDoctors } from '../../api/doctor'
import type { Doctor } from '../../types'

const todayLabel = computed(() => new Date().toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' }))
const regList = ref<any[]>([])
const prescList = ref<any[]>([])
const doctorList = ref<Doctor[]>([])
const stats = ref({ todayRegCount: 0, waitingCount: 0, stockAlertCount: 0, pendingPaymentCount: 0, todayPaymentAmount: '0' })

const topCards = computed(() => [
  { icon:'📋', label:'今日挂号', value: stats.value.todayRegCount + '人', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { icon:'💰', label:'今日收款', value: '¥'+(Number(stats.value.todayPaymentAmount)||0).toFixed(2), bg: 'linear-gradient(135deg,#f56c6c,#e04b4b)' },
  { icon:'💊', label:'今日处方', value: prescList.value.length + '张', bg: 'linear-gradient(135deg,#e6a23c,#cf9236)' },
  { icon:'✅', label:'候诊中', value: stats.value.waitingCount + '人', bg: 'linear-gradient(135deg,#67c23a,#529b2e)' },
])

const deptColors = ['#409eff','#67c23a','#e6a23c','#f56c6c','#909399']
const deptRank = computed(() => {
  const map: Record<string, number> = {}
  regList.value.forEach(r => { const dn = r.departmentName || '其他'; map[dn] = (map[dn]||0)+1 })
  return Object.entries(map).sort((a,b) => b[1]-a[1]).map(([name,count]) => ({name,count}))
})
const maxDept = computed(() => Math.max(...deptRank.value.map(d=>d.count), 1))

const docRank = computed(() => {
  const map: Record<string, {count:number,dept:string}> = {}
  regList.value.forEach(r => {
    const name = r.doctorName || '未知'
    if (!map[name]) map[name] = {count:0,dept:r.departmentName||''}
    map[name].count++
  })
  return Object.entries(map).sort((a,b)=>b[1].count-a[1].count).map(([name,v])=>({name,count:v.count,dept:v.dept}))
})

const medUsage = computed(() => {
  const map: Record<string, {count:number,amount:number}> = {}
  prescList.value.forEach(p => {
    (p.items||[]).forEach((i:any) => {
      const name = i.medicineName || '未知'
      if (!map[name]) map[name] = {count:0,amount:0}
      map[name].count += i.quantity||0
      map[name].amount += i.amount||0
    })
  })
  return Object.entries(map).sort((a,b)=>b[1].amount-a[1].amount).slice(0,10)
})

async function loadData() {
  try {
    const [s, r, p] = await Promise.all([getDashboardStats(), listRegistrations(), listPrescriptions()])
    stats.value = s.data
    regList.value = (r.data as any[]) || []
    prescList.value = (p.data as any[]) || []
    await listDoctors().then(r => doctorList.value = r.data)
  } catch {}
}

onMounted(loadData)
</script>

<style scoped>
.reports-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.report-card {
  padding: 24px; border-radius: 14px; color: #fff; text-align: center;
}
.report-card .rc-icon { font-size: 32px; margin-bottom: 8px; }
.report-card .rc-num { font-size: 28px; font-weight: 700; }
.report-card .rc-label { font-size: 13px; opacity: 0.75; margin-top: 4px; }
.r-card { border-radius: 14px; }
.bar-list { }
.bar-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
.bar-rank { width: 28px; font-weight: 700; color: #909399; }
.bar-name { width: 56px; font-size: 13px; }
.bar-track { flex: 1; height: 18px; background: #f0f0f5; border-radius: 9px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 9px; transition: width 0.8s ease; }
.bar-val { width: 40px; text-align: right; font-size: 12px; color: #606266; }
.doc-list { }
.doc-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
.doc-rank { width: 32px; font-weight: 700; text-align: center; }
.doc-name { flex: 1; font-weight: 500; }
.doc-dept { font-size: 12px; color: #909399; }
.doc-count { font-weight: 600; color: #409eff; }
.med-trend { display: flex; flex-wrap: wrap; gap: 8px; }
.med-item {
  padding: 8px 14px; border-radius: 8px; background: #f8f9fb;
  display: flex; gap: 12px; align-items: center; font-size: 13px;
}
.med-name { font-weight: 500; }
.med-qty { color: #e6a23c; font-weight: 600; }
.med-amount { color: #f56c6c; font-weight: 600; }
</style>
