<template>
  <div class="reg-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><Calendar /></el-icon>
        <div><h2>挂号预约</h2><p>管理患者挂号与候诊队列</p></div>
      </div>
      <div class="hero-badge">
        <span class="hero-stat">总挂号 <b>{{ regList.length }}</b></span>
        <span class="hero-stat" style="background:rgba(255,255,255,0.2)">候诊 <b>{{ regList.filter(r=>r.status===0).length }}</b></span>
        <span class="hero-stat" style="background:rgba(255,255,255,0.2)">完成 <b>{{ regList.filter(r=>r.status===2).length }}</b></span>
        <span class="hero-stat" style="background:rgba(255,255,255,0.2)">号源 <b>{{ schedList.length }}</b></span>
      </div>
    </div>

    <!-- 插图行 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="regImgs[0]" class="hero-img" alt="预约" /></el-col>
      <el-col :span="8"><img :src="regImgs[1]" class="hero-img" alt="挂号" /></el-col>
      <el-col :span="8">
        <div style="background:linear-gradient(135deg,#fccb90,#d57eeb);border-radius:12px;padding:18px 20px;color:#5a2d82;aspect-ratio:16/9;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:20px;font-weight:bold;margin-bottom:4px">📅 智能挂号系统</div>
          <div style="font-size:13px">选择科室 → 选择医生 → 选择时段 → 确认挂号</div>
          <div style="font-size:13px;margin-top:4px;opacity:0.8">原子扣减号源 · 防超卖 · 自动排序号</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="13">
        <el-card shadow="hover" class="main-card">
          <template #header>
            <div class="card-head">
              <span>📋 可用号源</span>
              <div style="display:flex;gap:8px">
                <el-date-picker v-model="queryDate" type="date" value-format="YYYY-MM-DD" size="small" @change="loadSchedules" />
                <el-select v-model="querySlot" placeholder="时段" clearable size="small" style="width:130px" @change="loadSchedules">
                  <el-option label="上午" value="上午" />
                  <el-option label="下午" value="下午" />
                </el-select>
                <el-select v-model="queryDeptId" placeholder="科室" clearable size="small" style="width:130px" @change="loadSchedules">
                  <el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="sched-grid">
            <div v-for="s in schedList" :key="s.id" class="sched-item" :class="{ selected: selectedSchedule?.id===s.id }" @click="handleSelectSchedule(s)">
              <div class="sched-head">
                <el-avatar :size="36">{{ s.doctorName?.charAt(0) }}</el-avatar>
                <div>
                  <div class="sched-doc">{{ s.doctorName }}</div>
                  <div class="sched-dept">{{ s.departmentName }}</div>
                </div>
              </div>
              <div class="sched-body">
                <el-tag :type="s.timeSlot==='上午'?'':s.timeSlot==='下午'?'warning':'info'" size="small">{{ s.timeSlot }}</el-tag>
                <span class="sched-slots">剩余 <b :style="{color:s.remainSlots>0?'#67c23a':'#f56c6c'}">{{ s.remainSlots }}</b> / {{ s.totalSlots }}</span>
              </div>
              <div class="slot-progress"><div class="slot-fill" :style="{width:(s.remainSlots/(s.totalSlots||1)*100)+'%',background:s.remainSlots>0?'#67c23a':'#f56c6c'}"></div></div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="11">
        <el-card shadow="hover" class="main-card">
          <template #header>
            <div class="card-head">
              <span>📝 挂号记录</span>
              <el-button type="primary" :disabled="!selectedSchedule" @click="openRegDialog" size="small">
                <el-icon><Plus /></el-icon> 挂号
              </el-button>
            </div>
          </template>
          <div class="reg-list">
            <div v-for="r in regList" :key="r.id" class="reg-item">
              <div class="reg-num">#{{ r.seqNo }}</div>
              <div class="reg-info">
                <div class="reg-name">{{ r.patientName }}</div>
                <div class="reg-meta">{{ r.doctorName }} · {{ r.timeSlot }}</div>
              </div>
              <el-tag :type="['warning','primary','success','info'][r.status]" size="small" effect="dark">
                {{ ['候诊','就诊中','已完成','已取消'][r.status] }}
              </el-tag>
              <el-button v-if="r.status===0" text type="danger" size="small" @click="handleCancel(r.id)">取消</el-button>
            </div>
            <el-empty v-if="regList.length===0" description="暂无挂号记录" :image-size="60" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="regDialogVisible" title="选择患者" width="750px" destroy-on-close>
      <el-input v-model="patientKw" placeholder="🔍 搜索患者姓名/身份证/手机…" size="large" style="margin-bottom:16px" @keyup.enter="handleSearchPatients" clearable />
      <el-table :data="patientList" stripe border @row-click="handleSelectPatient" highlight-current-row max-height="350">
        <el-table-column prop="name" label="姓名" width="100"><template #default="{row}"><div class="pat-cell"><el-avatar :size="28">{{row.name?.charAt(0)}}</el-avatar>{{row.name}}</div></template></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="175" />
        <el-table-column prop="phone" label="手机号" width="125" />
        <el-table-column prop="allergyInfo" label="过敏史"><template #default="{row}"><el-tag v-if="row.allergyInfo" type="danger" size="small" effect="plain">⚠ {{row.allergyInfo}}</el-tag></template></el-table-column>
      </el-table>
      <template #footer><el-button @click="regDialogVisible=false">取消</el-button><el-button type="primary" :disabled="!selectedPatient" @click="handleRegister">确认挂号</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listDepartments } from '../../api/department'
import { getAvailableSchedules, createSchedule } from '../../api/schedule'
import { listRegistrations, register, cancelRegistration } from '../../api/registration'
import { listPatients, searchPatients } from '../../api/patient'
import { regImgs } from '../../utils/images'
import type { Department, Schedule, Registration, Patient } from '../../types'

const deptList = ref<Department[]>([])
const schedList = ref<Schedule[]>([])
const regList = ref<Registration[]>([])
const queryDate = ref(new Date().toISOString().slice(0,10))
const querySlot = ref('')
const queryDeptId = ref<number>()
const selectedSchedule = ref<Schedule|null>(null)
const regDialogVisible = ref(false)
const patientKw = ref('')
const patientList = ref<Patient[]>([])
const selectedPatient = ref<Patient|null>(null)

async function loadSchedules(){try{const r=await getAvailableSchedules(queryDate.value,queryDeptId.value);let list=r.data||[];if(querySlot.value)list=list.filter((s:any)=>s.timeSlot?.includes(querySlot.value));schedList.value=list}catch{}}
async function loadRegs(){try{const r=await listRegistrations(queryDate.value);regList.value=r.data}catch{}}
function handleSelectSchedule(row:Schedule){selectedSchedule.value=row}
async function openRegDialog(){regDialogVisible.value=true;patientKw.value='';selectedPatient.value=null;try{const r=await listPatients();patientList.value=r.data}catch{}}
async function handleSearchPatients(){try{if(!patientKw.value.trim()){const r=await listPatients();patientList.value=r.data}else{const r=await searchPatients(patientKw.value.trim());patientList.value=r.data}}catch{}}
function handleSelectPatient(row:Patient){selectedPatient.value=row}
async function handleRegister(){if(!selectedSchedule.value||!selectedPatient.value)return;try{await register({patientId:selectedPatient.value.id!,scheduleId:selectedSchedule.value.id!});ElMessage.success('挂号成功');regDialogVisible.value=false;loadSchedules();loadRegs()}catch{}}
async function handleCancel(id:number){try{await cancelRegistration(id);ElMessage.success('已取消');loadRegs();loadSchedules()}catch{}}
onMounted(async()=>{await listDepartments().then(r=>deptList.value=r.data);loadSchedules();loadRegs()})
</script>

<style scoped>
.reg-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.hero-badge { display: flex; gap: 10px; font-size: 13px; }
.hero-stat { padding: 4px 14px; border-radius: 8px; background: rgba(255,255,255,0.15); }
.hero-stat b { font-size: 18px; }
.main-card { border-radius: 12px; height: calc(100vh - 160px); overflow-y: auto; }
.card-head { display: flex; justify-content: space-between; align-items: center; }

/* 号源网格 */
.sched-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sched-item {
  padding: 12px; border-radius: 10px; border: 2px solid #eee; cursor: pointer;
  transition: all 0.3s;
}
.sched-item:hover, .sched-item.selected { border-color: #e6a23c; background: #fef8f0; }
.sched-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.sched-doc { font-weight: 600; }
.sched-dept { font-size: 12px; color: #909399; }
.sched-body { display: flex; justify-content: space-between; align-items: center; }
.sched-slots { font-size: 13px; color: #606266; }
.slot-progress { height: 4px; background: #eee; border-radius: 2px; margin-top: 8px; }
.slot-fill { height: 100%; border-radius: 2px; transition: width 0.5s; }

/* 挂号记录 */
.reg-list { max-height: 500px; overflow-y: auto; }
.reg-item {
  display: flex; align-items: center; gap: 10px; padding: 10px; margin-bottom: 6px;
  border-radius: 8px; background: #fafafa; transition: background 0.2s;
}
.reg-item:hover { background: #f0f0f0; }
.reg-num { font-weight: bold; font-size: 16px; color: #409eff; min-width: 32px; }
.reg-info { flex: 1; }
.reg-name { font-weight: 500; }
.reg-meta { font-size: 12px; color: #909399; }
.pat-cell { display: flex; align-items: center; gap: 8px; }
</style>
