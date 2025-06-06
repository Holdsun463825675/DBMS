import React, {useEffect, useState} from "react";
import AdminHome from "./AdminHome";
import UserHome from "./UserHome";
import GuestHome from "./GuestHome";
import AlertModal from "../Common/AlertModal";

export default function Home(props) {
    const [userRole, setUserRole] = React.useState("guest");
    const roleId = props.roleId

    // 给定一个user_id，查询其full_name等相关信息，api为${props.url}/api/users/${user_id}，取回应的user.full_name
    const fetchUserFullName = async (user_id) => {
        try {
            const data = await props.getUser(user_id);
            if (data === null) {
                throw new Error("获取用户信息失败");
            }
            return data !== [] ? data.full_name : ""; // 返回用户的 full_name
        } catch (error) {
            console.error("Error fetching role:", error);
            return null;
        }
    };


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
            {userRole === "admin" && <AdminHome
                userId={props.userId}
                setRoleId={props.setRoleId}
                setUserId={props.setUserId}
                fetchUserFullName={fetchUserFullName}
                fetchRoleId={props.fetchRoleId}
            />}
            {userRole === "user" && <UserHome
                userId={props.userId}
                setRoleId={props.setRoleId}
                setUserId={props.setUserId}
                fetchUserFullName={fetchUserFullName}
                fetchRoleId={props.fetchRoleId}
            />}
            {userRole === "guest" && <GuestHome
                userId={props.userId}
                setRoleId={props.setRoleId}
                setUserId={props.setUserId}
                fetchRoleId={props.fetchRoleId}
            />}

        </>
    );
}
