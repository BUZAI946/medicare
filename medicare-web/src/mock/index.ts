import type { MockMethod } from 'vite-plugin-mock'

const departments = [
  { id: 1, name: '内科', location: '门诊楼 1 层 A 区', phone: '025-88880001' },
  { id: 2, name: '外科', location: '门诊楼 1 层 B 区', phone: '025-88880002' },
  { id: 3, name: '儿科', location: '门诊楼 2 层 C 区', phone: '025-88880003' },
  { id: 4, name: '妇产科', location: '门诊楼 2 层 D 区', phone: '025-88880004' },
  { id: 5, name: '中医科', location: '门诊楼 3 层 E 区', phone: '025-88880005' },
]

const doctors = [
  { id: 1, name: '张伟', departmentId: 1, title: '主任医师', status: 1, departmentName: '内科' },
  { id: 2, name: '李娜', departmentId: 1, title: '副主任医师', status: 1, departmentName: '内科' },
  { id: 3, name: '王强', departmentId: 2, title: '主治医师', status: 1, departmentName: '外科' },
  { id: 4, name: '刘洋', departmentId: 3, title: '主任医师', status: 1, departmentName: '儿科' },
  { id: 5, name: '陈静', departmentId: 4, title: '副主任医师', status: 1, departmentName: '妇产科' },
  { id: 6, name: '赵敏', departmentId: 5, title: '医师', status: 1, departmentName: '中医科' },
]

// 数据库全部 26 条患者数据
const patients = [
  { id: 1, idCard: '110101197001011234', name: '张伟', gender: 1, birthDate: '1979-07-11', phone: '13800138001', address: '北京市朝阳区建国路1号', allergyInfo: '青霉素过敏' },
  { id: 2, idCard: '310101198502153321', name: '王芳', gender: 0, birthDate: '1985-02-15', phone: '13900139002', address: '上海市黄浦区南京东路2号', allergyInfo: '' },
  { id: 3, idCard: '440106199008207891', name: '李强', gender: 1, birthDate: '1990-08-20', phone: '15000150003', address: '广州市天河区珠江新城3号', allergyInfo: '磺胺类药物过敏' },
  { id: 4, idCard: '510107197512054512', name: '刘洋', gender: 0, birthDate: '1975-12-05', phone: '18600186004', address: '成都市武侯区人民南路4号', allergyInfo: '' },
  { id: 5, idCard: '330106198803122337', name: '陈静', gender: 0, birthDate: '1988-03-12', phone: '13800138005', address: '杭州市西湖区文三路5号', allergyInfo: '花粉过敏' },
  { id: 6, idCard: '420106199510018876', name: '杨帆', gender: 1, birthDate: '1995-10-01', phone: '13900139006', address: '武汉市武昌区中南路6号', allergyInfo: '' },
  { id: 7, idCard: '610104197209204429', name: '赵敏', gender: 0, birthDate: '1972-09-20', phone: '15000150007', address: '西安市碑林区解放路7号', allergyInfo: '海鲜过敏' },
  { id: 8, idCard: '500103198110158113', name: '黄磊', gender: 1, birthDate: '1981-10-15', phone: '18600186008', address: '重庆市渝中区解放碑8号', allergyInfo: '' },
  { id: 9, idCard: '370102199307224055', name: '周杰', gender: 1, birthDate: '1993-07-22', phone: '13800138009', address: '济南市历下区泉城路9号', allergyInfo: '阿司匹林过敏' },
  { id: 10, idCard: '410105197806301988', name: '吴丽', gender: 0, birthDate: '1978-06-30', phone: '13900139010', address: '郑州市金水区花园路10号', allergyInfo: '' },
  { id: 11, idCard: '320106198912157621', name: '徐鹏', gender: 1, birthDate: '1989-12-15', phone: '15000150011', address: '南京市鼓楼区中山路11号', allergyInfo: '' },
  { id: 12, idCard: '430103199202083452', name: '孙婷', gender: 0, birthDate: '1992-02-08', phone: '18600186012', address: '长沙市芙蓉区五一路12号', allergyInfo: '头孢过敏' },
  { id: 13, idCard: '230103197411204113', name: '马丽', gender: 0, birthDate: '1974-11-20', phone: '13800138013', address: '哈尔滨市南岗区果戈里大街13号', allergyInfo: '' },
  { id: 14, idCard: '120101198605172776', name: '朱伟', gender: 1, birthDate: '1986-05-17', phone: '13900139014', address: '天津市和平区南京路14号', allergyInfo: '花生过敏' },
  { id: 15, idCard: '530102199409085631', name: '胡军', gender: 1, birthDate: '1994-09-08', phone: '15000150015', address: '昆明市五华区东风西路15号', allergyInfo: '' },
  { id: 16, idCard: '210102197305224829', name: '郭静', gender: 0, birthDate: '1973-05-22', phone: '18600186016', address: '沈阳市沈河区青年大街16号', allergyInfo: '' },
  { id: 17, idCard: '340102198701153914', name: '林峰', gender: 1, birthDate: '1987-01-15', phone: '13800138017', address: '合肥市庐阳区长江中路17号', allergyInfo: '尘螨过敏' },
  { id: 18, idCard: '520102199611304226', name: '何萍', gender: 0, birthDate: '1996-11-30', phone: '13900139018', address: '贵阳市云岩区中华北路18号', allergyInfo: '' },
  { id: 19, idCard: '130102197904121557', name: '高翔', gender: 1, birthDate: '1979-04-12', phone: '15000150019', address: '石家庄市长安区建设大街19号', allergyInfo: '' },
  { id: 20, idCard: '140107198305068743', name: '梁雨', gender: 0, birthDate: '1983-05-06', phone: '18600186020', address: '太原市小店区长风街20号', allergyInfo: '芒果过敏' },
  { id: 21, idCard: '321282200801040918', name: '王小二', gender: 1, birthDate: '2008-06-27', phone: '13951027333', address: '', allergyInfo: '' },
  { id: 22, idCard: '32128219901003021x', name: '刘欣', gender: 0, birthDate: '1990-10-01', phone: '13302210021', address: '', allergyInfo: '' },
  { id: 23, idCard: '320106199901011234', name: '测试患者', gender: 1, birthDate: '1999-01-01', phone: '13800138000', address: '南京市鼓楼区', allergyInfo: '无' },
  { id: 24, idCard: '320106200001011111', name: '临时患者', gender: 0, birthDate: '', phone: '13700000000', address: '', allergyInfo: '' },
  { id: 25, idCard: '32010681683661', name: '测试患者', gender: 1, birthDate: '1999-01-01', phone: '13800138000', address: '南京市鼓楼区', allergyInfo: '无' },
  { id: 26, idCard: '32010681683861', name: '测试患者-修改', gender: 1, birthDate: '', phone: '13900139000', address: '南京市玄武区', allergyInfo: '' },
]

const today = new Date().toISOString().slice(0, 10)
const tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate()+1)
const tomorrow = tomorrowDate.toISOString().slice(0, 10)

// 数据库全部 4 条排班（日期改为今天方便演示）
const schedules = [
  // 今天 - 上午
  { id: 1, doctorId: 1, workDate: today, timeSlot: '上午(08:00-12:00)', totalSlots: 20, remainSlots: 18, doctorName: '张伟', departmentName: '内科' },
  { id: 2, doctorId: 2, workDate: today, timeSlot: '上午(08:00-12:00)', totalSlots: 15, remainSlots: 13, doctorName: '李娜', departmentName: '内科' },
  { id: 3, doctorId: 3, workDate: today, timeSlot: '上午(08:00-12:00)', totalSlots: 20, remainSlots: 17, doctorName: '王强', departmentName: '外科' },
  { id: 4, doctorId: 4, workDate: today, timeSlot: '上午(08:00-12:00)', totalSlots: 18, remainSlots: 14, doctorName: '刘洋', departmentName: '儿科' },
  { id: 5, doctorId: 5, workDate: today, timeSlot: '上午(08:00-12:00)', totalSlots: 15, remainSlots: 12, doctorName: '陈静', departmentName: '妇产科' },
  { id: 6, doctorId: 6, workDate: today, timeSlot: '上午(08:00-12:00)', totalSlots: 25, remainSlots: 20, doctorName: '赵敏', departmentName: '中医科' },
  // 今天 - 下午
  { id: 7, doctorId: 1, workDate: today, timeSlot: '下午(14:00-17:30)', totalSlots: 20, remainSlots: 15, doctorName: '张伟', departmentName: '内科' },
  { id: 8, doctorId: 2, workDate: today, timeSlot: '下午(14:00-17:30)', totalSlots: 12, remainSlots: 10, doctorName: '李娜', departmentName: '内科' },
  { id: 9, doctorId: 3, workDate: today, timeSlot: '下午(14:00-17:30)', totalSlots: 15, remainSlots: 12, doctorName: '王强', departmentName: '外科' },
  { id: 10, doctorId: 4, workDate: today, timeSlot: '下午(14:00-17:30)', totalSlots: 15, remainSlots: 8, doctorName: '刘洋', departmentName: '儿科' },
  { id: 11, doctorId: 5, workDate: today, timeSlot: '下午(14:00-17:30)', totalSlots: 10, remainSlots: 8, doctorName: '陈静', departmentName: '妇产科' },
  { id: 12, doctorId: 6, workDate: today, timeSlot: '下午(14:00-17:30)', totalSlots: 20, remainSlots: 18, doctorName: '赵敏', departmentName: '中医科' },
  // 明天
  { id: 13, doctorId: 1, workDate: tomorrow, timeSlot: '上午(08:00-12:00)', totalSlots: 20, remainSlots: 20, doctorName: '张伟', departmentName: '内科' },
  { id: 14, doctorId: 2, workDate: tomorrow, timeSlot: '上午(08:00-12:00)', totalSlots: 15, remainSlots: 15, doctorName: '李娜', departmentName: '内科' },
  { id: 15, doctorId: 3, workDate: tomorrow, timeSlot: '上午(08:00-12:00)', totalSlots: 20, remainSlots: 20, doctorName: '王强', departmentName: '外科' },
  { id: 16, doctorId: 4, workDate: tomorrow, timeSlot: '上午(08:00-12:00)', totalSlots: 18, remainSlots: 18, doctorName: '刘洋', departmentName: '儿科' },
  { id: 17, doctorId: 5, workDate: tomorrow, timeSlot: '上午(08:00-12:00)', totalSlots: 15, remainSlots: 15, doctorName: '陈静', departmentName: '妇产科' },
  { id: 18, doctorId: 6, workDate: tomorrow, timeSlot: '上午(08:00-12:00)', totalSlots: 25, remainSlots: 25, doctorName: '赵敏', departmentName: '中医科' },
]

// 数据库全部 9 条挂号
const registrations = [
  // 内科 - 张伟
  { id: 1, patientId: 1, scheduleId: 1, doctorId: 1, regTime: `${today}T07:25:00`, status: 2, seqNo: 1, fee: 10.00, patientName: '张伟', doctorName: '张伟', departmentName: '内科', timeSlot: '上午' },
  { id: 2, patientId: 2, scheduleId: 1, doctorId: 1, regTime: `${today}T07:28:00`, status: 0, seqNo: 2, fee: 10.00, patientName: '王芳', doctorName: '张伟', departmentName: '内科', timeSlot: '上午' },
  // 内科 - 李娜
  { id: 3, patientId: 3, scheduleId: 2, doctorId: 2, regTime: `${today}T07:30:00`, status: 2, seqNo: 1, fee: 10.00, patientName: '李强', doctorName: '李娜', departmentName: '内科', timeSlot: '上午' },
  { id: 4, patientId: 22, scheduleId: 2, doctorId: 2, regTime: `${today}T07:32:00`, status: 1, seqNo: 2, fee: 10.00, patientName: '刘欣', doctorName: '李娜', departmentName: '内科', timeSlot: '上午' },
  // 外科 - 王强
  { id: 5, patientId: 4, scheduleId: 3, doctorId: 3, regTime: `${today}T07:35:00`, status: 2, seqNo: 1, fee: 10.00, patientName: '刘洋', doctorName: '王强', departmentName: '外科', timeSlot: '上午' },
  { id: 6, patientId: 6, scheduleId: 3, doctorId: 3, regTime: `${today}T07:40:00`, status: 0, seqNo: 2, fee: 10.00, patientName: '杨帆', doctorName: '王强', departmentName: '外科', timeSlot: '上午' },
  // 儿科 - 刘洋
  { id: 7, patientId: 21, scheduleId: 4, doctorId: 4, regTime: `${today}T07:50:00`, status: 2, seqNo: 1, fee: 10.00, patientName: '王小二', doctorName: '刘洋', departmentName: '儿科', timeSlot: '上午' },
  { id: 8, patientId: 5, scheduleId: 4, doctorId: 4, regTime: `${today}T07:55:00`, status: 0, seqNo: 2, fee: 10.00, patientName: '陈静', doctorName: '刘洋', departmentName: '儿科', timeSlot: '上午' },
  // 妇产科 - 陈静
  { id: 9, patientId: 7, scheduleId: 5, doctorId: 5, regTime: `${today}T08:00:00`, status: 0, seqNo: 1, fee: 10.00, patientName: '赵敏', doctorName: '陈静', departmentName: '妇产科', timeSlot: '上午' },
  { id: 10, patientId: 10, scheduleId: 5, doctorId: 5, regTime: `${today}T08:05:00`, status: 0, seqNo: 2, fee: 10.00, patientName: '吴丽', doctorName: '陈静', departmentName: '妇产科', timeSlot: '上午' },
  // 中医科 - 赵敏
  { id: 11, patientId: 8, scheduleId: 6, doctorId: 6, regTime: `${today}T08:10:00`, status: 0, seqNo: 1, fee: 10.00, patientName: '黄磊', doctorName: '赵敏', departmentName: '中医科', timeSlot: '上午' },
  { id: 12, patientId: 9, scheduleId: 6, doctorId: 6, regTime: `${today}T08:15:00`, status: 0, seqNo: 2, fee: 10.00, patientName: '周杰', doctorName: '赵敏', departmentName: '中医科', timeSlot: '上午' },
]

// 数据库全部 7 种药品
const medicines = [
  { id: 1, name: '阿莫西林胶囊', spec: '0.25g*24粒', unit: '盒', stock: 766, safetyStock: 50, expiryDate: '2028-06-30', batchNo: 'B2026030', pinyinCode: 'AMXL', price: 12.50, manufacturer: '华北制药', status: 1 },
  { id: 2, name: '布洛芬缓释胶囊', spec: '0.3g*20粒', unit: '盒', stock: 298, safetyStock: 30, expiryDate: '', batchNo: '', pinyinCode: 'BLF', price: 18.00, manufacturer: '芬必得', status: 1 },
  { id: 3, name: '感冒清热颗粒', spec: '12g*10袋', unit: '盒', stock: 8, safetyStock: 20, expiryDate: '', batchNo: '', pinyinCode: 'GMQRKL', price: 15.80, manufacturer: '同仁堂', status: 1 },
  { id: 4, name: '头孢克肟片', spec: '0.1g*6片', unit: '盒', stock: 1150, safetyStock: 15, expiryDate: '2028-06-30', batchNo: 'h20000', pinyinCode: 'TBKW', price: 28.50, manufacturer: '白云山', status: 1 },
  { id: 5, name: '维生素C片', spec: '0.1g*100片', unit: '瓶', stock: 100, safetyStock: 10, expiryDate: '', batchNo: '', pinyinCode: 'WSSC', price: 6.50, manufacturer: '东北制药', status: 1 },
  { id: 6, name: '阿莫西林', spec: '0.25g*12片', unit: '盒', stock: 100, safetyStock: 10, expiryDate: '2028-06-30', batchNo: '国药122322', pinyinCode: '', price: 7.60, manufacturer: 'AMXL', status: 1 },
  { id: 11, name: '左氧氟沙星胶囊', spec: '0.5g*24粒', unit: '盒', stock: 0, safetyStock: 10, expiryDate: '2028-06-30', batchNo: 'HW11200', pinyinCode: 'ZYFSX', price: 23.40, manufacturer: '太极制药集团', status: 1 },
]

// 数据库全部 4 条病历
const medicalRecords = [
  { id: 1, registrationId: 1, patientId: 1, doctorId: 1, chiefComplaint: '嗓子疼,轻微咳嗽', presentIllness: '无', pastHistory: '无', physicalExam: '扁桃体轻微肿大', diagnosis: '季节性感冒', advice: '复用999感冒灵7日', patientName: '张伟', doctorName: '张伟' },
  { id: 2, registrationId: 2, patientId: 22, doctorId: 2, chiefComplaint: '头疼', presentIllness: '无', pastHistory: '无', physicalExam: '健康', diagnosis: '神经衰弱', advice: '布若芬分散片1盒,头疼时服用1颗,注意休息', patientName: '刘欣', doctorName: '李娜' },
  { id: 3, registrationId: 4, patientId: 25, doctorId: 1, chiefComplaint: '头痛三天-修改', presentIllness: '', pastHistory: '', physicalExam: '', diagnosis: '高血压2级', advice: '', patientName: '测试患者', doctorName: '张伟' },
  { id: 4, registrationId: 5, patientId: 26, doctorId: 1, chiefComplaint: '头痛三天-修改', presentIllness: '', pastHistory: '', physicalExam: '', diagnosis: '高血压2级', advice: '', patientName: '测试患者-修改', doctorName: '张伟' },
]

// 数据库全部 2 条处方（含明细）
const prescriptions = [
  { id: 3, recordId: 3, patientId: 25, doctorId: 1, totalAmount: 43.00, status: 0, patientName: '测试患者', doctorName: '张伟', items: [
    { id: 1, prescriptionId: 3, medicineId: 1, quantity: 2, dosage: '一日三次', usageDesc: '饭后服用', unitPrice: 12.50, amount: 25.00, medicineName: '阿莫西林胶囊', medicineSpec: '0.25g*24粒', medicineUnit: '盒' },
    { id: 2, prescriptionId: 3, medicineId: 2, quantity: 1, dosage: '一日一次', usageDesc: '睡前服用', unitPrice: 18.00, amount: 18.00, medicineName: '布洛芬缓释胶囊', medicineSpec: '0.3g*20粒', medicineUnit: '盒' },
  ]},
  { id: 4, recordId: 4, patientId: 26, doctorId: 1, totalAmount: 43.00, status: 0, patientName: '测试患者-修改', doctorName: '张伟', items: [
    { id: 3, prescriptionId: 4, medicineId: 1, quantity: 2, dosage: '一日三次', usageDesc: '饭后服用', unitPrice: 12.50, amount: 25.00, medicineName: '阿莫西林胶囊', medicineSpec: '0.25g*24粒', medicineUnit: '盒' },
    { id: 4, prescriptionId: 4, medicineId: 2, quantity: 1, dosage: '一日一次', usageDesc: '睡前服用', unitPrice: 18.00, amount: 18.00, medicineName: '布洛芬缓释胶囊', medicineSpec: '0.3g*20粒', medicineUnit: '盒' },
  ]},
]

// 库存日志
const inventoryLogs = [
  { id: 9, medicineId: 1, type: 1, quantity: 50, batchNo: 'B2026002', expiryDate: '2027-12-31', operator: 'admin', remark: '测试入库50', logTime: '2026-06-11 00:29:18', medicineName: '阿莫西林胶囊' },
  { id: 10, medicineId: 1, type: 2, quantity: 20, batchNo: '', expiryDate: '', operator: 'admin', remark: '测试出库20', logTime: '2026-06-11 00:29:18', medicineName: '阿莫西林胶囊' },
  { id: 12, medicineId: 4, type: 1, quantity: 1000, batchNo: 'H221022', expiryDate: '2029-06-30', operator: '老王', remark: '', logTime: '2026-06-11 00:30:35', medicineName: '头孢克肟片' },
  { id: 16, medicineId: 4, type: 1, quantity: 100, batchNo: 'h20000', expiryDate: '2028-06-30', operator: '老苏', remark: '', logTime: '2026-06-11 00:34:41', medicineName: '头孢克肟片' },
  { id: 17, medicineId: 4, type: 2, quantity: 100, batchNo: 'h20000', expiryDate: '2028-06-30', operator: '老王', remark: '', logTime: '2026-06-11 00:35:03', medicineName: '头孢克肟片' },
  { id: 18, medicineId: 6, type: 1, quantity: 100, batchNo: '国药122322', expiryDate: '2028-06-30', operator: '', remark: '', logTime: '2026-06-11 07:48:09', medicineName: '阿莫西林' },
  { id: 19, medicineId: 1, type: 1, quantity: 100, batchNo: 'B20260601', expiryDate: '2027-06-01', operator: 'admin', remark: '测试入库', logTime: '2026-06-17 16:01:32', medicineName: '阿莫西林胶囊' },
  { id: 20, medicineId: 1, type: 2, quantity: 10, batchNo: 'B20260601', expiryDate: '2027-06-01', operator: 'admin', remark: '测试出库', logTime: '2026-06-17 16:01:32', medicineName: '阿莫西林胶囊' },
]

// 数据库全部 2 个用户 + 扩展的测试用户
const users = [
  { id: 1, username: 'admin', realName: '老板', role: 'admin', status: 1, doctorId: null, password: 'admin123' },
  { id: 8, username: 'admin2', realName: '老徐', role: 'admin', status: 1, doctorId: null, password: 'admin123' },
  { id: 2, username: 'doctor1', realName: '张伟', role: 'doctor', status: 1, doctorId: 1, password: 'doctor123' },
  { id: 3, username: 'pharmacist1', realName: '李药师', role: 'pharmacist', status: 1, doctorId: null, password: 'pharm123' },
]

let nextId = 200

export default [
  // ========== Auth ==========
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const user = users.find((u) => u.username === body.username)
      if (!user) return { code: 401, message: '用户不存在', data: null }
      if (body.password !== user.password) return { code: 401, message: '密码错误', data: null }
      return { code: 200, message: 'success', data: user }
    },
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: '/api/auth/current',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: users[0] }),
  },

  // ========== Dashboard ==========
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => ({
      code: 200, message: 'success',
      data: {
        todayRegCount: registrations.length,
        waitingCount: registrations.filter(r => r.status === 0).length,
        stockAlertCount: medicines.filter(m => m.stock <= m.safetyStock && m.status === 1).length,
      },
    }),
  },

  // ========== Departments ==========
  {
    url: '/api/departments',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: departments }),
  },
  {
    url: '/api/departments',
    method: 'post',
    response: ({ body }: any) => {
      const item = { id: ++nextId, ...body }
      departments.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/departments\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/departments\/\d+$/,
    method: 'delete',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: /\/api\/departments\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: departments.find(d => d.id === id) || null }
    },
  },

  // ========== Doctors ==========
  {
    url: '/api/doctors',
    method: 'get',
    response: ({ query }: any) => {
      let result = doctors
      if (query.deptId) result = result.filter((d) => d.departmentId === Number(query.deptId))
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/doctors',
    method: 'post',
    response: ({ body }: any) => {
      const dept = departments.find((d) => d.id === body.departmentId)
      const item = { id: ++nextId, ...body, departmentName: dept?.name || '' }
      doctors.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/doctors\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/doctors\/\d+$/,
    method: 'delete',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: /\/api\/doctors\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: doctors.find(d => d.id === id) || null }
    },
  },

  // ========== Patients ==========
  {
    url: '/api/patients',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: patients }),
  },
  {
    url: '/api/patients/search',
    method: 'get',
    response: ({ query }: any) => {
      const kw = query.keyword?.toLowerCase() || ''
      const result = patients.filter((p) =>
        p.name.toLowerCase().includes(kw) || p.idCard.includes(kw) || p.phone?.includes(kw)
      )
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/patients',
    method: 'post',
    response: ({ body }: any) => {
      const item = { id: ++nextId, ...body }
      patients.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/patients\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/patients\/\d+$/,
    method: 'delete',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: /\/api\/patients\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: patients.find(p => p.id === id) || null }
    },
  },

  // ========== Schedules ==========
  {
    url: '/api/schedules',
    method: 'get',
    response: ({ query }: any) => {
      let result = schedules
      if (query.date) result = result.filter((s) => s.workDate === query.date)
      if (query.deptId) result = result.filter((s) => doctors.find((d) => d.id === s.doctorId)?.departmentId === Number(query.deptId))
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/schedules/available',
    method: 'get',
    response: ({ query }: any) => {
      let result = schedules.filter((s) => s.remainSlots > 0)
      if (query.date) result = result.filter((s) => s.workDate === query.date)
      if (query.deptId) result = result.filter((s) => doctors.find((d) => d.id === s.doctorId)?.departmentId === Number(query.deptId))
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/schedules',
    method: 'post',
    response: ({ body }: any) => {
      const doc = doctors.find((d) => d.id === body.doctorId)
      const item = { id: ++nextId, ...body, doctorName: doc?.name || '', departmentName: doc?.departmentName || '' }
      schedules.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/schedules\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/schedules\/\d+$/,
    method: 'delete',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: /\/api\/schedules\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: schedules.find(s => s.id === id) || null }
    },
  },

  // ========== Registrations ==========
  {
    url: '/api/registrations',
    method: 'get',
    response: ({ query }: any) => {
      let result = registrations
      if (query.status !== undefined && query.status !== '') result = result.filter((r) => r.status === Number(query.status))
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/registrations',
    method: 'post',
    response: ({ body }: any) => {
      const sched = schedules.find((s) => s.id === body.scheduleId)
      const pat = patients.find((p) => p.id === body.patientId)
      if (sched) sched.remainSlots--
      const item = {
        id: ++nextId, ...body, status: 0, seqNo: registrations.length + 1, fee: 10.00,
        regTime: new Date().toISOString(), patientName: pat?.name || '',
        doctorName: sched?.doctorName || '', departmentName: sched?.departmentName || '', timeSlot: sched?.timeSlot || '',
      }
      registrations.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/registrations\/\d+\/call$/,
    method: 'put',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/(\d+)\/call/)![1])
      const reg = registrations.find(r => r.id === id)
      if (reg) reg.status = 1
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: /\/api\/registrations\/\d+\/complete$/,
    method: 'put',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/(\d+)\/complete/)![1])
      const reg = registrations.find(r => r.id === id)
      if (reg) reg.status = 2
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: /\/api\/registrations\/\d+$/,
    method: 'delete',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/(\d+)$/)![1])
      const reg = registrations.find(r => r.id === id)
      if (reg) reg.status = 3
      return { code: 200, message: 'success', data: null }
    },
  },

  // ========== Medical Records ==========
  {
    url: '/api/medical-records',
    method: 'get',
    response: ({ query }: any) => {
      let result = medicalRecords
      if (query.patientId) result = result.filter(r => r.patientId === Number(query.patientId))
      if (query.registrationId) result = result.filter(r => r.registrationId === Number(query.registrationId))
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/medical-records',
    method: 'post',
    response: ({ body }: any) => {
      const item = {
        id: ++nextId, ...body,
        patientName: patients.find((p) => p.id === body.patientId)?.name || '',
        doctorName: doctors.find((d) => d.id === body.doctorId)?.name || '',
      }
      medicalRecords.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/medical-records\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/medical-records\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: medicalRecords.find(r => r.id === id) || null }
    },
  },
  {
    url: /\/api\/medical-records\/by-registration\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/by-registration\/(\d+)/)![1])
      return { code: 200, message: 'success', data: medicalRecords.find(r => r.registrationId === id) || null }
    },
  },

  // ========== Medicines ==========
  {
    url: '/api/medicines',
    method: 'get',
    response: ({ query }: any) => {
      let result = medicines.filter((m) => m.status === 1)
      if (query.keyword) {
        const kw = query.keyword.toLowerCase()
        result = result.filter((m) => m.name.toLowerCase().includes(kw) || m.pinyinCode?.toLowerCase().includes(kw))
      }
      return { code: 200, message: 'success', data: result }
    },
  },
  {
    url: '/api/medicines/low-stock',
    method: 'get',
    response: () => ({
      code: 200, message: 'success',
      data: medicines.filter((m) => m.stock <= m.safetyStock && m.status === 1),
    }),
  },
  {
    url: '/api/medicines',
    method: 'post',
    response: ({ body }: any) => {
      const item = { id: ++nextId, ...body }
      medicines.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/medicines\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/medicines\/\d+\/stock-in$/,
    method: 'post',
    response: ({ url, body }: any) => {
      const id = Number((url as string).match(/(\d+)\/stock-in/)![1])
      const med = medicines.find(m => m.id === id)
      if (med) med.stock += (body.quantity || 0)
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: /\/api\/medicines\/\d+\/stock-out$/,
    method: 'post',
    response: ({ url, body }: any) => {
      const id = Number((url as string).match(/(\d+)\/stock-out/)![1])
      const med = medicines.find(m => m.id === id)
      if (med) med.stock = Math.max(0, med.stock - (body.quantity || 0))
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: /\/api\/medicines\/\d+$/,
    method: 'delete',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: /\/api\/medicines\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: medicines.find(m => m.id === id) || null }
    },
  },

  // ========== Prescriptions ==========
  {
    url: '/api/prescriptions',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: prescriptions }),
  },
  {
    url: '/api/prescriptions',
    method: 'post',
    response: ({ body }: any) => {
      const item = {
        id: ++nextId, ...body.prescription, items: body.items, status: 0,
        patientName: patients.find((p) => p.id === body.prescription.patientId)?.name || '',
        doctorName: doctors.find((d) => d.id === body.prescription.doctorId)?.name || '',
      }
      prescriptions.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/prescriptions\/\d+\/dispense$/,
    method: 'put',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/(\d+)\/dispense/)![1])
      const p = prescriptions.find(p => p.id === id)
      if (p) p.status = 2
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: /\/api\/prescriptions\/\d+\/cancel$/,
    method: 'put',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/(\d+)\/cancel/)![1])
      const p = prescriptions.find(p => p.id === id)
      if (p) p.status = 3
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: /\/api\/prescriptions\/by-record\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).match(/by-record\/(\d+)/)![1])
      return { code: 200, message: 'success', data: prescriptions.find(p => p.recordId === id) || null }
    },
  },
  {
    url: /\/api\/prescriptions\/\d+$/,
    method: 'get',
    response: ({ url }: any) => {
      const id = Number((url as string).split('/').pop())
      return { code: 200, message: 'success', data: prescriptions.find(p => p.id === id) || null }
    },
  },
  {
    url: '/api/prescriptions/inventory-logs',
    method: 'get',
    response: ({ query }: any) => {
      let result = inventoryLogs
      if (query.medicineId) result = result.filter(l => l.medicineId === Number(query.medicineId))
      return { code: 200, message: 'success', data: result }
    },
  },

  // ========== Users ==========
  {
    url: '/api/users',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: users }),
  },
  {
    url: '/api/users',
    method: 'post',
    response: ({ body }: any) => {
      const item = { id: ++nextId, ...body }
      users.push(item as any)
      return { code: 200, message: 'success', data: item }
    },
  },
  {
    url: /\/api\/users\/\d+$/,
    method: 'put',
    response: ({ body }: any) => ({ code: 200, message: 'success', data: body }),
  },
  {
    url: /\/api\/users\/\d+\/password$/,
    method: 'put',
    response: ({ url, body }: any) => {
      const uid = Number((url as string).match(/(\d+)\/password/)![1])
      const user = users.find(u => u.id === uid)
      if (!user) return { code: 404, message: '用户不存在', data: null }
      if (body.oldPassword !== user.password) return { code: 400, message: '当前密码不正确', data: null }
      if (!body.newPassword || body.newPassword.length < 6) return { code: 400, message: '新密码至少6位', data: null }
      user.password = body.newPassword
      return { code: 200, message: '密码修改成功', data: null }
    },
  },
  {
    url: /\/api\/users\/\d+$/,
    method: 'delete',
    response: () => ({ code: 200, message: 'success', data: null }),
  },
] as MockMethod[]
