package com.library.controller;

import com.library.model.BorrowRecord;
import com.library.model.Paper;
import com.library.model.PaperDownload;
import com.library.model.User;
import com.library.service.PaperDownloadService;
import com.library.service.PaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/paper_downloads")
public class PaperDownloadController {
    @Autowired
    private PaperDownloadService paperDownloadService;
    @Autowired
    private PaperService paperService;

    //自动添加论文下载日志
    @PostMapping("/{paperId}/download")
    public String logDownload(@PathVariable String paperId, @RequestBody  User user) {
        // 将 Optional<Paper> 转换为 Paper 对象
        Optional<Paper> paperOptional = paperService.findById(Long.valueOf(paperId));
        // 检查 Paper 是否存在
        Paper paper = paperOptional.orElseThrow(() -> new RuntimeException("Paper not found"));
        if (paper == null) {
            throw new RuntimeException("Paper not found");
        }
        paperDownloadService.logDownload(paper, user);
        return "Download logged successfully";
    }

    // 获取所有借阅记录
    @GetMapping
    public ResponseEntity<List<PaperDownload>> getAllPaperDownloads() {
        return ResponseEntity.ok(paperDownloadService.getAllPaperDownloads());
    }

    // 添加借阅记录
    @PostMapping
    public ResponseEntity<PaperDownload> addPaperDownload(@RequestBody PaperDownload paperDownload) {
        return ResponseEntity.ok(paperDownloadService.addPaperDownload(paperDownload));
    }

    // 根据ID获取借阅记录
    @GetMapping("/{id}")
    public ResponseEntity<PaperDownload> getPaperDownloadById(@PathVariable String id) {
        return paperDownloadService.getPaperDownloadById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 更新借阅记录信息
    @PutMapping("/{id}")
    public ResponseEntity<PaperDownload> updatePaperDownload(@PathVariable String id, @RequestBody PaperDownload paperDownload) {
        return ResponseEntity.ok(paperDownloadService.updatePaperDownload(Long.valueOf(id), paperDownload));
    }

    // 根据id删除借阅记录
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaperDownload(@PathVariable String id) {
        paperDownloadService.deletePaperDownload(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

    //根据起始日期查询，返回data，count表
    @GetMapping("statistic_date")
    public ResponseEntity<List<Map<String,Object>>> statisticDate(@RequestParam("begin_date") String startDate,
                                                                  @RequestParam("end_date") String endDate) {
        return ResponseEntity.ok(paperDownloadService.statisticDate(startDate,endDate));
    }


}
