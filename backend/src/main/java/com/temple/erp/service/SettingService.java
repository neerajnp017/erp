package com.temple.erp.service;

import com.temple.erp.model.Setting;
import com.temple.erp.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SettingService {

    @Autowired
    private SettingRepository repository;

    public Setting getSetting(String keyName) {
        return repository.findByKeyName(keyName).orElse(new Setting(null, keyName, ""));
    }

    public Setting saveSetting(Setting setting) {
        Optional<Setting> existing = repository.findByKeyName(setting.getKeyName());
        if (existing.isPresent()) {
            Setting toUpdate = existing.get();
            toUpdate.setSettingValue(setting.getSettingValue());
            return repository.save(toUpdate);
        }
        return repository.save(setting);
    }
}
