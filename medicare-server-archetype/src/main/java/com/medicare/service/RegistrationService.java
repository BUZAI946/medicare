package com.medicare.service;

import com.medicare.dto.RegistrationVO;
import com.medicare.entity.Registration;
import com.medicare.entity.Schedule;
import com.medicare.exception.BusinessException;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.RegistrationRepository;
import com.medicare.repository.ScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 挂号服务 — 核心业务逻辑（挂号/叫号/完成/取消）
 * <p>
 * 事务保证：挂号时号源扣减与记录保存原子性；取消时号源回增与状态更新原子性
 */
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final ScheduleRepository scheduleRepository;
    private final PatientRepository patientRepository;

    public List<RegistrationVO> findRegistrationVOList(LocalDate date, Integer status) {
        return registrationRepository.findTodayList(date, status);
    }

    /**
     * 挂号 — 事务操作：原子扣减号源 + 保存挂号记录 + 从 schedule 复制 doctorId
     */
    @Transactional
    public Registration register(Long patientId, Long scheduleId) {
        // 1. 校验患者存在
        if (!patientRepository.existsById(patientId)) {
            throw new BusinessException("患者不存在");
        }

        // 2. 原子扣减号源（WHERE remain_slots > 0 防超卖）
        int affected = scheduleRepository.decrementRemain(scheduleId);
        if (affected == 0) {
            throw new BusinessException("号源不足，请选择其他号源");
        }

        // 3. 获取排班信息
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BusinessException("排班不存在"));

        // 4. 分配序号
        long seqNo = registrationRepository.countByScheduleAndNotCancelled(scheduleId) + 1;

        // 5. 创建挂号记录
        Registration reg = new Registration();
        reg.setPatientId(patientId);
        reg.setScheduleId(scheduleId);
        reg.setDoctorId(schedule.getDoctorId());
        reg.setStatus(Registration.STATUS_WAITING);
        reg.setSeqNo((int) seqNo);
        reg.setFee(java.math.BigDecimal.TEN);
        return registrationRepository.save(reg);
    }

    /** 叫号 — 状态 0(候诊) → 1(就诊中) */
    @Transactional
    public void callPatient(Long id) {
        int affected = registrationRepository.callPatient(id);
        if (affected == 0) {
            throw new BusinessException("叫号失败，可能该挂号不在候诊状态");
        }
    }

    /** 完成就诊 — 状态 1(就诊中) → 2(已完成) */
    @Transactional
    public void complete(Long id) {
        int affected = registrationRepository.completeRegistration(id);
        if (affected == 0) {
            throw new BusinessException("完成就诊失败，可能该挂号不在就诊中状态");
        }
    }

    /**
     * 取消挂号 — 事务操作：状态→已取消 + 回增号源
     */
    @Transactional
    public void cancel(Long id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("挂号不存在"));
        if (reg.getStatus() == Registration.STATUS_CANCELLED) {
            throw new BusinessException("该挂号已取消");
        }
        if (reg.getStatus() == Registration.STATUS_COMPLETED) {
            throw new BusinessException("已完成的挂号不能取消");
        }
        reg.setStatus(Registration.STATUS_CANCELLED);
        registrationRepository.save(reg);
        // 回增号源
        scheduleRepository.incrementRemain(reg.getScheduleId());
    }
}
