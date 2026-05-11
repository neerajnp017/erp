package com.temple.erp.controller;

import com.temple.erp.model.KitchenEntry;
import com.temple.erp.service.KitchenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
// @CrossOrigin(origins = "*")
public class KitchenController {

    @Autowired
    private KitchenService kitchenService;

    @GetMapping
    public List<KitchenEntry> getAll() {
        return kitchenService.getAllKitchenEntries();
    }

    @PostMapping
    public KitchenEntry create(@RequestBody KitchenEntry item) {
        return kitchenService.createKitchenEntry(item);
    }

    @PutMapping("/{id}")
    public KitchenEntry update(@PathVariable Long id, @RequestBody KitchenEntry details) {
        return kitchenService.updateKitchenEntry(id, details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        kitchenService.deleteKitchenEntry(id);
    }
}
