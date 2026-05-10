package com.temple.erp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "kitchen_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KitchenEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category; // Consumption, Procurement
    private Double quantity;
    private String unit;
    private LocalDate date;
    private String status;
}
