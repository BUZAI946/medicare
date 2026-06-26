package com.medicare.controller;

import com.medicare.auth.RequireRole;
import com.medicare.dto.CreatePaymentRequest;
import com.medicare.dto.PaymentVO;
import com.medicare.dto.Result;
import com.medicare.entity.Payment;
import com.medicare.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @RequireRole({"admin"})
    public Result<List<PaymentVO>> list(@RequestParam(required = false) Long patientId,
                                         @RequestParam(required = false) Integer status) {
        return Result.ok(paymentService.list(patientId, status));
    }

    @GetMapping("/{id}")
    @RequireRole({"admin"})
    public Result<Payment> getById(@PathVariable Long id) {
        return Result.ok(paymentService.getById(id));
    }

    @PostMapping
    @RequireRole({"admin"})
    public Result<Payment> create(@Valid @RequestBody CreatePaymentRequest request) {
        return Result.ok(paymentService.create(request));
    }

    @PutMapping("/{id}/pay")
    @RequireRole({"admin"})
    public Result<Void> pay(@PathVariable Long id) {
        paymentService.pay(id);
        return Result.ok();
    }

    @PutMapping("/{id}/refund")
    @RequireRole({"admin"})
    public Result<Void> refund(@PathVariable Long id) {
        paymentService.refund(id);
        return Result.ok();
    }
}
