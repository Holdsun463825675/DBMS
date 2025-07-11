import React, {useEffect, useState} from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./index.css";
import {useNavigate} from "react-router-dom";
import ConfirmModal from "../../Common/ConfirmModal";

export default function AdminHome(props) {
    const navigate = useNavigate();
    // 控制确认窗口的显示状态
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userName, setUserName] = useState("");
    const options = [
        { title: "管理论文", href: "/papers" },
        { title: "管理图书", href: "/books" },
        { title: "管理读者", href: "/readers" },
        { title: "日志查询", href: "/logs" },
        { title: "信息统计", href: "/statistics" },
    ];
    const userId = props.userId;

    // 在组件挂载时发起请求
    useEffect(() => {
        const fetchAndSetUserName = async () => {
            try {
                const name = await props.fetchUserFullName(userId); // 等待数据获取完成
                setUserName(name); // 设置用户名
            } catch (error) {
                console.error("Error fetching user full name:", error);
                setUserName("Unknown User"); // 设置默认值以应对失败情况
            }
        };

        if (!(userId instanceof Promise)) { // 确保 userId 有效
            fetchAndSetUserName();
        }
    }, [userId]);

    const handleLogout = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmLogout = async () => {
        try {
            const roleId = await props.fetchRoleId("guest"); // 获取 guest 对应的 roleId
            if (roleId !== null) {
                // 如果成功获取到 roleId，才执行以下操作
                props.setRoleId(roleId);
                props.setUserId("-1"); // 设置用户 ID 为 -1
                setShowConfirmModal(false);
                navigate("/login"); // 跳转到登录页面
            } else {
                console.warn("无法获取角色 ID，取消退出操作。");
                // 可以弹出一个提示框或者执行其他逻辑
            }
        } catch (error) {
            console.error("handleConfirmLogout error:", error);
        }
    };

    const handleCloseModal = () => {
        setShowConfirmModal(false);
    };

    return (
        <Container fluid className="admin-home-container">
            {/* 右上角退出登录按钮 */}
            <div className="logout-button">
                <Button variant="danger" onClick={handleLogout}>退出登录</Button>
            </div>

            <h2 className="welcome-text">欢迎回来，管理员 {userName}，您想要做点什么呢？</h2>
            <Row className="d-flex justify-content-center admin-option-row">
                {options.map(({ title, href }, idx) => (
                    <Col key={idx} xs={12} sm={6} md={4} lg={2} className="mb-4">
                        <Card className="admin-option-card text-center" onClick={() => navigate(href)}>
                            <Card.Img
                                variant="top"
                                src={`./icon/icon${idx}.png`}
                                className="card-image"
                            />
                            <Card.Body className="card-body">
                                <Card.Text className="card-text">{title}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 确认退出登录的弹窗 */}
            <ConfirmModal
                show={showConfirmModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmLogout}
                title="确认退出"
                message="您确定要退出登录吗？"
            />
        </Container>
    );
}
