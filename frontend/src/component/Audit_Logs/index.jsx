import React, {useEffect, useState} from "react";
import {Table, Button, Modal, Form} from "react-bootstrap";
import "./index.css"
import {useNavigate} from "react-router-dom";

export default function AuditLogs(props) {

    const [AuditLogs, setAuditLogs] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("action");
    const [alertMessage, setAlertMessage] = useState("");


    //const roles = props.roles
    const roleId = props.roleId

    const [userRole, setUserRole] = React.useState("guest");


    // 根据 roleId 从服务器获取角色名称
    const fetchUserRole = async () => {
        try {
            const data = await props.fetchRole(roleId);
            if (data === null) {
                throw new Error("服务器响应失败");
            }
            setUserRole(data !== [] ? data.role_name : "guest"); // 设置返回的角色名，若无则默认为 "guest"
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    // 使用 useEffect 调用异步函数
    useEffect(() => {
        const fetchAndSetRole = async () => {
            if (!(roleId instanceof Promise)) {
                await fetchUserRole(); // 确保异步调用完成后设置状态
            }
        };
        fetchAndSetRole(); // 调用异步操作
    }, [roleId]);

    useEffect(() => {
        const loadAuditLogs = async () => {
            const fetchedAuditLogs = await props.fetchAuditLog();
            if (fetchedAuditLogs) {
                setAuditLogs(fetchedAuditLogs);
            }
        };
        loadAuditLogs();
    }, []);

// 处理删除论文
    const handleDeleteAuditLog = async () => {
        const success = await props.deleteAuditLog(selectedLog.log_id);
        if (success) {
            const updatedAuditLogs = await props.fetchAuditLog();
            setAuditLogs(updatedAuditLogs);
            setShowDeleteModal(false);  // 关闭删除确认框

        } else {
            setAlertMessage("删除论文失败");
        }
    };


    // 打开删除确认框
    const handleDeleteModal = (log) => {
        setSelectedLog(log);
        setShowDeleteModal(true);
    };

    // 关闭删除确认框
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedLog(null);
    };

    const navigate = useNavigate();

    const handleSearchAuditLogs = async (searchType, searchQuery) => {
        try {
            if (!searchQuery) {
                // 如果 searchQuery 为空，重新加载所有借阅记录
                const records = await props.fetchAuditLog();
                setAuditLogs(records);
            } else {
                // 否则进行搜索
                const records = await props.searchAuditLogs(searchType, searchQuery);
                if (!records || records.length === 0) {
                    alert("没有找到符合条件的借阅记录");
                } else {
                    setAuditLogs(records);
                }
            }
        } catch (error) {
            console.error("Error searching borrow records:", error);
        }
    };


    return (
        <>
            {(userRole === "admin") &&
                <div className="audit-logs-container">
                    <h1 className="text-center">操作日志</h1>
                    <Button variant="link" className="position-absolute"
                            style={{top: "40px", left: "100px", fontSize: "24px"}} onClick={() => navigate("/logs")}>
                        借阅记录
                    </Button>

                    <div className="search-form-container">
                        <Form.Group>
                            <Form.Label>搜索类型</Form.Label>
                            <Form.Control
                                as="select"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="action">按操作描述查询</option>
                                <option value="user_id">按用户ID查询</option>
                                <option value="target_id">按目标ID查询</option>

                            </Form.Control>
                        </Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="输入搜索内容"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {/* 搜索按钮 */}
                        <Button
                            variant="primary"
                            onClick={()=>handleSearchAuditLogs(searchType,searchQuery)}  // 调用 handleSearch 函数
                        >
                            搜索
                        </Button>
                    </div>

                    {/* 操作日志表格 */}
                    <div className="audit-logs-table-container">
                        <Table Table striped bordered hover className="audit-logs-table">
                            <thead>
                            <tr>
                                <th>日志ID</th>
                                <th>用户ID</th>
                                <th>操作描述</th>
                                <th>目标ID</th>
                                <th>操作日期</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {AuditLogs.map((log) => (
                                <tr key={log.log_id}>
                                    <td>{log.log_id}</td>
                                    <td>{log.user_id}</td>
                                    <td>{log.action}</td>
                                    <td>{log.target_id}</td>
                                    <td>{new Date(log.action_date).toLocaleString()}</td>
                                    <td>
                                        <Button
                                            className="audit-logs-button audit-logs-button-delete"

                                            onClick={() => handleDeleteModal(log)}
                                        >
                                            删除
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* 删除确认模态框 */}
                    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>删除确认</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>确定要删除这条操作日志吗？</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDeleteModal}>
                                取消
                            </Button>
                            <Button variant="danger" onClick={handleDeleteAuditLog}>
                                确认删除
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            }
            {(userRole === "user" || userRole === "guest") && <h1>对不起，您的访问权限不足！</h1>}
        </>


    );
}





