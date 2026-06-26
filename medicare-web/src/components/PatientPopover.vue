<template>
  <el-popover placement="right" :width="280" trigger="hover" :show-after="300">
    <template #reference>
      <slot />
    </template>
    <div class="pp-card" v-if="patient">
      <div class="pp-header">
        <el-avatar :size="44">{{ patient.name?.charAt(0) }}</el-avatar>
        <div>
          <div class="pp-name">{{ patient.name }}</div>
          <div class="pp-meta">{{ genderText }} · {{ ageText }}</div>
        </div>
      </div>
      <div class="pp-stats">
        <div class="pp-stat"><b>{{ summary.totalVisits }}</b> 总就诊</div>
        <div class="pp-stat"><b>{{ summary.recentCount }}</b> 近期</div>
        <div class="pp-stat"><b>{{ summary.prescCount }}</b> 处方</div>
      </div>
      <div class="pp-allergy" v-if="patient.allergyInfo">
        <span class="pp-label">⚠ 过敏史</span>
        <span class="pp-allergy-text">{{ patient.allergyInfo }}</span>
      </div>
      <div class="pp-allergy" v-else>
        <span class="pp-label">✅ 无已知过敏</span>
      </div>
      <div class="pp-contact">
        📱 {{ patient.phone || '未登记' }}
      </div>
      <div class="pp-actions">
        <el-button size="small" @click="$router.push('/medical-records')">查看病历</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Patient } from '../types'
import { listMedicalRecords } from '../api/medical-record'
import { listRegistrations } from '../api/registration'
import { listPrescriptions } from '../api/prescription'

const props = defineProps<{ patient: Patient | null }>()

const summary = ref({ totalVisits: 0, recentCount: 0, prescCount: 0 })

const genderText = computed(() => props.patient?.gender === 1 ? '男' : props.patient?.gender === 0 ? '女' : '未知')
const ageText = computed(() => {
  if (!props.patient?.birthDate) return '年龄未知'
  const birth = new Date(props.patient.birthDate)
  const now = new Date()
  return Math.floor((now.getTime() - birth.getTime()) / 31557600000) + '岁'
})

watch(() => props.patient, async (p) => {
  if (!p?.id) return
  try {
    const [regs, recs, prescs] = await Promise.all([
      listRegistrations(undefined, undefined),
      listMedicalRecords(p.id),
      listPrescriptions(p.id)
    ])
    const patientRegs = (regs.data as any[]).filter((r: any) => r.patientId === p.id)
    summary.value = {
      totalVisits: patientRegs.length,
      recentCount: patientRegs.filter((r: any) => {
        const d = new Date(r.regTime || r.createTime)
        return (Date.now() - d.getTime()) < 30 * 86400000
      }).length,
      prescCount: (prescs.data as any[])?.length || 0,
    }
  } catch {}
}, { immediate: true })
</script>

<style scoped>
.pp-card { }
.pp-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.pp-name { font-size: 16px; font-weight: 700; }
.pp-meta { font-size: 12px; color: #909399; }
.pp-stats { display: flex; gap: 12px; padding: 8px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 8px; }
.pp-stat { font-size: 13px; }
.pp-stat b { color: #409eff; }
.pp-label { font-size: 12px; color: #909399; }
.pp-allergy-text { color: #f56c6c; font-size: 13px; }
.pp-contact { font-size: 13px; color: #606266; margin: 6px 0; }
.pp-actions { margin-top: 8px; text-align: right; }
</style>
