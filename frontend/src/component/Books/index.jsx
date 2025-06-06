import React, {useEffect} from 'react';

import BooksManager from "./BooksManager";

export default  function Books(props) {

    const roles=props.roles
    const [userRole, setUserRole] = React.useState("guest");
    const roleId = props.roleId;


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
            <BooksManager
                users={props.users}
                roles={roles}
                userRole={userRole}
                userId={props.userId}

                addBook={props.addBook}
                deleteBook={props.deleteBook}
                updateBook={props.updateBook}
                fetchBooks={props.fetchBooks}
                fetchBook={props.fetchBook}
                borrowBook={props.borrowBook}
                returnBook={props.returnBook}
                searchBooks={props.searchBooks}
                fetchBorrowRecords={props.fetchBorrowRecords}
                updateBorrowStatus={props.updateBorrowStatus}
            />

        </>
    )



}