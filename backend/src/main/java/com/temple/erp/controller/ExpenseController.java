package com.temple.erp.controller;

import com.temple.erp.model.Expense;
import com.temple.erp.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
// @CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return expenseService.getAllExpenses(year, month, startDate, endDate);
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseService.createExpense(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense details) {
        return expenseService.updateExpense(id, details);
    }

    @PutMapping("/category/{oldName}")
    public void renameCategory(@PathVariable String oldName, @RequestParam String newName) {
        expenseService.renameCategory(oldName, newName);
    }

    @DeleteMapping("/category/{category}")
    public void deleteCategory(@PathVariable String category) {
        expenseService.deleteCategory(category);
    }
}
