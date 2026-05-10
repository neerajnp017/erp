package com.temple.erp.service;

import com.temple.erp.model.Expense;
import com.temple.erp.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses(Integer year, Integer month, String startDate, String endDate) {
        List<Expense> expenses = expenseRepository.findAll();
        
        if (year != null) {
            expenses = expenses.stream().filter(e -> e.getDate() != null && e.getDate().getYear() == year).toList();
        }
        if (month != null) {
            expenses = expenses.stream().filter(e -> e.getDate() != null && e.getDate().getMonthValue() == month).toList();
        }
        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            expenses = expenses.stream().filter(e -> e.getDate() != null && !e.getDate().isBefore(start) && !e.getDate().isAfter(end)).toList();
        }

        return expenses;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense details) {
        Expense existing = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        existing.setName(details.getName());
        existing.setCategory(details.getCategory());
        existing.setAmount(details.getAmount());
        existing.setDate(details.getDate());
        existing.setDescription(details.getDescription());
        existing.setStatus(details.getStatus());
        return expenseRepository.save(existing);
    }

    public void renameCategory(String oldName, String newName) {
        List<Expense> items = expenseRepository.findAll().stream()
            .filter(i -> oldName.equals(i.getCategory()))
            .toList();
        items.forEach(i -> i.setCategory(newName));
        expenseRepository.saveAll(items);
    }

    public void deleteCategory(String category) {
        List<Expense> items = expenseRepository.findAll().stream()
            .filter(i -> category.equals(i.getCategory()))
            .toList();
        expenseRepository.deleteAll(items);
    }
}
