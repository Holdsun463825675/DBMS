package com.library.service;

import com.library.model.*;
import com.library.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PaperRepository paperRepository;

    @Autowired
    private PaperDownloadRepository paperDownloadRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long userId, User updatedUser) {
        return userRepository.findById(userId).map(existingUser -> {
            // 更新可修改字段
            if (updatedUser.getUsername() != null) {
                existingUser.setUsername(updatedUser.getUsername());
            }
            if (updatedUser.getPassword() != null) {
                existingUser.setPassword(updatedUser.getPassword());
            }
            if (updatedUser.getFull_name() != null) {
                existingUser.setFull_name(updatedUser.getFull_name());
            }
            if (updatedUser.getEmail() != null) {
                existingUser.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getPhone_number() != null) {
                existingUser.setPhone_number(updatedUser.getPhone_number());
            }
            if (updatedUser.getAddress() != null) {
                existingUser.setAddress(updatedUser.getAddress());
            }
            // 更新 Role：通过 role_id 从数据库加载新的 Role 实例
            if (updatedUser.getRole() != null && updatedUser.getRole().getRole_id() != null) {
                Long newRoleId = updatedUser.getRole().getRole_id();
                Role newRole = roleRepository.findById(newRoleId)
                        .orElseThrow(() -> new RuntimeException("Role not found with id: " + newRoleId));
                existingUser.setRole(newRole); // 设置新的 Role
            }
            if (updatedUser.getMax_borrow_limit() > 0) {
                existingUser.setMax_borrow_limit(updatedUser.getMax_borrow_limit());
            }

            // 保存更新后的用户
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }




    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }


    public Optional<User> findByUsername(String username) {

        return userRepository.findByUsername(username);
    }

//    //login 相关
//    public boolean authenticateUser(String username, String password) {
//        // Fetch user by username
//        Optional<User> user = findByUsername(username);
//        // Match password (in a real-world scenario, password should be hashed)
//        return user.isPresent() && user.get().getPassword().equals(password);
//    }

    //repeat
    public boolean repeat(String userName){
        Optional<User> user = findByUsername(userName);
        if(user.isPresent()){
            return true;
        }else return false;
    }


    //search
//    public List<User> search(String userName, String fullName, String roleName) {
//        Specification<User> spec = Specification.where(null);  // 开始时没有条件
//
//        // 根据 userName 动态添加 LIKE 条件
//        if (userName != null && !userName.isEmpty()) {
//            spec = spec.and((root, query, criteriaBuilder) ->
//                    criteriaBuilder.like(root.get("username"), "%" + userName + "%"));
//        }
//
//        // 根据 fullName 动态添加 LIKE 条件
//        if (fullName != null && !fullName.isEmpty()) {
//            spec = spec.and((root, query, criteriaBuilder) ->
//                    criteriaBuilder.like(root.get("fullName"), "%" + fullName + "%"));
//        }
//
//        // 根据 roleName 动态添加精确匹配条件
//        if (roleName != null && !roleName.isEmpty()) {
//            spec = spec.and((root, query, criteriaBuilder) ->
//                    criteriaBuilder.equal(root.get("role").get("roleName"), roleName));
//        }
//
//        // 使用 Specification 查询
//        return userRepository.findAll(spec);
//    }
    public List<User> search(String userName, String fullName, String roleName) {
        Specification<User> spec = Specification.where(null);

        // 模糊匹配 username
        if (userName != null && !userName.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), "%" + userName.toLowerCase() + "%"));
        }

        // 模糊匹配 fullName
        if (fullName != null && !fullName.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("full_name")), "%" + fullName.toLowerCase() + "%"));
        }

        // 精确匹配 roleName
        if (roleName != null && !roleName.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(criteriaBuilder.lower(root.get("role").get("role_name")), roleName.toLowerCase()));
        }

        return userRepository.findAll(spec);
    }

}
