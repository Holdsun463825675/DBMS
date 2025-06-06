import React from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import "./index.css"

function BookSearchBar({ onSearch, onSearchTypeChange }) {
    const handleSearch = (e) => {
        onSearch(e.target.value);
    };

    const handleTypeChange = (e) => {
        onSearchTypeChange(e.target.value);
    };

    return (
        <div className="book-search-bar-container">
            <Form className="mb-3 d-flex">
                {/* 下拉选择框 */}
                <Form.Select
                    aria-label="查询类型"
                    onChange={handleTypeChange}
                    className="me-2"
                >
                    <option value="title">按书名查询</option>
                    <option value="author">按作者查询</option>
                    <option value="publish_year">按出版年份查询</option>
                </Form.Select>

                {/* 查询输入框 */}
                <FormControl
                    type="text"
                    placeholder="请输入查询内容"
                    className="me-2"
                    onChange={handleSearch}
                />


            </Form>
        </div>

    );
}

export default BookSearchBar;