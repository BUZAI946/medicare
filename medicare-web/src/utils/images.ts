/**
 * 医疗主题图片 — 来自 Pexels 高质量免费图库
 * 每张图指定唯一 seed，保证内容稳定不随机变化
 */

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop`

// 仪表盘 — 医院全景 / 医疗团队
export const dashImgs = [
  px(356040),   // 医院大楼
  px(263402),   // 医生诊疗
]

// 医生工作站 — 听诊器 / 医疗设备
export const workstationImgs = [
  px(127873),   // 医生听诊
  px(4021775),  // 医疗工作
]

// 药品库存 — 药品 / 疫苗
export const medicineImgs = [
  px(355952),   // 药片特写
  px(4386478),  // 药房货架
]

// 挂号预约 — 候诊区 / 接待台
export const regImgs = [
  px(3844581),  // 医院走廊
  px(3957988),  // 候诊大厅
]

// 病历管理 — 医疗记录 / 电子病历
export const recordImgs = [
  px(2280571),  // 医疗实验室
  px(6120207),  // 患者护理
]

// 处方管理 — 处方 / 发药
export const prescImgs = [
  px(4386466),  // 医疗器械
  px(8460128),  // 医疗关怀
]

// 基础数据 — 医疗团队 / 科室
export const basicImgs = [
  px(3952235),  // 医疗团队
  px(8949278),  // 医疗环境
]

// 系统设置 — 医疗科技 / 管理
export const settingImgs = [
  px(6686450),  // 医疗建筑
  px(4588019),  // 医疗护理
]
