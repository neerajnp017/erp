package com.temple.erp.controller;

import com.temple.erp.dto.SearchResponseDTO;
import com.temple.erp.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public SearchResponseDTO search(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return new SearchResponseDTO();
        }
        return searchService.search(query);
    }
}
