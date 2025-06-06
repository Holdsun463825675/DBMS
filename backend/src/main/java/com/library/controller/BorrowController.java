package com.library.controller;

import com.library.model.AuditLog;
import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")

public class BorrowController {
    @Autowired
    private BorrowService borrowService;


    // 借书-与添加借阅记录功能重复
    @PostMapping("/borrow")
    public ResponseEntity<BorrowRecord> borrowBook(@RequestBody BorrowRecord record) {
        return ResponseEntity.ok(borrowService.borrowBook(record));
    }

    // 自动归还书籍，输入recordId，会将未归还图书修改为归还状态
    @PutMapping("/auto/{id}")
    public ResponseEntity<BorrowRecord> returnBook(@PathVariable String id) {
        return ResponseEntity.ok(borrowService.returnBook(Long.valueOf(id)));
    }


    // 获取所有借阅记录
    @GetMapping
    public ResponseEntity<List<BorrowRecord>> getAllBorrowRecords() {
        return ResponseEntity.ok(borrowService.getAllBorrowRecords());
    }


    // 添加借阅记录
    @PostMapping
    public ResponseEntity<BorrowRecord> addBorrowRecord(@RequestBody BorrowRecord borrowRecord) {
        return ResponseEntity.ok(borrowService.addBorrowRecord(borrowRecord));
    }

    // 根据ID获取借阅记录
    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecord> getBorrowRecordById(@PathVariable String id) {
        return borrowService.getBorrowRecordById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 手动更新借阅记录信息
    @PutMapping("/{id}")
    public ResponseEntity<BorrowRecord> updateBorrowRecord(@PathVariable String id, @RequestBody BorrowRecord borrowRecord) {
        return ResponseEntity.ok(borrowService.updateBorrowRecord(Long.valueOf(id), borrowRecord));
    }

    // 根据id删除借阅记录
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrowRecord(@PathVariable String id) {
        borrowService.deleteBorrowRecord(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

    //根据起始日期查询，返回data，count表
    @GetMapping("statistic_date")
    public ResponseEntity<List<Map<String,Object>>> statisticDate(@RequestParam("begin_date") String startDate,
                                                                  @RequestParam("end_date") String endDate) {
        return ResponseEntity.ok(borrowService.statisticDate(startDate,endDate));
    }

    //在日期范围按title模糊查找被借出的书名和数量，返回一张表（包含books的id、title、 借阅数量）
    @GetMapping("statistic_book")
    public ResponseEntity<List<Map<String,Object>>> statisticBook(@RequestParam("begin_date") String startDate,
                                                                  @RequestParam("end_date") String endDate,
                                                                  @RequestParam(value = "title",required = false) String title) {
        return ResponseEntity.ok(borrowService.statisticBook(startDate,endDate,title));
    }

    //搜索栏查询
    @GetMapping("borrow")
    public ResponseEntity<List<BorrowRecord>> borrow(@RequestParam(value = "searchType",required = false) String searchType,
                                                     @RequestParam(value = "searchQuery",required = false) String searchQuery) {
        return ResponseEntity.ok(borrowService.borrow(searchType,searchQuery));
    }


}
