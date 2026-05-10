package com.temple.erp.repository;

import com.temple.erp.model.FestivalExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FestivalExpenseRepository extends JpaRepository<FestivalExpense, Long> {
}
