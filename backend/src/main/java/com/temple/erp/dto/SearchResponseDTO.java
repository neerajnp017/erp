package com.temple.erp.dto;

import com.temple.erp.model.*;
import lombok.Data;
import java.util.List;

@Data
public class SearchResponseDTO {
    private List<Donation> donations;
    private List<Expense> expenses;
    private List<Volunteer> volunteers;
    private List<Inventory> inventory;
}
