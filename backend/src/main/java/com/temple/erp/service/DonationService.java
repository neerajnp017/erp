package com.temple.erp.service;

import com.temple.erp.model.Donation;
import com.temple.erp.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Map<String, Double> getMonthlyStats() {
        return donationRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDate().getMonth().name() + " " + d.getDate().getYear(),
                        Collectors.summingDouble(Donation::getAmount)));
    }

    public Donation createDonation(Donation donation) {
        return donationRepository.save(donation);
    }

    public Donation updateDonation(Long id, Donation details) {
        Donation existing = donationRepository.findById(id).orElseThrow(() -> new RuntimeException("Donation not found"));
        existing.setDonorName(details.getDonorName());
        existing.setAmount(details.getAmount());
        existing.setCategory(details.getCategory());
        existing.setStatus(details.getStatus());
        existing.setDate(details.getDate());
        existing.setCollectorName(details.getCollectorName());
        existing.setVolunteerName(details.getVolunteerName());
        return donationRepository.save(existing);
    }

    public void deleteDonation(Long id) {
        donationRepository.deleteById(id);
    }
}
