package com.library.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "paper_downloads")
public class PaperDownload {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long download_id;

    @ManyToOne
    @JoinColumn(name = "paper_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonBackReference("paper-download")// 从方向
    @JsonProperty("paper_id")
    private Paper paper;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonBackReference("user-download")
    @JsonProperty("user_id")
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime download_date = LocalDateTime.now();

    public PaperDownload() {}

    @JsonCreator
    public PaperDownload(
            @JsonProperty("download_id") Long download_id,
            @JsonProperty("paper_id") Long paper_id,
            @JsonProperty("user_id") Long user_id,
            @JsonProperty("download_date") LocalDateTime download_date
    ) {
        this.download_id = download_id;

        this.paper = new Paper();
        this.paper.setPaper_id(paper_id);

        this.user = new User();
        this.user.setUser_id(user_id);

        this.download_date = download_date;
    }

    // Getters and Setters

    public Long getDownload_id() {
        return download_id;
    }

    public void setDownload_id(Long downloadId) {
        this.download_id = downloadId;
    }

    public Paper getPaper() {
        return paper;
    }

    public void setPaper(Paper paper) {
        this.paper = paper;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getDownload_date() {
        return download_date;
    }

    public void setDownload_date(LocalDateTime downloadDate) {
        this.download_date = downloadDate;
    }

    @JsonGetter("user_id")
    public Long getUserId() {
        return this.user != null ? this.user.getUser_id() : 0;
    }
    @JsonGetter("paper_id")
    public Long getPaperId() {
        return this.paper != null ? this.paper.getPaper_id() : 0;
    }
}
