-- FinTrack Database Schema
-- Author: Ibrahim Fayyad | github.com/ibrahimf90

CREATE DATABASE IF NOT EXISTS fintrack
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fintrack;

CREATE TABLE IF NOT EXISTS transactions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        ENUM('income', 'expense') NOT NULL,
  category    VARCHAR(50) NOT NULL,
  amount      DECIMAL(12, 2) NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT '',
  date        DATE NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample seed data
INSERT INTO transactions (type, category, amount, description, date) VALUES
  ('income',  'Salary',        5000.00, 'Monthly salary',          '2025-06-01'),
  ('expense', 'Rent',          1200.00, 'June rent',               '2025-06-02'),
  ('expense', 'Food',           320.50, 'Groceries & dining',      '2025-06-05'),
  ('expense', 'Transport',       85.00, 'Gas & metro',             '2025-06-07'),
  ('income',  'Other',          250.00, 'Freelance project',       '2025-06-10'),
  ('expense', 'Entertainment',  150.00, 'Streaming + cinema',      '2025-06-12'),
  ('expense', 'Health',          90.00, 'Pharmacy & gym',          '2025-06-15'),
  ('expense', 'Shopping',       230.00, 'Clothes & accessories',   '2025-06-18');
