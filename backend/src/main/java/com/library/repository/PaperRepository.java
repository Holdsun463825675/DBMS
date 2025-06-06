package com.library.repository;

import com.library.model.Paper;
import com.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PaperRepository extends JpaRepository<Paper, Long>, JpaSpecificationExecutor<Paper> {

    @Query(value = "SELECT b.paper_id AS paperId, b.title AS title, COUNT(br) AS count " +
            "FROM paper_downloads br " +
            "JOIN papers b ON br.paper_id = b.paper_id " +
            "WHERE br.download_date BETWEEN TO_TIMESTAMP(:startDate, 'YYYY-MM-DD') AND TO_TIMESTAMP(:endDate, 'YYYY-MM-DD') " +
            "AND (:title IS NULL OR b.title LIKE CONCAT('%', :title, '%')) " +
            "GROUP BY b.paper_id, b.title", nativeQuery = true)
    List<Object[]> statisticPaper(@Param("startDate") String startDate,
                                  @Param("endDate") String endDate,
                                  @Param("title") String title);

    @Query("SELECT p FROM Paper p WHERE p.uploadedByUser.user_id = :userId")
    List<Paper> findByUploadedByUserId(@Param("userId") Long userId);



}
