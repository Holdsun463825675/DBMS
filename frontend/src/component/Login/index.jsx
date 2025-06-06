import "bootstrap/dist/css/bootstrap-grid.min.css";
import Background from "./Background";
import WelcomeText from "./WelcomeText";
import InputFrame from "./InputFrame";
import { Col, Container, Row } from "react-bootstrap";

export default function Login(props) {
    return (
        <Container fluid style={{ height: "100vh" }}>
            <Row className="h-100">
                {/* 左侧50%，放置 WelcomeText 组件和 Background */}
                <Col xs={6} className="position-relative d-flex align-items-center justify-content-center overflow-hidden">
                    <Background />
                    <WelcomeText />
                </Col>

                {/* 右侧50%，放置 InputFrame 组件和 Background */}
                <Col xs={6} className="position-relative d-flex align-items-center justify-content-center overflow-hidden">
                    <InputFrame
                        roleId={props.roleId}
                        userId={props.userId}
                        setRoleId={props.setRoleId}
                        setUserId={props.setUserId}
                        addAuditLog={props.addAuditLog}
                        fetchUser={props.fetchUser}
                        fetchRoleId={props.fetchRoleId}
                        fetchRole={props.fetchRole}
                    />
                </Col>
            </Row>
        </Container>
    );
}
