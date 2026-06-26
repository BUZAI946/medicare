import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/LoginView.vue'),
      meta: { title: '登录', requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('../views/layout/MainLayout.vue'),
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/layout/DashboardView.vue'),
          meta: { title: '首页', icon: 'HomeFilled', roles: ['admin', 'doctor', 'pharmacist'] },
        },
        {
          path: 'patients',
          name: 'PatientList',
          component: () => import('../views/patient/PatientList.vue'),
          meta: { title: '患者管理', icon: 'User', roles: ['admin', 'doctor'] },
        },
        {
          path: 'basic-data',
          name: 'BasicData',
          component: () => import('../views/basic-data/BasicDataView.vue'),
          meta: { title: '基础数据', icon: 'Folder', roles: ['admin', 'doctor'] },
        },
        {
          path: 'registration',
          name: 'Registration',
          component: () => import('../views/registration/RegistrationView.vue'),
          meta: { title: '挂号预约', icon: 'Calendar', roles: ['admin'] },
        },
        {
          path: 'workstation',
          name: 'Workstation',
          component: () => import('../views/doctor/WorkstationView.vue'),
          meta: { title: '医生工作站', icon: 'Stethoscope', roles: ['admin', 'doctor'] },
        },
        {
          path: 'medical-records',
          name: 'MedicalRecordList',
          component: () => import('../views/medical-record/RecordList.vue'),
          meta: { title: '病历管理', icon: 'Document', roles: ['admin', 'doctor'] },
        },
        {
          path: 'pharmacy',
          name: 'Pharmacy',
          component: () => import('../views/pharmacy/MedicineList.vue'),
          meta: { title: '药品库存', icon: 'FirstAidKit', roles: ['admin', 'doctor', 'pharmacist'] },
        },
        {
          path: 'prescriptions',
          name: 'PrescriptionList',
          component: () => import('../views/prescription/PrescriptionView.vue'),
          meta: { title: '处方管理', icon: 'Notebook', roles: ['admin', 'doctor', 'pharmacist'] },
        },
        {
          path: 'payments',
          name: 'PaymentList',
          component: () => import('../views/payment/PaymentView.vue'),
          meta: { title: '收费管理', icon: 'Money', roles: ['admin'] },
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: () => import('../views/calendar/CalendarView.vue'),
          meta: { title: '预约日历', icon: 'Calendar', roles: ['admin', 'doctor'] },
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/reports/ReportsView.vue'),
          meta: { title: '报表中心', icon: 'DataAnalysis', roles: ['admin'] },
        },
        {
          path: 'datav',
          name: 'DataV',
          component: () => import('../views/datav/DataV.vue'),
          meta: { title: '数据大屏', icon: 'Monitor', roles: ['admin', 'doctor', 'pharmacist'] },
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/settings/SettingsView.vue'),
          meta: { title: '系统设置', icon: 'Setting', roles: ['admin', 'doctor', 'pharmacist'] },
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'MediCare'} - 智慧医疗`

  if (to.meta.requiresAuth !== false) {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      userStore.loadFromStorage()
    }
    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }
    const roles = to.meta.roles as string[] | undefined
    if (roles && !roles.includes(userStore.currentUser!.role)) {
      next('/dashboard')
      return
    }
  }
  next()
})

export default router