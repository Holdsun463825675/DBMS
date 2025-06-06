import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../Common/AlertModal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InputFrame(props) {
    const navigate = useNavigate();
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userRole, setUserRole] = useState("普通用户");


    const jumpToRegister = () => {
        navigate("/register");
    };

    const jumpToHome = () => {
        setShowAlertModal(false);
        navigate("/home");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // 从后端查询用户信息
            const user = await props.fetchUser(username);
            console.log(user);
            if (user === null) {
                throw new Error("获取用户信息失败");
            }

            if (!user || user.password !== password) {
                // 用户不存在或密码错误
                setAlertConfig({
                    variant: "warning",
                    title: "登录失败",
                    message: "用户名或密码错误，请重新输入。",
                    onConfirm: () => setShowAlertModal(false),
                });
            } else {
                // 获取实际角色名称
                const actualRole = await props.fetchRole(user.role_id);
                if (actualRole === null) {
                    throw new Error("获取用户角色失败");
                }
                const actualRoleName = actualRole.role_name;
                console.log(actualRoleName);
                const selectedRole = userRole === "管理员" ? "admin" : "user";

                if (actualRoleName === selectedRole) {
                    // 登录成功
                    setAlertConfig({
                        variant: "info",
                        title: `${userRole}登录成功`,
                        message: `欢迎${userRole}${user.full_name}！即将跳转到主页。`,
                        onConfirm: jumpToHome,
                    });

                    // 设置角色和用户信息
                    props.setRoleId(user.role_id);
                    props.setUserId(user.user_id);

                    // 记录审计日志
                    const newLog = {
                        log_id: Date.now() & 0xffffffff,
                        user_id: user.user_id,
                        action: `${userRole}${user.username}登录`,
                        target_id: user.user_id,
                        action_date: new Date().toISOString(),
                    };
                    await props.addAuditLog(newLog);
                } else {
                    // 用户角色与选择不匹配
                    setAlertConfig({
                        variant: "warning",
                        title: "登录失败",
                        message: "用户名或密码错误，请重新输入。",
                        onConfirm: () => setShowAlertModal(false),
                    });
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
        }

        setShowAlertModal(true);
    };


    const handleGuestLogin = async () => {
        try {
            const roleId = await props.fetchRoleId("guest"); // 获取 guest 对应的 roleId
            if (roleId !== null) {
                setAlertConfig({
                    variant: "info",
                    title: "游客登录",
                    message: "您已以游客身份登录，部分功能受限。",
                    onConfirm: jumpToHome,
                });
                props.setRoleId(props.fetchRoleId("guest")) // 将角色id设置为游客对应的id
                props.setUserId("-1") // 将用户id设置为-1不存在
                setShowAlertModal(true);
            }
            else{
                console.warn("无法获取角色 ID，取消退出操作。");
            }
        } catch (error) {
            console.error("handleConfirmLogout error:", error);
        }
    };


    return (
        <Container fluid style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Row className="h-100">
                <Col className="d-flex align-items-center justify-content-center">
                    <Card style={{ width: "40rem", padding: "3rem", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                欢迎来到图书管理系统
                            </Card.Title>
                            <Card.Subtitle className="text-center mb-4 text-muted" style={{ fontSize: "1.2rem" }}>
                                登录
                            </Card.Subtitle>

                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="formBasicEmail" className="mb-4">
                                    <Form.Control
                                        type="text"
                                        placeholder="用户名"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mb-4">
                                    <Form.Control
                                        type="password"
                                        placeholder="密码"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>

                                <div className="d-flex align-items-center mb-4">
                                    <Dropdown onSelect={(e) => setUserRole(e)} className="flex-grow-1 me-2">
                                        <Dropdown.Toggle variant="secondary" className="w-100" style={{ height: "3rem", fontSize: "1.1rem" }}>
                                            {userRole}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="管理员">管理员</Dropdown.Item>
                                            <Dropdown.Item eventKey="普通用户">普通用户</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Button variant="primary" type="submit" className="w-50" style={{ height: "3rem", fontSize: "1.1rem" }}>
                                        登录
                                    </Button>
                                </div>

                                <Button variant="success" onClick={handleGuestLogin} className="w-100 mb-3" style={{ height: "3rem", fontSize: "1.1rem" }}>
                                    游客登录
                                </Button>

                                <Button variant="link" onClick={jumpToRegister} className="w-100 text-center" style={{ fontSize: "1rem" }}>
                                    前往注册
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 提示或警告窗口 */}
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
