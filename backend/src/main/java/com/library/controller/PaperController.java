package com.library.controller;

import com.library.model.Paper;
import com.library.service.PaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/papers")
public class PaperController {
    @Autowired
    private PaperService paperService;

    // 上传论文
    @PostMapping
    public ResponseEntity<Paper> addPaper(@RequestBody Paper paper) {
        return ResponseEntity.ok(paperService.addPaper(paper));
    }

    // 获取所有论文
    @GetMapping
    public ResponseEntity<List<Paper>> getAllPapers() {
        return ResponseEntity.ok(paperService.getAllPapers());
    }

    // 根据ID获取论文
    @GetMapping("/{id}")
    public ResponseEntity<Paper> getPaperById(@PathVariable String id) {
        return paperService.getPaperById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 更新论文信息
    @PutMapping("/{id}")
    public ResponseEntity<Paper> updatePaper(@PathVariable String id, @RequestBody Paper paper) {
        return ResponseEntity.ok(paperService.updatePaper(Long.valueOf(id), paper));
    }

    // 删除论文
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(@PathVariable String id) {
        paperService.deletePaper(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

    //在日期范围内按title模糊查找查找被下载的论文名字和下载次数，返回一张表（包含papers的id、title、下载次数）
    @GetMapping("/statistic_paper")
    public ResponseEntity<List<Map<String,Object>>> statisticPaper(@RequestParam("begin_date") String startDate,
                                                                   @RequestParam("end_date") String endDate,
                                                                   @RequestParam(value = "title",required = false) String title) {
        return ResponseEntity.ok(paperService.statisticPaper(startDate,endDate,title));
    }

    //搜索栏功能
    @GetMapping("papers")
    public ResponseEntity<List<Paper>> papers(@RequestParam(value = "UserRole",required = false) String userRole,
                                              @RequestParam(value = "searchType",required = false) String searchType,
                                              @RequestParam(value = "searchQuery",required = false) String searchQuery,
                                              @RequestParam(value = "is_public",required = false) String isPublic) {
        boolean isPublicBool = "true".equalsIgnoreCase(isPublic);
        return ResponseEntity.ok(paperService.papers(userRole,searchType,searchQuery,isPublicBool));
    }
}
