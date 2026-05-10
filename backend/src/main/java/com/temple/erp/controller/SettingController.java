package com.temple.erp.controller;

import com.temple.erp.model.Setting;
import com.temple.erp.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingController {

    @Autowired
    private SettingService settingService;

    @GetMapping("/{keyName}")
    public Setting getSetting(@PathVariable String keyName) {
        return settingService.getSetting(keyName);
    }

    @PostMapping
    public Setting saveSetting(@RequestBody Setting setting) {
        return settingService.saveSetting(setting);
    }
}
