import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WelcomeText() {
    return (
        <Container fluid style={{ height: "100vh" }}>
            <Row className="h-100">
                <Col className="d-flex flex-column align-items-center justify-content-center">
                    {/* 中文句子及作者 */}
                    <div className="text-center mb-5">
                        <h1 style={{ fontSize: "2.5rem" }}>书籍是人类进步的阶梯。</h1>
                        <p style={{ fontSize: "2.5rem", textAlign: "right", marginTop: "-10px" }}>—— 高尔基</p>
                    </div>

                    {/* 英文句子及作者 */}
                    <div className="text-center">
                        <h1 style={{ fontSize: "2.5rem" }}>Books are the ladder of human progress.</h1>
                        <p style={{ fontSize: "2.5rem", textAlign: "right", marginTop: "-10px" }}>—— Maxim Gorky</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
