package com.temple.erp.controller;

import com.temple.erp.model.Festival;
import com.temple.erp.repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@CrossOrigin(origins = "*")
public class FestivalController {

    @Autowired
    private FestivalRepository repository;

    @Autowired
    private com.temple.erp.service.FestivalService festivalService;

    @GetMapping
    public List<Festival> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Festival getById(@PathVariable Long id) {
        return festivalService.getFestivalDetails(id);
    }

    @PostMapping
    public Festival create(@RequestBody Festival item) {
        return repository.save(item);
    }

    @PostMapping("/{id}/departments")
    public com.temple.erp.model.FestivalDepartment addDepartment(@PathVariable Long id, @RequestBody com.temple.erp.model.FestivalDepartment department) {
        return festivalService.addDepartment(id, department);
    }

    @PutMapping("/departments/{id}")
    public com.temple.erp.model.FestivalDepartment updateDepartment(@PathVariable Long id, @RequestBody com.temple.erp.model.FestivalDepartment department) {
        return festivalService.updateDepartment(id, department);
    }

    @DeleteMapping("/departments/{id}")
    public void deleteDepartment(@PathVariable Long id) {
        festivalService.deleteDepartment(id);
    }

    @PostMapping("/departments/{deptId}/expenses")
    public com.temple.erp.model.FestivalExpense addExpense(@PathVariable Long deptId, @RequestBody com.temple.erp.model.FestivalExpense expense) {
        return festivalService.addExpense(deptId, expense);
    }

    @PutMapping("/expenses/{id}")
    public com.temple.erp.model.FestivalExpense updateExpense(@PathVariable Long id, @RequestBody com.temple.erp.model.FestivalExpense expense) {
        return festivalService.updateExpense(id, expense);
    }

    @DeleteMapping("/expenses/{id}")
    public void deleteExpense(@PathVariable Long id) {
        festivalService.deleteExpense(id);
    }

    @PutMapping("/{id}")
    public Festival update(@PathVariable Long id, @RequestBody Festival details) {
        Festival existing = repository.findById(id).orElseThrow();
        existing.setTitle(details.getTitle());
        existing.setDate(details.getDate());
        existing.setBudget(details.getBudget());
        existing.setStatus(details.getStatus());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
