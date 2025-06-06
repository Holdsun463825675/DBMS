package com.library.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
//  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long log_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonProperty("user_id")
    private User user;

    private String action;
    private Long target_id;

    @Column(nullable = false)
    private Date action_date;


    @JsonCreator
    public AuditLog(
            @JsonProperty("log_id") Long log_id,
            @JsonProperty("user_id") Long user_id,
            @JsonProperty("action") String action,
            @JsonProperty("target_id") Long target_id,
            @JsonProperty("action_date") Date action_date
    ) {
        this.log_id = log_id;
        this.user = new User();
        this.user.setUser_id(user_id);
        this.action = action;
        this.target_id = target_id;
        this.action_date = action_date;
    }

    public AuditLog() {

    }

    // Getters and Setters
    public Long getLog_id() {
        return log_id;
    }

    public void setLog_id(Long logId) {
        this.log_id = logId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getTarget_id() {
        return target_id;
    }

    public void setTarget_id(Long targetId) {
        this.target_id = targetId;
    }

    public Date getAction_date() {
        return action_date;
    }

    public void setAction_date(Date actionDate) {
        this.action_date = actionDate;
    }
    @JsonGetter("user_id")
    public Long getUserId() {
        return this.user != null ? this.user.getUser_id() : 0;
    }
}
