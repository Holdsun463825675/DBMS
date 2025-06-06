import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import AlertModal from "../Common/AlertModal";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register(props) {
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();

        if (username.trim() === "") {
            setAlertConfig({
                variant: "warning",
                title: "注册失败",
                message: "用户名不能为空，请输入用户名。",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
        } else if (await props.checkUserNameDuplicate(username)) {
            setAlertConfig({
                variant: "warning",
                title: "注册失败",
                message: "用户名已被占用，请选择其他用户名。",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
        } else if (password === "") {
            setAlertConfig({
                variant: "warning",
                title: "注册失败",
                message: "密码不能为空，请输入密码。",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
        } else if (password !== confirmPassword) {
            setAlertConfig({
                variant: "warning",
                title: "注册失败",
                message: "两次输入的密码不一致，请重新输入。",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
        } else {
            try {

                const newUser = {
                    user_id: Date.now() & 0xffffffff,
                    username: username,
                    password: password,
                    full_name: username,
                    email: "",
                    phone_number: "",
                    address: "",
                    role_id: 1,
                    max_borrow_limit: 5,
                };

                // 调用 addUser 添加用户
                const addUserResult = await props.addUser(newUser);
                if (!addUserResult) throw new Error("添加用户失败");

                // 记录审计日志
                const newLog = {
                    log_id: Date.now() & 0xffffffff,
                    user_id: newUser.user_id,
                    action: `创建user账号`,
                    target_id: newUser.user_id,
                    action_date: new Date().toISOString(),
                };
                await props.addAuditLog(newLog);

                if (addUserResult) {
                    // 注册成功提示并跳转
                    setAlertConfig({
                        variant: "success",
                        title: "注册成功",
                        message: "欢迎！您已成功注册，正在跳转到登录页面。",
                        onConfirm: () => {
                            setShowAlertModal(false);
                            navigate("/login"); // 注册成功后跳转到登录页面
                        },
                    });
                }

            } catch (error) {
                console.error("注册失败:", error);
                setAlertConfig({
                    variant: "danger",
                    title: "注册失败",
                    message: "注册过程中发生错误，请稍后重试。",
                    onConfirm: () => setShowAlertModal(false),
                });
            }
            setShowAlertModal(true);
        }
    };


    return (
        <Container fluid style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Row className="h-100">
                <Col className="d-flex align-items-center justify-content-center">
                    <Card style={{ width: "40rem", padding: "3rem", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                欢迎注册
                            </Card.Title>
                            <Card.Subtitle className="text-center mb-4 text-muted" style={{ fontSize: "1.2rem" }}>
                                注册新用户
                            </Card.Subtitle>

                            <Form onSubmit={handleRegister}>
                                <Form.Group controlId="formBasicUsername" className="mb-4">
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

                                <Form.Group controlId="formBasicConfirmPassword" className="mb-4">
                                    <Form.Control
                                        type="password"
                                        placeholder="确认密码"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mb-3" style={{ height: "3rem", fontSize: "1.1rem" }}>
                                    注册
                                </Button>
                            </Form>

                            <div className="text-center">
                                <Button
                                    variant="link"
                                    onClick={() => navigate("/login")}
                                    className="p-0"
                                    style={{ fontSize: "1rem", color: "#007bff", textDecoration: "underline" }}
                                >
                                    已有账号？点击登录
                                </Button>
                            </div>
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
