package com.library.repository;

import com.library.model.PaperDownload;
import com.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PaperDownloadRepository extends JpaRepository<PaperDownload, Long> {
    List<PaperDownload> findByUser(User user);

    @Query(value = "SELECT DATE_TRUNC('day', download_date), COUNT(*) FROM paper_downloads WHERE download_date BETWEEN TO_TIMESTAMP(:startDate, 'YYYY-MM-DD') AND TO_TIMESTAMP(:endDate, 'YYYY-MM-DD') GROUP BY download_date", nativeQuery = true)
    List<Object[]> findDownloadCountByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);




}