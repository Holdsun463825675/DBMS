import React from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import "./index.css"; // 引入样式

export default function SearchBar(props) {
    const handleSearch = () => {
        // 点击按钮时调用 onSearch 事件，并传递输入框中的值
        props.onSearch(props.searchQuery);
    };

    const handleTypeChange = (e) => {
        props.onSearchTypeChange(e.target.value);
    };


    const handleQueryChange = (e) => {
        // 处理输入框的内容变化，将值传递给父组件
        props.onSearchQueryChange(e.target.value);
    };

    return (
        <div className="search-bar-container">
            {/* 下拉选择框 */}
            <Form.Select
                aria-label="查询类型"
                value={props.searchType}
                onChange={handleTypeChange}
                className="form-select"
            >
                <option value="title">按标题查询</option>
                <option value="author">按作者查询</option>
                <option value="date">按日期查询</option>
            </Form.Select>

            {/* 查询输入框 */}
            <FormControl
                type="text"
                placeholder="输入查询内容"
                className="form-control"
                value={props.searchQuery}
                onChange={handleQueryChange}
            />


            <Button variant="primary" className="btn" onClick={handleSearch}>
                查询
            </Button>
        </div>
    );
}




