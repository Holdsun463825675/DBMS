import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Dropdown, ButtonGroup, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { subDays } from "date-fns";
import { Line, Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import "chart.js/auto";
import AlertModal from "../Common/AlertModal";

export default function Statistics(props) {
    const [activeType, setActiveType] = useState("论文统计");
    const [activeCategory, setActiveCategory] = useState("总数统计");
    const [dateRange, setDateRange] = useState("近7天");
    const [userRole, setUserRole] = useState("guest");

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [showAlertModal, setShowAlertModal] = useState(false); // 控制提示框的显示
    const [alertConfig, setAlertConfig] = useState({}); // 控制提示框的内容
    const navigate = useNavigate();

    const [statistics, setStatistics] = useState({
        bookborrows_date: [],
        bookborrows_books: [],
        paperdownloads_date: [],
        paperdownloads_papers: []
    });
    const [filteredDownloads, setFilteredDownloads] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    const roleId = props.roleId;

    const getDateRange = () => {
        const now = new Date();
        switch (dateRange) {
            case "近7天":
                return { startDate: subDays(now, 7), endDate: now };
            case "近30天":
                return { startDate: subDays(now, 30), endDate: now };
            case "近1年":
                return { startDate: subDays(now, 365), endDate: now };
            default:
                return { startDate: subDays(now, 7), endDate: now };
        }
    };

    // 动态请求数据
    const fetchStatistics = async () => {
        try {
            const { startDate, endDate } = getDateRange();
            const beginDate = startDate.toISOString().split("T")[0];
            const endDateStr = endDate.toISOString().split("T")[0];
            let fetchFunct;

            // 根据选项构建请求 URL
            if (activeType === "论文统计" && activeCategory === "总数统计") {
                fetchFunct = props.fetchPaperDownloadsByDate(beginDate, endDateStr);
            } else if (activeType === "论文统计" && activeCategory === "各项统计") {
                fetchFunct = props.fetchPaperStatisticsByTitle(beginDate, endDateStr, searchTerm);
            } else if (activeType === "图书统计" && activeCategory === "总数统计") {
                fetchFunct = props.fetchBorrowStatisticsByDate(beginDate, endDateStr);
            } else if (activeType === "图书统计" && activeCategory === "各项统计") {
                fetchFunct = props.fetchBorrowStatisticsByBook(beginDate, endDateStr, searchTerm);
            }

            const data = await fetchFunct;
            if (data === null) {
                throw new Error("请求失败");
            }

            // 处理 _date 字段：去掉时间并按日期合并
            const processDateData = (data) => {
                const pdata = data.reduce((acc, { date, count }) => {
                    // 提取日期部分（去掉时间）
                    const dateWithoutTime = date.split(' ')[0]; // 或使用 _date.slice(0, 10)

                    // 如果这个日期已经存在，则累加 count，否则添加新项
                    if (acc[dateWithoutTime]) {
                        acc[dateWithoutTime] += count;
                    } else {
                        acc[dateWithoutTime] = count;
                    }

                    return acc;
                }, {});
                return Object.keys(pdata).map(date => ({
                    date,
                    count: pdata[date]
                }));
            };


            // 更新统计数据
            if (activeType === "论文统计" && activeCategory === "总数统计") {
                setStatistics((prev) => ({ ...prev, paperdownloads_date: processDateData(data) }));
            } else if (activeType === "论文统计" && activeCategory === "各项统计") {
                setStatistics((prev) => ({ ...prev, paperdownloads_papers: data }));
            } else if (activeType === "图书统计" && activeCategory === "总数统计") {
                setStatistics((prev) => ({ ...prev, bookborrows_date: processDateData(data) }));
            } else if (activeType === "图书统计" && activeCategory === "各项统计") {
                setStatistics((prev) => ({ ...prev, bookborrows_books: data }));
            }

        } catch (error) {
            console.error("Error fetching statistics:", error);
            setAlertConfig({
                variant: "warning",
                title: "服务器未响应",
                message: "服务器未响应，请重试。",
                onConfirm: () => setShowAlertModal(false)
            });
            setShowAlertModal(true);
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

    // 根据 activeType 和 activeCategory 更新统计数据
    useEffect(() => {
        fetchStatistics();
    }, [activeType, activeCategory, dateRange]);

    // 根据统计数据更新过滤后的数据
    useEffect(() => {
        const currentDateData = activeType === "论文统计" ? statistics.paperdownloads_date : statistics.bookborrows_date;
        const currentItemsData = activeType === "论文统计" ? statistics.paperdownloads_papers : statistics.bookborrows_books;
        setFilteredDownloads(currentDateData);
        setFilteredRecords(currentItemsData);
        console.log(filteredDownloads);
    }, [statistics, activeType, activeCategory]);

    // 排序
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        } else if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = null;
            key = null;
        }
        setSortConfig({ key, direction });
    };

    const sortedDownloads = [...filteredDownloads];
    const sortedRecords = [...filteredRecords];
    if (sortConfig.key && sortConfig.direction) {
        const comparator = (a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
            return 0;
        };
        if (activeCategory === "总数统计") sortedDownloads.sort(comparator);
        else sortedRecords.sort(comparator);
    }

    const handleSearch = () => {
        fetchStatistics();
    }

    const lineChartData = {
        labels: sortedDownloads.map((download) => download.date),
        datasets: [
            {
                label: activeType === "论文统计" ? "下载数量" : "借阅数量",
                data: sortedDownloads.map((download) => download.count),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const barChartData = {
        labels: sortedRecords.map((record) => record.id),
        datasets: [
            {
                label: activeType === "论文统计" ? "下载数量" : "借阅数量",
                data: sortedRecords.map((record) => record.count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    // 纵轴设置
    const lineChartOptions = {
        scales: {
            y: {
                beginAtZero: true,  // 纵轴从0开始
                ticks: {
                    stepSize: 1,   // 保证纵轴刻度是整数
                    callback: function(value) {
                        return Number.isInteger(value) ? value : '';  // 只显示整数
                    },
                },
            },
        },
    };


    const barChartOptions = {
        scales: {
            y: {
                beginAtZero: true,  // 纵轴从0开始
                ticks: {
                    stepSize: 1,   // 保证纵轴刻度是整数
                    callback: function(value) {
                        return Number.isInteger(value) ? value : '';  // 只显示整数
                    },
                },
            },
        },
    };

    return (
        <>
            {userRole === "admin" && (
                <Container fluid className="p-4">
                    <Button variant="link" className="position-absolute" style={{ top: "20px", left: "20px", fontSize: "24px" }} onClick={() => navigate("/home")}>
                        返回
                    </Button>
                    <h1 className="text-center mt-3 mb-4" style={{ fontSize: "42px", fontWeight: "bold" }}>信息统计</h1>
                    <Row>
                        <Col xs={2} className="d-flex flex-column align-items-center">
                            <Button variant={activeType === "论文统计" ? "primary" : "light"} className="w-100 mb-2" style={{ fontSize: "20px" }} onClick={() => setActiveType("论文统计")}>
                                论文统计
                            </Button>
                            <Button variant={activeType === "图书统计" ? "primary" : "light"} className="w-100" style={{ fontSize: "20px" }} onClick={() => setActiveType("图书统计")}>
                                图书统计
                            </Button>
                        </Col>
                        <Col xs={8} className="d-flex justify-content-center align-items-center">
                            <ButtonGroup>
                                <Button variant={activeCategory === "总数统计" ? "primary" : "light"} style={{ fontSize: "20px", padding: "0px 200px" }} onClick={() => setActiveCategory("总数统计")}>
                                    总数统计
                                </Button>
                                <Button variant={activeCategory === "各项统计" ? "primary" : "light"} style={{ fontSize: "20px", padding: "0px 200px" }} onClick={() => setActiveCategory("各项统计")}>
                                    各项统计
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col xs={2} className="d-flex justify-content-end">
                            <Dropdown onSelect={(e) => setDateRange(e)}>
                                <Dropdown.Toggle variant="light" style={{ fontSize: "18px", padding: "10px 20px" }}>{dateRange}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="近7天">近7天</Dropdown.Item>
                                    <Dropdown.Item eventKey="近30天">近30天</Dropdown.Item>
                                    <Dropdown.Item eventKey="近1年">近1年</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>

                    {activeCategory === "各项统计" && (
                        <Row className="mt-3">
                            <Col xs={5}  style={{marginTop: "100px"}}>
                                <Form.Control
                                    type="text"
                                    placeholder="搜索标题"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Col>
                            <Col xs={1}  style={{marginTop: "100px"}}>
                                <Button variant="primary" onClick={handleSearch}>
                                    搜索
                                </Button>
                            </Col>
                        </Row>
                    )}
                    {activeCategory === "总数统计" && (
                        <Row className="mt-3">
                            <Col xs={9}  style={{marginTop: "100px"}}>

                            </Col>
                            <Col xs={3}  style={{marginTop: "100px"}}>

                            </Col>
                        </Row>
                    )}

                    <Row className="mt-4">
                        <Col xs={6} className="border bg-light p-3" style={{ height: "400px", overflowY: "auto", marginRight: "10px"}}>
                            {activeCategory === "总数统计" ? (
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>日期</th>
                                        <th onClick={() => handleSort("count")} style={{ cursor: "pointer" }}>{activeType === "论文统计" ? "下载数量" : "借阅数量"}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedDownloads.map((download, index) => (
                                        <tr key={index}>
                                            <td>{download.date}</td>
                                            <td>{download.count}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>ID</th>
                                        <th>标题</th>
                                        <th onClick={() => handleSort("count")} style={{ cursor: "pointer" }}>{activeType === "论文统计" ? "下载数量" : "借阅数量"}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedRecords.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.id}</td>
                                            <td>{record.title}</td>
                                            <td>{record.count}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            )}
                        </Col>
                        <Col xs={5} className="d-flex justify-content-center align-items-center border bg-light" style={{ height: "400px", marginLeft: "10px"}}>
                            {activeCategory === "总数统计" ? (
                                <Line data={lineChartData} options={lineChartOptions} />
                            ) : (
                                <Bar data={barChartData} options={barChartOptions} />
                            )}
                        </Col>
                    </Row>
                </Container>
            )}
            {(userRole === "user" || userRole === "guest") && <h1>对不起，您的访问权限不足！</h1>}
            {/* 显示提示框 */}
            <AlertModal
                show={showAlertModal}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmLabel="确认"
                variant={alertConfig.variant}
                onConfirm={alertConfig.onConfirm}
            />
        </>
    );
}
