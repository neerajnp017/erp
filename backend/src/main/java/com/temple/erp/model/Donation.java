package com.temple.erp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String donorName;
    private String category; // Annadanam, Seva, General, etc.
    private Double amount;
    private String status;
    private LocalDate date;
    private String phoneNumber;
    private String email;
    private String collectorName; // Linking to Payroll staff
    private String volunteerName; // Linking to Volunteers
    @Column(columnDefinition = "TEXT")
    private String description;
}
