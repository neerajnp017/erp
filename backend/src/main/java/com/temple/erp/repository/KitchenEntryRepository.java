package com.temple.erp.repository;

import com.temple.erp.model.KitchenEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KitchenEntryRepository extends JpaRepository<KitchenEntry, Long> {
}
