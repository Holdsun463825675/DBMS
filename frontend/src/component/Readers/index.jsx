import React, { useState, useEffect } from "react";
import AdminReaders from "./AdminReaders";
import UserReaders from "./UserReaders";
import AlertModal from "../Common/AlertModal";

export default function Readers(props) {
    const [userRole, setUserRole] = useState("guest"); // 默认角色为 "guest"
    const roleId = props.roleId; // 当前用户的角色 ID

    // 根据 roleId 从服务器获取角色名称
    const fetchUserRole = async () => {
        try {
            const data = await props.fetchRole(roleId);
            if (data === null) {
                throw new Error("服务器响应失败");
            }
            setUserRole(data !== [] ? data.role_name : "guest"); // 设置返回的角色名，若无则默认为 "guest"
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    // 使用 useEffect 调用异步函数
    useEffect(() => {
        const fetchAndSetRole = async () => {
            if (!(roleId instanceof Promise)) {
                await fetchUserRole(); // 确保异步调用完成后设置状态
            }
        };
        fetchAndSetRole(); // 调用异步操作
    }, [roleId]);

    return (
        <>
            {/* 根据 userRole 渲染不同的组件 */}
            {userRole === "admin" && (
                <AdminReaders
                    roles={props.roles}
                    roleId={roleId}
                    userId={props.userId}
                    addAuditLog={props.addAuditLog}
                    addUser={props.addUser}
                    updateUser={props.updateUser}
                    deleteUser={props.deleteUser}
                    getUser={props.getUser}
                    fetchUser={props.fetchUser}
                    fetchUsers={props.fetchUsers}
                    searchUsers={props.searchUsers}
                    checkUserNameDuplicate={props.checkUserNameDuplicate}
                />
            )}
            {userRole === "user" && (
                <UserReaders
                    roleId={roleId}
                    userId={props.userId}
                    getUser={props.getUser}
                    fetchUser={props.fetchUser}
                    addAuditLog={props.addAuditLog}
                    updateUser={props.updateUser}
                />
            )}
            {userRole === "guest" && <h1>对不起，您的访问权限不足！</h1>}

        </>
    );
}
