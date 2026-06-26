<template>
  <div class="basic-view">
    <div class="page-hero">
      <div class="hero-left">
        <el-icon :size="28"><Folder /></el-icon>
        <div><h2>基础数据管理</h2><p>科室 · 医生 · 排班</p></div>
      </div>
      <div class="hero-stats">
        <span>🏥 {{ deptList.length }}科室</span>
        <span>🩺 {{ doctorList.length }}医生</span>
        <span>📅 {{ schedList.length }}排班</span>
      </div>
    </div>

    <!-- 插图行 -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="8"><img :src="basicImgs[0]" class="hero-img" alt="诊室" /></el-col>
      <el-col :span="8"><img :src="basicImgs[1]" class="hero-img" alt="设置" /></el-col>
      <el-col :span="8">
        <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);border-radius:12px;padding:18px 20px;color:#004466;aspect-ratio:16/9;display:flex;flex-direction:column;justify-content:center">
          <div style="font-size:20px;font-weight:bold;margin-bottom:4px">🏗 基础数据管理中心</div>
          <div style="font-size:13px">科室管理 · 医生管理 · 排班管理</div>
          <div style="font-size:13px;margin-top:4px;opacity:0.8">三大基础数据 · 支撑核心业务</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" type="border-card" class="data-tabs">
      <!-- 科室 -->
      <el-tab-pane name="dept">
        <template #label><el-icon><OfficeBuilding /></el-icon> 科室管理</template>
        <div class="tab-bar"><el-button type="primary" @click="openDeptDialog()"><el-icon><Plus /></el-icon> 新增科室</el-button></div>
        <el-row :gutter="16">
          <el-col :span="8" v-for="d in deptList" :key="d.id">
            <div class="dept-card" @click="openDeptDialog(d)">
              <div class="dept-icon"><el-icon :size="28"><OfficeBuilding /></el-icon></div>
              <div class="dept-info">
                <div class="dept-name">{{ d.name }}</div>
                <div class="dept-detail">📍 {{ d.location || '未设置' }}</div>
                <div class="dept-detail">📞 {{ d.phone || '未设置' }}</div>
              </div>
              <el-button text type="danger" size="small" @click.stop="handleDeleteDept(d.id)"><el-icon><Delete /></el-icon></el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 医生 -->
      <el-tab-pane name="doctor">
        <template #label><el-icon><User /></el-icon> 医生管理</template>
        <div class="tab-bar">
          <el-select v-model="deptFilter" placeholder="筛选科室" clearable style="width:180px" @change="loadDoctors"><el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" /></el-select>
          <el-button type="primary" @click="openDoctorDialog()"><el-icon><Plus /></el-icon> 新增医生</el-button>
        </div>
        <el-table :data="doctorList" stripe border class="data-table">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="name" label="姓名" width="110">
            <template #default="{ row }"><div class="doc-cell"><el-avatar :size="30">{{ row.name?.charAt(0) }}</el-avatar><span>{{ row.name }}</span></div></template>
          </el-table-column>
          <el-table-column prop="departmentName" label="科室" width="100">
            <template #default="{ row }"><el-tag effect="plain" type="primary">{{ row.departmentName }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="title" label="职称" width="130">
            <template #default="{ row }"><el-tag :type="row.title?.includes('主任')?'danger':row.title?.includes('主治')?'warning':''" effect="dark">{{ row.title }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }"><el-switch :model-value="row.status===1" size="small" /></template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row }"><el-button text type="primary" @click="openDoctorDialog(row)">编辑</el-button><el-popconfirm title="确定删除?" @confirm="handleDeleteDoctor(row.id)"><template #reference><el-button text type="danger">删除</el-button></template></el-popconfirm></template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 排班 -->
      <el-tab-pane name="schedule">
        <template #label><el-icon><Calendar /></el-icon> 排班管理</template>
        <div class="tab-bar">
          <el-date-picker v-model="schedDate" type="date" value-format="YYYY-MM-DD" @change="loadSchedules" />
          <el-select v-model="schedDeptFilter" placeholder="科室" clearable style="width:150px" @change="loadSchedules"><el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" /></el-select>
          <el-button type="primary" @click="openSchedDialog()"><el-icon><Plus /></el-icon> 新增排班</el-button>
        </div>
        <el-table :data="schedList" stripe border class="data-table">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="doctorName" label="医生" width="100" />
          <el-table-column prop="departmentName" label="科室" width="100" />
          <el-table-column prop="workDate" label="日期" width="115" />
          <el-table-column prop="timeSlot" label="时段" width="80">
            <template #default="{ row }"><el-tag :type="row.timeSlot==='上午'?'':row.timeSlot==='下午'?'warning':'info'">{{ row.timeSlot }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="totalSlots" label="总号源" width="80" />
          <el-table-column prop="remainSlots" label="剩余" width="130">
            <template #default="{ row }">
              <div class="slot-bar"><div class="slot-fill" :style="{width:(row.remainSlots/(row.totalSlots||1)*100)+'%',background:row.remainSlots>0?'#67c23a':'#f56c6c'}"></div></div>
              <span :style="{color:row.remainSlots>0?'#67c23a':'#f56c6c',fontSize:'12px'}">{{ row.remainSlots }}/{{ row.totalSlots }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140"><template #default="{ row }"><el-button text type="primary" @click="openSchedDialog(row)">编辑</el-button><el-popconfirm title="确定删除?" @confirm="handleDeleteSched(row.id)"><template #reference><el-button text type="danger">删除</el-button></template></el-popconfirm></template></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 弹窗代码同上不变 -->
    <el-dialog v-model="deptDialogVisible" :title="deptIsEdit?'编辑科室':'新增科室'" width="450px" destroy-on-close>
      <el-form ref="deptFormRef" :model="deptForm" :rules="deptRules" label-width="80px">
        <el-form-item label="名称" prop="name"><el-input v-model="deptForm.name" /></el-form-item>
        <el-form-item label="位置"><el-input v-model="deptForm.location" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="deptForm.phone" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="deptDialogVisible=false">取消</el-button><el-button type="primary" @click="saveDept">保存</el-button></template>
    </el-dialog>
    <el-dialog v-model="doctorDialogVisible" :title="doctorIsEdit?'编辑医生':'新增医生'" width="500px" destroy-on-close>
      <el-form ref="doctorFormRef" :model="doctorForm" :rules="doctorRules" label-width="80px">
        <el-form-item label="姓名" prop="name"><el-input v-model="doctorForm.name" /></el-form-item>
        <el-form-item label="科室" prop="departmentId"><el-select v-model="doctorForm.departmentId" style="width:100%"><el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" /></el-select></el-form-item>
        <el-form-item label="职称"><el-input v-model="doctorForm.title" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="doctorForm.status"><el-radio :value="1">在职</el-radio><el-radio :value="0">停用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="doctorDialogVisible=false">取消</el-button><el-button type="primary" @click="saveDoctor">保存</el-button></template>
    </el-dialog>
    <el-dialog v-model="schedDialogVisible" :title="schedIsEdit?'编辑排班':'新增排班'" width="500px" destroy-on-close>
      <el-form ref="schedFormRef" :model="schedForm" :rules="schedRules" label-width="80px">
        <el-form-item label="医生" prop="doctorId"><el-select v-model="schedForm.doctorId" style="width:100%"><el-option v-for="d in doctorList" :key="d.id" :label="`${d.name} (${d.departmentName})`" :value="d.id" /></el-select></el-form-item>
        <el-form-item label="日期" prop="workDate"><el-date-picker v-model="schedForm.workDate" type="date" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item>
        <el-form-item label="时段" prop="timeSlot"><el-select v-model="schedForm.timeSlot" style="width:100%"><el-option label="☀ 上午" value="上午" /><el-option label="🌤 下午" value="下午" /><el-option label="🌙 晚上" value="晚上" /></el-select></el-form-item>
        <el-form-item label="总号源" prop="totalSlots"><el-input-number v-model="schedForm.totalSlots" :min="1" /></el-form-item>
        <el-form-item label="剩余号源"><el-input-number v-model="schedForm.remainSlots" :min="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="schedDialogVisible=false">取消</el-button><el-button type="primary" @click="saveSched">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { listDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/department'
import { listDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../api/doctor'
import { listSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../api/schedule'
import { basicImgs } from '../../utils/images'
import type { Department, Doctor, Schedule } from '../../types'

const activeTab = ref('dept')
const deptList = ref<Department[]>([])
const deptDialogVisible=ref(false), deptIsEdit=ref(false), deptFormRef=ref<FormInstance>()
const deptForm=reactive<Department>({name:'',location:'',phone:''})
const deptRules={name:[{required:true,message:'请输入科室名称'}]}
async function loadDepts(){try{const r=await listDepartments();deptList.value=r.data}catch{}}
function openDeptDialog(row?:Department){deptIsEdit.value=!!row;Object.assign(deptForm,row?{...row}:{name:'',location:'',phone:''});deptDialogVisible.value=true}
async function saveDept(){const v=await deptFormRef.value?.validate().catch(()=>false);if(!v)return;try{deptIsEdit.value&&deptForm.id?await updateDepartment(deptForm.id,deptForm):await createDepartment(deptForm);ElMessage.success('保存成功');deptDialogVisible.value=false;loadDepts()}catch{}}
async function handleDeleteDept(id:number){try{await deleteDepartment(id);ElMessage.success('已删除');loadDepts()}catch{}}

const doctorList=ref<Doctor[]>([]), deptFilter=ref<number>()
const doctorDialogVisible=ref(false), doctorIsEdit=ref(false), doctorFormRef=ref<FormInstance>()
const doctorForm=reactive<Doctor>({name:'',departmentId:1,title:'',status:1})
const doctorRules={name:[{required:true,message:'请输入姓名'}],departmentId:[{required:true,message:'请选择科室'}]}
async function loadDoctors(){try{const r=await listDoctors(deptFilter.value);doctorList.value=r.data}catch{}}
function openDoctorDialog(row?:Doctor){doctorIsEdit.value=!!row;Object.assign(doctorForm,row?{...row}:{name:'',departmentId:1,title:'',status:1});doctorDialogVisible.value=true}
async function saveDoctor(){const v=await doctorFormRef.value?.validate().catch(()=>false);if(!v)return;try{doctorIsEdit.value&&doctorForm.id?await updateDoctor(doctorForm.id,doctorForm):await createDoctor(doctorForm);ElMessage.success('保存成功');doctorDialogVisible.value=false;loadDoctors()}catch{}}
async function handleDeleteDoctor(id:number){try{await deleteDoctor(id);ElMessage.success('已删除');loadDoctors()}catch{}}

const schedList=ref<Schedule[]>([]), schedDate=ref(new Date().toISOString().slice(0,10)), schedDeptFilter=ref<number>()
const schedDialogVisible=ref(false), schedIsEdit=ref(false), schedFormRef=ref<FormInstance>()
const schedForm=reactive<Schedule>({doctorId:1,workDate:'',timeSlot:'上午',totalSlots:20,remainSlots:20})
const schedRules={doctorId:[{required:true}],workDate:[{required:true}],timeSlot:[{required:true}]}
async function loadSchedules(){try{const r=await listSchedules(schedDate.value,schedDeptFilter.value);schedList.value=r.data}catch{}}
function openSchedDialog(row?:Schedule){schedIsEdit.value=!!row;Object.assign(schedForm,row?{...row}:{doctorId:1,workDate:'',timeSlot:'上午',totalSlots:20,remainSlots:20});schedDialogVisible.value=true}
async function saveSched(){const v=await schedFormRef.value?.validate().catch(()=>false);if(!v)return;try{schedIsEdit.value&&schedForm.id?await updateSchedule(schedForm.id,schedForm):await createSchedule(schedForm);ElMessage.success('保存成功');schedDialogVisible.value=false;loadSchedules()}catch{}}
async function handleDeleteSched(id:number){try{await deleteSchedule(id);ElMessage.success('已删除');loadSchedules()}catch{}}

onMounted(async()=>{await loadDepts();await loadDoctors();await loadSchedules()})
</script>

<style scoped>
.basic-view { padding: 0; }
.page-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; color: #fff;
}
.page-hero h2 { margin: 0 0 4px; font-size: 20px; }
.page-hero p { margin: 0; opacity: 0.85; font-size: 13px; }
.hero-left { display: flex; align-items: center; gap: 14px; }
.hero-stats { display: flex; gap: 18px; font-size: 14px; }
.data-tabs { border-radius: 12px; overflow: hidden; }
.tab-bar { display: flex; gap: 10px; margin-bottom: 16px; }
.data-table { border-radius: 8px; }

/* 科室卡片 */
.dept-card {
  display: flex; align-items: center; gap: 12px; padding: 16px;
  background: #f9fafb; border-radius: 12px; margin-bottom: 12px; cursor: pointer;
  transition: all 0.3s; border: 2px solid transparent;
}
.dept-card:hover { border-color: #67c23a; background: #f0f9eb; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(103,194,58,0.15); }
.dept-icon { color: #67c23a; }
.dept-name { font-weight: 600; font-size: 15px; }
.dept-detail { font-size: 12px; color: #909399; }
.doc-cell { display: flex; align-items: center; gap: 8px; }
.slot-bar { height: 6px; background: #eee; border-radius: 3px; width: 80px; margin-bottom: 2px; }
.slot-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
</style>
