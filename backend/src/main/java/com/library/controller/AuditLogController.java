package com.library.controller;

import com.library.model.AuditLog;
import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class AuditLogController {
    @Autowired
    private AuditLogService auditLogService;

    // 获取所有日志
    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    // 添加日志
    @PostMapping
    public ResponseEntity<AuditLog> addAuditLog(@RequestBody AuditLog auditLog) {
        return ResponseEntity.ok(auditLogService.addAuditLog(auditLog));
    }

    // 根据ID获取日志
    @GetMapping("/{id}")
    public ResponseEntity<AuditLog> getAuditLogById(@PathVariable String id) {
        return auditLogService.getAuditLogById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 更新日志信息
    @PutMapping("/{id}")
    public ResponseEntity<AuditLog> updateAuditLog(@PathVariable String id, @RequestBody AuditLog auditLog) {
        return ResponseEntity.ok(auditLogService.updateAuditLog(Long.valueOf(id), auditLog));
    }

    // 根据id删除日志
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuditLog(@PathVariable String id) {
        auditLogService.deleteAuditLog(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

    //搜索栏功能
    @GetMapping("logs")
    public ResponseEntity<List<AuditLog>> log(@RequestParam(value = "searchType",required = false) String searchType,
                                              @RequestParam(value = "searchQuery",required = false) String searchQuery) {
        return ResponseEntity.ok(auditLogService.logs(searchType,searchQuery));
    }
}
