import React, { useState,useEffect } from "react";

import AdminBookList from "../../Common/BooksControl/AdminBookList"
import UserBookList from "../../Common/BooksControl/UserBookList"
import GuestBookList from "../../Common/BooksControl/GuestBookList"

import BookForm from "../../Common/BooksControl/BookForm"
import BookSearchBar from "../../Common/BooksControl/BookSearchBar"
import {Button, Form, FormControl, Modal} from "react-bootstrap";
import AlertModal from "../../Common/AlertModalCon"; // 可选，用于删除确认提示
import {useNavigate} from "react-router-dom";
import "./index.css"


export default function BooksManager(props) {


    const[books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const[deleteId, setDeleteId] = useState(null);
    const[searchType, setSearchType] = useState("title");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const UserRole=props.userRole;

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/home");
    }

    useEffect(() => {
        const loadBooks = async () => {
            const booksData = await props.fetchBooks();
            if (booksData) {
                // 如果 userRole 是 guest，过滤只显示 public 为 true 的论文
                if (props.userRole === "guest") {
                    setBooks(booksData.filter(book => book.public === true));
                } else {
                    setBooks(booksData);
                }
            } else {
                setAlertMessage("加载论文数据失败");
            }
        };

        loadBooks();
    }, [props.userRole]); // 添加 userRole 为依赖，确保 role 变化时重新加载数据

    // 处理添加论文
    const handleAddBook = async (newBook) => {
        console.log("传入的数据：", newBook);

        const bookWithId = {
            ...newBook,
            book_id: Date.now() & 0xffffffff,  // 使用时间戳作为临时的唯一 ID
        };
        console.log("带ID的数据：", bookWithId);

        const success = await props.addBook(bookWithId);
        if (success) {
            const updatedBooks = await props.fetchBooks();
            setBooks(updatedBooks);
            setShowForm(false);  // 关闭表单
        } else {
            setAlertMessage("添加书籍失败");
        }
    };



    // 处理编辑论文
    const handleEditBook = async (updatedBook) => {
        console.log("选中的图书", updatedBook);
        const success = await props.updateBook(updatedBook.book_id, updatedBook);
        if (success) {
            const updatedBooks = await props.fetchBooks();
            setBooks(updatedBooks);
            setShowForm(false);
        } else {
            setAlertMessage("更新论文失败");
        }
    };

    // 处理删除论文
    const handleDeleteBook = async () => {
        console.log("待删除的图书id：", deleteId);
        const success = await props.deleteBook(deleteId);
        if (success) {
            const updatedBooks = await props.fetchBooks();
            setBooks(updatedBooks);
            setShowModal(false);  // 关闭删除确认框
            setDeleteId(null);  // 清除待删除的ID
        } else {
            setAlertMessage("删除论文失败");
        }
    };

// 处理借阅书籍
    const handleBorrowBook = async (bookId) => {
        console.log("待借阅书籍ID",bookId);
        console.log("借阅者ID",props.userId);

        const success = await props.borrowBook(bookId,props.userId);
        if (success) {
            const updatedBooks = await props.fetchBooks();
            setBooks(updatedBooks);


        }
    };


    // 处理归还书籍
    const handleReturnBook = async (bookId) => {

        const success = await props.returnBook(bookId);
        if (success) {
            const updatedBooks = await props.fetchBooks();
            setBooks(updatedBooks);
        }
    };


    // 关闭警告框
    const handleCloseAlert = () => {
        setShowAlert(false);
    };




    // 搜索论文
    const handleSearchBooks = async (searchType,searchQuery) => {
        console.log("搜索类型", searchType);
        console.log("输入内容", searchQuery);
        try {
            if (!searchQuery) {
                // 如果 searchQuery 为空，重新加载所有书籍
                const books = await props.fetchBooks();
                setBooks(books);
            } else {
                // 否则进行搜索
                const books = await props.searchBooks(UserRole, searchType, searchQuery);
                if (!books || books.length === 0) {
                    alert("没有找到符合条件的书籍");
                } else {
                    setBooks(books);
                }
            }
        } catch (error) {
            console.error("Error searching books:", error);
        }
    };


    const handleSearchTypeChange = (type) => {
        setSearchType(type);
    };

    // 打开表单用于添加或编辑论文
    const handleOpenForm = (book = null) => {
        setSelectedBook(book);
        setShowForm(true);
    };

    // 打开删除确认模态框
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };




    let BookListComponent;

    if (UserRole === "admin") {
        BookListComponent = <AdminBookList books={books}
                                           onEdit={handleOpenForm}
                                           onDelete={confirmDelete}

                                           onBorrow={handleBorrowBook}
                                           onReturn={handleReturnBook}
        />;
    } else if (UserRole === "user") {
        BookListComponent = <UserBookList books={books}
                                          onEdit={handleOpenForm}
                                          onDelete={confirmDelete}

                                          onBorrow={handleBorrowBook}
                                          onReturn={handleReturnBook}

        />;
    } else if (UserRole === "guest") {
        BookListComponent = <GuestBookList books={books}
                                           onEdit={handleOpenForm}
                                           onDelete={confirmDelete}

        />;
    }

    let ButtonComponent;

    if (UserRole === "admin") {
        ButtonComponent = <Button variant="primary" onClick={() => handleOpenForm()}>
            添加图书
        </Button>
    }
    else{
        ButtonComponent = ""
    }

    return (
        <div className="books-manager-container">
            <div>
                <Button onClick={handleBack} variant="link" style={{fontSize: "2rem"}}>
                    返回
                </Button>
            </div>

            <h1>图书管理系统</h1>

            <h2>欢迎您，{UserRole === "admin" ? "管理员" : UserRole === "user" ? "用户" : "游客"}</h2>

            {/*<div className="books-search-bar">*/}
            {/*    <BookSearchBar*/}
            {/*        onSearch={handleSearchBooks}*/}
            {/*        onSearchTypeChange={handleSearchTypeChange}*/}
            {/*    />*/}
            {/*</div>*/}
            <div className="search-form-container">
                <Form.Group >
                    <Form.Label>搜索类型</Form.Label>
                    <Form.Control
                        as="select"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="title">按书名查询</option>
                        <option value="author">按作者查询</option>
                        <option value="publish_year">按出版年份查询</option>

                    </Form.Control>
                </Form.Group>

                    <FormControl
                        type="text"
                        placeholder="请输入查询内容"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        onClick={()=>handleSearchBooks(searchType,searchQuery)}  // 调用 handleSearch 函数
                    >
                        搜索
                    </Button>
            </div>

            <div className="books-button-component">{ButtonComponent}</div>

            <div>{BookListComponent}</div>

            {showForm && (
                <div className="books-form-container">
                    <BookForm
                        book={selectedBook}
                        onSave={selectedBook ? handleEditBook : handleAddBook}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <AlertModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="删除确认"
                message="确定要删除这本图书吗？"
                confirmLabel="确认删除"
                variant="warning"
                onConfirm={handleDeleteBook}
            />

            {/* 警告框 */}
            <Modal
                show={showAlert}
                onHide={handleCloseAlert}
                className="books-alert-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>警告</Modal.Title>
                </Modal.Header>
                <Modal.Body>{alertMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAlert}>
                        关闭
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}