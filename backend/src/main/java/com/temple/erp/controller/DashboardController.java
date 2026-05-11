package com.temple.erp.controller;

import com.temple.erp.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
// @CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public Map<String, Object> getSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        return dashboardService.getSummary(year, month);
    }
}
