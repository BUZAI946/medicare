<template>
  <div class="cal-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><Calendar /></el-icon>
        <div><h2>预约日历</h2><p>按日查看各科室医生排班与预约情况</p></div>
      </div>
      <div class="hero-badge">
        <el-button-group>
          <el-button size="small" @click="changeWeek(-1)">上一周</el-button>
          <el-button size="small" type="primary">{{ weekRange }}</el-button>
          <el-button size="small" @click="changeWeek(1)">下一周</el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 日历网格 -->
    <el-card shadow="hover" class="cal-card">
      <div class="cal-grid">
        <div class="cal-header">
          <div class="cal-time-col"></div>
          <div v-for="d in weekDays" :key="d.date" class="cal-day-head" :class="{ today: d.isToday }">
            <div class="cal-day-name">{{ d.dayName }}</div>
            <div class="cal-day-date">{{ d.dateStr }}</div>
          </div>
        </div>
        <div class="cal-body">
          <div v-for="dept in deptList" :key="dept.id" class="cal-row">
            <div class="cal-dept">{{ dept.name }}</div>
            <div v-for="d in weekDays" :key="d.date" class="cal-cell">
              <div v-for="s in getDeptDaySchedules(dept.id, d.date)" :key="s.id"
                class="cal-slot clickable"
                :class="{ full: s.remainSlots === 0 }"
                @click="$router.push('/registration')">
                <div class="slot-doc">{{ s.doctorName }}</div>
                <div class="slot-info">{{ s.timeSlot?.replace('(',' ')?.replace(')','') }} · {{ s.remainSlots }}/{{ s.totalSlots }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { listDepartments } from '../../api/department'
import { listSchedules } from '../../api/schedule'
import type { Department, Schedule } from '../../types'

const deptList = ref<Department[]>([])
const schedMap = ref<Record<string, Schedule[]>>({})
const weekOffset = ref(0)

const weekDays = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() + weekOffset.value * 7)
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      date: d.toISOString().slice(0, 10),
      dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      dayName: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
      isToday: d.toDateString() === new Date().toDateString(),
    }
  })
})

const weekRange = computed(() => {
  const w = weekDays.value
  return `${w[0].dateStr} ~ ${w[6].dateStr}`
})

function getDeptDaySchedules(deptId: number, date: string): Schedule[] {
  return (schedMap.value[date] || []).filter(s => {
    const doc = deptList.value.find(d => d.id === deptId)
    return s.departmentName === doc?.name
  })
}

function changeWeek(dir: number) { weekOffset.value += dir; loadData() }

async function loadData() {
  try {
    const depts = await listDepartments()
    deptList.value = depts.data
    const map: Record<string, Schedule[]> = {}
    for (const d of weekDays.value) {
      const r = await listSchedules(d.date)
      map[d.date] = r.data || []
    }
    schedMap.value = map
  } catch {}
}

onMounted(loadData)
</script>

<style scoped>
.cal-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.hero-badge { display: flex; gap: 10px; }
.cal-card { border-radius: 14px; overflow-x: auto; }
.cal-grid { min-width: 900px; }
.cal-header { display: grid; grid-template-columns: 80px repeat(7, 1fr); gap: 1px; background: rgba(0,0,0,0.04); border-radius: 8px 8px 0 0; }
.cal-time-col { height: 56px; }
.cal-day-head { text-align: center; padding: 10px 4px; background: #f8f9fb; }
.cal-day-head.today { background: #eef2ff; color: #667eea; font-weight: 700; }
.cal-day-name { font-size: 13px; opacity: 0.7; }
.cal-day-date { font-size: 16px; font-weight: 600; }
.cal-body { }
.cal-row { display: grid; grid-template-columns: 80px repeat(7, 1fr); gap: 1px; background: rgba(0,0,0,0.04); }
.cal-dept {
  padding: 10px 8px; font-weight: 600; font-size: 13px;
  background: #f0f0f5; display: flex; align-items: center; justify-content: center;
  color: #5a5a7a;
}
.cal-cell { padding: 4px; min-height: 70px; background: #fff; }
.cal-slot {
  padding: 4px 6px; margin-bottom: 3px; border-radius: 6px;
  background: linear-gradient(135deg, #eef2ff, #e8e9ff); border-left: 3px solid #667eea;
  font-size: 11px;
}
.cal-slot.full { opacity: 0.5; border-left-color: #ccc; }
.slot-doc { font-weight: 600; }
.slot-info { opacity: 0.6; }
.clickable { cursor: pointer; }
</style>
