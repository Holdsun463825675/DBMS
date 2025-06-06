import React, {useState} from "react";
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import "./index.css";
import {useNavigate} from "react-router-dom";
import ConfirmModal from "../../Common/ConfirmModal"; // 引入专用的 GuestHome 样式文件

export default function GuestHome(props) {
    const navigate = useNavigate();
    // 控制确认窗口的显示状态
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const options =
        [
            {title: "公开论文", href: "/papers"},
            {title: "公开图书", href: "/books"},
        ]

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
        <Container fluid className="guest-home-container">
            {/* 右上角退出登录按钮 */}
            <div className="logout-button">
                <Button variant="danger" onClick={handleLogout}>退出登录</Button>
            </div>

            <h2 className="guest-welcome-text">欢迎游客，您可以浏览以下公开资源：</h2>
            <Row className="d-flex justify-content-center guest-option-row">
                {options.map(({title, href}, idx) => (
                    <Col key={idx} xs={10} sm={6} md={4} className="mb-4">
                        <Card className="guest-option-card text-center"
                              onClick={() => navigate(href)}
                        >
                            <Card.Img
                                variant="top"
                                src={`./icon/icon${idx}.png`}
                                className="guest-card-image"
                            />
                            <Card.Body>
                                <Card.Text className="guest-card-text">浏览{title}</Card.Text>
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

