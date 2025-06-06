import React, {useEffect, useState} from "react";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../Common/ConfirmModal";
import AlertModal from "../../Common/AlertModal";

export default function AdminReaders(props) {
    const roles = props.roles;

    const [fullName, setFullName] = useState("");
    const [users, setUsers] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [newUser, setNewUser] = useState({});

    // 添加搜索条件的状态
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");

    // 搜索按钮点击后的过滤结果状态
    const [filteredUsers, setFilteredUsers] = useState(users);

    const navigate = useNavigate();
    const userId = props.userId;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user = await props.getUser(userId);
                if (user === null) throw new Error("服务器未响应");
                setFullName(user !== [] ? user.full_name : "");

                const users = await props.fetchUsers();
                console.log(users)
                if (users === null) throw new Error("服务器未响应");
                setUsers(users);
                setFilteredUsers(users);
            } catch (error) {
            }
        };

        fetchUsers();
    }, [userId]);

    const fetchFilteredUsers = async () => {
        try {
            const users = await props.searchUsers(searchTerm, searchTerm, selectedRole === "all" ? "" : selectedRole);
            if (users === null) throw new Error("服务器未响应");
            setFilteredUsers(users);
        } catch (error) {
        }
    };

    useEffect(() => {
        if (!users) return;
        fetchFilteredUsers();
        console.log(filteredUsers);
    }, [users]);


    // 返回按钮的点击事件
    const handleBack = () => {
        navigate("/home");
    };


    // 删除用户
    const confirmDelete = (user_Id) => {
        if (user_Id === userId) {
            setAlertConfig({
                variant: "warning",
                title: "警告",
                message: "无法删除自己！",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
        } else {
            setConfirmConfig({
                title: "确认删除",
                message: "确定要删除此用户吗？此操作无法撤销。",
                handleClose: () => {setShowConfirmModal(false)},
                handleConfirm: () => {deleteUser(user_Id)}
            });
            setShowConfirmModal(true);
        }
    };

    const deleteUser = async (user_Id) => {
        try {
            const flag = await props.deleteUser(user_Id);

            if (flag === false) {
                throw new Error("删除用户失败");
            }

            const newLog = {
                log_id: Date.now() & 0xffffffff,
                user_id: userId,
                action: `管理员${fullName}删除了用户 ID 为 ${user_Id} 的账号`,
                target_id: user_Id,
                action_date: new Date().toISOString(),
            };

            await props.addAuditLog(newLog);

            setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== user_Id));
            setShowConfirmModal(false);

        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // 编辑用户
    const handleEdit = (user) => {
        setEditingUserId(user.user_id);
        setEditedUser({ ...user });
    };

    const handleSave = async () => {
        const originalUser = users ? users.find((user) => user.user_id === editingUserId) : null;
        console.log(users)

        if (originalUser && originalUser.username !== editedUser.username) {
            if (await props.checkUserNameDuplicate(editedUser.username)) {
                setAlertConfig({
                    variant: "warning",
                    title: "错误",
                    message: "用户名已存在，请重新输入。",
                    onConfirm: () => setShowAlertModal(false),
                });
                setShowAlertModal(true);
                return;
            }
        }

        const changedFields = [];
        if (editedUser.username !== originalUser.username) changedFields.push("用户名");
        if (editedUser.password && editedUser.password !== originalUser.password) changedFields.push("密码");
        if (editedUser.full_name !== originalUser.full_name) changedFields.push("姓名");
        if (editedUser.email !== originalUser.email) changedFields.push("电子邮件");
        if (editedUser.phone_number !== originalUser.phone_number) changedFields.push("电话号码");
        if (editedUser.address !== originalUser.address) changedFields.push("地址");
        if (editedUser.role_id !== originalUser.role_id) changedFields.push("角色");
        if (editedUser.max_borrow_limit !== originalUser.max_borrow_limit) changedFields.push("最大借阅数量");

        try {
            const flag = await props.updateUser(originalUser.user_id, editedUser);

            if (flag === false) {
                throw new Error("编辑用户失败");
            }

            if (changedFields.length > 0) {
                const newLog = {
                    log_id: Date.now() & 0xffffffff,
                    user_id: userId,
                    action: `管理员${fullName}修改了用户 ID 为 ${originalUser.user_id} 的以下字段：${changedFields.join(", ")}`,
                    target_id: originalUser.user_id,
                    action_date: new Date().toISOString(),
                };

                console.log(newLog);
                await props.addAuditLog(newLog);
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === editingUserId ? editedUser : user
                )
            );
            setEditingUserId(null);
        } catch (error) {
            console.error("Error editing user:", error);
        }
    };


    const handleCancelEdit = () => {
        setEditingUserId(null);
    };

    // 显示密码切换
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // 添加用户
    const handleAddUser = async () => {
        if (await props.checkUserNameDuplicate(newUser.username)) {
            setAlertConfig({
                variant: "warning",
                title: "错误",
                message: "用户名已存在，请重新输入。",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
            return;
        }

        const defaultNewUser = {
            user_id: Date.now() & 0xffffffff,
            username: newUser.username,
            password: newUser.password,
            full_name: newUser.full_name || newUser.username,
            role_id: roles.find((role) => role.role_name === "user")?.role_id,
            max_borrow_limit: 5,
            email: "",
            phone_number: "",
            address: "",
        };

        try {
            const flag = await props.addUser(defaultNewUser);

            if (flag === false) {
                throw new Error("添加用户失败");
            }

            const newLog = {
                log_id: Date.now() & 0xffffffff,
                user_id: userId,
                action: `管理员${fullName}创建了用户 ID 为 ${defaultNewUser.user_id} 的账号`,
                target_id: defaultNewUser.user_id,
                action_date: new Date().toISOString(),
            };

            await props.addAuditLog(newLog);

            setUsers((prevUsers) => [...prevUsers, defaultNewUser]);
            setIsAddingUser(false);
            setNewUser({});
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleCancelAddUser = () => {
        setIsAddingUser(false);
        setNewUser({});
    };

    // 搜索按钮点击事件处理函数
    const handleSearch = () => {
        fetchFilteredUsers();
    };

    // 获取角色名称
    const getRoleName = (roleId) => {
        const role = roles.find((r) => r.role_id === roleId);
        return role ? role.role_name : "未知角色";
    };

    return (
        <Container fluid style={{ height: "100vh", backgroundColor: "#f5f5f5", padding: "2rem" }}>
            <Row>
                <Col>
                    <Button onClick={handleBack} variant="link" style={{ fontSize: "2rem" }}>
                        返回
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2 className="text-center mb-4" style={{ fontSize: "3rem", fontWeight: "bold" }}>管理读者</h2>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="搜索用户名或姓名"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={1}>
                    <Form.Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                        <option value="all">所有角色</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </Form.Select>
                </Col>
                <Col md={1}>
                    <Button variant="primary" onClick={handleSearch}>搜索</Button>
                </Col>
                <Col md={2}>
                    {!isAddingUser ? (
                        <Button onClick={() => setIsAddingUser(true)} variant="success">
                            添加用户
                        </Button>
                    ) : (
                        <div className="d-flex align-items-center gap-2">
                            <Form.Control
                                type="text"
                                placeholder="用户名"
                                value={newUser.username || ""}
                                onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                            />
                            <Form.Control
                                type="text"
                                placeholder="密码"
                                value={newUser.password || ""}
                                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                            />
                            <Button variant="success" onClick={handleAddUser}>
                                保存
                            </Button>
                            <Button variant="secondary" onClick={handleCancelAddUser}>
                                取消
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{ height: "75vh", overflowY: "auto", border: "1px solid #ccc", borderRadius: "5px" }}>
                        <Table bordered hover responsive style={{ backgroundColor: "#fff" }}>
                            <thead>
                            <tr>
                                <th>用户ID</th>
                                <th>用户名</th>
                                <th>密码</th>
                                <th>姓名</th>
                                <th>电子邮件</th>
                                <th>电话号码</th>
                                <th>地址</th>
                                <th>角色</th>
                                <th>最大借书数量</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers ? (filteredUsers.map((user) =>
                                user ? (  // 检查 user 是否为 null 或 undefined
                                    editingUserId === user.user_id ? (
                                        <tr key={user.user_id}>
                                            <td>{user.user_id}</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={editedUser.username}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({ ...prev, username: e.target.value }))
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        value={editedUser.password || ""}
                                                        onChange={(e) =>
                                                            setEditedUser((prev) => ({
                                                                ...prev,
                                                                password: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={togglePasswordVisibility}
                                                        className="ms-2"
                                                    >
                                                        {showPassword ? "隐藏" : "显示"}
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={editedUser.full_name}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({ ...prev, full_name: e.target.value }))
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="email"
                                                    value={editedUser.email}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({ ...prev, email: e.target.value }))
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={editedUser.phone_number}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({ ...prev, phone_number: e.target.value }))
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={editedUser.address}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({ ...prev, address: e.target.value }))
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Form.Select
                                                    value={editedUser.role_id}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({
                                                            ...prev,
                                                            role_id: Number(e.target.value),
                                                        }))
                                                    }
                                                >
                                                    {roles
                                                        .filter((role) => ["admin", "user"].includes(role.role_name))
                                                        .map((role) => (
                                                            <option key={role.role_id} value={role.role_id}>
                                                                {role.role_name}
                                                            </option>
                                                        ))}
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={editedUser.max_borrow_limit}
                                                    onChange={(e) =>
                                                        setEditedUser((prev) => ({
                                                            ...prev,
                                                            max_borrow_limit: Number(e.target.value),
                                                        }))
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <Button variant="success" size="sm" onClick={handleSave}>
                                                    保存
                                                </Button>{" "}
                                                <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                                                    取消
                                                </Button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={user.user_id}>
                                            <td>{user.user_id}</td>
                                            <td>{user.username}</td>
                                            <td>••••••</td>
                                            <td>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone_number}</td>
                                            <td>{user.address}</td>
                                            <td>{getRoleName(user.role_id)}</td>
                                            <td>{user.max_borrow_limit}</td>
                                            <td>
                                                <Button variant="primary" size="sm" onClick={() => handleEdit(user)}>
                                                    修改
                                                </Button>{" "}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => confirmDelete(user.user_id)}
                                                >
                                                    删除
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                ) : null // 如果 user 为 null 或 undefined，跳过此项渲染
                            )) : null}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>

            {/* 删除确认模态框 */}
            <ConfirmModal
                show={showConfirmModal}
                handleClose={confirmConfig.handleClose}
                handleConfirm={confirmConfig.handleConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
            />

            {/* 警告模态框 */}
            <AlertModal
                show={showAlertModal}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmLabel="确认"
                variant={alertConfig.variant}
                onConfirm={alertConfig.onConfirm}
            />
        </Container>
    );
}
