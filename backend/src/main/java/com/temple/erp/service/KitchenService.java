package com.temple.erp.service;

import com.temple.erp.model.KitchenEntry;
import com.temple.erp.repository.KitchenEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitchenService {

    @Autowired
    private KitchenEntryRepository repository;

    public List<KitchenEntry> getAllKitchenEntries() {
        return repository.findAll();
    }

    public KitchenEntry createKitchenEntry(KitchenEntry item) {
        return repository.save(item);
    }

    public KitchenEntry updateKitchenEntry(Long id, KitchenEntry details) {
        KitchenEntry existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Kitchen entry not found"));
        existing.setItemName(details.getItemName());
        existing.setQuantity(details.getQuantity());
        existing.setUnit(details.getUnit());
        existing.setStatus(details.getStatus());
        return repository.save(existing);
    }

    public void deleteKitchenEntry(Long id) {
        repository.deleteById(id);
    }
}
