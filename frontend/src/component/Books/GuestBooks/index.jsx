import React, { useState,useEffect } from "react";
import GuestBookList from "../../Common/BooksControl/GuestBookList"
import BookForm from "../../Common/BooksControl/BookForm"
import BookSearchBar from "../../Common/BooksControl/BookSearchBar"
import { Button } from "react-bootstrap";
import AlertModal from "../../Common/AlertModalCon"; // 可选，用于删除确认提示

function GuestBooks() {
    // const [papers, setPapers] = useState([]);
    // const [searchQuery, setSearchQuery] = useState("");
    // const [selectedPaper, setSelectedPaper] = useState(null); // 用于编辑
    // const [showForm, setShowForm] = useState(false);
    // const [showModal, setShowModal] = useState(false);
    // const [deleteId, setDeleteId] = useState(null); // 记录要删除的论文ID
    // const [searchType, setSearchType] = useState("title");

    const[books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const[showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const[deleteId, setDeleteId] = useState(null);
    const[searchType, setSearchType] = useState("title");

    // 加载默认论文数据,用于测试功能
    useEffect(() => {
        const defaultBooks = [
            {
                book_id: "1",
                title: "Deep Learning in Neural Networks",
                author: "Yann LeCun",
                publish_year: "2020-01-15",
                is_public: true,
                publisher:"aaa",
                download_count: 12,
                isbn:1321313,
                quantity:10,
                borrow_count:0,


            },

            {
                book_id: "2",
                title: "Deep Learning in Neural Networks",
                author: "Yann LeCun",
                publish_year: "2020-01-15",
                is_public: true,
                publisher: "aaa",
                download_count: 12,
                isbn: 1321313,
                quantity: 10,
                borrow_countBooks: 0,
            },

            {
                book_id: "3",
                title: "Deep Learning in Neural Networks",
                author: "Yann LeCun",
                publish_year: "2020-01-15",
                is_public: false,
                publisher:"aaa",
                download_count: 12,
                isbn:1321313,
                quantity:10,
                borrow_count:0,
            },
        ];
        setBooks(defaultBooks);
    }, []); // 空依赖数组，确保只在首次加载时执行


    // 添加/编辑论文
    const handleSaveBook = (book) => {
        if (book.book_id) {
            // 编辑现有论文
            setBooks(books.map((b) => (b.book_id === book.book_id ? book : b)));
        } else {
            const newBook={...book, book_id: Date.now() & 0xffffffff
                ,is_public:false
                ,download_count:0
                ,quantity:10
                ,borrow_count:0
                //,uploaded_by:""
                //,uploaded_by_id:""
            }
            // 添加新论文
            setBooks([...books,newBook]);
        }
        setShowForm(false);
        setSelectedBook(null);
    };

    //处理下载次数
    const handleDownload = (id) => {
        setBooks((prevBooks) =>
            prevBooks.map((book) =>
                book.book_id === id
                    ? { ...book, download_count: book.download_count + 1 }
                    : book
            )
        );
    };




    // 删除论文
    const handleDeleteBook = () => {
        setBooks(books.filter((book) => book.book_id !== deleteId)); // 根据 deleteId 删除论文
        setShowModal(false); // 关闭删除确认模态框
        setDeleteId(null); // 清除待删除的ID
    };

    // 搜索论文
    const handleSearch = (query) => {
        setSearchQuery(query);
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

    // 筛选搜索结果
    const filteredBooks = books.filter((book) => {
        if (searchType === "title" && book.is_public===true) {
            return book.title.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === "author"&& book.is_public===true) {
            return book.author.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === "publish_year" && book.is_public===true) {
            return book.publish_year.includes(searchQuery);
        }
        return false;
    });

    return (
        <div>
            <h1>图书库</h1>
            <h2>欢迎您，游客</h2>
            <BookSearchBar
                onSearch={handleSearch}
                onSearchTypeChange={handleSearchTypeChange}
            />
            {/*<Button variant="primary" onClick={() => handleOpenForm()}>*/}
            {/*    添加图书*/}
            {/*</Button>*/}
            <GuestBookList books={filteredBooks}
                           onEdit={handleOpenForm}
                           onDelete={confirmDelete}
                           onDownload={handleDownload} // 传递下载处理函数
            />

            {showForm && (
                <BookForm
                    book={selectedBook}
                    onSave={handleSaveBook}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <AlertModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="删除确认"
                message="确定要删除这本图书吗？"
                confirmLabel="确认删除"
                variant="warning"
                onConfirm={handleDeleteBook} // 当用户点击确认删除时调用 handleDeletePaper
            />
        </div>
    );
}

export default GuestBooks;