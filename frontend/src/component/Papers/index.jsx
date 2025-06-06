import React, {useEffect} from 'react';

import PapersManager from "./PapersManager";


export default  function Papers(props) {

    const roles=props.roles
    const [userRole, setUserRole] = React.useState("guest");
    const roleId=props.roleId


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
            <PapersManager
                roles={roles}
                users={props.users}
                userRole={userRole}
                userId={props.userId}

                addPaper={props.addPaper}
                deletePaper={props.deletePaper}
                updatePaper={props.updatePaper}
                fetchPaper={props.fetchPaper}
                fetchPapers={props.fetchPapers}
                downloadPaper={props.downloadPaper}
                searchPapers={props.searchPapers}

                addAuditLog={props.addAuditLog}
            />

        </>
    )



}

