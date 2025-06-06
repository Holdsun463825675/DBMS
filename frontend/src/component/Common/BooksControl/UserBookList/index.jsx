import React from "react";
import { Table, Button } from "react-bootstrap";
import './index.css'; // 导入CSS样式

function UserBookList({ books, onEdit, onDelete,  onBorrow, onReturn }) {
    return (
        <div className="user-book-list-container">
            <div className="user-book-table-container">
                <Table striped bordered hover className="user-book-list-table">
                    <thead>
                    <tr>
                        <th>书籍ID</th>
                        <th>书名</th>
                        <th>作者</th>
                        <th>出版社</th>
                        <th>出版年份</th>
                        <th>ISBN码</th>
                        <th>总数量</th>
                        <th>是否公开</th>
                        <th>借阅数</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book) => (
                        <tr key={book.book_id}>
                            <td>{book.book_id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.publish_year}</td>
                            <td>{book.isbn}</td>
                            <td>{book.quantity}</td>
                            <td>{book.public ? "是" : "否"}</td>
                            <td>{book.borrow_count}</td>
                            <td>
                                <div className="button-group">
                                    <Button
                                        variant="success"
                                        className="borrow-button"
                                        onClick={() => onBorrow(book.book_id)}
                                    >
                                        借阅
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="return-button"
                                        onClick={() => onReturn(book.book_id)}
                                    >
                                        归还
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default UserBookList;
