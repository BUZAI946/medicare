package com.medicare.config;

import com.medicare.entity.*;
import com.medicare.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 每日自动生成演示数据
 * 启动时检测当天是否有挂号数据，若没有则随机生成
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDataGenerator implements CommandLineRunner {

    private final ScheduleRepository scheduleRepository;
    private final RegistrationRepository registrationRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final PaymentRepository paymentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;

    @Override
    @Transactional
    public void run(String... args) {
        try {
            generateIfNeeded();
        } catch (Exception e) {
            log.warn("演示数据生成跳过: {}", e.getMessage());
        }
    }

    private void generateIfNeeded() {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        List<Registration> todayRegs = registrationRepository.findAll().stream()
                .filter(r -> r.getRegTime() != null && r.getRegTime().toLocalDate().equals(today))
                .toList();
        boolean isFirstRun = todayRegs.isEmpty();
        int extraCount = isFirstRun ? 12 : (new Random().nextInt(5) + 3);

        log.info("=== 追加生成 {} 条演示数据 ===", extraCount);
        List<Patient> patients = patientRepository.findAll();
        List<Doctor> doctors = doctorRepository.findByStatus(1);
        List<Medicine> medicines = medicineRepository.findByStatus(1);

        if (patients.isEmpty() || doctors.isEmpty()) {
            log.warn("患者或医生数据为空，跳过");
            return;
        }

        Random rng = new Random();

        // 1. 为今明两天创建排班
        for (Doctor doc : doctors) {
            for (LocalDate date : Arrays.asList(today, tomorrow)) {
                if (!scheduleRepository.existsByDoctorIdAndWorkDateAndTimeSlot(doc.getId(), date, "上午(08:00-12:00)")) {
                    Schedule s = new Schedule();
                    s.setDoctorId(doc.getId());
                    s.setWorkDate(date);
                    s.setTimeSlot("上午(08:00-12:00)");
                    s.setTotalSlots(20);
                    s.setRemainSlots(20);
                    scheduleRepository.save(s);
                }
                if (!scheduleRepository.existsByDoctorIdAndWorkDateAndTimeSlot(doc.getId(), date, "下午(14:00-17:30)")) {
                    Schedule s = new Schedule();
                    s.setDoctorId(doc.getId());
                    s.setWorkDate(date);
                    s.setTimeSlot("下午(14:00-17:30)");
                    s.setTotalSlots(15);
                    s.setRemainSlots(15);
                    scheduleRepository.save(s);
                }
            }
        }

        // 2. 随机生成 8-15 条挂号
        List<Schedule> todaySchedules = scheduleRepository.findByWorkDate(today);
        int regCount = extraCount;
        List<Registration> newRegs = new ArrayList<>();
        Set<String> usedSlots = new HashSet<>();

        for (int i = 0; i < regCount; i++) {
            Schedule sched = todaySchedules.get(rng.nextInt(todaySchedules.size()));
            String slotKey = sched.getId() + "-" + i;
            if (usedSlots.contains(slotKey)) continue;
            usedSlots.add(slotKey);

            Patient patient = patients.get(rng.nextInt(patients.size()));
            Registration reg = new Registration();
            reg.setPatientId(patient.getId());
            reg.setScheduleId(sched.getId());
            reg.setDoctorId(sched.getDoctorId());
            reg.setRegTime(LocalDateTime.now().minusMinutes(rng.nextInt(480)));
            reg.setStatus(rng.nextInt(3)); // 0候诊 1就诊中 2已完成
            reg.setSeqNo(i + 1);
            reg.setFee(BigDecimal.valueOf(10));
            newRegs.add(registrationRepository.save(reg));

            // 更新剩余号源
            if (sched.getRemainSlots() > 0) {
                sched.setRemainSlots(sched.getRemainSlots() - 1);
                scheduleRepository.save(sched);
            }
        }

        // 3. 对已完成的挂号，随机生成病历和处方
        List<Registration> completed = newRegs.stream()
                .filter(r -> r.getStatus() == Registration.STATUS_COMPLETED)
                .limit(rng.nextInt(5) + 2)
                .toList();

        String[] complaints = {"头痛三天","咳嗽伴发热","腹痛不适","咽痛一周","腰背酸痛","头晕乏力","关节疼痛","胸闷气短","嗓子疼轻微咳嗽","失眠多梦","高血压复诊","糖尿病复查"};
        String[] diagnoses = {"季节性感冒","上呼吸道感染","急性咽炎","腰肌劳损","高血压2级","2型糖尿病","偏头痛","过敏性鼻炎","神经衰弱","扁桃体炎"};
        String[] advices = {"多饮水注意休息","按时服药三天后复诊","不适随诊","注意饮食清淡","每周复查血压","适度运动避免劳累"};

        for (Registration reg : completed) {
            // 病历
            MedicalRecord record = new MedicalRecord();
            record.setRegistrationId(reg.getId());
            record.setPatientId(reg.getPatientId());
            record.setDoctorId(reg.getDoctorId());
            record.setChiefComplaint(complaints[rng.nextInt(complaints.length)]);
            record.setDiagnosis(diagnoses[rng.nextInt(diagnoses.length)]);
            record.setAdvice(advices[rng.nextInt(advices.length)]);
            record = medicalRecordRepository.save(record);

            // 处方
            Prescription presc = new Prescription();
            presc.setRecordId(record.getId());
            presc.setPatientId(reg.getPatientId());
            presc.setDoctorId(reg.getDoctorId());
            presc.setStatus(0); // 待缴费
            presc = prescriptionRepository.save(presc);

            // 处方明细 1-3种药品
            BigDecimal total = BigDecimal.ZERO;
            int itemCount = rng.nextInt(3) + 1;
            for (int j = 0; j < itemCount; j++) {
                Medicine med = medicines.get(rng.nextInt(medicines.size()));
                int qty = rng.nextInt(3) + 1;
                BigDecimal price = med.getPrice() != null ? med.getPrice() : BigDecimal.valueOf(15);
                BigDecimal amount = price.multiply(BigDecimal.valueOf(qty));

                PrescriptionItem item = new PrescriptionItem();
                item.setPrescriptionId(presc.getId());
                item.setMedicineId(med.getId());
                item.setQuantity(qty);
                item.setUsageDesc("一日三次饭后服用");
                item.setUnitPrice(price);
                item.setAmount(amount);
                prescriptionItemRepository.save(item);
                total = total.add(amount);
            }
            presc.setTotalAmount(total);
            prescriptionRepository.save(presc);

            // 收费
            if (rng.nextBoolean()) {
                Payment payment = new Payment();
                payment.setPrescriptionId(presc.getId());
                payment.setPatientId(reg.getPatientId());
                payment.setAmount(total);
                payment.setPaymentMethod(rng.nextBoolean() ? "WECHAT" : "CASH");
                payment.setStatus(rng.nextBoolean() ? 1 : 0); // 已收或待收
                payment.setRemark("处方费");
                paymentRepository.save(payment);
            }
        }

        log.info("=== 演示数据生成完成: {}条挂号 {}条病历 {}条处方 ===",
                regCount, completed.size(), completed.size());
    }
}
