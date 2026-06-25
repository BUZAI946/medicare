<template>
  <div>
    <!-- 插图行 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="medicineImgs[0]" class="hero-img" alt="药品" /></el-col>
      <el-col :span="8"><img :src="medicineImgs[1]" class="hero-img" alt="药房" /></el-col>
      <el-col :span="8">
        <div style="background:linear-gradient(135deg,#43e97b,#38f9d7);border-radius:12px;padding:20px;color:#1a5c2e;display:flex;flex-direction:column;justify-content:center;aspect-ratio:16/9">
          <div style="font-size:18px;font-weight:bold;margin-bottom:6px">📦 智能库存管理</div>
          <div style="font-size:13px;line-height:1.6">实时监控 · 热力预警</div>
          <div style="font-size:13px;line-height:1.6">自动补货 · 效期管理</div>
        </div>
      </el-col>
    </el-row>

    <!-- 库存热力概览 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="card in heatCards" :key="card.label">
        <div class="heat-card" :style="{ background: card.bg }">
          <div class="heat-num">{{ card.count }}</div>
          <div class="heat-label">{{ card.label }}</div>
          <div class="heat-icon"><el-icon :size="36"><component :is="card.icon" /></el-icon></div>
        </div>
      </el-col>
    </el-row>

    <!-- 智能补货建议 + 库存表格 -->
    <el-row :gutter="16">
      <!-- 左侧：智能补货建议 -->
      <el-col :span="7">
        <el-card shadow="hover" class="restock-card">
          <template #header>
            <div class="restock-header">
              <span><el-icon><ShoppingCart /></el-icon> 🛒 智能补货建议</span>
              <el-tag type="danger" size="small" effect="dark">创新功能</el-tag>
            </div>
          </template>
          <div v-if="restockList.length === 0" class="restock-empty">
            <el-icon :size="40"><CircleCheckFilled /></el-icon>
            <p>库存状态良好，无需补货 👍</p>
          </div>
          <div v-for="item in restockList" :key="item.id" class="restock-item">
            <div class="restock-info">
              <div class="restock-name">
                <span class="stock-dot" :style="{ background: item.heatColor }"></span>
                {{ item.name }}
              </div>
              <div class="restock-detail">
                <span>库存 <b :style="{ color: item.heatColor }">{{ item.stock }}</b></span>
                <span>/ 安全线 {{ item.safetyStock }}</span>
              </div>
              <div class="stock-bar-wrap">
                <div class="stock-bar" :style="{ width: item.stockPct + '%', background: item.heatColor }"></div>
              </div>
            </div>
            <div class="restock-suggest">
              <el-tag :type="item.heatLevel === 'danger' ? 'danger' : 'warning'" size="small">
                建议补货 {{ item.suggestQty }} {{ item.unit }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：药品表格 -->
      <el-col :span="17">
        <el-card>
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span>💊 药品库存清单</span>
              <div>
                <el-input v-model="keyword" placeholder="搜索药品名称/拼音码" style="width:220px;margin-right:8px" clearable @keyup.enter="loadData">
                  <template #append><el-button @click="loadData"><el-icon><Search /></el-icon></el-button></template>
                </el-input>
                <el-button type="warning" @click="showLowStock"><el-icon><WarningFilled /></el-icon> 库存预警</el-button>
                <el-button type="primary" @click="openMedDialog()"><el-icon><Plus /></el-icon> 新增药品</el-button>
              </div>
            </div>
          </template>
          <el-table :data="tableData" stripe border :row-class-name="tableRowClass" max-height="480">
            <el-table-column prop="id" label="ID" width="55" />
            <el-table-column prop="name" label="药品名称" width="150" />
            <el-table-column prop="spec" label="规格" width="120" />
            <el-table-column prop="unit" label="单位" width="55" />
            <el-table-column prop="stock" label="库存" width="130">
              <template #default="{ row }">
                <div class="stock-cell">
                  <div class="stock-bar-inline" :style="{ width: row.stockPct + '%', background: getHeatColor(row) }"></div>
                  <span class="stock-num" :style="{ color: getHeatColor(row) }">{{ row.stock }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="safetyStock" label="安全库存" width="75" />
            <el-table-column prop="price" label="单价" width="70">
              <template #default="{ row }">¥{{ (row.price || 0).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="expiryDate" label="有效期" width="100" />
            <el-table-column prop="manufacturer" label="厂家" show-overflow-tooltip min-width="120" />
            <el-table-column label="操作" width="220" fixed="right">
              <template #default="{ row }">
                <el-button text type="success" @click="openStockDialog(row, 'in')">入库</el-button>
                <el-button text type="warning" @click="openStockDialog(row, 'out')">出库</el-button>
                <el-button text type="primary" @click="openMedDialog(row)">编辑</el-button>
                <el-popconfirm title="确定删除?" @confirm="handleDelete(row.id)"><template #reference><el-button text type="danger">删除</el-button></template></el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 药品编辑弹窗 -->
    <el-dialog v-model="medDialogVisible" :title="medIsEdit ? '编辑药品' : '新增药品'" width="600px" destroy-on-close>
      <el-form ref="medFormRef" :model="medForm" :rules="medRules" label-width="90px">
        <el-form-item label="药品名称" prop="name"><el-input v-model="medForm.name" /></el-form-item>
        <el-form-item label="规格"><el-input v-model="medForm.spec" /></el-form-item>
        <el-form-item label="单位"><el-input v-model="medForm.unit" style="width:120px" /></el-form-item>
        <el-form-item label="零售价"><el-input-number v-model="medForm.price" :precision="2" :min="0" /></el-form-item>
        <el-form-item label="安全库存"><el-input-number v-model="medForm.safetyStock" :min="0" /></el-form-item>
        <el-form-item label="拼音码"><el-input v-model="medForm.pinyinCode" /></el-form-item>
        <el-form-item label="生产厂家"><el-input v-model="medForm.manufacturer" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="medDialogVisible=false">取消</el-button><el-button type="primary" @click="saveMed">保存</el-button></template>
    </el-dialog>

    <!-- 出入库弹窗 -->
    <el-dialog v-model="stockDialogVisible" :title="stockType==='in'?'📥 入库':'📤 出库'" width="450px" destroy-on-close>
      <el-form ref="stockFormRef" :model="stockForm" :rules="stockRules" label-width="90px">
        <el-form-item label="药品"><el-input :model-value="stockMedicine?.name" disabled /></el-form-item>
        <el-form-item label="当前库存">
          <el-input :model-value="stockMedicine?.stock" disabled>
            <template #suffix><span v-if="stockMedicine && stockMedicine.stock <= stockMedicine.safetyStock" style="color:#f56c6c">⚠ 低库存</span></template>
          </el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity"><el-input-number v-model="stockForm.quantity" :min="1" :max="stockType==='out'&&stockMedicine?stockMedicine.stock:99999" /></el-form-item>
        <el-form-item v-if="stockType==='in'" label="批号"><el-input v-model="stockForm.batchNo" /></el-form-item>
        <el-form-item v-if="stockType==='in'" label="有效期"><el-date-picker v-model="stockForm.expiryDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="stockForm.remark" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="stockDialogVisible=false">取消</el-button><el-button type="primary" @click="doStock">确认</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { listMedicines, listLowStock, createMedicine, updateMedicine, deleteMedicine, stockIn, stockOut } from '../../api/medicine'
import { medicineImgs } from '../../utils/images'
import type { Medicine, StockRequest } from '../../types'

const tableData = ref<Medicine[]>([])
const keyword = ref('')

// 热力色
function getHeatColor(row: any): string {
  const ratio = row.stock / Math.max(row.safetyStock, 1)
  if (ratio <= 0) return '#f56c6c'
  if (ratio < 0.5) return '#f89898'
  if (ratio < 1) return '#e6a23c'
  if (ratio < 2) return '#67c23a'
  return '#409eff'
}

function tableRowClass({ row }: any) {
  const ratio = row.stock / Math.max(row.safetyStock, 1)
  if (ratio <= 0) return 'row-danger'
  if (ratio < 1) return 'row-warning'
  return ''
}

// 热力概览卡片
const heatCards = computed(() => {
  const all = tableData.value
  return [
    { label: '药品总数', count: all.length, icon: 'FirstAidKit', bg: 'linear-gradient(135deg,#409eff,#337ecc)' },
    { label: '库存充足', count: all.filter(m => (m.stock||0) >= (m.safetyStock||1)*2).length, icon: 'CircleCheckFilled', bg: 'linear-gradient(135deg,#67c23a,#529b2e)' },
    { label: '库存偏低', count: all.filter(m => (m.stock||0) < (m.safetyStock||1) && (m.stock||0) > 0).length, icon: 'WarningFilled', bg: 'linear-gradient(135deg,#e6a23c,#cf9236)' },
    { label: '已售罄', count: all.filter(m => (m.stock||0) <= 0).length, icon: 'CircleCloseFilled', bg: 'linear-gradient(135deg,#f56c6c,#e04b4b)' },
  ]
})

// 智能补货列表
const restockList = computed(() => {
  return tableData.value
    .filter(m => (m.stock || 0) < (m.safetyStock || 10))
    .map(m => {
      const deficit = (m.safetyStock || 10) - (m.stock || 0)
      const suggestQty = Math.max(deficit * 2, m.safetyStock || 10)
      const ratio = (m.stock || 0) / Math.max(m.safetyStock || 1, 1)
      return {
        ...m,
        stockPct: Math.min(ratio * 100, 100),
        heatColor: ratio <= 0 ? '#f56c6c' : ratio < 0.5 ? '#f89898' : '#e6a23c',
        heatLevel: ratio <= 0.5 ? 'danger' : 'warning',
        suggestQty,
      }
    })
    .sort((a, b) => (a.stock || 0) / Math.max(a.safetyStock || 1, 1) - (b.stock || 0) / Math.max(b.safetyStock || 1, 1))
})

// 药品编辑
const medDialogVisible = ref(false)
const medIsEdit = ref(false)
const medFormRef = ref<FormInstance>()
const medForm = reactive<Medicine>({ name: '', spec: '', unit: '盒', stock: 0, safetyStock: 10, price: 0, pinyinCode: '', manufacturer: '', status: 1 })
const medRules = { name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }] }

// 出入库
const stockDialogVisible = ref(false)
const stockType = ref<'in'|'out'>('in')
const stockMedicine = ref<Medicine | null>(null)
const stockFormRef = ref<FormInstance>()
const stockForm = reactive<StockRequest>({ quantity: 1, batchNo: '', expiryDate: '', remark: '' })
const stockRules = { quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }] }

async function loadData() { try { const r = await listMedicines(keyword.value); tableData.value = r.data } catch {} }
async function showLowStock() { try { const r = await listLowStock(); tableData.value = r.data } catch {} }

function openMedDialog(row?: Medicine) {
  medIsEdit.value = !!row
  Object.assign(medForm, row ? { ...row } : { name: '', spec: '', unit: '盒', stock: 0, safetyStock: 10, price: 0, pinyinCode: '', manufacturer: '', status: 1 })
  medDialogVisible.value = true
}
async function saveMed() {
  const v = await medFormRef.value?.validate().catch(() => false); if (!v) return
  try { medIsEdit.value && medForm.id ? await updateMedicine(medForm.id, medForm) : await createMedicine(medForm); ElMessage.success('保存成功'); medDialogVisible.value = false; loadData() } catch {}
}
async function handleDelete(id: number) { try { await deleteMedicine(id); ElMessage.success('删除成功'); loadData() } catch {} }

function openStockDialog(row: Medicine, type: 'in'|'out') {
  stockType.value = type; stockMedicine.value = row
  Object.assign(stockForm, { quantity: 1, batchNo: '', expiryDate: '', remark: '' })
  stockDialogVisible.value = true
}
async function doStock() {
  if (!stockMedicine.value) return
  try {
    stockType.value === 'in' ? await stockIn(stockMedicine.value.id!, stockForm) : await stockOut(stockMedicine.value.id!, stockForm)
    ElMessage.success(stockType.value === 'in' ? '入库成功' : '出库成功')
    stockDialogVisible.value = false; loadData()
  } catch {}
}

onMounted(loadData)
</script>

<style scoped>
/* 热力卡片 */
.heat-card {
  padding: 18px 16px; border-radius: 12px; color: #fff;
  display: flex; flex-wrap: wrap; align-items: center; position: relative; overflow: hidden;
}
.heat-num { font-size: 30px; font-weight: bold; width: 100%; }
.heat-label { font-size: 13px; opacity: 0.85; margin-top: 4px; width: 100%; }
.heat-icon { position: absolute; right: 10px; bottom: 10px; opacity: 0.25; }

/* 智能补货 */
.restock-card { border-radius: 12px; border-left: 4px solid #f56c6c; }
.restock-header { display: flex; justify-content: space-between; align-items: center; }
.restock-empty { text-align: center; padding: 30px 0; color: #67c23a; }
.restock-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px; margin-bottom: 8px; border-radius: 8px; background: #fafafa;
  transition: background 0.2s;
}
.restock-item:hover { background: #f0f0f0; }
.restock-name { font-weight: 500; display: flex; align-items: center; gap: 6px; }
.stock-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.restock-detail { font-size: 12px; color: #909399; margin-top: 2px; }
.stock-bar-wrap {
  height: 4px; background: #e8e8e8; border-radius: 2px; margin-top: 4px; width: 150px;
}
.stock-bar { height: 100%; border-radius: 2px; transition: width 0.5s ease; }

/* 表格内库存条 */
.stock-cell { display: flex; align-items: center; gap: 8px; }
.stock-bar-inline { height: 16px; border-radius: 4px; min-width: 4px; transition: width 0.5s ease; }
.stock-num { font-weight: bold; min-width: 30px; }

:deep(.row-danger) { background: #fef0f0 !important; }
:deep(.row-warning) { background: #fdf6ec !important; }
</style>
