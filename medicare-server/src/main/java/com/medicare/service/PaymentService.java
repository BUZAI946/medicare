package com.medicare.service;

import com.medicare.dto.CreatePaymentRequest;
import com.medicare.dto.PaymentVO;
import com.medicare.entity.Payment;
import com.medicare.exception.BusinessException;
import com.medicare.repository.PaymentRepository;
import com.medicare.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PrescriptionRepository prescriptionRepository;

    public List<PaymentVO> list(Long patientId, Integer status) {
        return paymentRepository.findPaymentVOList(patientId, status);
    }

    public Payment getById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new BusinessException("收费记录不存在"));
    }

    @Transactional
    public Payment create(CreatePaymentRequest request) {
        if (request.getRegistrationId() == null && request.getPrescriptionId() == null) {
            throw new BusinessException("必须关联挂号或处方");
        }
        Payment payment = new Payment();
        payment.setPatientId(request.getPatientId());
        payment.setRegistrationId(request.getRegistrationId());
        payment.setPrescriptionId(request.getPrescriptionId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setRemark(request.getRemark());
        payment.setStatus(Payment.STATUS_PENDING);
        return paymentRepository.save(payment);
    }

    @Transactional
    public void pay(Long id) {
        int rows = paymentRepository.pay(id);
        if (rows == 0) {
            throw new BusinessException("收费失败：记录不存在或状态不正确");
        }
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment != null && payment.getPrescriptionId() != null) {
            prescriptionRepository.markAsPaid(payment.getPrescriptionId());
        }
    }

    @Transactional
    public void refund(Long id) {
        int rows = paymentRepository.refund(id);
        if (rows == 0) {
            throw new BusinessException("退款失败：记录不存在或状态不正确");
        }
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment != null && payment.getPrescriptionId() != null) {
            prescriptionRepository.rollbackToPending(payment.getPrescriptionId());
        }
    }
}
