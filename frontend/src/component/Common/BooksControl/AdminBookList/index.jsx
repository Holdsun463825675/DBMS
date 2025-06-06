import React from "react";
import { Table, Button } from "react-bootstrap";
import "./index.css"; // 引入样式文件

function AdminBookList({ books, onEdit, onDelete,  onBorrow, onReturn }) {
    return (
        <div className="admin-book-list">
            <Table striped bordered hover>
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
                        <td>
                            <Button
                                variant="warning"
                                onClick={() => onEdit(book)}
                            >
                                编辑
                            </Button>{" "}
                            <Button
                                variant="danger"
                                onClick={() => onDelete(book.book_id)}
                                className="ms-2"
                            >
                                删除
                            </Button>
                            <Button
                                variant="success"
                                className="ms-2"
                                onClick={() => onBorrow(book.book_id)}
                            >
                                借阅
                            </Button>
                            <Button
                                variant="primary"
                                className="ms-2"
                                onClick={() => onReturn(book.book_id)}
                            >
                                归还
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminBookList;
