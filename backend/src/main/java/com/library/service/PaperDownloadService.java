package com.library.service;


import com.library.model.Paper;
import com.library.model.PaperDownload;
import com.library.model.User;
import com.library.repository.PaperDownloadRepository;
import com.library.repository.PaperRepository;
import com.library.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaperDownloadService {
    @Autowired
    private PaperDownloadRepository paperDownloadRepository;

    @Autowired
    private PaperRepository paperRepository;
    @Autowired
    private UserRepository userRepository;
    @PersistenceContext
    private EntityManager entityManager;  // 确保使用了 @PersistenceContext 注解

    //添加论文下载日志
    public PaperDownload logDownload(Paper paper, User user) {
        Query query = entityManager.createQuery("SELECT MAX(d.download_id) FROM PaperDownload d");
        Long maxDownloadId = (Long) query.getSingleResult();

        Long nextDownloadId = (maxDownloadId == null) ? 1L : maxDownloadId + 1;

        PaperDownload download = new PaperDownload();
        download.setDownload_id(nextDownloadId);
        download.setPaper(paper);
        download.setUser(user);
        return paperDownloadRepository.save(download);
    }


    //添加记录
    public PaperDownload addPaperDownload(PaperDownload paperDownload) {
        return paperDownloadRepository.save(paperDownload);
    }
    //通过id获取记录
    public Optional<PaperDownload> getPaperDownloadById(Long download_id) {
        return paperDownloadRepository.findById(download_id);
    }
    //更新
    public PaperDownload updatePaperDownload(Long downloadId, PaperDownload updatedPaperDownload) {
        return paperDownloadRepository.findById(downloadId).map(existingPaperDownload -> {
            // 更新可修改字段
            if (updatedPaperDownload.getPaper() != null && updatedPaperDownload.getPaper().getPaper_id() != null) {
                Paper paper = paperRepository.findById(updatedPaperDownload.getPaper().getPaper_id())
                        .orElseThrow(() -> new RuntimeException("Paper not found"));
                existingPaperDownload.setPaper(paper);
            }

            // 更新 User 引用
            if (updatedPaperDownload.getUser() != null && updatedPaperDownload.getUser().getUser_id() != null) {
                User user = userRepository.findById(updatedPaperDownload.getUser().getUser_id())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                existingPaperDownload.setUser(user);
            }

            if (updatedPaperDownload.getDownload_date() != null) {
                existingPaperDownload.setDownload_date(updatedPaperDownload.getDownload_date());
            }

            // 保存更新后的 PaperDownload
            return paperDownloadRepository.save(existingPaperDownload);
        }).orElseThrow(() -> new RuntimeException("PaperDownload not found"));
    }


    //删除记录
    public void deletePaperDownload(Long download_id) {
        paperDownloadRepository.deleteById(download_id);
    }

    //获取所有论文下载记录
    public List<PaperDownload> getAllPaperDownloads() {
        return paperDownloadRepository.findAll();
    }



    public List<PaperDownload> getDownloadsByUser(User user) {

        return paperDownloadRepository.findByUser(user);
    }

    public List<Map<String, Object>> statisticDate(String startDate, String endDate) {
        List<Object[]> result = paperDownloadRepository.findDownloadCountByDateRange(startDate, endDate);

        // 定义中国标准时间（CST）时区和日期格式化器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        ZoneId cstZone = ZoneId.of("Asia/Shanghai");

        // 将查询结果转换为 Map 并返回
        List<Map<String, Object>> statistics = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new HashMap<>();

            // 转换 UTC 时间为 CST 时间
            ZonedDateTime utcDateTime = ((java.sql.Timestamp) row[0]).toInstant().atZone(ZoneId.of("UTC"));
            String cstDateTime = utcDateTime.withZoneSameInstant(cstZone).format(formatter);

            map.put("date", cstDateTime); // CST Date
            map.put("count", row[1]);    // Download Count
            statistics.add(map);
        }

        return statistics;
    }


}
