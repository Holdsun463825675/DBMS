package com.library.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "books")
public class Book {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long book_id;

    @Column(nullable = false)
    private String title;

    private String author;
    private String publisher;
    private int publish_year;

    @Column(unique = true)
    private String isbn;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int quantity;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int borrow_count;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean is_public;

    @OneToMany(mappedBy = "book", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<BorrowRecord> borrowRecords;

    @JsonCreator
    public Book(
            @JsonProperty("book_id") Long book_id,
            @JsonProperty("title") String title,
            @JsonProperty("author") String author,
            @JsonProperty("publisher") String publisher,
            @JsonProperty("publish_year") int publish_year,
            @JsonProperty("isbn") String isbn,
            @JsonProperty("quantity") int quantity,
            @JsonProperty("borrow_count") int borrow_count,
            @JsonProperty("is_public") boolean is_public
    ) {
        this.book_id = book_id;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.publish_year = publish_year;
        this.isbn = isbn;
        this.quantity = quantity;
        this.borrow_count = borrow_count;
        this.is_public = is_public;
    }

    public Book() {

    }

    // Getters and Setters
    public Long getBook_id() {
        return book_id;
    }

    public void setBook_id(Long bookId) {
        this.book_id = bookId;
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

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public int getPublish_year() {
        return publish_year;
    }

    public void setPublish_year(int publishYear) {
        this.publish_year = publishYear;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getBorrow_count() {
        return borrow_count;
    }

    public void setBorrow_count(int borrowCount) {
        this.borrow_count = borrowCount;
    }

    public boolean isPublic() {
        return is_public;
    }

    public void setPublic(boolean isPublic) {
        this.is_public = isPublic;
    }

}
