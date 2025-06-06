import React, {useState} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AlertModal from "./component/Common/AlertModal";
import Books from "./component/Books";
import Home from "./component/Home";
import Login from "./component/Login";
import Logs from "./component/Logs";
import Papers from "./component/Papers";
import Readers from "./component/Readers";
import Register from "./component/Register";
import Statistics from "./component/Statistics";
import AuditLogs from "./component/Audit_Logs";

export default function App(props) {
    const url = "http://localhost:8080"
    const roles = props.roles
    const [roleId, setRoleId] = useState(2) //设置全局角色id，默认为2游客
    const [userId, setUserId] = useState(-1) //设置全局用户id，默认为-1不存在
    const [showAlertModal, setShowAlertModal] = useState(false); // 控制提示框的显示
    const [alertConfig, setAlertConfig] = useState({}); // 控制提示框的内容

    // 请求错误处理
    const handleApiError = () => {
        setAlertConfig({
            variant: "warning",
            title: "服务器未响应",
            message: "服务器未响应，请重试。",
            onConfirm: () => setShowAlertModal(false),
        });
        setShowAlertModal(true);
    };

    // 增删改查请求
    // roles表
    const fetchRole = async (role_id) => {
        try {
            const response = await fetch(`${url}/api/roles/${role_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("获取角色信息失败");
            }
            return await response.json(); // 返回 role
        } catch (error) {
            console.error("Error fetching role ID:", error);
            handleApiError();
            return null;
        }
    };
    const fetchRoleId = async (role_name) => {
        try {
            const response = await fetch(`${url}/api/roles/search?role_name=${role_name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching role ID: ${response.statusText}`);
            }
            return await response.json(); // 返回 role_id
        } catch (error) {
            console.error("fetchRoleId error:", error);
            handleApiError();
            return null;
        }
    };

    // users表
    const getUser = async (user_id) => {
        try {
            const response = await fetch(`${url}/api/users/${user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("用户获取失败");
            }

            return response.json(); // 返回API响应结果
        } catch (error) {
            console.error("Error adding user:", error);
            handleApiError();
            return null;
        }
    };
    const addUser = async (newUser) => {
        try {
            const response = await fetch(`${url}/api/users/createUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error("用户添加失败");
            }

            return true; // 返回API响应结果
        } catch (error) {
            console.error("Error adding user:", error);
            handleApiError();
            return false;
        }
    };
    const updateUser = async (id, updatedUser) => {
        try {
            const response = await fetch(`${url}/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) {
                throw new Error("服务器未响应");
            }
            return true;
        } catch (error) {
            console.error("Error updating user data:", error);
            handleApiError();
            return false;
        }
    };
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${url}/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("删除用户失败");
            }

            return true;

        } catch (error) {
            console.error("Error deleting user:", error);
            handleApiError();
            return false;
        }
    };
    const fetchUser = async (user_name) => {
        try {
            const response = await fetch(`${url}/api/users/getitem?user_name=${user_name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`);
            }
            return await response.json(); // 返回用户信息
        } catch (error) {
            console.error("fetchUser error:", error);
            handleApiError();
            return null;
        }
    };
    const fetchUsers = async () => {
        try {
            const usersResponse = await fetch(`${url}/api/users/getAllUsers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!usersResponse.ok) throw new Error("服务器未响应");
            return await usersResponse.json();
        } catch (error) {
            handleApiError();
            return null;
        }
    };
    const checkUserNameDuplicate = async (user_name) => {
        try {
            const response = await fetch(`${url}/api/users/repeat?user_name=${user_name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`Error checking username duplicate: ${response.statusText}`);
            }
            return await response.json(); // 返回布尔值
        } catch (error) {
            console.error("checkUserNameDuplicate error:", error);
            handleApiError();
            return true;
        }
    };
    const searchUsers = async (user_name, full_name, role_name) => {
        try {
            const response = await fetch(
                `${url}/api/users/search?user_name=${user_name}&full_name=${full_name}&role_name=${role_name}`
                , {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                throw new Error(`Error searching users: ${response.statusText}`);
            }
            return await response.json(); // 返回搜索结果
        } catch (error) {
            console.error("searchUsers error:", error);
            handleApiError();
            return null;
        }
    };

    // books表，待补充
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${url}/api/books`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Error fetching books");
            }
            return await response.json(); // 返回书籍列表
        } catch (error) {
            console.error("fetchBooks error:", error);
            handleApiError();
            return null;
        }
    };

    const fetchBook = async (bookId) => {
        try {
            const response = await fetch(`${url}/api/books/${bookId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Error fetching book");
            }
            return await response.json(); // 返回书籍信息
        } catch (error) {
            console.error("fetchBook error:", error);
            handleApiError();
            return null;
        }
    };

    const addBook = async (newBook) => {
        try {
            const response = await fetch(`${url}/api/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) {
                throw new Error("书籍添加失败");
            }


            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "新增图书", // 操作类型
                target_id: newBook.book_id ,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true; // 返回API响应结果
        } catch (error) {
            console.error("Error adding book:", error);
            handleApiError();
            return false;
        }
    };

    const updateBook = async (id, updatedBook) => {
        try {
            const response = await fetch(`${url}/api/books/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBook),
            });

            if (!response.ok) {
                throw new Error("更新书籍失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "编辑图书", // 操作类型
                target_id: id ,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true; // 返回API响应结果
        } catch (error) {
            console.error("Error updating book:", error);
            handleApiError();
            return false;
        }
    };

    const deleteBook = async (bookId) => {
        try {
            const response = await fetch(`${url}/api/books/${bookId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // 捕获详细错误信息
                console.error("API Error:", errorResponse);  // 输出错误信息
                throw new Error("删除书籍失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "删除图书", // 操作类型
                target_id: bookId ,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true; // 删除成功
        } catch (error) {
            console.error("Error deleting book:", error);
            handleApiError();
            return false;
        }
    };


    const borrowBook = async (bookId) => {
        try {

            // 获取书籍详细信息
            const book = await fetchBook(bookId);
            if (!book) {
                alert("书籍信息不存在");
                return false;
            }

            if (book.quantity <= 0) {
                alert("库存不足，无法借阅！");
                return false;
            }

            // 获取所有借阅记录
            const borrowRecords = await fetchBorrowRecords();
            //console.log("所有借阅记录:", borrowRecords);  // 调试信息

            const thisBorrowRecord = borrowRecords
                .find(record => record.user_id === userId && record.book_id === bookId && record.status === "borrowed"); // 找到状态为 "borrowed" 的记录

            // 如果找到 "borrowed" 状态的借阅记录
            if (thisBorrowRecord) {
                console.log("已借阅该书:", thisBorrowRecord);
                alert("已借阅该书");
                return false;
            }
            else{
                // 更新书籍库存数量
                alert("借阅成功");
                book.quantity -= 1;
                book.borrow_count += 1;
                const successUpdate = await updateBook(book.book_id, book); // 更新书籍库存

                if (!successUpdate) {
                    alert("更新书籍库存失败");
                    return false;
                }
            }


            // 构建借阅记录
            const borrowRecord = {
                record_id: Date.now() & 0xffffffff,
                user_id: userId,  // 用户ID
                book_id: bookId,  // 图书ID
                borrow_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0],  // 当前日期，ISO格式
                return_date: null,  // 归还日期为空
                due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],  // 到期日期，默认是30天后
                status: 'borrowed',  // 借阅状态为 "borrowed"
            };

            // 发起 POST 请求借书
            const response = await fetch(`${url}/api/borrow/borrow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(borrowRecord),  // 请求体
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API Error:", errorResponse);
                throw new Error("借阅书籍失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "借阅图书", // 操作类型
                target_id: bookId,
                action_date: new Date().toISOString(),
                user_id: userId,
            };
            await addAuditLog(logEntry); // 记录操作日志

            return true;
        } catch (error) {
            console.error("Error borrowing book:", error);
            handleApiError();
            return false;
        }
    };

    const returnBook = async (bookId) => {
        try {


            // 获取书籍详细信息
            const book = await fetchBook(bookId);
            if (!book) {
                alert("书籍信息不存在");
                return false;
            }

            // 获取所有借阅记录
            const borrowRecords = await fetchBorrowRecords();
            //console.log("所有借阅记录:", borrowRecords);  // 调试信息

            const thisBorrowRecord = borrowRecords
                .find(record => record.user_id === userId && record.book_id === bookId && record.status === "borrowed"); // 找到状态为 "borrowed" 的记录

            // 如果找到 "borrowed" 状态的借阅记录
            if (thisBorrowRecord) {
                console.log("已借阅该书:", thisBorrowRecord);
                const underChangeId = thisBorrowRecord.record_id;
                console.log("待修改日志id:", underChangeId);

                // 更新书籍库存数量
                book.quantity += 1;
                book.borrow_count -= 1;
                const successUpdate = await updateBook(book.book_id, book); // 更新书籍库存
                if (!successUpdate) {
                    alert("更新书籍库存失败");
                    return false;
                }

            } else {
                // 如果没有找到借阅记录，提醒用户
                alert("没有找到借阅记录或该书未借阅！");
            }

            // 归还书籍操作
            const response = await fetch(`${url}/api/borrow/auto/${thisBorrowRecord.record_id}`, {
                method: "PUT", // 使用 PUT 方法
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("归还书籍失败");
            }
            else{
                alert("归还成功");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "归还图书", // 操作类型
                target_id: bookId,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID
            };
            await addAuditLog(logEntry); // 记录操作日志

            return true;
        } catch (error) {
            console.error("Error returning book:", error);
            //alert("您还没有借阅该书");
            //handleApiError();
            return false;
        }
    };





    // papers表，待补充
    const addPaper = async (newPaper) => {
        try {
            const response = await fetch(`${url}/api/papers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPaper),
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // 捕获详细错误信息
                console.error("API Error:", errorResponse);  // 输出错误信息
                throw new Error("论文添加失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "新增论文", // 操作类型
                target_id: newPaper.paper_id,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true; // 返回API响应结果
        } catch (error) {
            console.error("Error adding paper:", error);
            handleApiError();
            return false;
        }
    };

    const updatePaper = async (id, updatedPaper) => {
        try {
            const response = await fetch(`${url}/api/papers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPaper),
            });

            if (!response.ok) {
                throw new Error("服务器未响应");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "编辑论文", // 操作类型
                target_id: id,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true;
        } catch (error) {
            console.error("Error updating paper data:", error);
            handleApiError();
            return false;
        }
    };

    const deletePaper = async (id) => {
        try {
            const response = await fetch(`${url}/api/papers/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("删除论文失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "删除论文", // 操作类型
                target_id: id,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true;
        } catch (error) {
            console.error("Error deleting paper:", error);
            handleApiError();
            return false;
        }
    };
    //获取单篇论文
    const fetchPaper = async (id) => {
        try {
            const response = await fetch(`${url}/api/papers/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching paper: ${response.statusText}`);
            }

            return await response.json(); // 返回单篇论文信息
        } catch (error) {
            console.error("fetchPaper error:", error);
            handleApiError();
            return null;
        }
    };
    //获取所有论文
    const fetchPapers = async () => {
        try {
            const papersResponse = await fetch(`${url}/api/papers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!papersResponse.ok) throw new Error("服务器未响应");

            return await papersResponse.json();
        } catch (error) {
            handleApiError();
            return null;
        }
    };

    const downloadPaper = async (paperId) => {
        try {

            // // 添加操作日志
            // const logEntry = {
            //     log_id: Date.now(),
            //     action: "下载论文", // 操作类型
            //     target_id: paperId,
            //     action_date: new Date().toISOString(),
            //     user_id: userId,  // 假设 userId 是当前执行操作的用户ID
            //
            // };
            // await addAuditLog(logEntry); // 记录操作日志


            // 构建下载记录
            const downloadRecord = {
                download_id: Date.now() & 0xffffffff,
                paper_id: paperId,
                user_id: userId,  // 用户ID
                download_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),  // 当前日期，ISO格式
            };

            // 发起 POST 请求借书
            const responses = await fetch(`${url}/api/paper_downloads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(downloadRecord),  // 请求体
            });

            if (!responses.ok) {
                const errorResponse = await responses.json();
                console.error("API Error:", errorResponse);
                throw new Error("上传记录失败");
            }


            return true;
        } catch (error) {
            console.error("Error downloading paper:", error);
            //handleApiError();
            return false;
        }
    };


    // borrow_records表
    const addBorrowRecord = async (newBorrowRecord) => {
        try {
            const response = await fetch(`${url}/api/borrow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBorrowRecord), // 将新借阅记录作为请求体
            });

            if (!response.ok) {
                throw new Error("借阅记录添加失败");
            }




            return true; // 返回API响应结果
        } catch (error) {
            console.error("Error adding borrow record:", error);
            handleApiError();
            return false;
        }
    };

    const deleteBorrowRecord = async (id) => {
        try {
            const response = await fetch(`${url}/api/borrow/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("删除借阅记录失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "删除借阅记录", // 操作类型
                target_id: id,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID

            };
            await addAuditLog(logEntry); // 记录操作日志


            return true; // 返回删除成功
        } catch (error) {
            console.error("Error deleting borrow record:", error);
            handleApiError();
            return false;
        }
    };

    const fetchBorrowRecords = async () => {
        try {
            const response = await fetch(`${url}/api/borrow`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // 捕获详细错误信息
                console.error("API Error:", errorResponse);  // 输出错误信息
                throw new Error("无法获取借阅记录");
            }

            return await response.json(); // 返回借阅记录列表
        } catch (error) {
            console.error("Error fetching borrow records:", error);
            handleApiError();
            return null;
        }
    };



    const updateBorrowStatus = async (borrowRecordId) => {
        try {



            // 使用 PUT 请求来更新借阅记录
            const response = await fetch(`${url}/api/borrow/${borrowRecordId}`, {
                method: "PUT", // 使用 PUT 方法更新借阅记录
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "returned", return_date: Date.now().toString()}),  // 假设状态更新为 "returned"
            });

            if (!response.ok) {
                throw new Error("更新借阅状态失败");
            }

            // 添加操作日志
            const logEntry = {
                log_id: Date.now() & 0xffffffff,
                action: "更新借阅状态", // 操作类型
                target_id: borrowRecordId,
                action_date: new Date().toISOString(),
                user_id: userId,  // 假设 userId 是当前执行操作的用户ID
            };
            await addAuditLog(logEntry); // 记录操作日志

            return true;
        } catch (error) {
            console.error("Error updating borrow status:", error);
            handleApiError();
            return false;
        }
    };



    const fetchBorrowStatisticsByDate = async (begin_date, end_date) => {
        try {
            const response = await fetch(
                `${url}/api/borrow/statistic_date?begin_date=${begin_date}&end_date=${end_date}`
                , {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                throw new Error(`Error fetching borrow statistics: ${response.statusText}`);
            }
            return await response.json(); // 返回借阅统计结果
        } catch (error) {
            console.error("fetchBorrowStatisticsByDate error:", error);
            handleApiError();
            return null;
        }
    };
    const fetchBorrowStatisticsByBook = async (begin_date, end_date, title) => {
        try {
            const response = await fetch(
                `${url}/api/borrow/statistic_book?begin_date=${begin_date}&end_date=${end_date}&title=${title}`
                , {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                throw new Error(`Error fetching borrow statistics by book: ${response.statusText}`);
            }
            return await response.json(); // 返回按书籍统计的借阅结果
        } catch (error) {
            console.error("fetchBorrowStatisticsByBook error:", error);
            handleApiError();
            return null;
        }
    };

    // paper_downloads表
    const fetchPaperDownloadsByDate = async (begin_date, end_date) => {
        try {
            const response = await fetch(
                `${url}/api/paper_downloads/statistic_date?begin_date=${begin_date}&end_date=${end_date}`
                , {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                throw new Error(`Error fetching paper download statistics: ${response.statusText}`);
            }
            return await response.json(); // 返回论文下载统计结果
        } catch (error) {
            console.error("fetchPaperDownloadsByDate error:", error);
            handleApiError();
            return null;
        }
    };
    const fetchPaperStatisticsByTitle = async (begin_date, end_date, title) => {
        try {
            const response = await fetch(
                `${url}/api/papers/statistic_paper?begin_date=${begin_date}&end_date=${end_date}&title=${title}`
                , {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if (!response.ok) {
                throw new Error(`Error fetching paper statistics by title: ${response.statusText}`);
            }
            return await response.json(); // 返回按标题统计的论文结果
        } catch (error) {
            console.error("fetchPaperStatisticsByTitle error:", error);
            handleApiError();
            return null;
        }
    };

    // audit_logs表
    const addAuditLog = async (newLog) => {
        try {
            const response = await fetch(`${url}/api/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newLog),
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // 捕获详细错误信息
                console.error("API Error:", errorResponse);  // 输出错误信息
                throw new Error("添加日志失败");
            }

        } catch (error) {
            console.error("Error logging audit entry:", error);
        }
    };

    const deleteAuditLog = async (id) => {
        try {
            const response = await fetch(`${url}/api/logs/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },

            });

            if (!response.ok) {
                throw new Error("删除日志失败");
            }

        return true;
        } catch (error) {
            console.error("Error logging audit entry:", error);
            handleApiError();
            return false;
        }
    };

    const fetchAuditLog = async () => {
        try {
            const response = await fetch(`${url}/api/logs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("无法获取借阅记录");
            }

            return await response.json(); // 返回借阅记录列表
        } catch (error) {
            console.error("Error fetching audit_log:", error);
            handleApiError();
            return null;
        }
    };

    //四个搜索函数

    //借阅日志搜索
    const searchBorrowRecords = async (searchType, searchQuery) => {
        try {
            // 构建查询参数
            const params = new URLSearchParams();
            if (searchType) params.append("searchType", searchType);
            if (searchQuery) params.append("searchQuery", searchQuery);

            // 发起 GET 请求，带上查询参数
            const response = await fetch(`${url}/api/borrow/borrow?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // 捕获详细错误信息
                console.error("API Error:", errorResponse);  // 输出错误信息
                throw new Error("无法获取借阅记录");
            }

            return await response.json(); // 返回借阅记录列表
        } catch (error) {
            console.error("Error fetching borrow records:", error);
            handleApiError();
            return null;
        }
    };

    //操作日志搜索
    //借阅日志搜索
    const searchAuditLogs = async (searchType, searchQuery) => {
        try {
            // 构建查询参数
            const params = new URLSearchParams();
            if (searchType) params.append("searchType", searchType);
            if (searchQuery) params.append("searchQuery", searchQuery);

            // 发起 GET 请求，带上查询参数
            const response = await fetch(`${url}/api/logs/logs?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // 捕获详细错误信息
                console.error("API Error:", errorResponse);  // 输出错误信息
                throw new Error("无法获取操作记录");
            }

            return await response.json(); // 返回借阅记录列表
        } catch (error) {
            console.error("Error fetching auditlogs:", error);
            handleApiError();
            return null;
        }
    };

    //图书搜索
    // 在 app.js 中定义 searchBooks 函数
    const searchBooks = async (userRole, searchType, searchQuery) => {
        try {
            // 构建查询参数
            const params = new URLSearchParams();
            if (userRole)params.append("userRole", userRole);
            if (searchType) params.append("searchType", searchType);
            if (searchQuery) params.append("searchQuery", searchQuery);

            const response = await fetch(`${url}/api/books/books?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },

            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API Error:", errorResponse);
                throw new Error("搜索书籍失败");
            }

            // 返回搜索结果
            return await response.json();
        } catch (error) {
            console.error("Error searching books:", error);
            handleApiError();  // 错误处理
            return null;
        }
    };

    //论文搜索
    // 在 app.js 中定义 searchBooks 函数
    const searchPapers = async (userRole, searchType, searchQuery) => {
        try {
            // 构建查询参数
            const params = new URLSearchParams();
            if (userRole)params.append("userRole", userRole);
            if (searchType) params.append("searchType", searchType);
            if (searchQuery) params.append("searchQuery", searchQuery);

            const response = await fetch(`${url}/api/papers/papers?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },

            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("API Error:", errorResponse);
                throw new Error("搜索书籍失败");
            }

            // 返回搜索结果
            return await response.json();
        } catch (error) {
            console.error("Error searching books:", error);
            handleApiError();  // 错误处理
            return null;
        }
    };




    return (
        <div
            style={{
                border: "0px solid #ddd", // 外围边框样式
                borderRadius: "20px", // 边框圆角
                margin: "20px", // 页面内边距
                height: "calc(100vh - 40px)", // 减去上下边距高度
                overflow: "hidden", // 防止内容溢出
            }}
        >
            <Router>
                <Routes>
                    {/* 根路径重定向到 /login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route path="/books" element={<Books
                        roles={roles}
                        roleId={roleId}
                        userId={userId}

                        fetchRole={fetchRole}

                        addBook={addBook}
                        deleteBook={deleteBook}
                        updateBook={updateBook}
                        fetchBook={fetchBook}
                        fetchBooks={fetchBooks}
                        borrowBook={borrowBook}
                        returnBook={returnBook}

                        addBorrowRecord={addBorrowRecord}
                        updateBorrowStatus={updateBorrowStatus}
                        addAuditLog={addAuditLog}
                        fetchBorrowRecords={fetchBorrowRecords}
                        searchBooks={searchBooks}

                    />} />
                    <Route path="/home" element={<Home
                        roleId={roleId}
                        userId={userId}
                        setRoleId={setRoleId}
                        setUserId={setUserId}
                        getUser={getUser}
                        fetchRoleId={fetchRoleId}
                        fetchRole={fetchRole}
                        fetchUser={fetchUser}
                    />}/>
                    <Route path="/login" element={<Login
                        roleId={roleId}
                        userId={userId}
                        setRoleId={setRoleId}
                        setUserId={setUserId}
                        fetchUser={fetchUser}
                        fetchRoleId={fetchRoleId}
                        fetchRole={fetchRole}
                        addAuditLog={addAuditLog}
                    />}/>
                    <Route path="/logs" element={<Logs
                        roles={roles}
                        roleId={roleId}
                        userId={userId}

                        fetchRole={fetchRole}
                        addBorrowRecord={addBorrowRecord}
                        deleteBorrowRecord={deleteBorrowRecord}
                        fetchBorrowRecords={fetchBorrowRecords}
                        updateBorrowStatus={updateBorrowStatus}

                        searchBorrowRecords={searchBorrowRecords}
                    />} />

                    <Route path="/auditlogs" element={<AuditLogs
                        roles={roles}
                        roleId={roleId}
                        userId={userId}

                        fetchRole={fetchRole}
                        addAuditLog={addAuditLog}
                        deleteAuditLog={deleteAuditLog}
                        fetchAuditLog={fetchAuditLog}
                        searchAuditLogs={searchAuditLogs}
                    />} />

                    <Route path="/papers" element={<Papers
                        roles={roles}
                        roleId={roleId}
                        userId={userId}

                        fetchRole={fetchRole}
                        addPaper={addPaper}
                        deletePaper={deletePaper}
                        updatePaper={updatePaper}
                        fetchPaper={fetchPaper}
                        fetchPapers={fetchPapers}
                        downloadPaper={downloadPaper}

                        addAuditLog={addAuditLog}
                        searchPapers={searchPapers}

                    />} />
                    <Route path="/readers" element={<Readers
                        roles={roles}
                        roleId={roleId}
                        userId={userId}
                        getUser={getUser}
                        fetchUser={fetchUser}
                        fetchUsers={fetchUsers}
                        fetchRole={fetchRole}
                        addUser={addUser}
                        addAuditLog={addAuditLog}
                        searchUsers={searchUsers}
                        checkUserNameDuplicate={checkUserNameDuplicate}
                        updateUser={updateUser}
                        deleteUser={deleteUser}
                    />} />
                    <Route path="/register" element={<Register
                        fetchRoleId={fetchRoleId}
                        checkUserNameDuplicate={checkUserNameDuplicate}
                        addAuditLog={addAuditLog}
                        addUser={addUser}
                    />}/>
                    <Route path="/statistics" element={<Statistics
                        roleId={roleId}
                        fetchRole={fetchRole}
                        fetchPaperDownloadsByDate={fetchPaperDownloadsByDate}
                        fetchBorrowStatisticsByDate={fetchBorrowStatisticsByDate}
                        fetchPaperStatisticsByTitle={fetchPaperStatisticsByTitle}
                        fetchBorrowStatisticsByBook={fetchBorrowStatisticsByBook}
                    />} />
                </Routes>
            </Router>

            <AlertModal
                show={showAlertModal}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmLabel="确认"
                variant={alertConfig.variant}
                onConfirm={alertConfig.onConfirm}
            />
        </div>
    );
}
