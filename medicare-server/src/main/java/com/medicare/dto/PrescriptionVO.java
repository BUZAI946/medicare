package com.medicare.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 处方视图对象 — 包含明细列表
 */
@Data
public class PrescriptionVO {

    private Long id;
    private Long recordId;
    private Long patientId;
    private Long doctorId;
    private BigDecimal totalAmount;
    private Integer status;
    private LocalDateTime createTime;

    // 关联字段
    private String patientName;
    private String doctorName;

    // 明细列表
    private List<PrescriptionItemVO> items;

    public static String getStatusText(Integer status) {
        if (status == null) return "未知";
        if (status == 0) return "待缴费";
        if (status == 1) return "已缴费";
        if (status == 2) return "已取药";
        if (status == 3) return "已作废";
        return "未知";
    }
}
