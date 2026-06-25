package com.medicare.service;

import com.medicare.dto.InventoryLogVO;
import com.medicare.entity.InventoryLog;
import com.medicare.entity.Medicine;
import com.medicare.exception.BusinessException;
import com.medicare.repository.InventoryLogRepository;
import com.medicare.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 药品服务 — 药品 CRUD + 库存管理（入库/出库）+ 库存预警
 * <p>
 * 入库：增加库存 + 记录日志；出库：安全扣减库存（防超卖）+ 记录日志
 */
@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public List<Medicine> findAll(String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return medicineRepository.searchByKeyword(keyword);
        }
        return medicineRepository.findByStatus(1);
    }

    public Medicine findById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new BusinessException("药品不存在"));
    }

    /** 查询库存低于安全存量的药品（库存预警） */
    public List<Medicine> findLowStock() {
        return medicineRepository.findLowStockMedicines();
    }

    public Medicine create(Medicine medicine) {
        if (medicineRepository.existsByNameAndSpec(medicine.getName(), medicine.getSpec())) {
            throw new BusinessException("该药品规格已存在");
        }
        return medicineRepository.save(medicine);
    }

    public Medicine update(Long id, Medicine medicine) {
        Medicine existing = findById(id);
        if (medicineRepository.existsByNameAndSpecAndIdNot(medicine.getName(), medicine.getSpec(), id)) {
            throw new BusinessException("该药品规格已存在");
        }
        existing.setName(medicine.getName());
        existing.setSpec(medicine.getSpec());
        existing.setUnit(medicine.getUnit());
        existing.setSafetyStock(medicine.getSafetyStock());
        existing.setPinyinCode(medicine.getPinyinCode());
        existing.setPrice(medicine.getPrice());
        existing.setManufacturer(medicine.getManufacturer());
        existing.setStatus(medicine.getStatus());
        return medicineRepository.save(existing);
    }

    /** 删除药品 — 禁止删除库存大于0的药品（需先出库清零） */
    public void delete(Long id) {
        Medicine medicine = findById(id);
        if (medicine.getStock() > 0) {
            throw new BusinessException("该药品还有库存，请先出库清零");
        }
        medicineRepository.deleteById(id);
    }

    /**
     * 入库 — 增加库存 + 记录日志（含批次号、有效期）
     */
    @Transactional
    public void stockIn(Long id, int quantity, String batchNo, LocalDateTime expireDate) {
        Medicine medicine = findById(id);
        medicine.setStock(medicine.getStock() + quantity);
        medicineRepository.save(medicine);

        InventoryLog log = new InventoryLog();
        log.setMedicineId(id);
        log.setType(InventoryLog.TYPE_STOCK_IN);
        log.setQuantity(quantity);
        log.setBatchNo(batchNo);
        if (expireDate != null) {
            log.setExpiryDate(expireDate.toLocalDate());
        }
        inventoryLogRepository.save(log);
    }

    /**
     * 出库 — 安全扣减库存（WHERE stock >= qty 防超卖）+ 记录日志
     */
    @Transactional
    public void stockOut(Long id, int quantity, String batchNo) {
        int affected = medicineRepository.safeDecrementStock(id, quantity);
        if (affected == 0) {
            throw new BusinessException("库存不足");
        }

        InventoryLog log = new InventoryLog();
        log.setMedicineId(id);
        log.setType(InventoryLog.TYPE_STOCK_OUT);
        log.setQuantity(quantity);
        log.setBatchNo(batchNo);
        inventoryLogRepository.save(log);
    }

    /** 查询库存变动日志 */
    public List<InventoryLogVO> findInventoryLogs(Long medicineId) {
        return inventoryLogRepository.findLogVOList(medicineId);
    }
}
