-- ============================================================
-- MediCare 初始化脚本 — 重置密码为已知明文，首次启动自动 BCrypt 加密
-- 执行方式：在 MySQL 中执行此脚本，或在导入 medicare.sql 后执行
-- ============================================================

USE medicare;

-- 删除旧测试用户（如有）
DELETE FROM sys_user WHERE username IN ('doctor1', 'pharmacist1');

-- 重置 admin 密码为已知明文（首次启动时 DataMigrationRunner 自动 BCrypt 加密）
UPDATE sys_user SET password = 'admin123' WHERE username = 'admin';
UPDATE sys_user SET password = 'admin123' WHERE username = 'admin2';

-- 新增测试医生账号
INSERT INTO sys_user (username, password, real_name, role, status, doctor_id)
VALUES ('doctor1', 'doctor123', '张医生', 'doctor', 1, 1);

-- 新增测试药房账号
INSERT INTO sys_user (username, password, real_name, role, status, doctor_id)
VALUES ('pharmacist1', 'pharmacist123', '李药师', 'pharmacist', 1, NULL);

-- 验证
SELECT id, username, real_name, role, status FROM sys_user;

SELECT '初始化完成！首次启动后密码将自动转为 BCrypt 加密' AS message;
