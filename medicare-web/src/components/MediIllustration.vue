<template>
  <div class="medi-illustration" :style="{ width: w + 'px', height: h + 'px' }">
    <!-- 诊室场景 -->
    <svg v-if="type==='clinic'" viewBox="0 0 400 200" fill="none">
      <rect x="20" y="40" width="360" height="150" rx="8" fill="#f0f4ff" stroke="#667eea" stroke-width="2"/>
      <rect x="40" y="100" width="100" height="60" rx="6" fill="#fff" stroke="#ccc"/>
      <rect x="55" y="110" width="70" height="35" rx="3" fill="#667eea" opacity="0.15"/>
      <text x="90" y="132" text-anchor="middle" font-size="16">🩺</text>
      <rect x="180" y="65" width="50" height="40" rx="4" fill="#e8f0fe" stroke="#667eea"/>
      <text x="205" y="90" text-anchor="middle" font-size="18">💊</text>
      <circle cx="300" cy="80" r="25" fill="#67c23a" opacity="0.15"/>
      <text x="300" y="85" text-anchor="middle" font-size="22">🏥</text>
      <rect x="260" y="120" width="80" height="35" rx="6" fill="#667eea"/>
      <text x="300" y="142" text-anchor="middle" font-size="13" fill="#fff" font-weight="bold">诊室开放</text>
      <rect x="30" y="50" width="8" height="14" rx="2" fill="#667eea"/>
      <rect x="360" y="50" width="8" height="14" rx="2" fill="#667eea"/>
    </svg>

    <!-- 药品与处方 -->
    <svg v-else-if="type==='pharmacy'" viewBox="0 0 400 200" fill="none">
      <rect x="15" y="50" width="370" height="140" rx="8" fill="#f6ffed" stroke="#67c23a" stroke-width="2"/>
      <rect x="30" y="70" width="70" height="50" rx="4" fill="#fff" stroke="#67c23a"/>
      <text x="65" y="100" text-anchor="middle" font-size="24">💊</text>
      <rect x="115" y="70" width="70" height="50" rx="4" fill="#fff" stroke="#67c23a"/>
      <text x="150" y="100" text-anchor="middle" font-size="24">🧴</text>
      <rect x="200" y="70" width="70" height="50" rx="4" fill="#fff" stroke="#67c23a"/>
      <text x="235" y="100" text-anchor="middle" font-size="24">💉</text>
      <rect x="285" y="70" width="70" height="50" rx="4" fill="#fff" stroke="#67c23a"/>
      <text x="320" y="100" text-anchor="middle" font-size="24">🩹</text>
      <rect x="80" y="140" width="220" height="30" rx="6" fill="#67c23a"/>
      <text x="190" y="160" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">药品库存充足 · 智能补货系统</text>
    </svg>

    <!-- 数据分析 -->
    <svg v-else-if="type==='analytics'" viewBox="0 0 400 200" fill="none">
      <rect x="10" y="15" width="380" height="175" rx="8" fill="#fff7e6" stroke="#e6a23c" stroke-width="2"/>
      <rect x="30" y="55" width="30" height="100" rx="3" fill="#409eff"/>
      <rect x="75" y="75" width="30" height="80" rx="3" fill="#67c23a"/>
      <rect x="120" y="40" width="30" height="115" rx="3" fill="#e6a23c"/>
      <rect x="165" y="65" width="30" height="90" rx="3" fill="#f56c6c"/>
      <rect x="210" y="50" width="30" height="105" rx="3" fill="#9b59b6"/>
      <polyline points="45,50 90,70 135,35 180,60 225,45" stroke="#667eea" stroke-width="2" fill="none" stroke-dasharray="4"/>
      <text x="210" y="30" font-size="12" fill="#909399">📊 实时数据</text>
      <rect x="260" y="130" width="110" height="40" rx="6" fill="#e6a23c"/>
      <text x="315" y="155" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">智能分析引擎</text>
    </svg>

    <!-- 预约挂号 -->
    <svg v-else-if="type==='appointment'" viewBox="0 0 400 200" fill="none">
      <rect x="10" y="10" width="380" height="182" rx="8" fill="#f0f9ff" stroke="#409eff" stroke-width="2"/>
      <rect x="30" y="55" width="55" height="40" rx="4" fill="#fff" stroke="#409eff"/>
      <text x="57" y="80" text-anchor="middle" font-size="14">📅</text>
      <rect x="100" y="55" width="55" height="40" rx="4" fill="#409eff"/>
      <text x="127" y="80" text-anchor="middle" font-size="18" fill="#fff">1</text>
      <rect x="170" y="55" width="55" height="40" rx="4" fill="#fff" stroke="#409eff"/>
      <text x="197" y="80" text-anchor="middle" font-size="18">2</text>
      <rect x="240" y="55" width="55" height="40" rx="4" fill="#fff" stroke="#409eff"/>
      <text x="267" y="80" text-anchor="middle" font-size="18">3</text>
      <rect x="310" y="55" width="55" height="40" rx="4" fill="#409eff"/>
      <text x="337" y="80" text-anchor="middle" font-size="18" fill="#fff">4</text>
      <rect x="30" y="120" width="65" height="50" rx="6" fill="#e8f0fe"/>
      <text x="62" y="145" text-anchor="middle" font-size="22">👨‍⚕️</text>
      <text x="62" y="162" text-anchor="middle" font-size="10" fill="#667eea">医生</text>
      <rect x="115" y="120" width="65" height="50" rx="6" fill="#e8f0fe"/>
      <text x="147" y="145" text-anchor="middle" font-size="22">👩‍💼</text>
      <text x="147" y="162" text-anchor="middle" font-size="10" fill="#667eea">患者</text>
      <rect x="200" y="120" width="65" height="50" rx="6" fill="#409eff"/>
      <text x="232" y="140" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">在线</text>
      <text x="232" y="158" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">预约</text>
      <rect x="290" y="125" width="80" height="40" rx="6" fill="#409eff"/>
      <text x="330" y="150" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">挂号大厅</text>
    </svg>

    <!-- 病历档案 -->
    <svg v-else-if="type==='records'" viewBox="0 0 400 200" fill="none">
      <rect x="10" y="10" width="380" height="182" rx="8" fill="#faf5ff" stroke="#9b59b6" stroke-width="2"/>
      <rect x="30" y="35" width="90" height="60" rx="4" fill="#fff" stroke="#9b59b6"/>
      <text x="75" y="60" text-anchor="middle" font-size="14" font-weight="bold" fill="#9b59b6">📋 病历1</text>
      <text x="75" y="80" text-anchor="middle" font-size="10" fill="#909399">张伟·内科</text>
      <rect x="135" y="45" width="90" height="55" rx="4" fill="#fff" stroke="#9b59b6"/>
      <text x="180" y="70" text-anchor="middle" font-size="14" font-weight="bold" fill="#9b59b6">📋 病历2</text>
      <text x="180" y="88" text-anchor="middle" font-size="10" fill="#909399">刘欣·内科</text>
      <rect x="240" y="35" width="90" height="60" rx="4" fill="#9b59b6"/>
      <text x="285" y="62" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">+ 新病历</text>
      <rect x="60" y="115" width="120" height="55" rx="6" fill="#f3e8ff"/>
      <text x="120" y="138" text-anchor="middle" font-size="22">📝</text>
      <text x="120" y="160" text-anchor="middle" font-size="10" fill="#9b59b6">电子档案系统</text>
      <rect x="220" y="120" width="140" height="50" rx="6" fill="#9b59b6"/>
      <text x="290" y="140" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">📊 病历统计</text>
      <text x="290" y="158" text-anchor="middle" font-size="11" fill="#fff">共4份 · 合规率100%</text>
    </svg>

    <!-- 系统设置 -->
    <svg v-else-if="type==='settings'" viewBox="0 0 400 200" fill="none">
      <rect x="10" y="10" width="380" height="182" rx="8" fill="#f5f5f5" stroke="#909399" stroke-width="2"/>
      <circle cx="70" cy="65" r="28" fill="#409eff" opacity="0.15"/>
      <text x="70" y="72" text-anchor="middle" font-size="24">⚙️</text>
      <circle cx="160" cy="65" r="28" fill="#67c23a" opacity="0.15"/>
      <text x="160" y="72" text-anchor="middle" font-size="24">🔒</text>
      <circle cx="250" cy="65" r="28" fill="#e6a23c" opacity="0.15"/>
      <text x="250" y="72" text-anchor="middle" font-size="24">💾</text>
      <circle cx="340" cy="65" r="28" fill="#f56c6c" opacity="0.15"/>
      <text x="340" y="72" text-anchor="middle" font-size="24">📊</text>
      <rect x="30" y="120" width="150" height="50" rx="6" fill="#667eea"/>
      <text x="105" y="140" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">系统配置中心</text>
      <text x="105" y="158" text-anchor="middle" font-size="10" fill="#fff" opacity="0.8">主题·用户·数据·日志</text>
      <rect x="210" y="125" width="150" height="45" rx="6" fill="#e8e8e8"/>
      <text x="285" y="145" text-anchor="middle" font-size="12" font-weight="bold" fill="#606266">🟢 系统状态：正常</text>
      <text x="285" y="162" text-anchor="middle" font-size="10" fill="#909399">运行174天·零故障</text>
    </svg>

    <!-- 默认：医学十字 -->
    <svg v-else viewBox="0 0 400 200" fill="none">
      <rect x="10" y="15" width="380" height="175" rx="8" fill="#e8f0fe" stroke="#667eea" stroke-width="2"/>
      <rect x="165" y="35" width="70" height="130" rx="6" fill="#667eea"/>
      <rect x="115" y="85" width="170" height="30" rx="6" fill="#667eea"/>
      <text x="200" y="120" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">MEDICARE</text>
      <text x="200" y="150" text-anchor="middle" font-size="10" fill="#fff" opacity="0.7">智慧医疗门诊</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ type?: string; w?: number; h?: number }>(), { type: 'default', w: 400, h: 200 })
</script>

<style scoped>
.medi-illustration { display: inline-block; overflow: hidden; }
.medi-illustration svg { width: 100%; height: 100%; }
</style>
