import React from "react";
import { Modal, Button } from "react-bootstrap";

const AlertModal = ({
                        show,
                        handleClose,
                        title,
                        message,
                        confirmLabel = "确认",
                        variant = "info", // "info" for regular, "warning" for alert
                        onConfirm,
                    }) => {
    const variantTitles = {
        info: "提示",
        warning: "警告",
    };

    const variantColors = {
        info: "primary",
        warning: "danger",
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title || variantTitles[variant]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant={variantColors[variant]} onClick={handleClose}>
                    取消
                </Button>

                <Button variant={variantColors[variant]} onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlertModal;
