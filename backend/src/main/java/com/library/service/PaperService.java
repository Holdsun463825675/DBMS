package com.library.service;

import com.library.model.Paper;
import com.library.model.User;
import com.library.repository.PaperRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
public class PaperService {
    @Autowired
    private PaperRepository paperRepository;

    @Autowired
    private UserRepository userRepository;

    public Paper addPaper(Paper paper) {
        return paperRepository.save(paper);
    }

    public Optional<Paper> getPaperById(Long paperId) {
        return paperRepository.findById(paperId);
    }

    public List<Paper> getAllPapers() {
        return paperRepository.findAll();
    }

    public Optional<Paper> findById(Long paperId) {
        return paperRepository.findById(paperId);
    }

    public Paper updatePaper(Long paperId, Paper updatedPaper) {
        Paper existingPaper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        // 更新可修改字段
        if (updatedPaper.getTitle() != null) {
            existingPaper.setTitle(updatedPaper.getTitle());
        }
        if (updatedPaper.getAuthor() != null) {
            existingPaper.setAuthor(updatedPaper.getAuthor());
        }
        if (updatedPaper.getUpload_date() != null) {
            existingPaper.setUpload_date(updatedPaper.getUpload_date());
        }
        if (updatedPaper.isPublic() != existingPaper.isPublic()) {
            existingPaper.setPublic(updatedPaper.isPublic());
        }
        if (updatedPaper.getUploaded_by() != null) {
            existingPaper.setUploaded_by(updatedPaper.getUploaded_by());
        }
        if (updatedPaper.getDownload_count() >= 0) {
            existingPaper.setDownload_count(updatedPaper.getDownload_count());
        }

        // 更新上传者用户
        if (updatedPaper.getUploadedByUser() != null && updatedPaper.getUploadedByUser().getUser_id() != null) {
            User updatedUser = updatedPaper.getUploadedByUser();
            User persistentUser = userRepository.findById(updatedUser.getUser_id())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingPaper.setUploadedByUser(persistentUser);
        }

        // 保存更新后的 Paper
        return paperRepository.save(existingPaper);
    }



    public void deletePaper(Long paperId) {
        paperRepository.deleteById(paperId);
    }

    public List<Map<String, Object>> statisticPaper(String startDate, String endDate, String title) {
        // 执行查询
        List<Object[]> result = paperRepository.statisticPaper(startDate, endDate, title);

        // 将查询结果转换为 Map 并返回
        List<Map<String, Object>> statistics = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);     // ID
            map.put("title", row[1]);  // Title
            map.put("count", row[2]);  // Count
            statistics.add(map);
        }

        return statistics;
    }


    public List<Paper> papers(String userRole, String searchType, String searchQuery, boolean isPublic) {
        Specification<Paper> spec = Specification.where(null);

        // 根据 userRole 是否为 guest 以及是否公开来加上相应的查询条件
        if ("guest".equalsIgnoreCase(userRole)) {
            if (isPublic) {
                spec = spec.and(isPublicSpecification());
            }
        }

        // 根据 searchType 动态添加查询条件
        if ("title".equalsIgnoreCase(searchType)) {
            spec = spec.and(titleContains(searchQuery));
        } else if ("author".equalsIgnoreCase(searchType)) {
            spec = spec.and(authorContains(searchQuery));
        } else if ("date".equalsIgnoreCase(searchType)) {
            spec = spec.and(dateContains(searchQuery));
        }

        return paperRepository.findAll(spec);
    }

    // 根据 title 进行模糊查询
    private Specification<Paper> titleContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("title"), "%" + searchQuery + "%");
    }

    // 根据 author 进行模糊查询
    private Specification<Paper> authorContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("author"), "%" + searchQuery + "%");
    }

////     根据 date 进行模糊查询
//    private Specification<Paper> dateContains(String searchQuery) {
//        return (root, query, criteriaBuilder) -> {
//            // 定义日期格式
//            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//            try {
//                // 将查询字符串转换为 Date 对象
//                Date parsedDate = dateFormat.parse(searchQuery);
//                // 将 Date 转换为 Timestamp
//                Timestamp timestamp = new Timestamp(parsedDate.getTime());
//
//                // 使用 criteriaBuilder 来比较 upload_date
//                return criteriaBuilder.equal(root.get("uploadDate"), timestamp);
//            } catch (ParseException e) {
//                // 处理日期解析错误的情况
//                return criteriaBuilder.conjunction();  // 返回一个始终为真的条件，或者可以抛出异常
//            }
//        };
//    }
private Specification<Paper> dateContains(String searchQuery) {
    return (root, query, criteriaBuilder) -> {
        try {
            // 判断输入是否为年份前缀
            if (searchQuery.matches("\\d{1,4}")) { // 匹配 "20", "2022", 等
                return criteriaBuilder.like(
                        criteriaBuilder.function("TO_CHAR", String.class, root.get("upload_date"), criteriaBuilder.literal("YYYY")),
                        searchQuery + "%"
                );
            }

            // 匹配具体的年月
            if (searchQuery.matches("\\d{4}-\\d{2}")) { // 匹配 "2022-03"
                return criteriaBuilder.like(
                        criteriaBuilder.function("TO_CHAR", String.class, root.get("upload_date"), criteriaBuilder.literal("YYYY-MM")),
                        searchQuery + "%"
                );
            }

            // 匹配具体的日期
            if (searchQuery.matches("\\d{4}-\\d{2}-\\d{2}")) { // 匹配 "2022-03-01"
                return criteriaBuilder.like(
                        criteriaBuilder.function("TO_CHAR", String.class, root.get("upload_date"), criteriaBuilder.literal("YYYY-MM-DD")),
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
    // 判断是否公开的查询条件
    private Specification<Paper> isPublicSpecification() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("is_public"));
    }
}
