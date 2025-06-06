import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 引入useHistory用于页面跳转
import AlertModal from "../../Common/AlertModal";
import ConfirmModal from "../../Common/ConfirmModal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserReaders(props) {

    const [user, setUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [fullName, setFullName] = useState(user ? user.full_name : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [phoneNumber, setPhoneNumber] = useState(user ? user.phone_number : "");
    const [address, setAddress] = useState(user ? user.address : "");
    const [isModified, setIsModified] = useState(false); // 用于追踪是否修改过

    const navigate = useNavigate();
    const userId = props.userId;

    // 在组件挂载时发送请求
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await props.getUser(userId);
                if (data === null) {
                    throw new Error("服务器未响应");
                }
                setUser(data !== [] ? data : null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        if (userId && !(userId instanceof Promise)) fetchUserData();
    }, [userId]);


    // 请求成功即获取到user后渲染
    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
            setEmail(user.email);
            setPhoneNumber(user.phone_number);
            setAddress(user.address);
        }
    }, [user]);



    // 处理输入修改
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setIsModified(true);
    };

    // 保存修改
    const handleSaveChanges = async (e) => {
        e.preventDefault();

        if (!user) {
            setAlertConfig({
                variant: "danger",
                title: "错误",
                message: "未找到用户。",
                onConfirm: () => setShowAlertModal(false),
            });
            setShowAlertModal(true);
            return;
        }

        if (oldPassword && oldPassword !== user.password) {
            setAlertConfig({
                variant: "warning",
                title: "修改失败",
                message: "原密码不正确，请重新输入。",
                onConfirm: () => setShowAlertModal(false),
            });
        } else if (newPassword && newPassword !== confirmNewPassword) {
            setAlertConfig({
                variant: "warning",
                title: "修改失败",
                message: "两次输入的新密码不一致，请重新输入。",
                onConfirm: () => setShowAlertModal(false),
            });
        } else {
            const updatedUser = {
                user_id: user.user_id,
                username: user.username,
                password: newPassword || user.password,
                full_name: fullName,
                email: email,
                phone_number: phoneNumber,
                address: address,
                role_id: user.role_id,
                max_borrow_limit: user.max_borrow_limit
            };

            const flag = await props.updateUser(userId, updatedUser);
            if (!flag) return;

            const changedFields = [];
            if (fullName !== user.full_name) changedFields.push("姓名");
            if (email !== user.email) changedFields.push("电子邮件");
            if (phoneNumber !== user.phone_number) changedFields.push("电话号码");
            if (address !== user.address) changedFields.push("地址");
            if (newPassword) changedFields.push("密码");

            if (changedFields.length > 0) {
                const newLog = {
                    log_id: Date.now() & 0xffffffff,
                    user_id: user.user_id,
                    action: `用户${user.username}修改了以下信息：${changedFields.join(", ")}`,
                    target_id: user.user_id,
                    action_date: new Date().toISOString(),
                };
                await props.addAuditLog(newLog);
            }

            setAlertConfig({
                variant: "success",
                title: "修改成功",
                message: "您的信息已成功更新。",
                onConfirm: () => setShowAlertModal(false),
            });
            setUser(updatedUser);
            setIsModified(false); // 重置修改状态
        }
        setShowAlertModal(true);
    };


    // 返回按钮的点击事件
    const handleBack = () => {
        if (isModified) {
            setConfirmConfig({
                title: "未保存的更改",
                message: "您有未保存的更改，确认返回吗？",
                handleClose: () => {setShowConfirmModal(false)},
                handleConfirm: () => {
                    setShowConfirmModal(false);
                    navigate("/home");
                },
            });
            setShowConfirmModal(true);
        } else {
            navigate("/home");
        }
    };

    return (
        <Container fluid style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Row>
                <Col>
                    <Button onClick={handleBack} variant="link" style={{ fontSize: "2rem", position: "absolute"}}>
                        返回
                    </Button>
                </Col>
            </Row>
            <Row className="h-100">
                <Col className="d-flex align-items-center justify-content-center">
                    <Card style={{ width: "40rem", padding: "3rem", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4" style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                修改个人信息
                            </Card.Title>
                            <Form onSubmit={handleSaveChanges}>
                                {/* 不可修改的信息 */}
                                <Form.Group controlId="formUserId" className="mb-4">
                                    <Form.Label>用户ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user ? user.user_id : ""}
                                        readOnly
                                        style={{ color: "#6c757d", cursor: "not-allowed" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formRoleId" className="mb-4">
                                    <Form.Label>最大借阅数量限制</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user ? user.max_borrow_limit : 0}
                                        readOnly
                                        style={{ color: "#6c757d", cursor: "not-allowed" }}
                                    />
                                </Form.Group>

                                {/* 修改密码 */}
                                <Form.Group controlId="formOldPassword" className="mb-4">
                                    <Form.Label>密码修改</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="请输入原密码"
                                        value={oldPassword}
                                        onChange={handleInputChange(setOldPassword)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword" className="mb-4">
                                    <Form.Control
                                        type="password"
                                        placeholder="请输入新密码"
                                        value={newPassword}
                                        onChange={handleInputChange(setNewPassword)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmNewPassword" className="mb-4">
                                    <Form.Control
                                        type="password"
                                        placeholder="确认新密码"
                                        value={confirmNewPassword}
                                        onChange={handleInputChange(setConfirmNewPassword)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>

                                {/* 可编辑信息 */}
                                <Form.Group controlId="formFullName" className="mb-4">
                                    <Form.Label>姓名</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={fullName}
                                        onChange={handleInputChange(setFullName)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mb-4">
                                    <Form.Label>电子邮件</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={handleInputChange(setEmail)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhoneNumber" className="mb-4">
                                    <Form.Label>电话号码</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={phoneNumber}
                                        onChange={handleInputChange(setPhoneNumber)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAddress" className="mb-4">
                                    <Form.Label>地址</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={address}
                                        onChange={handleInputChange(setAddress)}
                                        style={{ height: "3rem", fontSize: "1.1rem" }}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mb-3" style={{ height: "3rem", fontSize: "1.1rem" }}>
                                    保存修改
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <AlertModal
                show={showAlertModal}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmLabel="确认"
                variant={alertConfig.variant}
                onConfirm={alertConfig.onConfirm}
            />

            <ConfirmModal
                show={showConfirmModal}
                handleClose={confirmConfig.handleClose}
                handleConfirm={confirmConfig.handleConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
            />
        </Container>
    );
}