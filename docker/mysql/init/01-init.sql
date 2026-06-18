CREATE DATABASE IF NOT EXISTS frontend_users_db;

CREATE USER IF NOT EXISTS 'club_user'@'%' IDENTIFIED BY 'club_pass';

GRANT ALL PRIVILEGES ON frontend_users_db.* TO 'club_user'@'%';

FLUSH PRIVILEGES;
