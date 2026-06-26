package com.medicare.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaymentVO {
    Long getId();
    Long getRegistrationId();
    Long getPrescriptionId();
    Long getPatientId();
    BigDecimal getAmount();
    String getPaymentMethod();
    Integer getStatus();
    String getRemark();
    LocalDateTime getCreateTime();
    String getPatientName();
    String getRegistrationType();
}
