package com.temple.erp.repository;

import com.temple.erp.model.FestivalDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FestivalDepartmentRepository extends JpaRepository<FestivalDepartment, Long> {
}
