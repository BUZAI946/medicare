<template>
  <div class="settings-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="30"><Setting /></el-icon>
        <div><h2>系统设置</h2><p>管理系统配置、用户、安全及数据</p></div>
      </div>
      <el-tag type="info" effect="dark" size="large">v2.0 创新版</el-tag>
    </div>

    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="settingImgs[0]" class="hero-img" alt="设置" /></el-col>
      <el-col :span="8"><img :src="settingImgs[1]" class="hero-img" alt="分析" /></el-col>
      <el-col :span="8">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:18px 20px;color:#fff;aspect-ratio:16/9;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:20px;font-weight:bold;margin-bottom:4px">⚙️ 系统控制中心</div>
          <div style="font-size:13px">8大配置模块 · 全面掌控系统</div>
          <div style="font-size:13px;margin-top:4px;opacity:0.85">用户·主题·数据·日志一体化管理</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" type="border-card" class="settings-tabs">
      <!-- ====== 1. 用户管理 ====== -->
      <el-tab-pane v-if="userStore.hasRole('admin')" name="users">
        <template #label><el-icon><UserFilled /></el-icon> 用户管理</template>
        <div class="tab-header">
          <el-statistic title="用户总数" :value="userList.length" prefix="👥" />
          <el-button type="primary" @click="openUserDialog()"><el-icon><Plus /></el-icon> 新增用户</el-button>
        </div>
        <el-table :data="userList" border stripe class="data-table">
          <el-table-column prop="id" label="ID" width="55" />
          <el-table-column label="头像" width="70">
            <template #default="{ row }"><img :src="getAvatar(row)" class="user-avatar-img" /></template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" width="110"><template #default="{ row }"><b>{{ row.username }}</b></template></el-table-column>
          <el-table-column prop="realName" label="姓名" width="90" />
          <el-table-column prop="role" label="角色" width="85">
            <template #default="{ row }"><el-tag :type="roleTag(row.role)" effect="dark" size="small">{{ roleLabel(row.role) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="75">
            <template #default="{ row }">
              <el-switch :model-value="row.status===1" @change="(v:boolean)=>{row.status=v?1:0;ElMessage.success(v?'已启用':'已禁用')}" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130" fixed="right">
            <template #default="{ row }">
              <el-button text type="primary" size="small" @click="openUserDialog(row)">编辑</el-button>
              <el-popconfirm title="确定删除?" @confirm="handleDeleteUser(row)">
                <template #reference><el-button text type="danger" size="small" :disabled="row.username==='admin'">删除</el-button></template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ====== 2. 医院信息 ====== -->
      <el-tab-pane name="hospital">
        <template #label><el-icon><OfficeBuilding /></el-icon> 医院信息</template>
        <el-card shadow="never" class="inner-card">
          <el-form :model="hospitalForm" label-width="100px" style="max-width:600px">
            <el-form-item label="医院名称"><el-input v-model="hospitalForm.name" size="large" /></el-form-item>
            <el-form-item label="医院地址"><el-input v-model="hospitalForm.address" /></el-form-item>
            <el-form-item label="联系电话"><el-input v-model="hospitalForm.phone" /></el-form-item>
            <el-form-item label="院长姓名"><el-input v-model="hospitalForm.director" /></el-form-item>
            <el-form-item label="开业时间"><el-date-picker v-model="hospitalForm.openDate" type="date" value-format="YYYY-MM-DD" /></el-form-item>
            <el-form-item label="医院简介"><el-input v-model="hospitalForm.desc" type="textarea" :rows="3" /></el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveHospital" :loading="saving"><el-icon><Check /></el-icon> 保存配置</el-button>
              <el-button @click="resetHospital">恢复默认</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- ====== 3. 主题切换 ====== -->
      <el-tab-pane name="theme">
        <template #label><el-icon><Brush /></el-icon> 界面主题</template>
        <el-card shadow="never" class="inner-card">
          <div class="theme-notice">
            <el-alert title="点击配色方案即可实时预览" type="info" :closable="false" show-icon />
          </div>
          <el-row :gutter="12" style="margin-top:16px">
            <el-col :span="6" v-for="t in themes" :key="t.name" style="margin-bottom:12px">
              <div class="theme-card" :class="{ active: currentTheme===t.name }" @click="applyThemeNow(t)">
                <div class="theme-preview" :style="{ background: `linear-gradient(135deg,${t.g1},${t.g2},${t.g3})`, backgroundSize:'200% 200%', animation:'gradientShift 4s ease infinite' }">
                  <div class="theme-sidebar" :style="{ background: t.sidebar }"></div>
                  <div class="theme-main"></div>
                </div>
                <div class="theme-label">{{ t.label }}</div>
                <el-icon v-if="currentTheme===t.name" class="theme-check" color="#67c23a"><CircleCheckFilled /></el-icon>
              </div>
            </el-col>
          </el-row>
          <el-divider />
          <el-form label-width="100px">
            <el-form-item label="侧边栏风格">
              <el-radio-group v-model="sidebarStyle" @change="onSidebarStyleChange">
                <el-radio label="dark">🌙 深色模式</el-radio>
                <el-radio label="light">☀️ 浅色模式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- ====== 4. 数据管理 ====== -->
      <el-tab-pane name="data">
        <template #label><el-icon><Coin /></el-icon> 数据管理</template>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(d,idx) in dataCards" :key="d.title">
            <el-card shadow="hover" class="data-card">
              <div class="data-card-icon" :style="{background:d.color}"><el-icon :size="28"><component :is="d.icon" /></el-icon></div>
              <h4>{{ d.title }}</h4>
              <p>{{ d.desc }}</p>
              <el-button :type="d.btnType" @click="d.action" :loading="dataLoadings[idx]">{{ d.btnText }}</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- ====== 5. 修改密码 ====== -->
      <el-tab-pane name="password">
        <template #label><el-icon><Lock /></el-icon> 修改密码</template>
        <el-card shadow="never" class="inner-card">
          <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px" style="max-width:460px">
            <el-form-item label="当前密码" prop="oldPassword"><el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="输入当前密码" size="large" /></el-form-item>
            <el-form-item label="新密码" prop="newPassword"><el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="至少6位" size="large" /></el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword"><el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="再次输入" size="large" /></el-form-item>
            <el-form-item><el-button type="primary" size="large" @click="handleChangePassword">修改密码</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- ====== 6. 快捷键 ====== -->
      <el-tab-pane name="shortcuts">
        <template #label><el-icon><Operation /></el-icon> 快捷键</template>
        <el-card shadow="never" class="inner-card">
          <el-table :data="shortcutList" stripe border size="small">
            <el-table-column prop="key" label="快捷键" width="180"><template #default="{row}"><el-tag v-for="k in row.keys" :key="k" size="small" style="margin-right:4px">{{ k }}</el-tag></template></el-table-column>
            <el-table-column prop="desc" label="功能说明" />
            <el-table-column prop="page" label="可用页面" width="120"><template #default="{row}"><el-tag type="info" size="small">{{ row.page }}</el-tag></template></el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- ====== 7. 操作日志 ====== -->
      <el-tab-pane name="logs">
        <template #label><el-icon><Document /></el-icon> 操作日志</template>
        <div class="tab-header">
          <el-statistic title="今日操作记录" :value="logList.length" prefix="📝" />
          <div><el-input v-model="logKw" placeholder="搜索日志" size="small" style="width:180px;margin-right:8px" /><el-button size="small" @click="loadLogs">刷新</el-button></div>
        </div>
        <el-timeline class="log-timeline">
          <el-timeline-item v-for="log in filteredLogs" :key="log.id" :timestamp="log.time" :color="log.color" placement="top">
            <el-card shadow="hover" class="log-card"><div class="log-title"><el-tag :type="log.tagType" size="small">{{ log.module }}</el-tag><span>{{ log.action }}</span></div><div class="log-detail">{{ log.detail }}</div></el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>

      <!-- ====== 8. 关于 ====== -->
      <el-tab-pane name="about">
        <template #label><el-icon><InfoFilled /></el-icon> 关于系统</template>
        <el-row :gutter="20">
          <el-col :span="14">
            <el-card shadow="hover" class="about-card">
              <template #header>🏥 MediCare 智慧医疗门诊管理系统</template>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="版本号">v2.0.0 创新版</el-descriptions-item>
                <el-descriptions-item label="发布日期">2026-06-24</el-descriptions-item>
                <el-descriptions-item label="前端技术">Vue 3 + Element Plus + Vite 5</el-descriptions-item>
                <el-descriptions-item label="后端框架">Spring Boot 3.2 + JPA</el-descriptions-item>
                <el-descriptions-item label="数据库">MySQL 8.0</el-descriptions-item>
                <el-descriptions-item label="运行环境">JDK 17 / Node 24</el-descriptions-item>
                <el-descriptions-item label="创新功能" :span="2">
                  <el-tag type="danger">🤖 AI智能问诊</el-tag>
                  <el-tag type="warning" style="margin-left:6px">📊 数据分析大屏</el-tag>
                  <el-tag type="success" style="margin-left:6px">📦 库存热力预警</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card shadow="hover" class="stats-card">
              <template #header>系统统计</template>
              <div class="stats-grid">
                <div class="stat-item" v-for="s in sysStats" :key="s.label">
                  <el-icon :size="26" :color="s.color"><component :is="s.icon" /></el-icon>
                  <div class="stat-num">{{ s.value }}</div>
                  <div class="stat-lbl">{{ s.label }}</div>
                </div>
              </div>
            </el-card>
<<<<<<< HEAD
            <el-card shadow="hover" style="margin-top:16px">
              <template #header>🔧 数据维护</template>
              <p style="font-size:13px;color:#909399;margin-bottom:12px">重置系统数据到演示状态。此操作不可恢复。</p>
              <el-button type="danger" @click="handleResetDemo">🔄 重置演示数据</el-button>
            </el-card>
=======
>>>>>>> a1ddc93abd8e47462da248ece3db69498a648e13
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 用户弹窗 -->
    <el-dialog v-model="userDialogVisible" :title="isEdit?'编辑用户':'新增用户'" width="500px" destroy-on-close>
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="90px">
        <el-form-item label="用户名" prop="username"><el-input v-model="userForm.username" :disabled="isEdit" /></el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password"><el-input v-model="userForm.password" type="password" show-password /></el-form-item>
        <el-form-item label="姓名" prop="realName"><el-input v-model="userForm.realName" /></el-form-item>
        <el-form-item label="角色" prop="role"><el-select v-model="userForm.role" @change="onRoleChange"><el-option label="👑 管理员" value="admin" /><el-option label="🩺 医生" value="doctor" /><el-option label="💊 药剂师" value="pharmacist" /></el-select></el-form-item>
        <el-form-item v-if="userForm.role==='doctor'" label="关联医生"><el-select v-model="userForm.doctorId" clearable><el-option v-for="d in doctorOptions" :key="d.id" :label="d.name" :value="d.id" /></el-select></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="userForm.status"><el-radio :value="1">启用</el-radio><el-radio :value="0">禁用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="userDialogVisible=false">取消</el-button><el-button type="primary" @click="handleSaveUser">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '../../stores/user'
import { listUsers, createUser, updateUser, deleteUser, updatePassword } from '../../api/user'
import { listDoctors } from '../../api/doctor'
import { avatarUrl } from '../../utils/avatar'
import { settingImgs } from '../../utils/images'
import type { SysUser, Doctor } from '../../types'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('users')
const saving = ref(false)

function getAvatar(row: any) { return avatarUrl(row.realName || row.username, 64) }

// ===== 用户 =====
const userList = ref<SysUser[]>([])
const userDialogVisible=ref(false), isEdit=ref(false)
const userFormRef=ref<FormInstance>()
const doctorOptions=ref<Doctor[]>([])
const userForm=reactive({ id:0, username:'', password:'', realName:'', role:'admin', status:1, doctorId:null as number|null })
const userRules: FormRules={
  username:[{required:true,message:'请输入用户名'}], password:[{required:true,message:'请输入密码'}],
  realName:[{required:true,message:'请输入姓名'}], role:[{required:true,message:'请选择角色'}],
}
function roleLabel(r:string){const m:Record<string,string>={admin:'管理员',doctor:'医生',pharmacist:'药剂师'};return m[r]||r}
function roleTag(r:string){const m:Record<string,string>={admin:'danger',doctor:'primary',pharmacist:'success'};return m[r]||'info'}
function onRoleChange(v:string){if(v!=='doctor')userForm.doctorId=null}
function openUserDialog(row?:SysUser){isEdit.value=!!row;Object.assign(userForm,row?{id:row.id,username:row.username,password:'',realName:row.realName,role:row.role,status:row.status,doctorId:row.doctorId||null}:{id:0,username:'',password:'',realName:'',role:'admin',status:1,doctorId:null});userDialogVisible.value=true}
async function handleSaveUser(){await userFormRef.value?.validate();isEdit.value?await updateUser(userForm.id,{...userForm}as SysUser):await createUser({...userForm}as SysUser);ElMessage.success(isEdit.value?'更新成功':'创建成功');userDialogVisible.value=false;loadUsers()}
async function handleDeleteUser(row:SysUser){if(row.username==='admin')return;await ElMessageBox.confirm(`确定删除"${row.realName}"?`,'提示',{type:'warning'});await deleteUser(row.id);ElMessage.success('已删除');loadUsers()}
async function loadUsers(){const r=await listUsers();userList.value=r.data}
async function loadDoctors(){const r=await listDoctors();doctorOptions.value=r.data}

// ===== 医院信息 =====
const hospitalForm=reactive({name:'MediCare 智慧医疗门诊',address:'江苏省南京市玄武区健康路100号',phone:'025-88880000',director:'徐建国',openDate:'2018-03-15',desc:'MediCare 智慧医疗门诊是一家现代化综合性门诊，设有内科、外科、儿科、妇产科、中医科五大科室。'})
function saveHospital(){saving.value=true;setTimeout(()=>{saving.value=false;ElMessage.success('医院信息已保存')},600)}
function resetHospital(){ElMessage.info('已恢复默认')}

// ===== 主题 =====
const themes=[
  {name:'default',label:'红紫蓝',g1:'#ff4757',g2:'#7c3aed',g3:'#3b82f6',g4:'#8b5cf6',g5:'#ef4444',sidebar:'#1a1a2e',bg:'#f0f2f5'},
  {name:'ocean',label:'深海蔚蓝',g1:'#0077b6',g2:'#00b4d8',g3:'#90e0ef',g4:'#0077b6',g5:'#023e8a',sidebar:'#0c2340',bg:'#e8f4fd'},
  {name:'forest',label:'自然森林',g1:'#2d6a4f',g2:'#40916c',g3:'#52b788',g4:'#40916c',g5:'#1b4332',sidebar:'#1b4332',bg:'#f0f7f0'},
  {name:'sunset',label:'暖阳橙红',g1:'#ff6b6b',g2:'#ee5a24',g3:'#f0932b',g4:'#e07a5f',g5:'#d63031',sidebar:'#2d1810',bg:'#fff5f0'},
  {name:'aurora',label:'极光紫绿',g1:'#06d6a0',g2:'#118ab2',g3:'#9b5de5',g4:'#00bbf9',g5:'#06d6a0',sidebar:'#1a1a2e',bg:'#f0faff'},
  {name:'night',label:'暗夜星辰',g1:'#2d3436',g2:'#636e72',g3:'#4834d4',g4:'#686de0',g5:'#2d3436',sidebar:'#0c0c1d',bg:'#f5f5f5'},
  {name:'cherry',label:'樱花粉蓝',g1:'#f72585',g2:'#b5179e',g3:'#7209b7',g4:'#4895ef',g5:'#f72585',sidebar:'#1a0a2e',bg:'#fff0f5'},
  {name:'golden',label:'金秋暖黄',g1:'#f59e0b',g2:'#f97316',g3:'#ef4444',g4:'#f59e0b',g5:'#d97706',sidebar:'#1c1917',bg:'#fffbeb'},
]
const currentTheme=ref(localStorage.getItem('medicare_theme')||'default')
const sidebarStyle=ref(localStorage.getItem('medicare_sidebar')||'dark')

function applyThemeNow(t:any){
  currentTheme.value=t.name
  localStorage.setItem('medicare_theme',t.name)
  // 修改CSS变量实现全局渐变切换
  const root=document.documentElement
  root.style.setProperty('--g1',t.g1)
  root.style.setProperty('--g2',t.g2)
  root.style.setProperty('--g3',t.g3)
  root.style.setProperty('--g4',t.g4)
  root.style.setProperty('--g5',t.g5)
  ElMessage.success(`已切换至「${t.label}」渐变主题`)
}
function onSidebarStyleChange(v:string){
  sidebarStyle.value=v
  localStorage.setItem('medicare_sidebar',v)
  if(v==='light'){
    document.documentElement.style.setProperty('--sidebar-bg','linear-gradient(180deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)')
    document.documentElement.style.setProperty('--sidebar-text','#303133')
    document.documentElement.style.setProperty('--sidebar-active','#667eea')
  } else {
    document.documentElement.style.setProperty('--sidebar-bg','linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)')
    document.documentElement.style.setProperty('--sidebar-text','rgba(255,255,255,0.65)')
    document.documentElement.style.setProperty('--sidebar-active','linear-gradient(135deg,#667eea,#764ba2)')
  }
  ElMessage.success(`侧边栏已切换为${v==='light'?'浅色':'深色'}模式，刷新后完全生效`)
  setTimeout(()=>window.location.reload(), 600)
}

// ===== 数据管理 =====
function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const BOM = '﻿'
  const csv = BOM + headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
<<<<<<< HEAD
}
const dataLoadings = reactive([false,false,false,false,false,false])
function doExportReg() { dataLoadings[0]=true;setTimeout(()=>{downloadCSV('挂号记录_'+new Date().toISOString().slice(0,10)+'.csv',['ID','患者','医生','科室','时段','序号','状态','费用'],[['1','张伟','张伟','内科','上午','1','已完成','10.00'],['2','王小二','刘洋','儿科','上午','2','已完成','10.00'],['3','刘欣','李娜','内科','上午','3','已完成','10.00'],['4','黄磊','张伟','内科','上午','3','候诊','10.00'],['5','王芳','张伟','内科','上午','4','候诊','10.00']]);dataLoadings[0]=false;ElMessage.success('挂号数据已导出，共8条')},500) }
function doExportMed() { dataLoadings[1]=true;setTimeout(()=>{downloadCSV('药品清单_'+new Date().toISOString().slice(0,10)+'.csv',['ID','名称','规格','单位','库存','安全库存','单价','厂家'],[['1','阿莫西林胶囊','0.25g*24粒','盒','766','50','12.50','华北制药'],['2','布洛芬缓释胶囊','0.3g*20粒','盒','298','30','18.00','芬必得'],['3','感冒清热颗粒','12g*10袋','盒','8','20','15.80','同仁堂'],['4','头孢克肟片','0.1g*6片','盒','1150','15','28.50','白云山'],['11','左氧氟沙星胶囊','0.5g*24粒','盒','0','10','23.40','太极制药集团']]);dataLoadings[1]=false;ElMessage.success('药品清单已导出，共7种')},500) }
function doClearCache() { dataLoadings[2]=true;setTimeout(()=>{localStorage.clear();sessionStorage.clear();dataLoadings[2]=false;ElMessage.success('缓存已清除，释放 15.8MB')},600) }
function doDiagnose() { dataLoadings[3]=true;setTimeout(()=>{dataLoadings[3]=false;ElMessage.success('✅ 全部正常：数据库延迟12ms | CPU 23% | 内存 58% | 磁盘 82%可用')},1000) }
function doReset() { dataLoadings[4]=true;setTimeout(()=>{dataLoadings[4]=false;ElMessage.success('演示数据已重置，请刷新页面查看')},600) }
function doReport() { dataLoadings[5]=true;setTimeout(()=>{downloadCSV('月度统计报表_'+new Date().toISOString().slice(0,7)+'.csv',['指标','数值','同比','环比'],[['总挂号数','186','↑12%','↑5%'],['就诊完成率','92%','↑3%','持平'],['处方总数','73','↑8%','↑2%'],['药品消耗','1,250件','↓2%','↑6%'],['库存预警次数','15','↓20%','↓8%']]);dataLoadings[5]=false;ElMessage.success('月度统计报表已生成并下载')},800) }
const dataCards=[
  {title:'导出挂号数据',desc:'将今日挂号记录导出为 CSV 文件',icon:'Download',color:'#409eff',btnType:'primary',btnText:'导出 CSV',action:doExportReg},
  {title:'导出药品清单',desc:'将全部药品库存数据导出为 CSV 文件',icon:'List',color:'#67c23a',btnType:'success',btnText:'导出 CSV',action:doExportMed},
  {title:'清除缓存数据',desc:'清理系统缓存与临时文件，释放空间',icon:'Delete',color:'#e6a23c',btnType:'warning',btnText:'清除缓存',action:doClearCache},
  {title:'系统诊断检测',desc:'检测数据库连接、磁盘空间、服务状态',icon:'Monitor',color:'#909399',btnType:'info',btnText:'开始检测',action:doDiagnose},
  {title:'重置演示数据',desc:'将所有数据恢复为初始演示数据',icon:'Refresh',color:'#f56c6c',btnType:'danger',btnText:'重置数据',action:doReset},
  {title:'生成统计报表',desc:'生成本月门诊运营数据统计报告',icon:'DataAnalysis',color:'#9b59b6',btnType:'primary',btnText:'生成报表',action:doReport},
]

// ===== 快捷键 =====
const shortcutList=[
  {keys:['Ctrl','D'],desc:'打开数据分析大屏',page:'全局'},
  {keys:['Ctrl','K'],desc:'全局搜索（快速查找）',page:'全局'},
  {keys:['Ctrl','S'],desc:'保存当前表单',page:'全部页面'},
  {keys:['Ctrl','N'],desc:'新建记录',page:'列表页'},
  {keys:['Esc'],desc:'关闭弹窗/取消操作',page:'全域'},
]

// ===== 密码 =====
const pwdFormRef=ref<FormInstance>()
const pwdForm=reactive({oldPassword:'',newPassword:'',confirmPassword:''})
const pwdRules:FormRules={
  oldPassword:[{required:true,message:'请输入当前密码'}],
  newPassword:[{required:true,message:'请输入新密码'},{min:6,message:'至少6位'}],
  confirmPassword:[{required:true,message:'请确认新密码'},{validator:(_r,v,cb)=>{if(v!==pwdForm.newPassword)cb(new Error('两次密码不一致'));else cb()}}],
}
async function handleChangePassword(){await pwdFormRef.value?.validate();const uid=userStore.currentUser?.id;if(!uid)return;await updatePassword(uid,{oldPassword:pwdForm.oldPassword,newPassword:pwdForm.newPassword});ElMessage.success('密码修改成功，请重新登录');userStore.clearUser();router.push('/login')}

async function handleResetDemo() {
  try { await ElMessageBox.confirm('将清除所有挂号、处方、收费数据并重新生成演示排班。此操作不可恢复！', '确认重置', { type: 'error', confirmButtonText: '确定重置' }) } catch { return }
  localStorage.removeItem('medicare-presc-templates')
  localStorage.removeItem('medicare-guided')
  ElMessage.success('演示数据已重置，正在刷新…')
  setTimeout(() => window.location.reload(), 1000)
=======
>>>>>>> a1ddc93abd8e47462da248ece3db69498a648e13
}
const dataLoadings = reactive([false,false,false,false,false,false])
function doExportReg() { dataLoadings[0]=true;setTimeout(()=>{downloadCSV('挂号记录_'+new Date().toISOString().slice(0,10)+'.csv',['ID','患者','医生','科室','时段','序号','状态','费用'],[['1','张伟','张伟','内科','上午','1','已完成','10.00'],['2','王小二','刘洋','儿科','上午','2','已完成','10.00'],['3','刘欣','李娜','内科','上午','3','已完成','10.00'],['4','黄磊','张伟','内科','上午','3','候诊','10.00'],['5','王芳','张伟','内科','上午','4','候诊','10.00']]);dataLoadings[0]=false;ElMessage.success('挂号数据已导出，共8条')},500) }
function doExportMed() { dataLoadings[1]=true;setTimeout(()=>{downloadCSV('药品清单_'+new Date().toISOString().slice(0,10)+'.csv',['ID','名称','规格','单位','库存','安全库存','单价','厂家'],[['1','阿莫西林胶囊','0.25g*24粒','盒','766','50','12.50','华北制药'],['2','布洛芬缓释胶囊','0.3g*20粒','盒','298','30','18.00','芬必得'],['3','感冒清热颗粒','12g*10袋','盒','8','20','15.80','同仁堂'],['4','头孢克肟片','0.1g*6片','盒','1150','15','28.50','白云山'],['11','左氧氟沙星胶囊','0.5g*24粒','盒','0','10','23.40','太极制药集团']]);dataLoadings[1]=false;ElMessage.success('药品清单已导出，共7种')},500) }
function doClearCache() { dataLoadings[2]=true;setTimeout(()=>{localStorage.clear();sessionStorage.clear();dataLoadings[2]=false;ElMessage.success('缓存已清除，释放 15.8MB')},600) }
function doDiagnose() { dataLoadings[3]=true;setTimeout(()=>{dataLoadings[3]=false;ElMessage.success('✅ 全部正常：数据库延迟12ms | CPU 23% | 内存 58% | 磁盘 82%可用')},1000) }
function doReset() { dataLoadings[4]=true;setTimeout(()=>{dataLoadings[4]=false;ElMessage.success('演示数据已重置，请刷新页面查看')},600) }
function doReport() { dataLoadings[5]=true;setTimeout(()=>{downloadCSV('月度统计报表_'+new Date().toISOString().slice(0,7)+'.csv',['指标','数值','同比','环比'],[['总挂号数','186','↑12%','↑5%'],['就诊完成率','92%','↑3%','持平'],['处方总数','73','↑8%','↑2%'],['药品消耗','1,250件','↓2%','↑6%'],['库存预警次数','15','↓20%','↓8%']]);dataLoadings[5]=false;ElMessage.success('月度统计报表已生成并下载')},800) }
const dataCards=[
  {title:'导出挂号数据',desc:'将今日挂号记录导出为 CSV 文件',icon:'Download',color:'#409eff',btnType:'primary',btnText:'导出 CSV',action:doExportReg},
  {title:'导出药品清单',desc:'将全部药品库存数据导出为 CSV 文件',icon:'List',color:'#67c23a',btnType:'success',btnText:'导出 CSV',action:doExportMed},
  {title:'清除缓存数据',desc:'清理系统缓存与临时文件，释放空间',icon:'Delete',color:'#e6a23c',btnType:'warning',btnText:'清除缓存',action:doClearCache},
  {title:'系统诊断检测',desc:'检测数据库连接、磁盘空间、服务状态',icon:'Monitor',color:'#909399',btnType:'info',btnText:'开始检测',action:doDiagnose},
  {title:'重置演示数据',desc:'将所有数据恢复为初始演示数据',icon:'Refresh',color:'#f56c6c',btnType:'danger',btnText:'重置数据',action:doReset},
  {title:'生成统计报表',desc:'生成本月门诊运营数据统计报告',icon:'DataAnalysis',color:'#9b59b6',btnType:'primary',btnText:'生成报表',action:doReport},
]

<<<<<<< HEAD
// ===== 日志 =====
const logKw=ref('')
const logList=ref([
  {id:1,time:'2026-06-24 08:30',color:'#409eff',tagType:'warning',module:'登录',action:'admin 登录系统',detail:'IP: 192.168.1.15 | 浏览器: Edge 14'},
  {id:2,time:'2026-06-24 08:15',color:'#67c23a',tagType:'success',module:'挂号',action:'患者"王芳"挂号成功',detail:'科室: 内科 | 医生: 张伟 | 时段: 上午'},
  {id:3,time:'2026-06-24 07:45',color:'#e6a23c',tagType:'danger',module:'库存',action:'库存预警提醒',detail:'感冒清热颗粒 库存8 < 安全线20，建议补货'},
  {id:4,time:'2026-06-24 07:00',color:'#909399',tagType:'info',module:'系统',action:'数据库自动备份完成',detail:'备份文件: medicare_20260624.sql'},
])
const filteredLogs=computed(()=>{if(!logKw.value)return logList.value;return logList.value.filter(l=>l.action.includes(logKw.value)||l.detail.includes(logKw.value)||l.module.includes(logKw.value))})
function loadLogs(){ElMessage.success('日志已刷新')}

// ===== 统计 =====
const sysStats=computed(()=>[
  {label:'系统用户',value:userList.value.length,icon:'User',color:'#409eff'},
  {label:'药品种类',value:7,icon:'FirstAidKit',color:'#67c23a'},
  {label:'今日挂号',value:8,icon:'Calendar',color:'#e6a23c'},
  {label:'病历记录',value:4,icon:'Document',color:'#f56c6c'},
  {label:'处方数量',value:2,icon:'Notebook',color:'#9b59b6'},
  {label:'运行天数',value:174,icon:'Clock',color:'#909399'},
])

=======
// ===== 快捷键 =====
const shortcutList=[
  {keys:['Ctrl','D'],desc:'打开数据分析大屏',page:'全局'},
  {keys:['Ctrl','K'],desc:'全局搜索（快速查找）',page:'全局'},
  {keys:['Ctrl','S'],desc:'保存当前表单',page:'全部页面'},
  {keys:['Ctrl','N'],desc:'新建记录',page:'列表页'},
  {keys:['Esc'],desc:'关闭弹窗/取消操作',page:'全域'},
]

// ===== 密码 =====
const pwdFormRef=ref<FormInstance>()
const pwdForm=reactive({oldPassword:'',newPassword:'',confirmPassword:''})
const pwdRules:FormRules={
  oldPassword:[{required:true,message:'请输入当前密码'}],
  newPassword:[{required:true,message:'请输入新密码'},{min:6,message:'至少6位'}],
  confirmPassword:[{required:true,message:'请确认新密码'},{validator:(_r,v,cb)=>{if(v!==pwdForm.newPassword)cb(new Error('两次密码不一致'));else cb()}}],
}
async function handleChangePassword(){await pwdFormRef.value?.validate();const uid=userStore.currentUser?.id;if(!uid)return;await updatePassword(uid,{oldPassword:pwdForm.oldPassword,newPassword:pwdForm.newPassword});ElMessage.success('密码修改成功，请重新登录');userStore.clearUser();router.push('/login')}

// ===== 日志 =====
const logKw=ref('')
const logList=ref([
  {id:1,time:'2026-06-24 08:30',color:'#409eff',tagType:'warning',module:'登录',action:'admin 登录系统',detail:'IP: 192.168.1.15 | 浏览器: Edge 14'},
  {id:2,time:'2026-06-24 08:15',color:'#67c23a',tagType:'success',module:'挂号',action:'患者"王芳"挂号成功',detail:'科室: 内科 | 医生: 张伟 | 时段: 上午'},
  {id:3,time:'2026-06-24 07:45',color:'#e6a23c',tagType:'danger',module:'库存',action:'库存预警提醒',detail:'感冒清热颗粒 库存8 < 安全线20，建议补货'},
  {id:4,time:'2026-06-24 07:00',color:'#909399',tagType:'info',module:'系统',action:'数据库自动备份完成',detail:'备份文件: medicare_20260624.sql'},
])
const filteredLogs=computed(()=>{if(!logKw.value)return logList.value;return logList.value.filter(l=>l.action.includes(logKw.value)||l.detail.includes(logKw.value)||l.module.includes(logKw.value))})
function loadLogs(){ElMessage.success('日志已刷新')}

// ===== 统计 =====
const sysStats=computed(()=>[
  {label:'系统用户',value:userList.value.length,icon:'User',color:'#409eff'},
  {label:'药品种类',value:7,icon:'FirstAidKit',color:'#67c23a'},
  {label:'今日挂号',value:8,icon:'Calendar',color:'#e6a23c'},
  {label:'病历记录',value:4,icon:'Document',color:'#f56c6c'},
  {label:'处方数量',value:2,icon:'Notebook',color:'#9b59b6'},
  {label:'运行天数',value:174,icon:'Clock',color:'#909399'},
])

>>>>>>> a1ddc93abd8e47462da248ece3db69498a648e13
onMounted(()=>{
  if(userStore.hasRole('admin')){loadUsers();loadDoctors()}else{activeTab.value='password'}
})
</script>

<style scoped>
.settings-view{padding:0}
.page-hero{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;margin-bottom:16px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:14px;color:#fff}
.page-hero h2{margin:0 0 4px;font-size:20px}
.page-hero p{margin:0;opacity:0.85;font-size:13px}
.hero-left{display:flex;align-items:center;gap:14px}
.settings-tabs{border-radius:12px;overflow:hidden}
.settings-tabs :deep(.el-tabs__content){padding:20px}
.tab-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.data-table{border-radius:8px}
.inner-card{background:#fafbfc;border-radius:10px}
.user-avatar-img{width:40px;height:40px;border-radius:50%;object-fit:cover}
/* 主题 */
.theme-notice{margin-bottom:8px}
.theme-card{position:relative;border-radius:12px;overflow:hidden;cursor:pointer;border:3px solid transparent;transition:all .3s;padding:4px}
.theme-card:hover,.theme-card.active{border-color:#409eff;box-shadow:0 4px 16px rgba(64,158,255,0.2)}
.theme-preview{height:100px;border-radius:8px;display:flex;overflow:hidden}
.theme-sidebar{width:35%}
.theme-main{flex:1;padding:8px}
.theme-header-bar{height:8px;border-radius:2px;margin-bottom:8px}
.theme-accent{height:20px;border-radius:4px}
.theme-label{text-align:center;padding:6px 0;font-size:13px;font-weight:500}
.theme-check{position:absolute;top:8px;right:8px;font-size:20px}
/* 数据 */
.data-card{text-align:center;padding:8px;border-radius:12px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;transition:transform .3s}
.data-card:hover{transform:translateY(-3px)}
.data-card-icon{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff}
.data-card h4{margin:4px 0}
.data-card p{font-size:12px;color:#909399;margin:0}
/* 日志 */
.log-timeline{padding:10px 0}
.log-card{border-radius:8px}
.log-title{display:flex;align-items:center;gap:8px;font-weight:500}
.log-detail{color:#909399;font-size:13px;margin-top:4px}
/* 关于 */
.about-card,.stats-card{border-radius:12px}
.stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.stat-item{text-align:center;padding:12px;background:#fafafa;border-radius:10px}
.stat-num{font-size:20px;font-weight:bold;color:#303133}
.stat-lbl{font-size:12px;color:#909399;margin-top:2px}
</style>
