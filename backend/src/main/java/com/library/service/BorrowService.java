package com.library.service;

import com.library.model.*;
import com.library.repository.BorrowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class BorrowService {
    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    //借书
    public BorrowRecord borrowBook(BorrowRecord borrowRecord) {
        return borrowRecordRepository.save(borrowRecord);
    }

    //还书
    public BorrowRecord returnBook(Long recordId) {
        return borrowRecordRepository.findById(recordId).map(record -> {
            record.setReturn_date(new java.util.Date());
            record.setStatus("returned");
            return borrowRecordRepository.save(record);
        }).orElseThrow(() -> new RuntimeException("Borrow record not found"));
    }

    //添加借阅记录
    public BorrowRecord addBorrowRecord(BorrowRecord borrowRecord) {
        return borrowRecordRepository.save(borrowRecord);
    }
    //通过id获取借阅记录
    public Optional<BorrowRecord> getBorrowRecordById(Long record_id) {
        return borrowRecordRepository.findById(record_id);
    }

    //更新借阅记录
    public BorrowRecord updateBorrowRecord(Long recordId, BorrowRecord updatedBorrowRecord) {
        return borrowRecordRepository.findById(recordId).map(existingBorrowRecord -> {
            // 更新可修改字段
            if (updatedBorrowRecord.getUser() != null && updatedBorrowRecord.getUser().getUser_id() != null) {
                User user = new User();
                user.setUser_id(updatedBorrowRecord.getUser().getUser_id());
                existingBorrowRecord.setUser(user);
            }

            if (updatedBorrowRecord.getBook() != null && updatedBorrowRecord.getBook().getBook_id() != null) {
                Book book = new Book();
                book.setBook_id(updatedBorrowRecord.getBook().getBook_id());
                existingBorrowRecord.setBook(book);
            }
            if (updatedBorrowRecord.getBorrow_date() != null) {
                existingBorrowRecord.setBorrow_date(updatedBorrowRecord.getBorrow_date());
            }
            if (updatedBorrowRecord.getReturn_date() != null) {
                existingBorrowRecord.setReturn_date(updatedBorrowRecord.getReturn_date());
            }
            if (updatedBorrowRecord.getDue_date() != null) {
                existingBorrowRecord.setDue_date(updatedBorrowRecord.getDue_date());
            }
            if (updatedBorrowRecord.getStatus() != null) {
                existingBorrowRecord.setStatus(updatedBorrowRecord.getStatus());
            }

            // 保存更新后的 BorrowRecord
            return borrowRecordRepository.save(existingBorrowRecord);
        }).orElseThrow(() -> new RuntimeException("BorrowRecord not found"));
    }

    //删除借阅记录
    public void deleteBorrowRecord(Long record_id) {
        borrowRecordRepository.deleteById(record_id);
    }

    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }

    public List<Map<String, Object>> statisticDate(String startDate, String endDate) {
        List<Object[]> result = borrowRecordRepository.findBorrowCountByDateRange(startDate, endDate);

        // 定义中国标准时间（CST）时区和日期格式化器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        ZoneId cstZone = ZoneId.of("Asia/Shanghai");

        // 转换查询结果为 Map 并将 UTC 时间转换为 CST
        List<Map<String, Object>> statistics = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new HashMap<>();

            // 将 UTC 时间（row[0]）转换为 CST
            ZonedDateTime utcDateTime = ((java.sql.Timestamp) row[0]).toInstant().atZone(ZoneId.of("UTC"));
            String cstDateTime = utcDateTime.withZoneSameInstant(cstZone).format(formatter);

            map.put("date", cstDateTime);
            map.put("count", row[1]);
            statistics.add(map);
        }

        return statistics;
    }

    public List<Map<String, Object>> statisticBook(String startDate, String endDate, String title) {
        // 执行查询
        List<Object[]> result = borrowRecordRepository.statisticBook(startDate, endDate, title);

        // 将查询结果转换为 Map 并返回
        List<Map<String, Object>> statistics = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);        // book_id
            map.put("title", row[1]);     // title
            map.put("count", row[2]);     // borrow_count
            statistics.add(map);
        }

        return statistics;
    }


    //searchQuery-borrow
    public List<BorrowRecord> borrow(String searchType, String searchQuery) {
        Specification<BorrowRecord> spec = Specification.where(null);


        // 根据 searchType 动态添加查询条件
        if ("user_id".equalsIgnoreCase(searchType)) {
            spec = spec.and(userIdContains(searchQuery));
        } else if ("book_id".equalsIgnoreCase(searchType)) {
            spec = spec.and(bookIdContains(searchQuery));
        } else if ("borrow_date".equalsIgnoreCase(searchType)) {
            spec = spec.and(dateContains(searchQuery,"borrow_date"));
        }else if ("return_date".equalsIgnoreCase(searchType)) {
            spec = spec.and(dateContains(searchQuery,"return_date"));
        }

        return borrowRecordRepository.findAll(spec);
    }

    // 根据 user_id 进行模糊查询
    private Specification<BorrowRecord> userIdContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->{
            return criteriaBuilder.like(
                    criteriaBuilder.toString(root.get("user").get("user_id")),
                    "%" + searchQuery + "%");
        };
    }

    // 根据 book_id进行模糊查询
    private Specification<BorrowRecord> bookIdContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->{
            return criteriaBuilder.like(
                    criteriaBuilder.toString(root.get("book").get("book_id")),
                    "%" + searchQuery + "%");
        };
    }

        private Specification<BorrowRecord> dateContains(String searchQuery,String filed) {
            return (root, query, criteriaBuilder) -> {
                try {
                    // 判断输入是否为年份前缀
                    if (searchQuery.matches("\\d{1,4}")) { // 匹配 "20", "2022", 等
                        return criteriaBuilder.like(
                                criteriaBuilder.function("TO_CHAR", String.class, root.get(filed), criteriaBuilder.literal("YYYY")),
                                searchQuery + "%"
                        );
                    }

                    // 匹配具体的年月
                    if (searchQuery.matches("\\d{4}-\\d{2}")) { // 匹配 "2022-03"
                        return criteriaBuilder.like(
                                criteriaBuilder.function("TO_CHAR", String.class, root.get(filed), criteriaBuilder.literal("YYYY-MM")),
                                searchQuery + "%"
                        );
                    }

                    // 匹配具体的日期
                    if (searchQuery.matches("\\d{4}-\\d{2}-\\d{2}")) { // 匹配 "2022-03-01"
                        return criteriaBuilder.like(
                                criteriaBuilder.function("TO_CHAR", String.class, root.get(filed), criteriaBuilder.literal("YYYY-MM-DD")),
                                searchQuery + "%"
                        );
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                // 如果输入不符合格式，返回一个始终为假的条件
                return criteriaBuilder.disjunction(); // 返回空结果
            };
        }
}



