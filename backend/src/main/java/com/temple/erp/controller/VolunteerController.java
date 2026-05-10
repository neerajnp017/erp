package com.temple.erp.controller;

import com.temple.erp.model.Volunteer;
import com.temple.erp.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    @GetMapping
    public List<Volunteer> getAll() {
        return volunteerService.getAllVolunteers();
    }

    @PostMapping
    public Volunteer create(@RequestBody Volunteer volunteer) {
        return volunteerService.createVolunteer(volunteer);
    }

    @PutMapping("/{id}")
    public Volunteer update(@PathVariable Long id, @RequestBody Volunteer details) {
        return volunteerService.updateVolunteer(id, details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        volunteerService.deleteVolunteer(id);
    }
}
