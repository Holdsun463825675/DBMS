import React, { useState,useEffect } from "react";
import AdminPaperList from "../../Common/PapersControl/AdminPaperList";
import PaperForm from "../../Common/PapersControl/PaperForm";
import SearchBar from "../../Common/PapersControl/SearchBar";
import { Button } from "react-bootstrap";
import AlertModal from "../../Common/AlertModalCon"; // 可选，用于删除确认提示

function AdminPapers() {
    const [papers, setPapers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPaper, setSelectedPaper] = useState(null); // 用于编辑
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null); // 记录要删除的论文ID
    const [searchType, setSearchType] = useState("title");

    // 加载默认论文数据,用于测试功能
    useEffect(() => {
        const defaultPapers = [
            {
                paper_id: "1",
                title: "Deep Learning in Neural Networks",
                author: "Yann LeCun",
                date: "2020-01-15",
                is_public: true,
                uploaded_by: "Alice",
                uploaded_by_id: "user_1",
                download_count: 12,
                download_href:"https://www.baidu.com"
            },
            {
                paper_id: "2",
                title: "Attention Is All You Need",
                author: "Ashish Vaswani",
                date: "2017-06-12",
                is_public: false,
                uploaded_by: "Bob",
                uploaded_by_id: "user_2",
                download_count: 8,
                download_href:"https://www.baidu.com"
            },
            {
                paper_id: "3",
                title: "A Survey on Federated Learning",
                author: "Peter Kairouz",
                date: "2021-05-03",
                is_public: true,
                uploaded_by: "Charlie",
                uploaded_by_id: "user_3",
                download_count: 20,
                download_href:"https://www.baidu.com"
            },
        ];
        setPapers(defaultPapers);
    }, []); // 空依赖数组，确保只在首次加载时执行


    // 添加/编辑论文
    const handleSavePaper = (paper) => {
        if (paper.paper_id) {
            // 编辑现有论文
            setPapers(papers.map((p) => (p.paper_id === paper.paper_id ? paper : p)));
        } else {
            const newPaper={...paper, paper_id: Date.now() & 0xffffffff
                ,is_public:false
                ,download_count:0
                //,uploaded_by:""
                //,uploaded_by_id:""
            }
            // 添加新论文
            setPapers([...papers,newPaper]);
        }
        setShowForm(false);
        setSelectedPaper(null);
    };

    //处理下载次数
    const handleDownload = (id) => {
        setPapers((prevPapers) =>
            prevPapers.map((paper) =>
                paper.paper_id === id
                    ? { ...paper, download_count: paper.download_count + 1 }
                    : paper
            )
        );
    };




    // 删除论文
    const handleDeletePaper = () => {
        setPapers(papers.filter((paper) => paper.paper_id !== deleteId)); // 根据 deleteId 删除论文
        setShowModal(false); // 关闭删除确认模态框
        setDeleteId(null); // 清除待删除的ID
    };

    //搜索论文
    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
    };

    // 打开表单用于添加或编辑论文
    const handleOpenForm = (paper = null) => {
        setSelectedPaper(paper);
        setShowForm(true);
    };

    // 打开删除确认模态框
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    //筛选搜索结果
    const filteredPapers = papers.filter((paper) => {
        if (searchType === "title") {
            return paper.title.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === "author") {
            return paper.author.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === "date") {
            return paper.date.includes(searchQuery);
        }
        return false;
    });

    return (
        <div>
            <h1>论文管理</h1>
            <h2>欢迎您，管理员</h2>
            <SearchBar
                onSearch={handleSearch}
                onSearchTypeChange={handleSearchTypeChange}
            />
            <Button variant="primary" onClick={() => handleOpenForm()}>
                添加论文
            </Button>
            <AdminPaperList papers={filteredPapers}
                           onEdit={handleOpenForm}
                           onDelete={confirmDelete}
                           // onDownload={handleDownload} // 传递下载处理函数
                            onDownload={handleDownload}
            />

            {showForm && (
                <PaperForm
                    paper={selectedPaper}
                     onSave={handleSavePaper}
                    //onSave={onSave}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <AlertModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="删除确认"
                message="确定要删除这篇论文吗？"
                confirmLabel="确认删除"
                variant="warning"
                 onConfirm={handleDeletePaper} // 当用户点击确认删除时调用 handleDeletePaper
                //onConfirm={onDelete}
            />
        </div>
    );
}

export default AdminPapers;