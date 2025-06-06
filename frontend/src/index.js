import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const roles =
    [
        {role_id: 0, role_name: "admin"},
        {role_id: 1, role_name: "user"},
        {role_id: 2, role_name: "guest"}
    ]

const users =
    [
        {user_id: "0", user_name: "admin", password: "adminpass", full_name: "adminhhh", email: "admin@dbms.com", phone_number: "3366", address: "ry", role_id: 0, max_borrow_limit: 999},
        {user_id: "1", user_name: "user1", password: "user1pass", full_name: "userhhh", email: "user1@dbms.com", phone_number: "384632", address: "kkk", role_id: 1, max_borrow_limit: 5},
        {user_id: "2", user_name: "user2", password: "user2pass", full_name: "user2", email: "user2@dbms.com", phone_number: "947368", address: "ttt", role_id: 1, max_borrow_limit: 5},
    ]

const books = [
    {book_id: "1", title: "Data Science Basics", author: "Alice Smith", publisher: "TechPress", publish_year: 2015, isbn: "978-1234567890", quantity: 12, borrow_count: 8, is_public: true},
    {book_id: "2", title: "Machine Learning Essentials", author: "John Doe", publisher: "AI Books", publish_year: 2018, isbn: "978-2345678901", quantity: 5, borrow_count: 2, is_public: false},
    {book_id: "3", title: "Deep Learning Fundamentals", author: "Jane Lee", publisher: "SciencePub", publish_year: 2020, isbn: "978-3456789012", quantity: 7, borrow_count: 3, is_public: true},
    {book_id: "4", title: "Python Programming", author: "Robert Brown", publisher: "CodeBooks", publish_year: 2017, isbn: "978-4567890123", quantity: 10, borrow_count: 6, is_public: true},
    {book_id: "5", title: "Statistics for Data", author: "Emily Davis", publisher: "DataPub", publish_year: 2019, isbn: "978-5678901234", quantity: 15, borrow_count: 10, is_public: false},
    {book_id: "6", title: "Advanced SQL", author: "Chris Green", publisher: "DatabaseBooks", publish_year: 2016, isbn: "978-6789012345", quantity: 4, borrow_count: 1, is_public: true},
    {book_id: "7", title: "Big Data Analytics", author: "Kevin White", publisher: "BigDataHouse", publish_year: 2019, isbn: "978-7890123456", quantity: 9, borrow_count: 4, is_public: false},
    {book_id: "8", title: "Artificial Intelligence", author: "Nancy Hall", publisher: "FuturePress", publish_year: 2021, isbn: "978-8901234567", quantity: 6, borrow_count: 2, is_public: true},
    {book_id: "9", title: "Blockchain Basics", author: "David Martin", publisher: "BlockchainPress", publish_year: 2018, isbn: "978-9012345678", quantity: 11, borrow_count: 5, is_public: false},
    {book_id: "10", title: "Cloud Computing", author: "Laura Wilson", publisher: "CloudPub", publish_year: 2022, isbn: "978-0123456789", quantity: 8, borrow_count: 3, is_public: true}
];

const papers = [
    {paper_id: "1", title: "A Study on Machine Learning", author: "Alice Smith", upload_date: "2022-03-01", is_public: true, uploaded_by: "Alice", uploaded_by_id: 101, download_count: 20},
    {paper_id: "2", title: "Quantum Computing Advances", author: "John Doe", upload_date: "2021-11-15", is_public: false, uploaded_by: "John", uploaded_by_id: 102, download_count: 15},
    {paper_id: "3", title: "Blockchain Security", author: "Jane Lee", upload_date: "2020-06-18", is_public: true, uploaded_by: "Jane", uploaded_by_id: 103, download_count: 25},
    {paper_id: "4", title: "Natural Language Processing", author: "Robert Brown", upload_date: "2019-08-25", is_public: true, uploaded_by: "Robert", uploaded_by_id: 104, download_count: 30},
    {paper_id: "5", title: "AI Ethics", author: "Emily Davis", upload_date: "2021-01-22", is_public: false, uploaded_by: "Emily", uploaded_by_id: 105, download_count: 10},
    {paper_id: "6", title: "Big Data Management", author: "Chris Green", upload_date: "2018-09-10", is_public: true, uploaded_by: "Chris", uploaded_by_id: 106, download_count: 18},
    {paper_id: "7", title: "IoT Security Challenges", author: "Kevin White", upload_date: "2022-05-12", is_public: false, uploaded_by: "Kevin", uploaded_by_id: 107, download_count: 22},
    {paper_id: "8", title: "5G Networks", author: "Nancy Hall", upload_date: "2019-07-14", is_public: true, uploaded_by: "Nancy", uploaded_by_id: 108, download_count: 12},
    {paper_id: "9", title: "Self-driving Cars", author: "David Martin", upload_date: "2021-03-28", is_public: true, uploaded_by: "David", uploaded_by_id: 109, download_count: 27},
    {paper_id: "10", title: "Edge Computing", author: "Laura Wilson", upload_date: "2020-11-05", is_public: false, uploaded_by: "Laura", uploaded_by_id: 110, download_count: 14}
];

const borrow_records = [
    {record_id: "1", user_id: 201, book_id: 1, borrow_date: "2024-07-01", return_date: "2024-07-10", due_date: "2024-07-15", status: "returned"},
    {record_id: "2", user_id: 202, book_id: 2, borrow_date: "2024-06-12", return_date: "2024-06-20", due_date: "2024-06-25", status: "returned"},
    {record_id: "3", user_id: 203, book_id: 3, borrow_date: "2024-05-20", return_date: "2024-05-29", due_date: "2024-06-02", status: "returned"},
    {record_id: "4", user_id: 204, book_id: 4, borrow_date: "2024-08-15", return_date: null, due_date: "2024-08-25", status: "borrowed"},
    {record_id: "5", user_id: 205, book_id: 5, borrow_date: "2024-04-10", return_date: "2024-04-18", due_date: "2024-04-22", status: "returned"},
    {record_id: "6", user_id: 206, book_id: 6, borrow_date: "2024-09-01", return_date: "2024-09-10", due_date: "2024-09-15", status: "returned"},
    {record_id: "7", user_id: 207, book_id: 7, borrow_date: "2024-07-20", return_date: null, due_date: "2024-07-30", status: "overdue"},
    {record_id: "8", user_id: 208, book_id: 8, borrow_date: "2024-10-05", return_date: "2024-10-12", due_date: "2024-10-15", status: "returned"},
    {record_id: "9", user_id: 209, book_id: 9, borrow_date: "2024-03-14", return_date: "2024-03-22", due_date: "2024-03-25", status: "returned"},
    {record_id: "10", user_id: 210, book_id: 10, borrow_date: "2024-11-01", return_date: null, due_date: "2024-11-10", status: "borrowed"}
];

const paper_downloads = [
    {download_id: "1", paper_id: 1, user_id: 301, download_date: "2024-01-05T10:15:30Z"},
    {download_id: "2", paper_id: 2, user_id: 302, download_date: "2024-02-14T12:20:45Z"},
    {download_id: "3", paper_id: 3, user_id: 303, download_date: "2024-03-18T09:30:00Z"},
    {download_id: "4", paper_id: 4, user_id: 304, download_date: "2024-04-21T14:25:10Z"},
    {download_id: "5", paper_id: 5, user_id: 305, download_date: "2024-05-10T11:45:20Z"},
    {download_id: "6", paper_id: 6, user_id: 306, download_date: "2024-06-25T13:50:30Z"},
    {download_id: "7", paper_id: 7, user_id: 307, download_date: "2024-07-15T08:40:00Z"},
    {download_id: "8", paper_id: 8, user_id: 308, download_date: "2024-08-07T15:00:45Z"},
    {download_id: "9", paper_id: 9, user_id: 309, download_date: "2024-09-30T07:25:50Z"},
    {download_id: "10", paper_id: 10, user_id: 310, download_date: "2024-10-12T17:35:00Z"}
];

const audit_logs = [
    {log_id: "0", user_id: "0", action: "创建admin账号", target_id: "0", action_date: "2024-11-11T11:11:11Z"}
]


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App
            roles={roles}
            users={users}
            books={books}
            papers={papers}
            borrow_records={borrow_records}
            paper_downloads={paper_downloads}
            audit_logs={audit_logs}
        />
    </React.StrictMode>
);

