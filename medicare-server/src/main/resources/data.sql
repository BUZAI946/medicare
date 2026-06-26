-- MediCare H2 初始数据（MySQL 兼容模式）
-- 使用 MERGE 避免重复插入
SET MODE MySQL;

-- 科室
MERGE INTO department (id, name, location, phone) VALUES (1, '内科', '门诊楼 1 层 A 区', '025-88880001');
MERGE INTO department (id, name, location, phone) VALUES (2, '外科', '门诊楼 1 层 B 区', '025-88880002');
MERGE INTO department (id, name, location, phone) VALUES (3, '儿科', '门诊楼 2 层 C 区', '025-88880003');
MERGE INTO department (id, name, location, phone) VALUES (4, '妇产科', '门诊楼 2 层 D 区', '025-88880004');
MERGE INTO department (id, name, location, phone) VALUES (5, '中医科', '门诊楼 3 层 E 区', '025-88880005');

-- 医生
MERGE INTO doctor (id, name, department_id, title, status) VALUES (1, '张医生', 1, '主任医师', 1);
MERGE INTO doctor (id, name, department_id, title, status) VALUES (2, '李医生', 1, '副主任医师', 1);
MERGE INTO doctor (id, name, department_id, title, status) VALUES (3, '王医生', 2, '主任医师', 1);
MERGE INTO doctor (id, name, department_id, title, status) VALUES (4, '赵医生', 3, '主治医师', 1);
MERGE INTO doctor (id, name, department_id, title, status) VALUES (5, '孙医生', 4, '副主任医师', 1);
MERGE INTO doctor (id, name, department_id, title, status) VALUES (6, '陈医生', 5, '主任医师', 1);

-- 排班（未来 7 天）
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (1, 1, CURRENT_DATE, '上午', 20, 20);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (2, 1, CURRENT_DATE, '下午', 15, 15);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (3, 2, CURRENT_DATE, '上午', 20, 20);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (4, 3, CURRENT_DATE, '上午', 20, 20);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (5, 4, CURRENT_DATE, '上午', 15, 15);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (6, 1, DATEADD('DAY', 1, CURRENT_DATE), '上午', 20, 20);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (7, 2, DATEADD('DAY', 1, CURRENT_DATE), '上午', 20, 20);
MERGE INTO schedule (id, doctor_id, work_date, time_slot, total_slots, remain_slots) VALUES (8, 3, DATEADD('DAY', 2, CURRENT_DATE), '下午', 15, 15);

-- 药品
MERGE INTO medicine (id, name, spec, unit, stock, safety_stock, price, manufacturer, status) VALUES (1, '阿莫西林胶囊', '0.25g*24粒', '盒', 500, 50, 12.50, '华北制药', 1);
MERGE INTO medicine (id, name, spec, unit, stock, safety_stock, price, manufacturer, status) VALUES (2, '布洛芬缓释胶囊', '0.3g*20粒', '盒', 300, 30, 18.00, '中美史克', 1);
MERGE INTO medicine (id, name, spec, unit, stock, safety_stock, price, manufacturer, status) VALUES (3, '头孢克洛胶囊', '0.25g*12粒', '盒', 200, 20, 35.00, '广州白云山', 1);
MERGE INTO medicine (id, name, spec, unit, stock, safety_stock, price, manufacturer, status) VALUES (4, '维生素C片', '100mg*100片', '瓶', 800, 100, 8.00, '东北制药', 1);
MERGE INTO medicine (id, name, spec, unit, stock, safety_stock, price, manufacturer, status) VALUES (5, '板蓝根颗粒', '10g*20袋', '盒', 600, 60, 15.00, '三九医药', 1);

-- 管理员账号（明文密码，首次启动 DataMigrationRunner 自动 BCrypt 加密）
MERGE INTO sys_user (id, username, password, real_name, role, status) VALUES (1, 'admin', 'admin123', '系统管理员', 'admin', 1);
MERGE INTO sys_user (id, username, password, real_name, role, status) VALUES (2, 'admin2', 'admin123', '备用管理员', 'admin', 1);
MERGE INTO sys_user (id, username, password, real_name, role, status) VALUES (3, 'doctor1', 'doctor123', '张医生', 'doctor', 1);
MERGE INTO sys_user (id, username, password, real_name, role, status) VALUES (4, 'pharmacist1', 'pharmacist123', '李药师', 'pharmacist', 1);
