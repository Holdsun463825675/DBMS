import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./index.css"; // 引入 CSS 文件

export default function PaperForm(props)  {

    const [title, setTitle] = useState(""); // 论文标题
    const [author, setAuthor] = useState(""); // 论文作者
    const [upload_date, setUploadDate] = useState(""); // 上传日期
    const [is_public, setIsPublic] = useState(false); // 是否公开，默认 false
    const [uploaded_by, setUploadedBy] = useState(""); // 上传者名称
    const [uploaded_by_id, setUploadedById] = useState(0); // 上传用户 ID
    const [download_href, setDownloadHref] = useState(""); // 下载链接


    useEffect(() => {
        if (props.paper) {
            setTitle(props.paper.title);
            setAuthor(props.paper.author);
            setUploadDate(props.paper.upload_date);
            setIsPublic(props.paper.public);
            setUploadedBy(props.paper.uploaded_by);
            setUploadedById(props.paper.uploaded_by_id);
            setDownloadHref(props.paper.download_href);
        }
    }, [props.paper]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedUploadDate=new Date(upload_date).toISOString();

        const updatedPaper = {
            //paper_id: props.paper?.paper_id,  // 新增时不会有 paper_id
            ...props.paper ? { paper_id: props.paper.paper_id } : {},  // 如果是编辑，保留 paper_id，新增时不传递
            title: title,
            author: author,
            upload_date: formattedUploadDate,
            public: is_public,
            uploaded_by: uploaded_by,
            uploaded_by_id: uploaded_by_id,
            download_count: props.paper?.download_count || 0,
        };

        console.log("提交的数据:", updatedPaper);  // 调试输出
        props.onSave(updatedPaper);


        setTitle("");
        setAuthor("");
        setUploadDate("");
        setIsPublic(false);
        setUploadedBy("");
        setUploadedById(0);
        setDownloadHref("");
    };

    return (
        <div className="paper-form-container">
            <h2>编辑论文信息</h2>
            <Form onSubmit={handleSubmit}>


                <Form.Group>
                    <Form.Label>标题</Form.Label>
                    <Form.Control
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>作者</Form.Label>
                    <Form.Control
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>上传日期</Form.Label>
                    <Form.Control
                        type="date"
                        value={upload_date}
                        onChange={(e) => setUploadDate(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>是否公开</Form.Label>
                    <Form.Select
                        value={is_public ? "yes" : "no"}
                        onChange={(e) => setIsPublic(e.target.value === "yes")}
                        required
                    >
                        <option value="yes">是</option>
                        <option value="no">否</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>上传者名称</Form.Label>
                    <Form.Control
                        value={uploaded_by}
                        onChange={(e) => setUploadedBy(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>上传者 ID</Form.Label>
                    <Form.Control
                        value={uploaded_by_id}
                        onChange={(e) => setUploadedById(Number(e.target.value))}
                        required
                    />
                </Form.Group>

                {/*<Form.Group>*/}
                {/*    <Form.Label>上传者 ID</Form.Label>*/}
                {/*    <Form.Control*/}
                {/*        type="number"*/}
                {/*        value={uploaded_by_id}*/}
                {/*        onChange={(e) => {*/}
                {/*            const value = e.target.value;*/}
                {/*            // 如果是有效数字，则更新状态，否则不做改变*/}
                {/*            const numValue = value === "" ? "" : Number(value);*/}
                {/*            if (!isNaN(numValue) || value === "") { // 允许为空字符串*/}
                {/*                setUploadedById(numValue);*/}
                {/*            }*/}
                {/*        }}*/}
                {/*        required*/}
                {/*    />*/}
                {/*</Form.Group>*/}


                {/*<Form.Group>*/}
                {/*    <Form.Label>下载链接</Form.Label>*/}
                {/*    <Form.Control*/}
                {/*        value={download_href}*/}
                {/*        onChange={(e) => setDownloadHref(e.target.value)}*/}
                {/*        required*/}
                {/*    />*/}
                {/*</Form.Group>*/}

                <Button variant="primary" type="submit">
                    保存
                </Button>{" "}
                <Button variant="secondary" onClick={props.onCancel}>
                    取消
                </Button>
            </Form>
        </div>
    );
}



