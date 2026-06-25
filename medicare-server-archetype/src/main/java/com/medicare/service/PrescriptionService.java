package com.medicare.service;

import com.medicare.dto.InventoryLogVO;
import com.medicare.dto.PrescriptionCreateRequest;
import com.medicare.dto.PrescriptionItemVO;
import com.medicare.dto.PrescriptionListVO;
import com.medicare.dto.PrescriptionVO;
import com.medicare.entity.InventoryLog;
import com.medicare.entity.Medicine;
import com.medicare.entity.Prescription;
import com.medicare.entity.PrescriptionItem;
import com.medicare.exception.BusinessException;
import com.medicare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 处方服务 — 处方 CRUD + 库存管理（扣减/回滚）+ 日志记录
 * <p>
 * 开处方时：保存处方主表 → 逐条扣减库存 → 记录库存日志 → 保存明细项
 * 作废处方时：逐条回滚库存 → 记录日志 → 更新处方状态
 */
@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public List<PrescriptionListVO> findPrescriptionListVOList(Long patientId, Boolean today) {
        LocalDate todayDate = (today != null && today) ? LocalDate.now() : null;
        return prescriptionRepository.findPrescriptionVOList(patientId, todayDate);
    }

    public PrescriptionVO findPrescriptionVOById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("处方不存在"));

        PrescriptionVO vo = new PrescriptionVO();
        vo.setId(prescription.getId());
        vo.setRecordId(prescription.getRecordId());
        vo.setPatientId(prescription.getPatientId());
        vo.setDoctorId(prescription.getDoctorId());
        vo.setTotalAmount(prescription.getTotalAmount());
        vo.setStatus(prescription.getStatus());
        vo.setCreateTime(prescription.getCreateTime());

        // 关联名称
        patientRepository.findById(prescription.getPatientId())
                .ifPresent(p -> vo.setPatientName(p.getName()));
        doctorRepository.findById(prescription.getDoctorId())
                .ifPresent(d -> vo.setDoctorName(d.getName()));

        // 明细列表 — 批量查询药品信息，避免 N+1
        List<PrescriptionItem> items = prescriptionItemRepository.findByPrescriptionId(id);
        List<Long> medicineIds = items.stream().map(PrescriptionItem::getMedicineId).distinct().toList();
        Map<Long, Medicine> medicineMap = medicineRepository.findAllById(medicineIds)
                .stream().collect(Collectors.toMap(Medicine::getId, Function.identity()));

        List<PrescriptionItemVO> itemVOs = new ArrayList<>();
        for (PrescriptionItem item : items) {
            PrescriptionItemVO itemVO = new PrescriptionItemVO();
            itemVO.setId(item.getId());
            itemVO.setPrescriptionId(item.getPrescriptionId());
            itemVO.setMedicineId(item.getMedicineId());
            itemVO.setQuantity(item.getQuantity());
            itemVO.setDosage(item.getDosage());
            itemVO.setUsageDesc(item.getUsageDesc());
            itemVO.setUnitPrice(item.getUnitPrice());
            itemVO.setAmount(item.getAmount());
            Medicine med = medicineMap.get(item.getMedicineId());
            if (med != null) {
                itemVO.setMedicineName(med.getName());
                itemVO.setMedicineSpec(med.getSpec());
                itemVO.setMedicineUnit(med.getUnit());
            }
            itemVOs.add(itemVO);
        }
        vo.setItems(itemVOs);

        return vo;
    }

    /** 按病历ID查询处方 */
    public PrescriptionVO findByMedicalRecordId(Long recordId) {
        return prescriptionRepository.findByRecordId(recordId)
                .map(p -> findPrescriptionVOById(p.getId()))
                .orElse(null);
    }

    /**
     * 开立处方 — 事务操作：保存处方主表 + 逐条扣减库存 + 记录库存日志 + 保存明细项
     */
    @Transactional
    public Prescription create(PrescriptionCreateRequest request) {
        PrescriptionCreateRequest.PrescriptionInfo info = request.getPrescription();
        List<PrescriptionCreateRequest.ItemInfo> itemInfos = request.getItems();

        // 构建处方主表
        Prescription prescription = new Prescription();
        prescription.setRecordId(info.getRecordId());
        prescription.setPatientId(info.getPatientId());
        prescription.setDoctorId(info.getDoctorId());

        // 计算总金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (PrescriptionCreateRequest.ItemInfo itemInfo : itemInfos) {
            BigDecimal amount = itemInfo.getUnitPrice().multiply(BigDecimal.valueOf(itemInfo.getQuantity()));
            totalAmount = totalAmount.add(amount);
        }
        prescription.setTotalAmount(totalAmount);
        prescription.setStatus(Prescription.STATUS_PENDING);
        prescription = prescriptionRepository.save(prescription);

        // 逐条扣减库存 + 记录日志 + 保存明细
        for (PrescriptionCreateRequest.ItemInfo itemInfo : itemInfos) {
            // 安全扣减库存
            boolean success = safeDecrementStock(itemInfo.getMedicineId(), itemInfo.getQuantity());
            if (!success) {
                throw new BusinessException("药品库存不足：ID=" + itemInfo.getMedicineId());
            }

            // 保存明细
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescriptionId(prescription.getId());
            item.setMedicineId(itemInfo.getMedicineId());
            item.setQuantity(itemInfo.getQuantity());
            item.setDosage(itemInfo.getDosage());
            item.setUsageDesc(itemInfo.getUsageDesc());
            item.setUnitPrice(itemInfo.getUnitPrice());
            item.setAmount(itemInfo.getUnitPrice().multiply(BigDecimal.valueOf(itemInfo.getQuantity())));
            prescriptionItemRepository.save(item);

            // 记录库存日志
            InventoryLog log = new InventoryLog();
            log.setMedicineId(itemInfo.getMedicineId());
            log.setType(InventoryLog.TYPE_STOCK_OUT);
            log.setQuantity(itemInfo.getQuantity());
            log.setOperator("system");
            log.setRemark("处方出库 - 处方ID:" + prescription.getId());
            inventoryLogRepository.save(log);
        }

        return prescription;
    }

    /** 取药 — 更新处方状态为已取药 */
    @Transactional
    public void dispense(Long id) {
        int affected = prescriptionRepository.dispense(id);
        if (affected == 0) {
            throw new BusinessException("取药失败，处方可能不在待缴费/已缴费状态");
        }
    }

    /**
     * 作废处方 — 事务操作：逐条回滚库存 + 记录日志 + 更新处方状态
     */
    @Transactional
    public void cancel(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("处方不存在"));
        if (prescription.getStatus() == Prescription.STATUS_CANCELLED) {
            throw new BusinessException("处方已作废");
        }
        if (prescription.getStatus() == Prescription.STATUS_DISPENSED) {
            throw new BusinessException("已取药处方不能作废");
        }

        // 逐条回滚库存
        List<PrescriptionItem> items = prescriptionItemRepository.findByPrescriptionId(id);
        for (PrescriptionItem item : items) {
            medicineRepository.incrementStock(item.getMedicineId(), item.getQuantity());
            // 记录库存日志
            InventoryLog log = new InventoryLog();
            log.setMedicineId(item.getMedicineId());
            log.setType(InventoryLog.TYPE_STOCK_IN);
            log.setQuantity(item.getQuantity());
            log.setOperator("system");
            log.setRemark("处方作废回滚 - 处方ID:" + id);
            inventoryLogRepository.save(log);
        }

        // 更新处方状态
        prescriptionRepository.cancel(id);
    }

    /**
     * 安全扣减库存 — 使用 WHERE stock >= qty 保证原子性，防超卖
     */
    private boolean safeDecrementStock(Long medicineId, int qty) {
        return medicineRepository.safeDecrementStock(medicineId, qty) > 0;
    }

    /** 查询库存变动日志 */
    public List<InventoryLogVO> findInventoryLogs(Long medicineId) {
        return inventoryLogRepository.findLogVOList(medicineId);
    }
}
