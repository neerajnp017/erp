package com.temple.erp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "festival_departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalDepartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String leaderName;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "festival_id")
    @JsonIgnore
    private Festival festival;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FestivalExpense> expenses;

    // Simplified users tracking
    @ElementCollection
    private List<String> volunteers;
}
