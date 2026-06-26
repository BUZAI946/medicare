package com.medicare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payment")
public class Payment {

    public static final int STATUS_PENDING = 0;
    public static final int STATUS_PAID = 1;
    public static final int STATUS_REFUNDED = 2;

    public static final String METHOD_CASH = "CASH";
    public static final String METHOD_WECHAT = "WECHAT";
    public static final String METHOD_ALIPAY = "ALIPAY";
    public static final String METHOD_CARD = "CARD";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_id")
    private Long registrationId;

    @Column(name = "prescription_id")
    private Long prescriptionId;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    private Integer status;

    private String remark;

    @Column(name = "create_time", updatable = false, insertable = false)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    private LocalDateTime updateTime;

    public static String getStatusText(Integer status) {
        if (status == null) return "未知";
        return switch (status) {
            case STATUS_PENDING -> "待缴费";
            case STATUS_PAID -> "已缴费";
            case STATUS_REFUNDED -> "已退款";
            default -> "未知";
        };
    }

    public static String getMethodText(String method) {
        if (method == null) return "未知";
        return switch (method) {
            case METHOD_CASH -> "现金";
            case METHOD_WECHAT -> "微信";
            case METHOD_ALIPAY -> "支付宝";
            case METHOD_CARD -> "银行卡";
            default -> method;
        };
    }
}
