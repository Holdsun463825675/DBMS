import React from "react";

export default function Background() {
    return (
        <>
            <img
                alt=""
                src="./img/login.jpg"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50vw",
                    height: "100vh",
                    zIndex: -1, // 将图片置于最底层
                    opacity: 0.3 // 设置不透明度
                }}
            />
        </>
    );
}
