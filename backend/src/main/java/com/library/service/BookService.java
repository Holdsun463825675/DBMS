package com.library.service;

import com.library.model.Book;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Optional<Book> getBookById(Long bookId) {
        return bookRepository.findById(bookId);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book updateBook(Long bookId, Book updatedBook) {
        return bookRepository.findById(bookId).map(existingBook -> {
            // 更新可修改字段
            if (updatedBook.getTitle() != null) {
                existingBook.setTitle(updatedBook.getTitle());
            }
            if (updatedBook.getAuthor() != null) {
                existingBook.setAuthor(updatedBook.getAuthor());
            }
            if (updatedBook.getPublisher() != null) {
                existingBook.setPublisher(updatedBook.getPublisher());
            }
            if (updatedBook.getPublish_year() != 0) {  // 假设publish_year为0时，代表不更新
                existingBook.setPublish_year(updatedBook.getPublish_year());
            }
            if (updatedBook.getIsbn() != null) {
                existingBook.setIsbn(updatedBook.getIsbn());
            }
            if (updatedBook.getQuantity() >= 0) {  // Quantity 不能为负数
                existingBook.setQuantity(updatedBook.getQuantity());
            }
            if (updatedBook.getBorrow_count() >= 0) {
                existingBook.setBorrow_count(updatedBook.getBorrow_count());
            }
            if (updatedBook.isPublic() != existingBook.isPublic()) {
                existingBook.setPublic(updatedBook.isPublic());
            }

            // 保存更新后的 Book
            return bookRepository.save(existingBook);
        }).orElseThrow(() -> new RuntimeException("Book not found"));
    }


    public void deleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
    }


    public List<Book> books(String userRole, String searchType, String searchQuery, boolean isPublic) {
        Specification<Book> spec = Specification.where(null);

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
        } else if ("publish_year".equalsIgnoreCase(searchType)) {
            spec = spec.and(publishYearContains(searchQuery));
        }

        return bookRepository.findAll(spec);
    }

    // 根据 title 进行模糊查询
    private Specification<Book> titleContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("title"), "%" + searchQuery + "%");
    }

    // 根据 author 进行模糊查询
    private Specification<Book> authorContains(String searchQuery) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("author"), "%" + searchQuery + "%");
    }

    // 根据 publishYear 进行模糊查询
    private Specification<Book> publishYearContains(String searchQuery) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.like(
                    criteriaBuilder.toString(root.get("publish_year")),
                    "%" + searchQuery + "%"
            );
        };
    }



    // 判断是否公开的查询条件
    private Specification<Book> isPublicSpecification() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("is_public"));
    }
}
