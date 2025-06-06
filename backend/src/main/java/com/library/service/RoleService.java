package com.library.service;

import com.library.model.Role;
import com.library.model.User;
import com.library.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Optional<Role> getRoleById(Long roleId) {
        return roleRepository.findById(roleId);
    }

    public List<Long> getRoleIdByName(String name) {
        Role role = roleRepository.findByRole_name(name);
        if (role != null) {
            return Collections.singletonList(role.getRole_id()); // 将单个 roleId 包装成集合返回
        }
        return Collections.emptyList();
    }


}
