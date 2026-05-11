package com.temple.erp.controller;

import com.temple.erp.model.Donation;
import com.temple.erp.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
// @CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @GetMapping
    public List<Donation> getAll() {
        return donationService.getAllDonations();
    }

    @GetMapping("/stats/monthly")
    public java.util.Map<String, Double> getMonthlyStats() {
        return donationService.getMonthlyStats();
    }

    @PostMapping
    public Donation create(@RequestBody Donation donation) {
        return donationService.createDonation(donation);
    }

    @PutMapping("/{id}")
    public Donation update(@PathVariable Long id, @RequestBody Donation details) {
        return donationService.updateDonation(id, details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        donationService.deleteDonation(id);
    }
}
