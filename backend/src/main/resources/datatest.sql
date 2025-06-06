INSERT INTO roles (role_id, role_name) VALUES
                                           (0, 'admin'),
                                           (1, 'user'),
                                           (2, 'guest');

INSERT INTO users (user_id, username, password, full_name, email, phone_number, address, role_id, max_borrow_limit) VALUES
                                                                                                                        (0, 'admin', 'adminpass', 'adminhhh', 'admin@dbms.com', '3366', 'ry', 0, 999),
                                                                                                                        (1, 'user1', 'user1pass', 'userhhh', 'user1@dbms.com', '384632', 'kkk', 1, 5),
                                                                                                                        (2, 'user2', 'user2pass', 'user2', 'user2@dbms.com', '947368', 'ttt', 1, 5);

INSERT INTO books (book_id, title, author, publisher, publish_year, isbn, quantity, borrow_count, is_public) VALUES
                                                                                                                 (1, 'Data Science Basics', 'Alice Smith', 'TechPress', 2015, '978-1234567890', 12, 8, TRUE),
                                                                                                                 (2, 'Machine Learning Essentials', 'John Doe', 'AI Books', 2018, '978-2345678901', 5, 2, FALSE),
                                                                                                                 (3, 'Deep Learning Fundamentals', 'Jane Lee', 'SciencePub', 2020, '978-3456789012', 7, 3, TRUE),
                                                                                                                 (4, 'Python Programming', 'Robert Brown', 'CodeBooks', 2017, '978-4567890123', 10, 6, TRUE),
                                                                                                                 (5, 'Statistics for Data', 'Emily Davis', 'DataPub', 2019, '978-5678901234', 15, 10, FALSE),
                                                                                                                 (6, 'Advanced SQL', 'Chris Green', 'DatabaseBooks', 2016, '978-6789012345', 4, 1, TRUE),
                                                                                                                 (7, 'Big Data Analytics', 'Kevin White', 'BigDataHouse', 2019, '978-7890123456', 9, 4, FALSE),
                                                                                                                 (8, 'Artificial Intelligence', 'Nancy Hall', 'FuturePress', 2021, '978-8901234567', 6, 2, TRUE),
                                                                                                                 (9, 'Blockchain Basics', 'David Martin', 'BlockchainPress', 2018, '978-9012345678', 11, 5, FALSE),
                                                                                                                 (10, 'Cloud Computing', 'Laura Wilson', 'CloudPub', 2022, '978-0123456789', 8, 3, TRUE);

INSERT INTO papers (paper_id, title, author, upload_date, is_public, uploaded_by, uploaded_by_id, download_count) VALUES
                                                                                                                      (1, 'A Study on Machine Learning', 'Alice Smith', '2022-03-01', TRUE, 'Alice', 0, 20),
                                                                                                                      (2, 'Quantum Computing Advances', 'John Doe', '2021-11-15', FALSE, 'John', 1, 15),
                                                                                                                      (3, 'Blockchain Security', 'Jane Lee', '2020-06-18', TRUE, 'Jane', 2, 25),
                                                                                                                      (4, 'Natural Language Processing', 'Robert Brown', '2019-08-25', TRUE, 'Robert', 2, 30),
                                                                                                                      (5, 'AI Ethics', 'Emily Davis', '2021-01-22', FALSE, 'Emily', 2, 10),
                                                                                                                      (6, 'Big Data Management', 'Chris Green', '2018-09-10', TRUE, 'Chris', 0, 18),
                                                                                                                      (7, 'IoT Security Challenges', 'Kevin White', '2022-05-12', FALSE, 'Kevin', 1, 22),
                                                                                                                      (8, '5G Networks', 'Nancy Hall', '2019-07-14', TRUE, 'Nancy', 0, 12),
                                                                                                                      (9, 'Self-driving Cars', 'David Martin', '2021-03-28', TRUE, 'David', 1, 27),
                                                                                                                      (10, 'Edge Computing', 'Laura Wilson', '2020-11-05', FALSE, 'Laura', 2, 14);

INSERT INTO borrow_records (record_id, user_id, book_id, borrow_date, return_date, due_date, status) VALUES
                                                                                                         (1, 0, 1, '2024-07-01', '2024-07-10', '2024-07-15', 'returned'),
                                                                                                         (2, 2, 2, '2024-06-12', '2024-06-20', '2024-06-25', 'returned'),
                                                                                                         (3, 1, 3, '2024-05-20', '2024-05-29', '2024-06-02', 'returned'),
                                                                                                         (4, 2, 4, '2024-08-15', NULL, '2024-08-25', 'borrowed'),
                                                                                                         (5, 0, 5, '2024-04-10', '2024-04-18', '2024-04-22', 'returned'),
                                                                                                         (6, 1, 6, '2024-09-01', '2024-09-10', '2024-09-15', 'returned'),
                                                                                                         (7, 1, 7, '2024-07-20', NULL, '2024-07-30', 'overdue'),
                                                                                                         (8, 1, 8, '2024-10-05', '2024-10-12', '2024-10-15', 'returned'),
                                                                                                         (9, 2, 9, '2024-03-14', '2024-03-22', '2024-03-25', 'returned'),
                                                                                                         (10, 0, 10, '2024-11-01', NULL, '2024-11-10', 'borrowed');

INSERT INTO paper_downloads (download_id, paper_id, user_id, download_date) VALUES
                                                                                (1, 1, 0, '2024-01-05T10:15:30Z'),
                                                                                (2, 2, 1, '2024-02-14T12:20:45Z'),
                                                                                (3, 3, 1, '2024-03-18T09:30:00Z'),
                                                                                (4, 4, 2, '2024-04-21T14:25:10Z'),
                                                                                (5, 5, 1, '2024-05-10T11:45:20Z'),
                                                                                (6, 6, 0, '2024-06-25T13:50:30Z'),
                                                                                (7, 7, 0, '2024-07-15T08:40:00Z'),
                                                                                (8, 8, 2, '2024-08-07T15:00:45Z'),
                                                                                (9, 9, 0, '2024-09-30T07:25:50Z'),
                                                                                (10, 10, 1, '2024-10-12T17:35:00Z');

INSERT INTO audit_logs (log_id, user_id, action, target_id, action_date) VALUES
    (0, 0, '创建admin账号', 0, '2024-11-11T11:11:11Z');