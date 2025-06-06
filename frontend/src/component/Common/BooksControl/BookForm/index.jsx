import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./index.css"
export default function BookForm(props) {


    const[title, setTitle] = useState("");
    const[author, setAuthor] = useState("");
    const[publisher, setPublisher] = useState("");
    const[publish_year, setPublishYear] = useState(0);
    const[isbn, setIsbn] = useState("");
    const[is_public, setIsPublic] = useState(false);
    const[quantity, setQuantity] = useState(10);



    useEffect(() => {
        if (props.book) {


            setTitle(props.book.title);
            setAuthor(props.book.author);
            setPublisher(props.book.publisher);
            setPublishYear(props.book.publish_year);
            setIsbn(props.book.isbn);
            setIsPublic(props.book.is_public);
            setQuantity(props.book.quantity);

        }
    }, [props.book]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedBook={
            //book_id: props.book?.book_id,
            ...props.book ? { book_id: props.book.book_id } : {},
            title:title,
            author:author,
            publisher:publisher,
            publish_year:publish_year,
            isbn:isbn,
            public:is_public,
            quantity:quantity,
            download_count: props.book?.download_count || 0,
        };
        console.log("更新的图书",updatedBook);
        props.onSave(updatedBook);

        setTitle("");
        setAuthor("");
        setPublisher("");
        setIsPublic(false);
        setPublishYear(0);
        setIsbn("");
        setQuantity(10);


    };

    return (
        <div className="book-form-container">
            <h2>编辑图书</h2>
            <Form onSubmit={handleSubmit}>

                <Form.Group>
                    <Form.Label>标题</Form.Label>
                    <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>作者</Form.Label>
                    <Form.Control value={author} onChange={(e) => setAuthor(e.target.value)} required/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>出版社</Form.Label>
                    <Form.Control value={publisher} onChange={(e) => setPublisher(e.target.value)} required/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>出版年份</Form.Label>
                    <Form.Control   type="number"  value={publish_year} onChange={(e) => setPublishYear(Number(e.target.value))} required/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>ISBN码</Form.Label>
                    <Form.Control value={isbn} onChange={(e) => setIsbn(e.target.value)} required/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>总数量</Form.Label>
                    <Form.Control value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
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




                <div className="form-buttons">
                    <Button variant="primary" type="submit">保存</Button>
                    <Button variant="secondary" onClick={props.onCancel}>取消</Button>
                </div>
            </Form>

        </div>
    );
}

