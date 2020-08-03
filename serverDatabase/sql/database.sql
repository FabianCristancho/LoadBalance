CREATE DATABASE IF NOT EXISTS load_balance_images;

USE load_balance_images;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin123';

flush privileges;

CREATE TABLE images (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  original_name VARCHAR(50),
  code_name VARCHAR(150),
  size INT,
  server VARCHAR(100),
  time_current TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
