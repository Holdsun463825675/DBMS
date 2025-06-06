package com.library.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "borrow_records")
public class BorrowRecord {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long record_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonProperty("user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonProperty("book_id")
    private Book book;

    @Column(nullable = false)
    private Date borrow_date;

    private Date return_date;

    @Column(nullable = false)
    private Date due_date;

    @Column(nullable = false)
    private String status;


    @JsonCreator
    public BorrowRecord(
            @JsonProperty("record_id") Long record_id,
            @JsonProperty("user_id") Long user_id,
            @JsonProperty("book_id") Long book_id,
            @JsonProperty("borrow_date") Date borrow_date,
            @JsonProperty("return_date") Date return_date,
            @JsonProperty("due_date") Date due_date,
            @JsonProperty("status") String status
    ) {
        this.record_id = record_id;
        this.user = new User();
        this.user.setUser_id(user_id);
        this.book = new Book();
        this.book.setBook_id(book_id);
        this.borrow_date = borrow_date;
        this.return_date = return_date;
        this.due_date = due_date;
        this.status = status;
    }

    public BorrowRecord() {

    }

    // Getters and Setters
    public Long getRecord_id() {
        return record_id;
    }

    public void setRecord_id(Long recordId) {
        this.record_id = recordId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Date getBorrow_date() {
        return borrow_date;
    }

    public void setBorrow_date(Date borrowDate) {
        this.borrow_date = borrowDate;
    }

    public Date getReturn_date() {
        return return_date;
    }

    public void setReturn_date(Date returnDate) {
        this.return_date = returnDate;
    }

    public Date getDue_date() {
        return due_date;
    }

    public void setDue_date(Date dueDate) {
        this.due_date = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    @JsonGetter("user_id")
    public Long getUserId() {
        return this.user != null ? this.user.getUser_id() : 0;
    }
    @JsonGetter("book_id")
    public Long getBookId() {
        return this.book != null ? this.book.getBook_id() : 0;
    }
}
