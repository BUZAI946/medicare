package com.medicare.repository;

import com.medicare.dto.PaymentVO;
import com.medicare.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query(value = """
        SELECT p.id, p.registration_id AS registrationId, p.prescription_id AS prescriptionId,
               p.patient_id AS patientId, p.amount, p.payment_method AS paymentMethod,
               p.status, p.remark, p.create_time AS createTime,
               pt.name AS patientName,
               CASE WHEN p.registration_id IS NOT NULL THEN '挂号费'
                    WHEN p.prescription_id IS NOT NULL THEN '处方费'
                    ELSE '其他' END AS registrationType
        FROM payment p
        LEFT JOIN patient pt ON p.patient_id = pt.id
        WHERE (:patientId IS NULL OR p.patient_id = :patientId)
          AND (:status IS NULL OR p.status = :status)
        ORDER BY p.create_time DESC
        """, nativeQuery = true)
    List<PaymentVO> findPaymentVOList(@Param("patientId") Long patientId,
                                       @Param("status") Integer status);

    @Modifying
    @Query("UPDATE Payment p SET p.status = 1 WHERE p.id = :id AND p.status = 0")
    int pay(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Payment p SET p.status = 2 WHERE p.id = :id AND p.status = 1")
    int refund(@Param("id") Long id);

    List<Payment> findByStatus(Integer status);

    List<Payment> findByPatientIdOrderByCreateTimeDesc(Long patientId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 1 AND DATE(p.createTime) = :date")
    BigDecimal sumPaidToday(@Param("date") LocalDate date);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 0")
    long countPending();
}
