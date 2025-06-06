package com.library.repository;

import com.library.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long>, JpaSpecificationExecutor<BorrowRecord> {
    @Query(value = "SELECT DATE_TRUNC('day', borrow_date) AS date, COUNT(*) AS count " +
            "FROM borrow_records " +
            "WHERE borrow_date BETWEEN TO_TIMESTAMP(:startDate, 'YYYY-MM-DD') AND TO_TIMESTAMP(:endDate, 'YYYY-MM-DD') " +
            "GROUP BY DATE_TRUNC('day', borrow_date) " ,nativeQuery = true)
    List<Object[]> findBorrowCountByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = "SELECT b.book_id AS bookId, b.title AS title, COUNT(br) AS borrowCount " +
            "FROM borrow_records br " +
            "JOIN books b ON br.book_id = b.book_id " +
            "WHERE br.borrow_date BETWEEN TO_TIMESTAMP(:startDate, 'YYYY-MM-DD') AND TO_TIMESTAMP(:endDate, 'YYYY-MM-DD') " +
            "AND (:title IS NULL OR b.title LIKE CONCAT('%', :title, '%')) " +
            "GROUP BY b.book_id, b.title", nativeQuery = true)
    List<Object[]> statisticBook(@Param("startDate") String startDate,
                                 @Param("endDate") String endDate,
                                 @Param("title") String title);



}
