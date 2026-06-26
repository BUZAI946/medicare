<template>
  <div class="record-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><Notebook /></el-icon>
        <div><h2>病历管理</h2><p>查看和管理所有患者病历档案</p></div>
      </div>
      <el-statistic title="病历总数" :value="recordList.length" prefix="📋" />
    </div>

    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="recordImgs[0]" class="hero-img" alt="病历" /></el-col>
      <el-col :span="8"><img :src="recordImgs[1]" class="hero-img" alt="诊室" /></el-col>
      <el-col :span="8">
        <div style="background:linear-gradient(135deg,#a18cd1,#fbc2eb);border-radius:12px;padding:18px 20px;color:#4a2d5c;aspect-ratio:16/9;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:20px;font-weight:bold;margin-bottom:4px">📋 电子病历档案</div>
          <div style="font-size:13px">数字化存储 · 快速检索 · 隐私保护</div>
          <div style="font-size:13px;margin-top:4px;opacity:0.8">1挂号=1病历 · 完整就诊记录</div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon :size="20"><Document /></el-icon>
            <span>病历档案列表</span>
          </div>
          <div class="header-stats">
            <div class="stat-chip chip-purple">
              <span class="chip-num">{{ recordList.length }}</span>
              <span class="chip-label">总病历</span>
            </div>
            <div class="stat-chip chip-blue">
              <span class="chip-num">{{ patientCount }}</span>
              <span class="chip-label">患者数</span>
            </div>
            <div class="stat-chip chip-orange">
              <span class="chip-num">{{ diagnosedCount }}</span>
              <span class="chip-label">已诊断</span>
            </div>
          </div>
        </div>
      </template>
      <el-table :data="recordList" stripe border class="data-table" @row-click="viewDetail">
        <el-table-column prop="id" label="ID" width="65" />
        <el-table-column prop="patientName" label="患者" width="110">
          <template #default="{ row }"><div class="info-cell"><el-avatar :size="28">{{ row.patientName?.charAt(0) }}</el-avatar>{{ row.patientName }}</div></template>
        </el-table-column>
        <el-table-column prop="doctorName" label="医生" width="90" />
        <el-table-column prop="chiefComplaint" label="主诉" min-width="160" show-overflow-tooltip />
        <el-table-column prop="diagnosis" label="诊断" width="140" show-overflow-tooltip>
          <template #default="{ row }"><el-tag v-if="row.diagnosis" type="danger" effect="dark" size="small">{{ row.diagnosis }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="105" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }"><el-button text type="primary" size="small" @click.stop="viewDetail(row)">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="📋 病历详情" width="680px" destroy-on-close>
      <template v-if="currentRecord">
        <div class="record-header">
          <div class="rh-patient">
            <el-avatar :size="44">{{ currentRecord.patientName?.charAt(0) }}</el-avatar>
            <div>
              <div class="rh-name">{{ currentRecord.patientName }}</div>
              <div class="rh-meta">👨‍⚕️ {{ currentRecord.doctorName }}</div>
            </div>
          </div>
        </div>
        <el-descriptions :column="1" border class="record-desc">
          <el-descriptions-item label="主诉"><span class="desc-text">{{ currentRecord.chiefComplaint || '—' }}</span></el-descriptions-item>
          <el-descriptions-item label="现病史"><span class="desc-text">{{ currentRecord.presentIllness || '—' }}</span></el-descriptions-item>
          <el-descriptions-item label="既往史">{{ currentRecord.pastHistory || '—' }}</el-descriptions-item>
          <el-descriptions-item label="体格检查">{{ currentRecord.physicalExam || '—' }}</el-descriptions-item>
          <el-descriptions-item label="诊断"><el-tag v-if="currentRecord.diagnosis" type="danger" effect="dark">{{ currentRecord.diagnosis }}</el-tag><span v-else>—</span></el-descriptions-item>
          <el-descriptions-item label="医嘱"><span class="desc-text">{{ currentRecord.advice || '—' }}</span></el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { listMedicalRecords } from '../../api/medical-record'
import { recordImgs } from '../../utils/images'
import type { MedicalRecord } from '../../types'

const recordList = ref<MedicalRecord[]>([])
const detailVisible = ref(false)
const currentRecord = ref<MedicalRecord|null>(null)

const patientCount = computed(() => new Set(recordList.value.map(r => r.patientId)).size)
const diagnosedCount = computed(() => recordList.value.filter(r => r.diagnosis).length)

async function loadData(){try{const r=await listMedicalRecords();recordList.value=r.data}catch{}}
function viewDetail(row:MedicalRecord){currentRecord.value=row;detailVisible.value=true}
onMounted(loadData)
</script>

<style scoped>
.record-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.main-card { border-radius: 12px; }
.card-header {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}
.header-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 600; color: #303133;
}
.header-stats { display: flex; gap: 10px; }
.stat-chip {
  display: flex; flex-direction: column; align-items: center;
  padding: 6px 18px; border-radius: 10px; min-width: 72px;
}
.chip-purple { background: linear-gradient(135deg, #f3e8ff, #e9d5ff); color: #7c3aed; }
.chip-blue   { background: linear-gradient(135deg, #e0f2fe, #bae6fd); color: #0284c7; }
.chip-orange { background: linear-gradient(135deg, #fff7ed, #fed7aa); color: #ea580c; }
.chip-num   { font-size: 20px; font-weight: 700; line-height: 1.2; }
.chip-label { font-size: 11px; opacity: 0.75; }
.data-table { border-radius: 8px; cursor: pointer; }
.info-cell { display: flex; align-items: center; gap: 8px; }
.record-header { padding: 8px 0 16px; border-bottom: 1px solid #eee; margin-bottom: 16px; }
.rh-patient { display: flex; align-items: center; gap: 12px; }
.rh-name { font-size: 18px; font-weight: bold; }
.rh-meta { font-size: 13px; color: #909399; }
.record-desc { border-radius: 8px; }
.desc-text { color: #303133; line-height: 1.7; }
</style>
