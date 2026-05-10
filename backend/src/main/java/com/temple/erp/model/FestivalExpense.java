package com.temple.erp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "festival_expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double amount;
    private String category;

    @ManyToOne
    @JoinColumn(name = "department_id")
    @JsonIgnore
    private FestivalDepartment department;
}
