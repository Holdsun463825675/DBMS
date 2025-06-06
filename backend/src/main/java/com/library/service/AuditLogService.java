package com.library.service;

import com.library.model.AuditLog;
import com.library.model.User;
import com.library.repository.AuditLogRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public AuditLog addAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    public Optional<AuditLog> getAuditLogById(Long logId) {
        return auditLogRepository.findById(logId);
    }


    public AuditLog updateAuditLog(Long logId, AuditLog updatedAuditLog) {
        return auditLogRepository.findById(logId).map(existingAuditLog -> {
            // 更新可修改字段
            if (updatedAuditLog.getUser() != null && updatedAuditLog.getUser().getUser_id() != null) {
                User user = userRepository.findById(updatedAuditLog.getUser().getUser_id())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                existingAuditLog.setUser(user);
            }
            if (updatedAuditLog.getAction() != null) {
                existingAuditLog.setAction(updatedAuditLog.getAction());
            }
            if (updatedAuditLog.getTarget_id() != null) {
                existingAuditLog.setTarget_id(updatedAuditLog.getTarget_id());
            }
            if (updatedAuditLog.getAction_date() != null) {
                existingAuditLog.setAction_date(updatedAuditLog.getAction_date());
            }

            // 保存更新后的 AuditLog
            return auditLogRepository.save(existingAuditLog);
        }).orElseThrow(() -> new RuntimeException("AuditLog not found"));
    }


    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public void deleteAuditLog(Long log_id) {
        auditLogRepository.deleteById(log_id);
    }


    public List<AuditLog> logs(String searchType, String searchQuery) {
        Specification<AuditLog> spec = Specification.where(null);


        // 根据 searchType 动态添加查询条件
        if ("action".equalsIgnoreCase(searchType)) {
            spec = spec.and(actionContains(searchQuery));
        } else if ("user_id".equalsIgnoreCase(searchType)) {
            spec = spec.and(userIdContains(searchQuery));
        } else if ("target_id".equalsIgnoreCase(searchType)) {
            spec = spec.and(targetId(searchQuery));
        }
        return auditLogRepository.findAll(spec);
    }

    // 根据 action 进行模糊查询
    private Specification<AuditLog> actionContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("action"), "%" + searchQuery + "%");
    }

    // 根据 userid 进行模糊查询
    private Specification<AuditLog> userIdContains(String searchQuery) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(
                    criteriaBuilder.toString(root.get("user").get("user_id")),
                    "%" + searchQuery + "%");
        };
    }

    // 根据 target_id 进行模糊查询
    private Specification<AuditLog> targetId(String searchQuery) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(
                    criteriaBuilder.toString(root.get("target_id")),
                    "%" + searchQuery + "%");
        };
    }


}
