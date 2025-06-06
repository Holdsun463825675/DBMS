package com.library.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private String full_name;
    private String email;
    private String phone_number;
    private String address;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonProperty("role_id")
    private Role role;

    @Column(name = "max_borrow_limit", nullable = false, columnDefinition = "INT DEFAULT 5")
    private int max_borrow_limit;


    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @JsonManagedReference("user-download")
    @JsonIgnore
    private List<PaperDownload> downloads;

    @OneToMany(mappedBy = "uploadedByUser", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Paper> papers;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<BorrowRecord> borrowRecords;


    public User() {
    }
    @JsonCreator
    public User(
            @JsonProperty("user_id") Long user_id,
            @JsonProperty("username") String username,
            @JsonProperty("password") String password,
            @JsonProperty("full_name") String full_name,
            @JsonProperty("email") String email,
            @JsonProperty("phone_number") String phone_number,
            @JsonProperty("address") String address,
            @JsonProperty("role_id") Long role_id,  // 通过 role_id 创建 Role 对象
            @JsonProperty("max_borrow_limit") int max_borrow_limit) {

        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.full_name = full_name;
        this.email = email;
        this.phone_number = phone_number;
        this.address = address;
        this.max_borrow_limit = max_borrow_limit;

        // 设置 Role 对象
        this.role = new Role();
        this.role.setRole_id(role_id);  // 根据传入的 role_id 初始化 Role 对象
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long userId) {
        this.user_id = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String fullName) {
        this.full_name = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phoneNumber) {
        this.phone_number = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getMax_borrow_limit() {
        return max_borrow_limit;
    }

    public void setMax_borrow_limit(int maxBorrowLimit) {
        this.max_borrow_limit = maxBorrowLimit;
    }

    public List<PaperDownload> getDownloads() {
        return downloads;
    }

    public void setDownloads(List<PaperDownload> downloads) {
        this.downloads = downloads;

    }
    @JsonGetter("role_id")
    public Long getRoleId() {
        return this.role != null ? this.role.getRole_id() : 0; // 如果 role 不为空，返回 role_id，否则返回 0
    }

}



