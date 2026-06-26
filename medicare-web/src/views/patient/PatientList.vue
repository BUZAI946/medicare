<template>
  <div class="patient-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="30"><User /></el-icon>
        <div><h2>患者管理</h2><p>管理所有患者档案信息</p></div>
      </div>
      <el-statistic title="患者总数" :value="tableData.length" prefix="👥" />
    </div>

    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-input v-model="keyword" placeholder="搜索姓名/身份证/手机号…" size="large" style="width:300px" clearable @clear="loadData" @keyup.enter="handleSearch">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-button type="primary" size="large" @click="openDialog()"><el-icon><Plus /></el-icon> 新增患者</el-button>
          </div>
          <div class="header-stats">
            <div class="mini-stat"><span class="dot male"></span>男 {{ genderCount(1) }}</div>
            <div class="mini-stat"><span class="dot female"></span>女 {{ genderCount(0) }}</div>
          </div>
        </div>
      </template>

      <el-table :data="tableData" stripe border class="data-table" :default-sort="{prop:'id',order:'ascending'}" @row-dblclick="openDialog">
        <el-table-column prop="id" label="ID" width="65" sortable />
        <el-table-column prop="name" label="姓名" width="110">
          <template #default="{ row }">
            <div class="patient-cell">
              <el-avatar :size="32" :style="{background: row.gender===0?'#f56c6c':'#409eff'}">
                {{ row.name?.charAt(0) }}
              </el-avatar>
              <span class="patient-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="185" />
        <el-table-column prop="gender" label="性别" width="65" align="center">
          <template #default="{ row }">
            <el-tag :type="row.gender===0?'danger':''" effect="dark" size="small">
              {{ row.gender===0?'♀ 女':'♂ 男' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" label="出生" width="100" />
        <el-table-column prop="phone" label="手机号" width="135" />
        <el-table-column prop="address" label="住址" show-overflow-tooltip min-width="140" />
        <el-table-column prop="allergyInfo" label="过敏史" width="130">
          <template #default="{ row }">
            <el-tag v-if="row.allergyInfo" type="danger" size="small" effect="plain">
              ⚠ {{ row.allergyInfo.length>8?row.allergyInfo.slice(0,8)+'…':row.allergyInfo }}
            </el-tag>
            <span v-else class="text-muted">无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="openDialog(row)"><el-icon><Edit /></el-icon></el-button>
            <el-popconfirm title="确定删除该患者?" @confirm="handleDelete(row.id)">
              <template #reference><el-button text type="danger" size="small"><el-icon><Delete /></el-icon></el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页信息条 -->
      <div class="table-footer-bar">
        <span>共 <b>{{ tableData.length }}</b> 条记录</span>
        <span style="color:#909399">双击行可编辑患者信息</span>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit?'编辑患者':'新增患者'" width="580px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="身份证号" prop="idCard"><el-input v-model="form.idCard" maxlength="18" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender"><el-radio-group v-model="form.gender"><el-radio :value="0">♀ 女</el-radio><el-radio :value="1">♂ 男</el-radio></el-radio-group></el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="出生日期"><el-date-picker v-model="form.birthDate" type="date" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="住址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="过敏史"><el-input v-model="form.allergyInfo" type="textarea" :rows="2" placeholder="如：青霉素过敏" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { listPatients, searchPatients, createPatient, updatePatient, deletePatient } from '../../api/patient'
import { listRegistrations } from '../../api/registration'
import { listMedicalRecords } from '../../api/medical-record'
import { listPrescriptions } from '../../api/prescription'
import PatientPopover from '../../components/PatientPopover.vue'
import type { Patient } from '../../types'

// 时间线
const timelineVisible = ref(false)
const timelinePatient = ref<Patient|null>(null)
const timelineData = ref<any[]>([])
async function openTimeline(row: Patient) {
  timelinePatient.value = row
  timelineVisible.value = true
  timelineData.value = []
  if (!row.id) return
  try {
    const [regs, recs, prescs] = await Promise.all([
      listRegistrations(undefined, undefined),
      listMedicalRecords(row.id),
      listPrescriptions(row.id)
    ])
    const items: any[] = []
    const patientRegs = (regs.data as any[]).filter(r => r.patientId === row.id).sort((a,b) => new Date(a.regTime||0).getTime() - new Date(b.regTime||0).getTime())
    for (const r of patientRegs) {
      items.push({ title: `挂号 — ${r.departmentName} · ${r.doctorName}`, desc: `序号#${r.seqNo} 状态：${['候诊','就诊中','已完成','已取消'][r.status]}`, time: r.regTime || r.createTime, color: '#409eff' })
      const rec = (recs.data as any[]).find((x:any) => x.registrationId === r.id)
      if (rec) {
        items.push({ title: `病历 — 诊断：${rec.diagnosis || '待诊断'}`, desc: `主诉：${rec.chiefComplaint || '—'} · 医嘱：${rec.advice || '—'}`, time: rec.createTime, color: '#e6a23c' })
        const presc = (prescs.data as any[]).find((p:any) => p.recordId === rec.id)
        if (presc) {
          const meds = (presc.items || []).map((i:any) => i.medicineName).join('、')
          items.push({ title: `处方 — ¥${Number(presc.totalAmount||0).toFixed(2)}`, desc: `药品：${meds || '—'} 状态：${['待缴费','已缴费','已取药','已作废'][presc.status]}`, time: presc.createTime, color: '#67c23a' })
        }
      }
    }
    timelineData.value = items
  } catch {}
}

const route = useRoute()
const tableData = ref<Patient[]>([])
const keyword = ref((route.query.search as string) || '')
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const defaultForm = (): Patient => ({ idCard:'', name:'', gender:1, birthDate:'', phone:'', address:'', allergyInfo:'' })
const form = reactive<Patient>(defaultForm())
const rules = {
  name: [{ required:true, message:'请输入姓名' }],
  idCard: [{ required:true, message:'请输入身份证号' }, { pattern:/^\d{17}[\dXx]$/, message:'格式不正确' }],
  gender: [{ required:true, message:'请选择性别' }],
}

const genderCount = (g: number) => tableData.value.filter(p => p.gender === g).length

async function loadData() { try { const r = await listPatients(); tableData.value = r.data } catch {} }
async function handleSearch() {
  if(!keyword.value) { loadData(); return }
  try { const r = await searchPatients(keyword.value); tableData.value = r.data } catch {}
}
function openDialog(row?: Patient) { isEdit.value=!!row; Object.assign(form, row?{...row}:defaultForm()); dialogVisible.value=true }
async function handleSave() {
  const v = await formRef.value?.validate().catch(()=>false); if(!v) return
  try { isEdit.value&&form.id ? await updatePatient(form.id,form) : await createPatient(form); ElMessage.success('保存成功'); dialogVisible.value=false; loadData() } catch {}
}
async function handleDelete(id: number) { try { await deletePatient(id); ElMessage.success('已删除'); loadData() } catch {} }
onMounted(loadData)
</script>

<style scoped>
.patient-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.main-card { border-radius: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-left { display: flex; gap: 10px; }
.header-stats { display: flex; gap: 16px; }
.mini-stat { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #606266; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.male { background: #409eff; } .dot.female { background: #f56c6c; }
.data-table { border-radius: 8px; }
.patient-cell { display: flex; align-items: center; gap: 10px; }
.patient-name { font-weight: 500; }
.text-muted { color: #c0c4cc; }
.table-footer-bar { display: flex; justify-content: space-between; padding: 10px 0 0; font-size: 13px; color: #606266; }
</style>
