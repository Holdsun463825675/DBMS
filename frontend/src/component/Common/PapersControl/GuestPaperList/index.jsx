import React from "react";
import { Table } from "react-bootstrap";
import "./index.css"; // 引入样式文件

function GuestPaperList({ papers }) {
    return (
        <div className="guest-paper-list-container">
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>论文ID</th>
                    <th>标题</th>
                    <th>作者</th>
                    <th>上传日期</th>
                    <th>是否公开</th>
                    <th>上传者名称</th>
                    <th>上传者ID</th>
                    <th>下载次数</th>
                </tr>
                </thead>
                <tbody>
                {papers.map((paper) => (
                    <tr key={paper.paper_id}>
                        <td>{paper.paper_id}</td>
                        <td>{paper.title}</td>
                        <td>{paper.author}</td>
                        <td>{paper.upload_date}</td>
                        <td>{paper.public ? "是" : "否"}</td>
                        <td>{paper.uploaded_by}</td>
                        <td>{paper.uploaded_by_id}</td>
                        <td>{paper.download_count}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default GuestPaperList;
