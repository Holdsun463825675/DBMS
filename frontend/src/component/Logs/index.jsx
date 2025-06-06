import React, {useState, useEffect} from "react";
import {Table, Button, Form} from "react-bootstrap";
import AlertModal from "../Common/AlertModalCon"; // 删除确认框
import LogsList from "../Common/LogsControl/LogsList";
import {useNavigate} from "react-router-dom";
import "./index.css"

export default function Logs(props) {
    const [logs, setLogs] = useState([]);  // 存储借阅记录
    const [searchQuery, setSearchQuery] = useState("");  // 搜索条件
    const [searchType, setSearchType] = useState("user_id");  // 搜索字段
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null); // 删除借阅记录的ID

    const roles = props.roles
    const roleId = props.roleId

    const [userRole, setUserRole] = React.useState("guest");


    // 根据 roleId 从服务器获取角色名称
    const fetchUserRole = async () => {
        try {
            const data = await props.fetchRole(roleId);
            if (data === null) {
                throw new Error("服务器响应失败");
            }
            console.log(data)
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

        const loadBorrowRecords = async () => {
            const records = await props.fetchBorrowRecords();
            if (records) {
                setLogs(records);
            }
        };
        loadBorrowRecords();
    }, [roleId]);


    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };



    const handleDeleteLog = async () => {
        const success = await props.deleteBorrowRecord(deleteId);
        if (success) {
            const updatedRecords = await props.fetchBorrowRecords();
            setLogs(updatedRecords);
            setShowModal(false);
            setDeleteId(null);
        }
    };

    // 处理标记为已归还的操作
    const handleChangeStatus = async (borrowRecordId) => {
        const success = await props.updateBorrowStatus(borrowRecordId);
        if (success) {
            const updatedRecords = await props.fetchBorrowRecords();
            setLogs(updatedRecords);
        } else {
            alert("更新借阅记录失败");
        }
    };

    const handleSearch = async (searchType, searchQuery) => {
        try {
            if (!searchQuery) {
                // 如果 searchQuery 为空，重新加载所有借阅记录
                const records = await props.fetchBorrowRecords();
                setLogs(records);
            } else {
                // 否则进行搜索
                const records = await props.searchBorrowRecords(searchType, searchQuery);
                if (!records || records.length === 0) {
                    alert("没有找到符合条件的借阅记录");
                } else {
                    setLogs(records);
                }
            }
        } catch (error) {
            console.error("Error searching borrow records:", error);
        }
    };


    const navigate = useNavigate();
    return (
        <>
            {(userRole === "admin") &&
                <div className="logs-container">

                    <h1 className="text-center">借阅记录</h1>
                    <Button variant="link" className="position-absolute"
                            style={{top: "40px", left: "50px", fontSize: "24px"}} onClick={() => navigate("/home")}>
                        返回
                    </Button>

                    <Button variant="link" className="position-absolute"
                            style={{top: "40px", right: "50px", fontSize: "24px"}}
                            onClick={() => navigate("/auditlogs")}>
                        操作日志
                    </Button>

                    <div className="search-form-container">
                        <Form.Group>
                            <Form.Label>搜索类型</Form.Label>
                            <Form.Control
                                as="select"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="user_id">用户ID</option>
                                <option value="book_id">书籍ID</option>
                                <option value="borrow_date">借阅日期</option>
                                <option value="return_date">归还日期</option>
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
                            onClick={()=>handleSearch(searchType,searchQuery)}  // 调用 handleSearch 函数
                        >
                            搜索
                        </Button>
                    </div>

                    <LogsList
                        logs={logs}
                        onDelete={confirmDelete}
                        onChangeStatus={handleChangeStatus}
                        onShowModal={showModal}
                    />

                    <AlertModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        title="删除确认"
                        message="确定要删除这条借阅记录吗？"
                        confirmLabel="确认删除"
                        variant="warning"
                        onConfirm={handleDeleteLog}
                    />
                </div>
            }
            {(userRole === "user" || userRole === "guest") && <h1>对不起，您的访问权限不足！</h1>}
        </>

    );
}




