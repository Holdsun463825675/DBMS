import React from "react";
import { Table, Button } from "react-bootstrap";

function PaperList({ papers, onEdit, onDelete,onDownload }) {
    return (
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
                <th>操作</th>

            </tr>
            </thead>
            <tbody>
            {papers.map((paper) => (
                <tr key={paper.paper_id}>
                    <td>{paper.paper_id}</td>
                    <td>{paper.title}</td>
                    <td>{paper.author}</td>
                    <td>{paper.upload_date}</td>
                    <td>{paper.is_public ? "是" : "否"}</td>
                    <td>{paper.uploaded_by}</td>
                    <td>{paper.uploaded_by_id}</td>
                    <td>{paper.download_count}</td>
                    <td>
                        <Button variant="warning" onClick={() => onEdit(paper)}>
                            编辑
                        </Button>{" "}

                        <Button variant="danger" onClick={() => onDelete(paper.paper_id)} className="ms-2">
                            删除
                        </Button>

                        <Button
                            variant="info"
                            onClick={() => onDownload(paper.paper_id)}
                            className="ms-2"
                            href={`/download/${paper.paper_id}`} // 假设下载链接为该路径
                        >
                            下载
                        </Button>

                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

export default PaperList;
