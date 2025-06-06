package com.library.controller;

import com.library.model.Role;
import com.library.model.User;
import com.library.service.RoleService;
import com.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    //通过roleid获取role
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable String id) {
        return roleService.getRoleById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //根据用户名获取用户id
    @GetMapping("/search")
    public ResponseEntity<List<Long>> getRoleIdByName(@RequestParam("role_name") String roleName) {
        List<Long> roleIds = roleService.getRoleIdByName(roleName);
        return ResponseEntity.ok(roleIds);
    }


}
