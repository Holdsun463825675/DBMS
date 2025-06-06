package com.library.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "papers")
public class Paper {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paper_id;

    @Column(nullable = false)
    private String title;

    private String author;

    @Column(nullable = false)
    private Date upload_date;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean is_public;

    @Column(nullable = false)
    private String uploaded_by;

    @ManyToOne
    @JoinColumn(name = "uploaded_by_id", nullable = true, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonProperty("uploaded_by_id")
    private User uploadedByUser;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int download_count;



    @OneToMany(mappedBy = "paper", cascade = CascadeType.REMOVE)
    @JsonManagedReference("paper-download")
    @JsonIgnore
    private List<PaperDownload> downloads;


    public Paper() {}

    @JsonCreator
    public Paper(
            @JsonProperty("paper_id") Long paper_id,
            @JsonProperty("title") String title,
            @JsonProperty("author") String author,
            @JsonProperty("upload_date") Date upload_date,
            @JsonProperty("is_public") boolean is_public,
            @JsonProperty("uploaded_by") String uploaded_by,
            @JsonProperty("uploaded_by_id") Long uploaded_by_id,
            @JsonProperty("download_count") int download_count
    ) {
        this.paper_id = paper_id;
        this.title = title;
        this.author = author;
        this.upload_date = upload_date;
        this.is_public = is_public;
        this.uploaded_by = uploaded_by;
        this.uploadedByUser = new User();
        this.uploadedByUser.setUser_id(uploaded_by_id);
        this.download_count = download_count;
    }

    // Getters and Setters
    public Long getPaper_id() {
        return paper_id;
    }

    public void setPaper_id(Long paperId) {
        this.paper_id = paperId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Date getUpload_date() {
        return upload_date;
    }

    public void setUpload_date(Date uploadDate) {
        this.upload_date = uploadDate;
    }

    public boolean isPublic() {
        return is_public;
    }

    public void setPublic(boolean isPublic) {
        this.is_public = isPublic;
    }

    public String getUploaded_by() {
        return uploaded_by;
    }

    public void setUploaded_by(String uploadedBy) {
        this.uploaded_by = uploadedBy;
    }

    public User getUploadedByUser() {
        return uploadedByUser;
    }

    public void setUploadedByUser(User uploadedByUser) {
        this.uploadedByUser = uploadedByUser;
    }

    public int getDownload_count() {
        return download_count;
    }

    public void setDownload_count(int downloadCount) {
        this.download_count = downloadCount;
    }

    @JsonGetter("uploaded_by_id")
    public Long getUploadedById() {
        return this.uploadedByUser != null ? this.uploadedByUser.getUser_id() : 0;
    }

}
