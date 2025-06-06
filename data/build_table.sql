CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(15),
    address TEXT,
    role_id INT,
    max_borrow_limit INT DEFAULT 5  
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    publish_year INT,
    isbn VARCHAR(20),
    quantity INT DEFAULT 0,  
    borrow_count INT DEFAULT 0,  
    is_public BOOLEAN DEFAULT FALSE  
);

CREATE TABLE papers (
    paper_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    upload_date DATE NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,  
    uploaded_by VARCHAR(255) NOT NULL,
    uploaded_by_id BIGINT,  
    download_count INT DEFAULT 0  
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE book_categories (
    book_id INT,
    category_id INT,
    PRIMARY KEY (book_id, category_id)
);

CREATE TABLE borrow_records (
    record_id SERIAL PRIMARY KEY,
    user_id BIGINT,
    book_id INT,
    borrow_date DATE NOT NULL,
    return_date DATE,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'borrowed',
    CHECK (status IN ('borrowed', 'returned', 'overdue'))  
);

CREATE TABLE paper_downloads (
    download_id SERIAL PRIMARY KEY,
    paper_id INT,
    user_id BIGINT,
    download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255),
    target_id INT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
