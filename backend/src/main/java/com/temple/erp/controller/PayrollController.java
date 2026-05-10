package com.temple.erp.controller;

import com.temple.erp.model.Payroll;
import com.temple.erp.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*") // For development
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @PostMapping
    public Payroll addPayrollEntry(@RequestBody Payroll payroll) {
        return payrollService.createPayrollEntry(payroll);
    }

    @GetMapping
    public List<Payroll> getAllPayroll() {
        return payrollService.getAllPayroll();
    }

    @PutMapping("/{id}")
    public Payroll updatePayrollEntry(@PathVariable Long id, @RequestBody Payroll payroll) {
        return payrollService.updatePayrollEntry(id, payroll);
    }

    @DeleteMapping("/{id}")
    public void deletePayrollEntry(@PathVariable Long id) {
        payrollService.deletePayrollEntry(id);
    }
}
