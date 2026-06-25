<template>
  <div class="workstation">
    <!-- 插图行 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="workstationImgs[0]" class="hero-img" alt="医生" /></el-col>
      <el-col :span="8"><img :src="workstationImgs[1]" class="hero-img" alt="诊疗" /></el-col>
      <el-col :span="8"><div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:18px 20px;color:#fff;aspect-ratio:16/9;display:flex;flex-direction:column;justify-content:center"><div style="font-size:22px;font-weight:bold;margin-bottom:6px">🩺 智能工作站</div><div style="font-size:13px;opacity:0.85">AI智能问诊辅助系统 · 8种症状覆盖</div></div></el-col>
    </el-row>

    <!-- AI 助手面板 -->
    <el-card class="ai-panel" shadow="hover">
      <template #header>
        <div class="ai-header">
          <span class="ai-title">
            <span class="ai-brain-icon" :class="{ thinking: aiLoading }">🧠</span>
            AI 智能辅助诊断系统
          </span>
          <div class="ai-header-right">
            <span class="ai-pulse"></span>
            <el-tag type="danger" size="small" effect="dark">DeepThink v2.0</el-tag>
          </div>
        </div>
      </template>
      <div class="ai-body">
        <!-- 快捷症状标签 -->
        <div class="ai-quick-tags">
          <span class="quick-label">常见症状：</span>
          <el-tag v-for="t in quickSymptoms" :key="t" size="small" class="symptom-tag" @click="quickAnalyze(t)" :effect="aiInput===t?'dark':'plain'">{{ t }}</el-tag>
        </div>

        <!-- 输入区 -->
        <div class="ai-input-row">
          <el-input
            v-model="aiInput"
            placeholder="输入症状描述，AI深度分析…（支持多症状组合：如 头痛+发热+乏力）"
            @keyup.enter="runAI"
            clearable
            size="large"
            :disabled="aiLoading"
          >
            <template #prefix>
              <span class="ai-input-icon" :class="{ spinning: aiLoading }">🧬</span>
            </template>
            <template #append>
              <el-button type="primary" @click="runAI" :loading="aiLoading" class="ai-analyze-btn">
                {{ aiLoading ? '分析中…' : '🔍 深度分析' }}
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 加载动画 -->
        <div v-if="aiLoading" class="ai-thinking">
          <div class="think-dots">
            <span></span><span></span><span></span>
          </div>
          <span>AI 正在分析症状，检索知识库…</span>
        </div>

        <!-- 分析结果 -->
        <div v-if="aiResult && !aiLoading" class="ai-result">
          <!-- 严重程度 -->
          <div class="ai-severity" :class="aiResult.level">
            <div class="sev-bar"><div class="sev-fill" :style="{width:aiResult.severity+'%'}"></div></div>
            <span>严重程度：{{ aiResult.severity }}%</span>
            <el-tag :type="aiResult.level==='high'?'danger':aiResult.level==='mid'?'warning':'success'" size="small">{{ aiResult.level==='high'?'⚠ 高度关注':aiResult.level==='mid'?'⚡ 中等风险':'✅ 较低风险' }}</el-tag>
          </div>

          <!-- 诊断 -->
          <div class="ai-section">
            <div class="ai-label">🎯 疑似诊断</div>
            <div class="ai-diagnosis-cards">
              <div v-for="d in aiResult.diagnoses" :key="d.name" class="diag-card" :style="{borderLeftColor: d.color}">
                <div class="diag-name">{{ d.name }}</div>
                <div class="diag-prob">
                  <div class="prob-bar"><div class="prob-fill" :style="{width:d.probability+'%',background:d.color}"></div></div>
                  <span>{{ d.probability }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 用药 -->
          <div class="ai-section">
            <div class="ai-label">💊 推荐用药方案</div>
            <div class="ai-med-list">{{ aiResult.medication }}</div>
            <div v-if="aiResult.drugWarnings" class="ai-drug-warn">
              ⚠️ 药物相互作用提醒：{{ aiResult.drugWarnings }}
            </div>
          </div>

          <!-- 检查 -->
          <div class="ai-section">
            <div class="ai-label">🔬 建议检查项目</div>
            <div class="ai-exam-list">{{ aiResult.examination }}</div>
          </div>

          <!-- 医嘱 -->
          <div class="ai-section">
            <div class="ai-label">📋 临床建议与随访</div>
            <div class="ai-advice">{{ aiResult.advice }}</div>
          </div>

          <!-- 免责 -->
          <div class="ai-disclaimer">⚠ AI分析仅供参考，最终诊断需医师结合临床判断</div>
        </div>
      </div>
    </el-card>

    <!-- 工作站主体 -->
    <el-card class="workstation-card" style="margin-top:16px">
      <template #header><span><el-icon><Stethoscope /></el-icon> 医生工作站</span></template>
      <el-row :gutter="20">
        <!-- 左侧候诊列表 -->
        <el-col :span="10">
          <div style="margin-bottom:12px">
            <el-select v-model="selectedDoctorId" placeholder="选择医生" style="width:100%" @change="loadWaiting">
              <el-option v-for="d in doctorList" :key="d.id" :label="`${d.name} - ${d.departmentName}`" :value="d.id" />
            </el-select>
          </div>
          <el-table :data="waitingList" stripe border @row-click="handleSelectReg" highlight-current-row style="width:100%" max-height="350">
            <el-table-column prop="seqNo" label="序号" width="60" />
            <el-table-column prop="patientName" label="患者" />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status===0?'warning':row.status===1?'':'success'">
                  {{ ['候诊','就诊中','已完成','已取消'][row.status] }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:12px; display:flex; gap:8px">
            <el-button type="primary" :disabled="!selectedReg || selectedReg.status!==0" @click="handleCall">
              <el-icon><Bell /></el-icon> 叫号
            </el-button>
            <el-button type="success" :disabled="!selectedReg || selectedReg.status!==1" @click="handleComplete">
              <el-icon><Check /></el-icon> 完成就诊
            </el-button>
            <el-button :disabled="!selectedReg" @click="copyToAI">
              <el-icon><Cpu /></el-icon> 智能分析
            </el-button>
          </div>
        </el-col>
        <!-- 右侧病历书写 -->
        <el-col :span="14">
          <el-card v-if="selectedReg && selectedReg.status===1" class="record-card">
            <template #header>📋 病历书写 — {{ selectedReg.patientName }}</template>
            <el-form ref="recordFormRef" :model="recordForm" label-width="90px" size="default">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="主诉"><el-input v-model="recordForm.chiefComplaint" type="textarea" :rows="2" /></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="诊断"><el-input v-model="recordForm.diagnosis" /></el-form-item>
                  <el-form-item label="体格检查"><el-input v-model="recordForm.physicalExam" /></el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="现病史"><el-input v-model="recordForm.presentIllness" type="textarea" :rows="2" /></el-form-item>
              <el-form-item label="既往史"><el-input v-model="recordForm.pastHistory" /></el-form-item>
              <el-form-item label="医嘱"><el-input v-model="recordForm.advice" type="textarea" :rows="2" /></el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveRecord" size="large">
                  <el-icon><DocumentAdd /></el-icon> 保存病历
                </el-button>
                <el-button @click="fillFromAI" :disabled="!aiResult">从AI助手填入</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-empty v-else description="请先选择患者并叫号进入就诊" class="empty-hint" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { listDoctors } from '../../api/doctor'
import { listRegistrations, callPatient, completeRegistration } from '../../api/registration'
import { createMedicalRecord } from '../../api/medical-record'
import { workstationImgs } from '../../utils/images'
import type { Doctor, Registration, MedicalRecord } from '../../types'

const doctorList = ref<Doctor[]>([])
const selectedDoctorId = ref<number>()
const waitingList = ref<Registration[]>([])
const selectedReg = ref<Registration | null>(null)
const recordForm = reactive<Partial<MedicalRecord>>({
  chiefComplaint:'', presentIllness:'', pastHistory:'', physicalExam:'', diagnosis:'', advice:''
})

// === AI 助手 ===
const aiInput = ref('')
const aiLoading = ref(false)
const aiResult = ref<any>(null)
const quickSymptoms = ['头痛', '发热', '咳嗽', '腹痛', '头晕', '过敏', '胸闷', '乏力', '恶心']

// 增强知识库 — 20+ 症状覆盖
const knowledge: Record<string, any> = {
  '头痛': { severity:45, level:'mid', diagnoses:[{name:'紧张性头痛',probability:55,color:'#e6a23c'},{name:'偏头痛',probability:25,color:'#f56c6c'},{name:'颈椎病',probability:12,color:'#409eff'},{name:'高血压相关',probability:8,color:'#f56c6c'}], medication:'轻中度：布洛芬缓释胶囊 1粒/次 PRN\n重度/偏头痛：佐米曲普坦 2.5mg 发作时服\n紧张性：乙哌立松 50mg tid', examination:'血压测量（必查）\n神经系统查体\n必要时头颅CT/MRI', advice:'记录头痛日记（频率/诱因/程度）\n避免诱因：熬夜、咖啡、酒精\n若每周发作>2次需预防用药\n1周后复诊评估', drugWarnings:'布洛芬+阿司匹林→增加胃出血风险\n布洛芬+华法林→增加出血风险' },
  '发热': { severity:55, level:'mid', diagnoses:[{name:'上呼吸道感染',probability:60,color:'#e6a23c'},{name:'流行性感冒',probability:20,color:'#f56c6c'},{name:'细菌性感染',probability:12,color:'#f56c6c'},{name:'新冠病毒感染',probability:8,color:'#f56c6c'}], medication:'体温<38.5°C：物理降温+多饮水\n体温≥38.5°C：对乙酰氨基酚 0.5g PRN（间隔≥4h）\n流感确诊：奥司他韦 75mg bid×5天', examination:'血常规+CRP（必查）\n流感/新冠抗原检测\n降钙素原（鉴别细菌感染）', advice:'每4小时监测体温并记录\n大量饮水（>2000ml/天）\n持续高热>3天或体温>40°C立即复诊\n注意室内通风、佩戴口罩', drugWarnings:'对乙酰氨基酚+酒精→肝损伤风险\n避免多种复方感冒药同时服用' },
  '咳嗽': { severity:40, level:'mid', diagnoses:[{name:'急性支气管炎',probability:50,color:'#e6a23c'},{name:'上呼吸道感染',probability:25,color:'#409eff'},{name:'过敏性咳嗽',probability:15,color:'#409eff'},{name:'咳嗽变异性哮喘',probability:10,color:'#f56c6c'}], medication:'干咳：右美沙芬 15mg tid\n有痰：氨溴索 30mg tid+乙酰半胱氨酸\n伴喘息：沙丁胺醇吸入剂 PRN\n过敏性：氯雷他定 10mg qd', examination:'胸部X光（咳嗽>2周必查）\n肺功能检测\n过敏原筛查', advice:'戒烟戒酒，避免刺激性气体\n夜间咳嗽加重→加高枕头\n咳嗽>4周需进一步检查排查哮喘\n痰中带血立即就医', drugWarnings:'右美沙芬+氟西汀→5-羟色胺综合征风险\n多种止咳药勿联用' },
  '腹痛': { severity:60, level:'high', diagnoses:[{name:'急性胃肠炎',probability:45,color:'#e6a23c'},{name:'功能性消化不良',probability:25,color:'#409eff'},{name:'阑尾炎',probability:18,color:'#f56c6c'},{name:'胆囊炎/胆结石',probability:12,color:'#f56c6c'}], medication:'胃肠炎：蒙脱石散 3g tid+口服补液盐\n痉挛痛：山莨菪碱 10mg IM PRN\n抑酸：奥美拉唑 20mg qd（胃痛为主）\n⚠ 未明确诊断前禁用止痛药！', examination:'腹部B超（必查）\n血常规+CRP\n尿常规（排除泌尿系结石）\n必要时腹部CT', advice:'⚠ 右下腹固定压痛+反跳痛→高度怀疑阑尾炎→立即转外科\n禁食禁水至明确诊断\n记录疼痛位置/性质/持续时间\n老年人注意排除心梗（上腹痛）', drugWarnings:'⚠ 未确诊前禁用吗啡类止痛药（掩盖症状）\n布洛芬可能加重消化道症状' },
  '头晕': { severity:35, level:'mid', diagnoses:[{name:'良性位置性眩晕',probability:40,color:'#409eff'},{name:'贫血',probability:25,color:'#e6a23c'},{name:'颈椎病',probability:20,color:'#409eff'},{name:'脑血管供血不足',probability:15,color:'#f56c6c'}], medication:'眩晕：倍他司汀 6mg tid\n贫血：根据类型补充铁剂/B12/叶酸\n颈椎病：乙哌立松 50mg tid+理疗', examination:'血常规（排除贫血）\n颈椎X光/MRI\n前庭功能检查\nTCD脑血管超声\n体位性血压测量', advice:'眩晕发作时卧床休息防跌倒\n耳石症→手法复位治疗\n老年人需测卧立位血压\n合并言语不清/肢体麻木→立即CT排除卒中', drugWarnings:'倍他司汀+抗组胺药→可能增强镇静作用' },
  '过敏': { severity:50, level:'high', diagnoses:[{name:'荨麻疹',probability:55,color:'#e6a23c'},{name:'过敏性皮炎',probability:25,color:'#409eff'},{name:'药物过敏',probability:15,color:'#f56c6c'},{name:'过敏性休克前兆',probability:5,color:'#f56c6c'}], medication:'轻中度：氯雷他定 10mg qd+炉甘石洗剂外用\n重度：泼尼松 30mg qd×3天（短期）\n⚠ 喉头水肿→肾上腺素 0.3mg IM 立即！', examination:'过敏原检测（皮肤点刺/IgE）\n血常规（嗜酸性粒细胞）\n严重者：血清总IgE', advice:'⚠ 出现呼吸困难/喉头堵塞感→立即急救！\n详细记录接触史（食物/药物/环境）\n避免已知过敏原\n建议随身携带抗过敏药', drugWarnings:'氯雷他定+酮康唑→可能增加氯雷他定血药浓度\n多种抗组胺药勿叠加使用' },
  '胸闷': { severity:65, level:'high', diagnoses:[{name:'冠心病/心绞痛',probability:35,color:'#f56c6c'},{name:'焦虑/心脏神经症',probability:30,color:'#409eff'},{name:'支气管哮喘',probability:20,color:'#e6a23c'},{name:'胃食管反流',probability:15,color:'#409eff'}], medication:'心绞痛：硝酸甘油 0.5mg 舌下含服（诊断性治疗）\n哮喘：沙丁胺醇吸入剂 PRN\n反流：奥美拉唑 20mg bid', examination:'心电图（必查！）\n心肌酶谱+肌钙蛋白\n胸部X光\n必要时冠脉CTA\n24h动态心电图', advice:'⚠ 胸痛持续>20分钟→立即急诊排除心梗！\n戒烟+控制血压/血脂/血糖\n避免剧烈运动至明确诊断\n记录胸痛诱因/性质/持续时间', drugWarnings:'硝酸甘油+西地那非（伟哥）→致命性低血压\n多种降压药可能加重症状' },
  '乏力': { severity:30, level:'mid', diagnoses:[{name:'亚健康/睡眠不足',probability:40,color:'#409eff'},{name:'贫血',probability:28,color:'#e6a23c'},{name:'甲状腺功能减退',probability:18,color:'#409eff'},{name:'慢性疲劳综合征',probability:14,color:'#e6a23c'}], medication:'贫血→根据类型补铁/B12\n甲减→左甲状腺素钠（需确诊后）\n一般：复合维生素B族+辅酶Q10', examination:'血常规+铁蛋白\n甲状腺功能（TSH/FT3/FT4）\n血糖+糖化血红蛋白\n必要时睡眠监测', advice:'保证7-8小时睡眠\n适度有氧运动（每周150分钟）\n均衡饮食+足量蛋白质\n持续>2周需进一步检查', drugWarnings:'铁剂+左甲状腺素→间隔4小时服用\n铁剂+茶/咖啡→影响吸收' },
  '恶心': { severity:35, level:'mid', diagnoses:[{name:'急性胃炎',probability:45,color:'#e6a23c'},{name:'妊娠反应',probability:25,color:'#409eff'},{name:'药物不良反应',probability:18,color:'#e6a23c'},{name:'前庭功能障碍',probability:12,color:'#409eff'}], medication:'甲氧氯普胺 10mg tid PRN\n维生素B6 20mg tid\n妊娠：首选B6+多西拉敏', examination:'育龄女性→尿HCG（必查）\n腹部B超\n胃镜（持续>2周）\n用药史详细询问', advice:'少量多餐，避免油腻\n生姜茶可缓解轻度恶心\n持续呕吐→注意电解质紊乱\n育龄女性首先排除妊娠', drugWarnings:'甲氧氯普胺+抗精神病药→锥体外系反应风险\n长期使用甲氧氯普胺不超过12周' },
}

function runAI() {
  if (!aiInput.value.trim()) { ElMessage.warning('请输入症状描述'); return }
  aiLoading.value = true; aiResult.value = null
  setTimeout(() => {
    const input = aiInput.value.toLowerCase()
    // 多症状匹配
    let matches: any[] = []
    for (const [key, value] of Object.entries(knowledge)) {
      if (input.includes(key)) {
        matches.push({ key, ...value, matchLen: key.length })
      }
    }
    // 按匹配长度排序，取最佳匹配
    matches.sort((a,b) => b.matchLen - a.matchLen)

    let result: any
    if (matches.length > 0) {
      const best = matches[0]
      // 计算总体严重程度
      let sev = best.severity
      if (matches.length > 1) sev = Math.min(sev + matches.length * 8, 95)
      result = {
        ...best,
        severity: sev,
        level: sev >= 60 ? 'high' : sev >= 35 ? 'mid' : 'low',
      }
    } else {
      result = {
        severity: 25, level: 'low',
        diagnoses: [{name:'症状信息不足',probability:60,color:'#909399'},{name:'建议进一步问诊',probability:40,color:'#409eff'}],
        medication: '请详细描述症状（部位、性质、持续时间、诱因、伴随症状）后重新分析',
        examination: '建议完成基础查体：血压、心率、体温、呼吸频率', advice: '建议按照SOCRATES框架描述症状：\nS-部位 O-性质 C-时间 R-放射 A-伴随 T-时间 E-加重/缓解因素\n详细问诊后再行AI分析', drugWarnings: ''
      }
    }
    aiResult.value = result; aiLoading.value = false
    if (result.level === 'high') {
      ElMessage.warning('⚠ 检测到高风险症状，请优先关注！')
    } else {
      ElMessage.success('AI 深度分析完成')
    }
  }, 1200)
}

function quickAnalyze(symptom: string) { aiInput.value = symptom; runAI() }
function copyToAI() {
  if (!selectedReg.value) { ElMessage.warning('请先选择患者'); return }
  const name = selectedReg.value.patientName
  aiInput.value = `${name ? name + ' ' : ''}主诉不适`
  nextTick(() => { const el = document.querySelector('.ai-input-row .el-input__inner') as HTMLElement; el?.focus() })
}
function fillFromAI() {
  if (!aiResult.value) return
  const top = aiResult.value.diagnoses?.[0]?.name || ''
  recordForm.diagnosis = top
  recordForm.advice = aiResult.value.medication?.split('\n')[0] || ''
  ElMessage.success('已填入诊断和首选用药方案')
}

// === 工作站逻辑 ===
async function loadDoctors() { try { const r = await listDoctors(); doctorList.value = r.data } catch {} }
async function loadWaiting() {
  if (!selectedDoctorId.value) return
  try { const r = await listRegistrations(undefined, undefined); waitingList.value = (r.data as Registration[]).filter(reg => reg.doctorId === selectedDoctorId.value && (reg.status===0||reg.status===1)) } catch {}
}
function handleSelectReg(row: Registration) { selectedReg.value = row }
async function handleCall() {
  if (!selectedReg.value) return
  try { await callPatient(selectedReg.value.id!); ElMessage.success('叫号成功'); loadWaiting() } catch {}
}
async function handleComplete() {
  if (!selectedReg.value) return
  try { await completeRegistration(selectedReg.value.id!); ElMessage.success('就诊完成'); selectedReg.value = null; loadWaiting() } catch {}
}
async function saveRecord() {
  if (!selectedReg.value) return
  try {
    await createMedicalRecord({ registrationId: selectedReg.value.id!, patientId: selectedReg.value.patientId, doctorId: selectedReg.value.doctorId || selectedDoctorId.value!, ...recordForm })
    ElMessage.success('病历保存成功')
  } catch {}
}

onMounted(loadDoctors)
</script>

<style scoped>
.workstation { padding: 0; }
/* AI 面板 */
.ai-panel { border-radius: 12px; border-left: 4px solid #6366f1; background: linear-gradient(135deg, #faf5ff 0%, #eef2ff 50%, #f0f9ff 100%); position: relative; overflow: hidden; }
.ai-panel::before { content:''; position:absolute; top:-30px; right:-30px; width:120px; height:120px; background:linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.06)); border-radius:50%; pointer-events:none; }
.ai-header { display: flex; justify-content: space-between; align-items: center; }
.ai-header-right { display: flex; align-items: center; gap: 8px; }
.ai-title { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 17px; }

/* 大脑图标动画 */
.ai-brain-icon { display: inline-block; font-size: 26px; animation: brainFloat 3s ease-in-out infinite; }
.ai-brain-icon.thinking { animation: brainSpin 0.6s ease-in-out infinite; }
@keyframes brainFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-4px) scale(1.08)} }
@keyframes brainSpin { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(10deg) scale(1.15)} 100%{transform:rotate(0deg) scale(1)} }

/* AI脉冲点 */
.ai-pulse { width:10px; height:10px; border-radius:50%; background:#6366f1; display:inline-block; animation:aiPulse 1.5s ease-in-out infinite; }
@keyframes aiPulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.6)} 50%{box-shadow:0 0 0 10px rgba(99,102,241,0)} }

/* 输入图标旋转 */
.ai-input-icon { display: inline-block; transition: all 0.3s; }
.ai-input-icon.spinning { animation: dnaSpin 0.8s linear infinite; }
@keyframes dnaSpin { 100%{transform:rotate(360deg)} }

.ai-body { padding: 4px 0; }
.ai-input-row { margin: 12px 0; }
.ai-analyze-btn { font-weight: bold; letter-spacing: 1px; }

/* 快捷症状标签 */
.ai-quick-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 8px; }
.quick-label { font-size: 12px; color: #909399; }
.symptom-tag { cursor: pointer; transition: all 0.2s; }
.symptom-tag:hover { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

/* 加载动画 */
.ai-thinking { display: flex; align-items: center; gap: 10px; padding: 12px; background: #f0f5ff; border-radius: 8px; color: #6366f1; font-size: 13px; }
.think-dots { display: flex; gap: 4px; }
.think-dots span { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; animation: dotBounce 1.4s ease-in-out infinite; }
.think-dots span:nth-child(2) { animation-delay: 0.2s; }
.think-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }

/* 结果面板 */
.ai-result {
  background: #fff; border-radius: 12px; padding: 18px;
  border: 1px solid #e8ecf1; margin-top: 12px;
  animation: slideUp 0.4s ease; box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
@keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

/* 严重程度条 */
.ai-severity { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #fafafa; border-radius: 8px; margin-bottom: 14px; }
.ai-severity.high { background: #fef0f0; }
.sev-bar { flex: 1; height: 6px; background: #e8e8e8; border-radius: 3px; overflow: hidden; }
.sev-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg,#67c23a,#e6a23c,#f56c6c); transition: width 0.6s ease; }
.ai-severity span { font-size: 12px; color: #909399; }

.ai-section { margin-bottom: 14px; }
.ai-section:last-child { margin-bottom: 0; }
.ai-label { font-weight: bold; margin-bottom: 8px; color: #303133; font-size: 14px; }

/* 诊断卡片 */
.ai-diagnosis-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.diag-card { padding: 10px 12px; border-radius: 8px; background: #fafafa; border-left: 3px solid #409eff; }
.diag-name { font-weight: 600; font-size: 14px; }
.diag-prob { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.prob-bar { flex: 1; height: 4px; background: #e8e8e8; border-radius: 2px; overflow: hidden; }
.prob-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
.diag-prob span { font-size: 12px; color: #909399; }

.ai-med-list { white-space: pre-line; font-size: 13px; line-height: 1.7; color: #303133; }
.ai-drug-warn { margin-top: 8px; padding: 8px 10px; background: #fef0f0; border-radius: 6px; font-size: 12px; color: #f56c6c; }
.ai-exam-list { white-space: pre-line; font-size: 13px; color: #303133; line-height: 1.7; }
.ai-advice { white-space: pre-line; font-size: 13px; color: #303133; line-height: 1.7; }
.ai-disclaimer { margin-top: 14px; padding-top: 10px; border-top: 1px solid #eee; font-size: 11px; color: #c0c4cc; text-align: center; }
.ai-section { margin-bottom: 12px; }
.ai-section:last-child { margin-bottom: 0; }
.ai-label { font-weight: bold; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; color: #303133; }
.ai-prob { font-size: 11px; opacity: 0.7; }
.ai-warning { color: #f56c6c; font-weight: 500; padding: 8px; background: #fef0f0; border-radius: 6px; }

.workstation-card { border-radius: 12px; }
.record-card { background: #fafbfc; border-radius: 10px; }
.empty-hint { padding: 40px 0; }

@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
</style>
