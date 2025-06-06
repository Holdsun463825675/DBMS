package com.library.controller;

import com.library.model.Book;
import com.library.model.Paper;
import com.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    // 添加图书
    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    // 获取所有图书
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // 根据ID获取图书
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.getBookById(Long.valueOf(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 更新图书信息
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(Long.valueOf(id), book));
    }

    // 删除图书
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookService.deleteBook(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }

    //搜索栏功能
    @GetMapping("books")
    public ResponseEntity<List<Book>> books(@RequestParam(value = "UserRole",required = false) String userRole,
                                            @RequestParam(value = "searchType",required = false) String searchType,
                                            @RequestParam(value = "searchQuery",required = false) String searchQuery,
                                            @RequestParam(value = "is_public",required = false) String isPublic) {
        boolean isPublicBool = "true".equalsIgnoreCase(isPublic);
        return ResponseEntity.ok(bookService.books(userRole,searchType,searchQuery,isPublicBool));
    }
}
