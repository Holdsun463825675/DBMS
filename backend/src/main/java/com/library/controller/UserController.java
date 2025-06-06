package com.library.controller;

import com.library.model.User;
import com.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    // 创建用户
    @PostMapping("/createUser")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    // 获取所有用户
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 根据ID获取用户
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

    // 根据用户名获取用户
    @GetMapping("/getitem")
    public ResponseEntity<User> getUserByUsername(@RequestParam("user_name") String userName) {
        return userService.findByUsername(userName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 更新用户信息
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(Long.valueOf(id), user));
    }

    // 删除用户
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

//    // 用户登录
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestParam("username")String username ,@RequestParam("password") String password) {
//        boolean isAuthenticated = userService.authenticateUser(username, password);
//        if (isAuthenticated) {
//            return ResponseEntity.ok("Login successful. Token: [mock-jwt-token]");
//        } else {
//            return ResponseEntity.status(401).body("无效用户密码");
//        }
//    }


    //查询是否有重复用户
    @GetMapping("repeat")
    public ResponseEntity<Boolean> repeat(@RequestParam("user_name") String userName){
        return ResponseEntity.ok(userService.repeat(userName));
    }

    //对user_name或full_name的模糊搜索，并符合某个role_name
    @GetMapping("search")
    public ResponseEntity<List<User>> search(@RequestParam(value = "user_name",required = false) String userName,
                                             @RequestParam(value = "full_name",required = false) String fullName,
                                             @RequestParam(value = "role_name",required = false) String roleName){
        return ResponseEntity.ok(userService.search(userName,fullName,roleName));
    }
}
