<template>
  <div class="payment-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><Money /></el-icon>
        <div><h2>收费管理</h2><p>门诊收费 · 处方结算 · 退款管理</p></div>
      </div>
      <div class="hero-badge">
        <span class="hero-stat">待收 <b>{{ pendingCount }}</b></span>
        <span class="hero-stat">已收 <b>{{ paidCount }}</b></span>
        <span class="hero-stat">退款 <b>{{ refundedCount }}</b></span>
      </div>
    </div>

    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-head">
          <div>
            <el-select v-model="filterStatus" placeholder="状态筛选" clearable size="small" style="width:130px" @change="loadData">
              <el-option label="待缴费" :value="0" />
              <el-option label="已缴费" :value="1" />
              <el-option label="已退款" :value="2" />
            </el-select>
          </div>
          <el-button type="primary" size="small" @click="openCreateDialog">
            <el-icon><Plus /></el-icon> 新增收费
          </el-button>
        </div>
      </template>
      <el-table :data="paymentList" stripe border @row-click="viewDetail">
        <el-table-column prop="id" label="ID" width="65" />
        <el-table-column prop="patientName" label="患者" width="100" />
        <el-table-column label="类型" width="90">
          <template #default="{ row }">
            <el-tag :type="row.registrationType==='挂号费'?'':'danger'" size="small" effect="plain">
              {{ row.registrationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="100">
          <template #default="{ row }">¥{{ Number(row.amount||0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="100">
          <template #default="{ row }">{{ methodText(row.paymentMethod) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="['warning','success','info'][row.status]" size="small" effect="dark">
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        <el-table-column prop="createTime" label="时间" width="105" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status===0" text type="success" size="small" @click.stop="handlePay(row.id)">收费</el-button>
            <el-button v-if="row.status===1" text type="warning" size="small" @click.stop="handleRefund(row.id)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="paymentList.length===0" description="暂无收费记录" :image-size="60" />
    </el-card>

    <!-- 新增收费弹窗 -->
    <el-dialog v-model="createVisible" title="新增收费" width="500px" destroy-on-close>
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="患者">
          <el-select v-model="createForm.patientId" filterable placeholder="搜索患者" style="width:100%">
            <el-option v-for="p in patientList" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收费类型">
          <el-radio-group v-model="createType" @change="createForm.registrationId=undefined;createForm.prescriptionId=undefined">
            <el-radio value="registration">挂号费</el-radio>
            <el-radio value="prescription">处方费</el-radio>
            <el-radio value="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="createType==='registration'" label="挂号">
          <el-select v-model="createForm.registrationId" filterable placeholder="选择挂号记录" style="width:100%">
            <el-option v-for="r in regList" :key="r.id" :label="`#${r.id} ${r.patientName} · ${r.doctorName} · ¥${r.fee}`" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="createType==='prescription'" label="处方">
          <el-select v-model="createForm.prescriptionId" filterable placeholder="选择处方" style="width:100%">
            <el-option v-for="p in prescList" :key="p.id" :label="`#${p.id} ${p.patientName} · ${p.doctorName} · ¥${p.totalAmount}`" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" required>
          <el-input-number v-model="createForm.amount" :min="0.01" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="createForm.paymentMethod" style="width:100%">
            <el-option label="现金" value="CASH" />
            <el-option label="微信" value="WECHAT" />
            <el-option label="支付宝" value="ALIPAY" />
            <el-option label="银行卡" value="CARD" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="createForm.remark" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible=false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listPayments, createPayment, payPayment, refundPayment } from '../../api/payment'
import { listPatients } from '../../api/patient'
import { listRegistrations } from '../../api/registration'
import { listPrescriptions } from '../../api/prescription'
import type { Payment, Patient, Registration, Prescription } from '../../types'

const paymentList = ref<Payment[]>([])
const filterStatus = ref<number>()
const createVisible = ref(false)
const createType = ref('registration')
const patientList = ref<Patient[]>([])
const regList = ref<Registration[]>([])
const prescList = ref<Prescription[]>([])
const createForm = ref({ patientId: undefined as number|undefined, registrationId: undefined as number|undefined, prescriptionId: undefined as number|undefined, amount: 10.00, paymentMethod: 'CASH', remark: '' })

const pendingCount = computed(() => paymentList.value.filter(p => p.status === 0).length)
const paidCount = computed(() => paymentList.value.filter(p => p.status === 1).length)
const refundedCount = computed(() => paymentList.value.filter(p => p.status === 2).length)

function statusText(s: number) { return ['待缴费','已缴费','已退款'][s] || '未知' }
function methodText(m: string) {
  const map: Record<string,string> = { CASH:'现金', WECHAT:'微信', ALIPAY:'支付宝', CARD:'银行卡' }
  return map[m] || m
}

async function loadData() {
  try { const r = await listPayments(undefined, filterStatus.value); paymentList.value = r.data } catch {}
}

async function openCreateDialog() {
  createVisible.value = true
  createType.value = 'registration'
  createForm.value = { patientId: undefined, registrationId: undefined, prescriptionId: undefined, amount: 10.00, paymentMethod: 'CASH', remark: '' }
  try { const [p, r, x] = await Promise.all([listPatients(), listRegistrations(), listPrescriptions()]); patientList.value = p.data; regList.value = r.data as any; prescList.value = x.data as any } catch {}
}

async function handleCreate() {
  if (!createForm.value.patientId) { ElMessage.warning('请选择患者'); return }
  if (createType.value === 'registration' && !createForm.value.registrationId) { ElMessage.warning('请选择挂号记录'); return }
  if (createType.value === 'prescription' && !createForm.value.prescriptionId) { ElMessage.warning('请选择处方'); return }
  if (!createForm.value.amount || createForm.value.amount <= 0) { ElMessage.warning('请输入有效金额'); return }
  try {
    await createPayment(createForm.value as any)
    ElMessage.success('收费记录已创建')
    createVisible.value = false
    loadData()
  } catch {}
}

async function handlePay(id: number) {
  try { await ElMessageBox.confirm('确认收款？', '提示', { type: 'info' }) } catch { return }
  try { await payPayment(id); ElMessage.success('收款成功'); loadData() } catch {}
}

async function handleRefund(id: number) {
  try { await ElMessageBox.confirm('确认退款？', '提示', { type: 'warning' }) } catch { return }
  try { await refundPayment(id); ElMessage.success('已退款'); loadData() } catch {}
}

function viewDetail(_row: Payment) {}

onMounted(loadData)
</script>

<style scoped>
.payment-view { padding: 0; }
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
.main-card { border-radius: 12px; }
.card-head { display: flex; justify-content: space-between; align-items: center; }
</style>
