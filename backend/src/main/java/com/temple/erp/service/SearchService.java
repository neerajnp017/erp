package com.temple.erp.service;

import com.temple.erp.dto.SearchResponseDTO;
import com.temple.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public SearchResponseDTO search(String query) {
        SearchResponseDTO results = new SearchResponseDTO();
        
        results.setDonations(donationRepository.findByDonorNameContainingIgnoreCase(query));
        results.setExpenses(expenseRepository.findByDescriptionContainingIgnoreCase(query));
        results.setVolunteers(volunteerRepository.findByNameContainingIgnoreCase(query));
        results.setInventory(inventoryRepository.findByItemNameContainingIgnoreCase(query));
        
        return results;
    }
}
