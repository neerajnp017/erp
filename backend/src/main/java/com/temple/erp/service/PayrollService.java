package com.temple.erp.service;

import com.temple.erp.model.Expense;
import com.temple.erp.model.Payroll;
import com.temple.erp.repository.ExpenseRepository;
import com.temple.erp.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Transactional
    public Payroll createPayrollEntry(Payroll payroll) {
        payroll.setPaymentDate(LocalDate.now());
        return payrollRepository.save(payroll);
    }

    public List<Payroll> getAllPayroll() {
        return payrollRepository.findAll();
    }

    @Transactional
    public Payroll updatePayrollEntry(Long id, Payroll details) {
        Payroll existing = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));

        existing.setPersonName(details.getPersonName());
        existing.setRole(details.getRole());
        existing.setAmount(details.getAmount());

        return payrollRepository.save(existing);
    }

    @Transactional
    public void deletePayrollEntry(Long id) {
        Payroll existing = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));
        
        // Expense will be deleted automatically if cascade is set, 
        // but we'll do it explicitly or rely on OneToOne cascade.
        payrollRepository.delete(existing);
    }
}
