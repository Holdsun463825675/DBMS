import React from "react";
import { Table, Button } from "react-bootstrap";

import "./index.css"

export default function AdminPaperList(props) {
    return (
        <div className="admin-paper-list-container">
            <Table striped bordered hover className="admin-paper-list-table">
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
                {props.papers.map((paper) => (
                    <tr key={paper.paper_id}>
                        <td>{paper.paper_id}</td>
                        <td>{paper.title}</td>
                        <td>{paper.author}</td>
                        <td>{paper.upload_date}</td>
                        <td>{paper.public ? "是" : "否"}</td>
                        <td>{paper.uploaded_by}</td>
                        <td>{paper.uploaded_by_id}</td>
                        <td>{paper.download_count}</td>
                        <td className="admin-paper-list-actions">
                            <Button
                                variant="warning"
                                onClick={() => props.onEdit(paper)}
                            >
                                编辑
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => props.onDelete(paper.paper_id)}
                                className="ms-2"
                            >
                                删除
                            </Button>
                            {/*<Button*/}
                            {/*    as="a"*/}
                            {/*    href={paper.download_href}*/}
                            {/*    target="_blank"*/}
                            {/*    variant="info"*/}
                            {/*    onClick={() => props.onDownload(paper.paper_id)}*/}
                            {/*    className="ms-2"*/}
                            {/*>*/}
                            {/*    下载*/}
                            {/*</Button>*/}

                            <Button
                                as="a"
                                href="https://www.baidu.com"
                                target="_blank"
                                variant="info"
                                onClick={() => props.onDownload(paper.paper_id)}
                                className="ms-2"
                            >
                                下载
                            </Button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

