import React from "react";
import { Table, Button } from "react-bootstrap";
import "./index.css"
function LogsList({ logs,onDelete,onChangeStatus,onShowModal}) {
    return (
        <div className="logs-list-container">
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>记录ID</th>
                <th>用户ID</th>
                <th>书籍ID</th>
                <th>借阅日期</th>
                <th>归还日期</th>
                <th>到期日期</th>
                <th>状态</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            {logs.map((log) => log ? (
                <tr key={log.record_id}>
                    <td>{log.record_id}</td>
                    <td>{log.user_id}</td>
                    <td>{log.book_id}</td>
                    <td>{log.borrow_date}</td>
                    <td>{log.return_date || "未归还"}</td>
                    <td>{log.due_date}</td>
                    <td>{log.status}</td>
                    <td>
                        {log.status === "borrowed" && (
                            <Button
                                variant="warning"
                                onClick={() => onChangeStatus(log.record_id, "returned")}
                            >
                                标记为已归还
                            </Button>
                        )}
                        <Button
                            variant="danger"
                            onClick={() => {onDelete(log.record_id) && onShowModal(true)}}
                        >
                            删除
                        </Button>
                    </td>
                </tr>
            ) : null)}
            </tbody>
        </Table>
        </div>
    );
}

export default LogsList;