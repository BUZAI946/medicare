<template>
  <div class="presc-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><Notebook /></el-icon>
        <div><h2>处方管理</h2><p>开立处方 · 取药确认 · 库存扣减</p></div>
      </div>
      <div class="hero-badge">
        <span>💊 待取药 {{ completedRegs.filter(r=>!prescMap[r.id]).length }}</span>
      </div>
    </div>

    <!-- 插图行 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="prescImgs[0]" class="hero-img" alt="药品" /></el-col>
      <el-col :span="8"><img :src="prescImgs[1]" class="hero-img" alt="分析" /></el-col>
      <el-col :span="8">
        <div style="background:linear-gradient(135deg,#f093fb,#f5576c);border-radius:12px;padding:18px 20px;color:#fff;aspect-ratio:16/9;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:20px;font-weight:bold;margin-bottom:4px">💊 处方管理系统</div>
          <div style="font-size:13px">开方→扣库存→取药→作废回滚</div>
          <div style="font-size:13px;margin-top:4px;opacity:0.85">安全扣减防超卖 · 全程原子事务</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="side-card">
          <template #header><span>✅ 已就诊患者</span></template>
          <div class="patient-list">
            <div v-for="reg in completedRegs" :key="reg.id" class="pat-row" :class="{active:selectedReg?.id===reg.id}" @click="handleSelectPatient(reg)">
              <el-avatar :size="38">{{ reg.patientName?.charAt(0) }}</el-avatar>
              <div class="pat-info">
                <div class="pat-name">
                  {{ reg.patientName }}
                  <el-tag v-if="prescMap[reg.id]" size="small" :type="prescMap[reg.id].status===0?'warning':'success'">已开方</el-tag>
                  <el-tag v-else size="small" type="info">未开方</el-tag>
                </div>
                <div class="pat-meta">{{ reg.doctorName }} · {{ reg.departmentName }} · #{{ reg.seqNo }}</div>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <el-empty v-if="completedRegs.length===0" description="暂无已就诊患者" :image-size="60" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card shadow="hover" class="side-card">
          <template #header>
            <div class="presc-head">
              <span>💊 {{ existingPrescription ? '已开处方' : '开立处方' }}</span>
              <el-tag v-if="existingPrescription" :type="prescTag(existingPrescription.status)" effect="dark">
                {{ prescText(existingPrescription.status) }}
              </el-tag>
            </div>
          </template>

          <div v-if="selectedReg">
            <div class="presc-patient-bar">
              <el-avatar :size="32">{{ selectedReg.patientName?.charAt(0) }}</el-avatar>
              <span>{{ selectedReg.patientName }}</span>
              <el-divider direction="vertical" />
              <span>👨‍⚕️ {{ selectedReg.doctorName }}</span>
            </div>

            <!-- 新开处方 -->
            <div v-if="!existingPrescription" class="presc-form">
              <div class="med-selector">
                <el-input v-model="medKw" placeholder="搜索药品" size="small" style="width:150px" @keyup.enter="searchMeds"><template #prefix><el-icon><Search /></el-icon></template></el-input>
                <el-select v-model="selectedMedId" placeholder="💊 选择药品" size="small" style="width:240px" filterable>
                  <el-option v-for="m in medResults" :key="m.id" :label="`${m.name} (${m.spec})`" :value="m.id">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span>{{ m.name }} <small style="color:#909399">{{ m.spec }}</small></span>
                      <span style="color:#f56c6c;font-weight:bold">¥{{ (m.price||0).toFixed(2) }}</span>
                    </div>
                    <small style="color:#909399">库存: {{ m.stock }} | 单位: {{ m.unit }}</small>
                  </el-option>
                </el-select>
                <el-input-number v-model="itemQty" :min="1" size="small" style="width:80px" placeholder="数量" />
                <el-input v-model="itemUsage" size="small" style="width:130px" placeholder="用法用量" />
                <el-button type="primary" size="small" @click="addItem"><el-icon><Plus /></el-icon></el-button>
              </div>
              <el-table :data="items" stripe border size="small" class="item-table">
                <el-table-column prop="medicineName" label="药品" />
                <el-table-column prop="medicineSpec" label="规格" width="100" />
                <el-table-column prop="quantity" label="数量" width="60" />
                <el-table-column label="单价" width="75"><template #default="{row}">¥{{(row.unitPrice||0).toFixed(2)}}</template></el-table-column>
                <el-table-column label="金额" width="75"><template #default="{row}">¥{{(row.amount||0).toFixed(2)}}</template></el-table-column>
                <el-table-column prop="usageDesc" label="用法" />
                <el-table-column label="" width="50"><template #default="{$index}"><el-button text type="danger" size="small" @click="items.splice($index,1)"><el-icon><Delete /></el-icon></el-button></template></el-table-column>
              </el-table>
              <div class="presc-footer">
                <div class="total-amount">💰 合计：<b>¥{{ totalAmount.toFixed(2) }}</b></div>
                <el-button type="primary" :disabled="items.length===0" @click="savePrescription" size="large">
                  <el-icon><DocumentAdd /></el-icon> 开立处方
                </el-button>
              </div>
            </div>

            <!-- 已有处方 -->
            <div v-else class="existing-presc">
              <el-table :data="existingPrescription.items||[]" stripe border size="small" class="item-table">
                <el-table-column prop="medicineName" label="药品" />
                <el-table-column prop="quantity" label="数量" width="60" />
                <el-table-column label="单价" width="75"><template #default="{row}">¥{{(row.unitPrice||0).toFixed(2)}}</template></el-table-column>
                <el-table-column prop="usageDesc" label="用法" />
              </el-table>
              <div class="presc-footer">
                <div class="total-amount">💰 合计：<b>¥{{ (existingPrescription.totalAmount||0).toFixed(2) }}</b></div>
                <div class="presc-actions">
                  <el-button v-if="existingPrescription.status===0" type="success" @click="handleDispense" size="large">
                    <el-icon><Check /></el-icon> 确认取药
                  </el-button>
                  <el-button v-if="existingPrescription.status===0" type="danger" @click="handleCancel" size="large">
                    <el-icon><Close /></el-icon> 作废处方
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="👈 请从左侧选择已就诊患者" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { listRegistrations } from '../../api/registration'
import { listMedicines } from '../../api/medicine'
import { listPrescriptions, getByRecord, createPrescription, dispensePrescription, cancelPrescription } from '../../api/prescription'
import { listMedicalRecords } from '../../api/medical-record'
import { prescImgs } from '../../utils/images'
import type { Registration, Medicine, Prescription, PrescriptionItem } from '../../types'

const completedRegs = ref<Registration[]>([])
const selectedReg = ref<Registration|null>(null)
const existingPrescription = ref<Prescription|null>(null)
const prescMap = reactive<Record<number,Prescription>>({})
const medKw = ref(''), medResults = ref<Medicine[]>([]), selectedMedId = ref<number>()
const itemQty = ref(1), itemUsage = ref('遵医嘱')
const items = ref<PrescriptionItem[]>([])

const prescText = (s:number)=>['待缴费','已缴费','已取药','已作废'][s]||'?'
const prescTag = (s:number)=>(['warning','','success','info'] as const)[s]||''
const totalAmount = computed(()=>items.value.reduce((s,i)=>s+(i.amount||0),0))

async function loadRegs(){try{const r=await listRegistrations();completedRegs.value=(r.data as Registration[]).filter(reg=>reg.status===2)}catch{}}
async function handleSelectPatient(row:Registration){
  selectedReg.value=row;items.value=[];existingPrescription.value=prescMap[row.id]||null
  // 预加载全部药品
  try{const r=await listMedicines('');medResults.value=r.data}catch{}
  try{const recs=await listMedicalRecords(row.patientId,row.id);const rec=(recs.data as any[])[0]
    if(rec){const pr=await getByRecord(rec.id);existingPrescription.value=pr.data;if(pr.data)prescMap[row.id]=pr.data}
  }catch{}
}
async function searchMeds(){
  if(!medKw.value.trim()){try{const r=await listMedicines('');medResults.value=r.data}catch{};return}
  try{const r=await listMedicines(medKw.value);medResults.value=r.data}catch{}
}
async function addItem(){
  const med=medResults.value.find(m=>m.id===selectedMedId.value)
  if(!med){ElMessage.warning('请选择药品');return}
  if(items.value.find(i=>i.medicineId===med.id)){ElMessage.warning('该药品已添加');return}
  const price=Number(med.price)||0
  const qty=itemQty.value
  items.value.push({medicineId:med.id!,quantity:qty,usageDesc:itemUsage.value||'遵医嘱',unitPrice:price,amount:price*qty,medicineName:med.name,medicineSpec:med.spec,medicineUnit:med.unit})
  ElMessage.success(`已添加：${med.name} x${qty} = ¥${(price*qty).toFixed(2)}`)
  medKw.value='';selectedMedId.value=undefined;itemQty.value=1;itemUsage.value='遵医嘱'
  // 重新搜索所有药品保持列表
  try{const r=await listMedicines('');medResults.value=r.data}catch{}
}
async function savePrescription(){
  if(!selectedReg.value||items.value.length===0)return
  try{const recs=await listMedicalRecords(selectedReg.value.patientId,selectedReg.value.id);const rec=(recs.data as any[])[0]
    if(!rec){ElMessage.error('未找到病历');return}
    await createPrescription({prescription:{recordId:rec.id,patientId:selectedReg.value.patientId,doctorId:selectedReg.value.doctorId||selectedReg.value.doctorId!,status:0},items:items.value})
    ElMessage.success('处方开立成功');items.value=[];handleSelectPatient(selectedReg.value)
  }catch{}
}
async function handleDispense(){if(!existingPrescription.value)return;try{await dispensePrescription(existingPrescription.value.id!);ElMessage.success('取药成功');if(selectedReg.value)handleSelectPatient(selectedReg.value)}catch{}}
async function handleCancel(){if(!existingPrescription.value)return;try{await cancelPrescription(existingPrescription.value.id!);ElMessage.success('已作废');if(selectedReg.value)handleSelectPatient(selectedReg.value)}catch{}}
onMounted(loadRegs)
</script>

<style scoped>
.presc-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.hero-badge { font-size: 14px; }
.side-card { border-radius: 12px; height: calc(100vh - 160px); overflow-y: auto; }
.presc-head { display: flex; justify-content: space-between; align-items: center; }

.patient-list { }
.pat-row {
  display: flex; align-items: center; gap: 10px; padding: 10px; margin-bottom: 6px;
  border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent;
}
.pat-row:hover { background: #f5f7fa; }
.pat-row.active { border-color: #f56c6c; background: #fef0f0; }
.pat-info { flex: 1; }
.pat-name { font-weight: 500; }
.pat-meta { font-size: 12px; color: #909399; }

.presc-patient-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px; background: #f5f7fa; border-radius: 8px; margin-bottom: 14px;
}
.med-selector { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.item-table { border-radius: 8px; margin-bottom: 14px; }
.presc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; }
.total-amount { font-size: 18px; }
.total-amount b { color: #f56c6c; }
.presc-actions { display: flex; gap: 8px; }
</style>
