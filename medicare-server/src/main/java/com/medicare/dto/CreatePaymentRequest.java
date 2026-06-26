package com.medicare.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {

    @NotNull(message = "患者ID不能为空")
    private Long patientId;

    private Long registrationId;

    private Long prescriptionId;

    @NotNull(message = "金额不能为空")
    @DecimalMin(value = "0.01", message = "金额必须大于0")
    private BigDecimal amount;

    @NotNull(message = "支付方式不能为空")
    private String paymentMethod;

    private String remark;
}
