import React, { useState, useEffect } from "react";

import AdminPaperList from "../../Common/PapersControl/AdminPaperList";
import UserPaperList from "../../Common/PapersControl/UserPaperList";
import GuestPaperList from "../../Common/PapersControl/GuestPaperList";

import SearchBar from "../../Common/PapersControl/SearchBar";
import {Button, Form, FormControl} from "react-bootstrap";
import PaperForm from "../../Common/PapersControl/PaperForm";
import AlertModal from "../../Common/AlertModalCon";
import { useNavigate } from "react-router-dom";
import './index.css';

export default function PapersManager(props) {

    const [papers, setPapers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPaper, setSelectedPaper] = useState(null); // 用于编辑
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null); // 记录要删除的论文ID
    const [searchType, setSearchType] = useState("title");

    const UserRole=props.userRole;
    const [alertMessage, setAlertMessage] = useState("");


    useEffect(() => {
        const loadPapers = async () => {
            const papersData = await props.fetchPapers();
            if (papersData) {
                // 如果 userRole 是 guest，过滤只显示 public 为 true 的论文
                if (UserRole === "guest") {
                    setPapers(papersData.filter(paper => paper.public === true));
                } else {
                    setPapers(papersData);
                }
            } else {
                setAlertMessage("加载论文数据失败");
            }
        };

        loadPapers();
    }, [UserRole]); // 添加 userRole 为依赖，确保 role 变化时重新加载数据



    // 处理添加论文
    const handleAddPaper = async (newPaper) => {
        console.log("传入的论文数据：", newPaper);

        const paperWithId = {
            ...newPaper,
            paper_id: Date.now() & 0xffffffff,  // 使用时间戳作为临时的唯一 ID
        };
        console.log("带ID的论文数据：", paperWithId);

        const success = await props.addPaper(paperWithId);

        if (success) {
            const updatedPapers = await props.fetchPapers();
            setPapers(updatedPapers);
            setShowForm(false);  // 关闭表单
        } else {
            setAlertMessage("添加论文失败");
        }
    };

    // 处理编辑论文
    const handleEditPaper = async (updatedPaper) => {
        console.log("传入的论文数据：", updatedPaper);
        console.log("待编辑的论文id：", updatedPaper.paper_id);

        const success = await props.updatePaper(updatedPaper.paper_id, updatedPaper);
        if (success) {
            const updatedPapers = await props.fetchPapers();
            setPapers(updatedPapers);
            setShowForm(false);


        } else {
            setAlertMessage("更新论文失败");
        }
    };

    // 处理删除论文
    const handleDeletePaper = async () => {
        console.log("待删除的论文id：", deleteId);

        const success = await props.deletePaper(deleteId);
        if (success) {
            const updatedPapers = await props.fetchPapers();
            setPapers(updatedPapers);
            setShowModal(false);  // 关闭删除确认框
            setDeleteId(null);  // 清除待删除的ID
        } else {
            setAlertMessage("删除论文失败");
        }
    };

    // 处理下载论文
    const handleDownloadPaper = async (paperId) => {
        console.log("待下载的论文id：", paperId);

        const paper= await props.fetchPaper(paperId);

        console.log("取到的论文数据：", paper);

        paper.download_count+=1;

        const successUpdate = await props.updatePaper(paper.paper_id, paper); // 更新书籍库存

        if (successUpdate) {
            const updatedPapers = await props.fetchPapers();
            setPapers(updatedPapers);
            setShowForm(false);


        } else {
            setAlertMessage("更新论文失败");
        }

        // 添加操作日志
        const logEntry = {
            log_id: Date.now() & 0xffffffff,
            action: "下载论文", // 操作类型
            target_id: paperId,
            action_date: new Date().toISOString(),
            user_id: props.userId,  // 假设 userId 是当前执行操作的用户ID

        };
        await props.addAuditLog(logEntry); // 记录操作日志

        const success = await props.downloadPaper(paperId);
        if (success) {
            setAlertMessage("论文下载成功");
        } else {
            setAlertMessage("论文下载失败");
        }
    };


    // 搜索论文
    const handleSearchPapers = async (searchType,searchQuery) => {
        console.log("搜索类型", searchType);
        console.log("输入内容", searchQuery);
        try {
            if (!searchQuery) {
                // 如果 searchQuery 为空，重新加载所有书籍
                const papers = await props.fetchPapers();
                setPapers(papers);
            } else {
                // 否则进行搜索
                const papers = await props.searchPapers(UserRole, searchType, searchQuery);
                if (!papers || papers.length === 0) {
                    alert("没有找到符合条件的书籍");
                } else {
                    setPapers(papers);
                }
            }
        } catch (error) {
            console.error("Error searching books:", error);
        }
    };





    const handleSearchTypeChange = (type) => {
        setSearchType(type);
    };

    const handleSearchQueryChange = (newQuery) => {
        setSearchQuery(newQuery);
    };

    // 打开表单用于添加或编辑论文
    const handleOpenForm = (paper = null) => {
        console.log("选中的论文:", paper);  // 调试输出
        setSelectedPaper(paper);
        setShowForm(true);
    };

    // 打开删除确认模态框
    const confirmDelete = (id) => {
        setDeleteId(id);
        console.log("选中的论文id:", id)
        setShowModal(true);
    };

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/home");
    };


    let PaperListComponent;

    if (UserRole === "admin") {
        PaperListComponent = <AdminPaperList papers={papers} onEdit={handleOpenForm} onDelete={confirmDelete} onDownload={handleDownloadPaper} />;
    } else if (UserRole === "user") {
        PaperListComponent = <UserPaperList papers={papers} onEdit={handleOpenForm} onDelete={confirmDelete} onDownload={handleDownloadPaper} />;
    } else if (UserRole === "guest") {
        PaperListComponent = <GuestPaperList papers={papers} onEdit={handleOpenForm} onDelete={confirmDelete} onDownload={handleDownloadPaper} />;
    }

    let ButtonComponent;

    if (UserRole === "admin") {
        ButtonComponent = <Button variant="primary" onClick={() => handleOpenForm()}>
            添加论文
        </Button>
    }
    else if (UserRole === "user") {
        ButtonComponent = <Button variant="primary" onClick={() => handleOpenForm()}>
            添加论文
        </Button>
    }

    return (
        <div className="paper-manager-container">
            <div>
                <Button onClick={handleBack} variant="link" style={{fontSize: "2rem"}}>
                    返回
                </Button>
            </div>
            <div className="paper-manager-header">
                <h1>论文管理系统</h1>
                <h2>欢迎您，{UserRole === "admin" ? "管理员" : UserRole === "user" ? "用户" : "游客"}</h2>
            </div>

            {/*<div className="search-bar">*/}
            {/*    <SearchBar*/}
            {/*        searchQuery={searchQuery}  // 传递查询内容*/}
            {/*        searchType={searchType}  // 传递查询类型*/}
            {/*        onSearch={handleSearch}  // 传递查询函数*/}
            {/*        onSearchTypeChange={handleSearchTypeChange}  // 传递查询类型变化函数*/}
            {/*        onSearchQueryChange={handleSearchQueryChange}  // 传递查询内容变化函数*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="search-form-container">
                <Form.Group>
                    <Form.Label>搜索类型</Form.Label>
                    <Form.Control
                        as="select"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="title">按书名查询</option>
                        <option value="author">按作者查询</option>
                        <option value="date">按日期查询</option>

                    </Form.Control>
                </Form.Group>

                <FormControl
                    type="text"
                    placeholder="请输入查询内容"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                    variant="primary"
                    onClick={() => handleSearchPapers(searchType, searchQuery)}  // 调用 handleSearch 函数
                >
                    搜索
                </Button>
            </div>

            <div className="button-container">{ButtonComponent}</div>

            <div className="paper-list">{PaperListComponent}</div>

            {showForm && (
                <div className="paper-form-modal">
                    <PaperForm
                        paper={selectedPaper}
                        onSave={selectedPaper ? handleEditPaper : handleAddPaper}
                        onCancel={() => setShowForm(false)}

                    />
                </div>
            )}

            <AlertModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="删除确认"
                message="确定要删除这篇论文吗？"
                confirmLabel="确认删除"
                variant="warning"
                onConfirm={handleDeletePaper}
            />
        </div>
    );
}


