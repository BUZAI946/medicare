package com.medicare.service;

import com.medicare.dto.DashboardStats;
import com.medicare.repository.MedicineRepository;
import com.medicare.repository.PaymentRepository;
import com.medicare.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RegistrationRepository registrationRepository;
    private final MedicineRepository medicineRepository;
    private final PaymentRepository paymentRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTodayRegCount(registrationRepository.findTodayList(LocalDate.now(), null).size());
        stats.setWaitingCount(registrationRepository.findTodayList(LocalDate.now(), 0).size());
        stats.setStockAlertCount(medicineRepository.findLowStockMedicines().size());
        stats.setPendingPaymentCount(paymentRepository.countPending());
        BigDecimal amount = paymentRepository.sumPaidToday(LocalDate.now());
        stats.setTodayPaymentAmount(amount != null ? amount.toString() : "0.00");
        return stats;
    }
}
