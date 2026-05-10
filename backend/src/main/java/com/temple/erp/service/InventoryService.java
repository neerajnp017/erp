package com.temple.erp.service;

import com.temple.erp.model.Inventory;
import com.temple.erp.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    public List<Inventory> getAllInventory() {
        return repository.findAll();
    }

    public Inventory createInventory(Inventory item) {
        List<Inventory> existing = repository.findAll();
        boolean isDuplicate = existing.stream().anyMatch(i -> 
            i.getItemName().equalsIgnoreCase(item.getItemName()) && 
            i.getCategory().equalsIgnoreCase(item.getCategory())
        );
        if (isDuplicate) {
            throw new RuntimeException("Item already exists in this category");
        }
        return repository.save(item);
    }

    public Inventory updateInventory(Long id, Inventory details) {
        Inventory existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Inventory item not found"));
        existing.setItemName(details.getItemName());
        existing.setCategory(details.getCategory());
        existing.setQuantity(details.getQuantity());
        existing.setUnit(details.getUnit());
        existing.setStatus(details.getStatus());
        return repository.save(existing);
    }

    public void renameCategory(String oldName, String newName) {
        List<Inventory> items = repository.findAll();
        for (Inventory item : items) {
            if (item.getCategory().equalsIgnoreCase(oldName)) {
                item.setCategory(newName);
                repository.save(item);
            }
        }
    }

    public void deleteCategory(String name) {
        List<Inventory> items = repository.findAll();
        for (Inventory item : items) {
            if (item.getCategory().equalsIgnoreCase(name)) {
                repository.delete(item);
            }
        }
    }

    public void deleteInventory(Long id) {
        repository.deleteById(id);
    }
}
