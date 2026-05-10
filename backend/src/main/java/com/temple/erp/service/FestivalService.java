package com.temple.erp.service;

import com.temple.erp.model.Festival;
import com.temple.erp.model.FestivalDepartment;
import com.temple.erp.model.FestivalExpense;
import com.temple.erp.repository.FestivalDepartmentRepository;
import com.temple.erp.repository.FestivalExpenseRepository;
import com.temple.erp.repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FestivalService {

    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private FestivalDepartmentRepository departmentRepository;

    @Autowired
    private FestivalExpenseRepository expenseRepository;

    @Transactional
    public FestivalDepartment addDepartment(Long festivalId, FestivalDepartment department) {
        Festival festival = festivalRepository.findById(festivalId).orElseThrow();
        // Duplicate Check
        boolean exists = festival.getDepartments().stream()
                .anyMatch(d -> d.getName().equalsIgnoreCase(department.getName()));
        if (exists) throw new RuntimeException("Department already exists in this festival");
        
        department.setFestival(festival);
        return departmentRepository.save(department);
    }

    @Transactional
    public FestivalDepartment updateDepartment(Long id, FestivalDepartment details) {
        FestivalDepartment existing = departmentRepository.findById(id).orElseThrow();
        existing.setName(details.getName());
        existing.setLeaderName(details.getLeaderName());
        existing.setNotes(details.getNotes());
        return departmentRepository.save(existing);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    @Transactional
    public FestivalExpense addExpense(Long departmentId, FestivalExpense expense) {
        FestivalDepartment dept = departmentRepository.findById(departmentId).orElseThrow();
        // Duplicate Check
        boolean exists = dept.getExpenses().stream()
                .anyMatch(e -> e.getName().equalsIgnoreCase(expense.getName()));
        if (exists) throw new RuntimeException("Expense with this name already logged in this department");
        
        expense.setDepartment(dept);
        return expenseRepository.save(expense);
    }

    @Transactional
    public FestivalExpense updateExpense(Long id, FestivalExpense details) {
        FestivalExpense existing = expenseRepository.findById(id).orElseThrow();
        existing.setName(details.getName());
        existing.setAmount(details.getAmount());
        existing.setCategory(details.getCategory());
        return expenseRepository.save(existing);
    }

    @Transactional
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Festival getFestivalDetails(Long id) {
        return festivalRepository.findById(id).orElseThrow();
    }
}
