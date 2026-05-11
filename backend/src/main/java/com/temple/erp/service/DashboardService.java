package com.temple.erp.service;

import com.temple.erp.model.Donation;
import com.temple.erp.model.Expense;
import com.temple.erp.repository.DonationRepository;
import com.temple.erp.repository.ExpenseRepository;
import com.temple.erp.repository.VolunteerRepository;
import com.temple.erp.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private DonationRepository donationRepository;
    @Autowired private ExpenseRepository expenseRepository;
    @Autowired private VolunteerRepository volunteerRepository;
    @Autowired private PayrollRepository payrollRepository;

    public Map<String, Object> getSummary(Integer year, Integer month) {
        Map<String, Object> summary = new HashMap<>();
        
        List<Donation> donations = donationRepository.findAll();
        List<Expense> expenses = expenseRepository.findAll();
        
        // Apply filters if provided
        if (year != null) {
            donations = donations.stream()
                .filter(d -> d.getDate() != null && d.getDate().getYear() == year)
                .collect(Collectors.toList());
            expenses = expenses.stream()
                .filter(e -> e.getDate() != null && e.getDate().getYear() == year)
                .collect(Collectors.toList());
        }
        if (month != null) {
            donations = donations.stream()
                .filter(d -> d.getDate() != null && d.getDate().getMonthValue() == month)
                .collect(Collectors.toList());
            expenses = expenses.stream()
                .filter(e -> e.getDate() != null && e.getDate().getMonthValue() == month)
                .collect(Collectors.toList());
        }
        
        double totalDonations = donations.stream()
            .mapToDouble(d -> d.getAmount() != null ? d.getAmount() : 0.0)
            .sum();
        double totalExpenses = expenses.stream()
            .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
            .sum();
        long volunteerCount = volunteerRepository.count();
        double totalPayroll = payrollRepository.findAll().stream()
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
            .sum();

        summary.put("totalDonations", totalDonations);
        summary.put("totalExpenses", totalExpenses);
        summary.put("volunteerCount", volunteerCount);
        summary.put("totalPayroll", totalPayroll);
        
        summary.put("trend", getRealMonthlyTrend(donations, expenses));
        summary.put("donationMix", getDonationMix(donations));
        
        // Add recent activity (last 5 donations)
        List<Map<String, Object>> recent = donations.stream()
            .filter(d -> d.getDate() != null)
            .sorted(Comparator.comparing(Donation::getDate).reversed())
            .limit(5)
            .map(d -> {
                Map<String, Object> activity = new HashMap<>();
                activity.put("title", "New Donation");
                activity.put("amount", d.getAmount());
                activity.put("donor", d.getDonorName());
                activity.put("time", d.getDate().toString());
                return activity;
            })
            .collect(Collectors.toList());
        summary.put("recentActivities", recent);

        return summary;
    }

    private List<Map<String, Object>> getRealMonthlyTrend(List<Donation> donations, List<Expense> expenses) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        List<Map<String, Object>> trend = new ArrayList<>();
        
        Map<String, Double> donByMonth = donations.stream()
            .filter(d -> d.getDate() != null)
            .collect(Collectors.groupingBy(
                d -> months[d.getDate().getMonthValue() - 1],
                Collectors.summingDouble(d -> d.getAmount() != null ? d.getAmount() : 0.0)
            ));

        Map<String, Double> expByMonth = expenses.stream()
            .filter(e -> e.getDate() != null)
            .collect(Collectors.groupingBy(
                e -> months[e.getDate().getMonthValue() - 1],
                Collectors.summingDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
            ));

        String[] recentMonths = {"Jan", "Feb", "Mar", "Apr", "May"};
        for (String m : recentMonths) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", m);
            monthData.put("donations", donByMonth.getOrDefault(m, 0.0));
            monthData.put("expenses", expByMonth.getOrDefault(m, 0.0));
            trend.add(monthData);
        }
        return trend;
    }

    private List<Map<String, Object>> getDonationMix(List<Donation> donations) {
        Map<String, Double> sums = donations.stream()
            .collect(Collectors.groupingBy(
                d -> d.getCategory() != null ? d.getCategory() : "Uncategorized", 
                Collectors.summingDouble(d -> d.getAmount() != null ? d.getAmount() : 0.0)
            ));
            
        List<Map<String, Object>> mix = new ArrayList<>();
        sums.forEach((cat, sum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("name", cat);
            item.put("value", sum);
            mix.add(item);
        });
        return mix;
    }
}
