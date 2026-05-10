package com.temple.erp.service;

import com.temple.erp.model.Volunteer;
import com.temple.erp.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VolunteerService {

    @Autowired
    private VolunteerRepository volunteerRepository;

    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    public Volunteer createVolunteer(Volunteer volunteer) {
        return volunteerRepository.save(volunteer);
    }

    public Volunteer updateVolunteer(Long id, Volunteer details) {
        Volunteer existing = volunteerRepository.findById(id).orElseThrow(() -> new RuntimeException("Volunteer not found"));
        existing.setName(details.getName());
        existing.setEmail(details.getEmail());
        existing.setPhoneNumber(details.getPhoneNumber());
        existing.setDepartment(details.getDepartment());
        existing.setStatus(details.getStatus());
        return volunteerRepository.save(existing);
    }

    public void deleteVolunteer(Long id) {
        volunteerRepository.deleteById(id);
    }
}
