-- schema_mysql.sql
CREATE DATABASE IF NOT EXISTS recipe_db;
USE recipe_db;

CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  ingredients TEXT,
  instructions TEXT,
  cuisine VARCHAR(100),
  category VARCHAR(100),
  rating FLOAT,
  prep_time INT,
  cook_time INT,
  total_time INT,
  serves VARCHAR(50),
  nutrients JSON
);
