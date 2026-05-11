package com.temple.erp.controller;

import com.temple.erp.model.Inventory;
import com.temple.erp.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
// @CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<Inventory> getAll() {
        return inventoryService.getAllInventory();
    }

    @PostMapping
    public Inventory create(@RequestBody Inventory item) {
        return inventoryService.createInventory(item);
    }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id, @RequestBody Inventory details) {
        return inventoryService.updateInventory(id, details);
    }

    @PutMapping("/categories/{oldName}")
    public void renameCategory(@PathVariable String oldName, @RequestParam String newName) {
        inventoryService.renameCategory(oldName, newName);
    }

    @DeleteMapping("/categories/{name}")
    public void deleteCategory(@PathVariable String name) {
        inventoryService.deleteCategory(name);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
    }
}
