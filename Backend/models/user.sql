-- ============================================================
-- Flora-Digitalis Pakistan
-- Database Schema: Users Table (Targeting existing 'test' DB)
-- ============================================================

-- Switch directly to your existing database visible in Workbench
USE test;

-- Drop table if exists (ONLY for development safety)
DROP TABLE IF EXISTS users;

-- Users Table
-- CREATE TABLE users (
--     id INT UNSIGNED NOT NULL AUTO_INCREMENT,

--     -- Basic Info
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(150) NOT NULL,
--     password VARCHAR(255) NOT NULL,

--     -- Role
--     role ENUM('user', 'botanist', 'admin') NOT NULL DEFAULT 'user',

--     -- Botanist workflow
--     botanist_application_status ENUM('none', 'pending', 'approved', 'rejected') 
--         NOT NULL DEFAULT 'none',

--     botanist_applied_at DATETIME NULL DEFAULT NULL,
--     botanist_reviewed_at DATETIME NULL DEFAULT NULL,
--     botanist_reviewed_by INT UNSIGNED NULL,


-- -- Multi-Step Application Details (Matched perfectly to your UI screens)
--     phone              VARCHAR(20)   NOT NULL,              -- Screen 1: Phone Number
--     institution        VARCHAR(255)  NOT NULL,              -- Screen 1: Institution / University
--     qualification      VARCHAR(255)  NOT NULL,              -- Screen 2: Highest Qualification
--     specialisation     VARCHAR(255)  NOT NULL,              -- Screen 2: Specialisation (e.g. Ethnobotany)
--     experience_years   VARCHAR(50)   NOT NULL,              -- Screen 2: Years of Experience (Using string/varchar to handle dropdown ranges nicely)
--     portfolio_url      VARCHAR(255)  NULL DEFAULT NULL,     -- Screen 2: Portfolio / Research Link (Optional)
--     document_url       VARCHAR(500)  NOT NULL,              -- Screen 3: Uploaded Certificate path/Cloudinary URL
--     rejection_reason   VARCHAR(500)  NULL DEFAULT NULL,     -- Admin internal field for feedback

--     -- Status
--     is_active BOOLEAN NOT NULL DEFAULT TRUE,

--     -- Timestamps
--     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

--     -- Keys
--     PRIMARY KEY (id),
--     UNIQUE KEY uq_email (email),
--     INDEX idx_role (role),
--     INDEX idx_botanist_status (botanist_application_status)

-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,

  role ENUM('user','botanist','admin') NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
);
CREATE TABLE botanist_applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  user_id INT UNSIGNED NOT NULL,

  phone VARCHAR(20) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  specialisation VARCHAR(255) NOT NULL,
  experience_years VARCHAR(50) NOT NULL,
  portfolio_url VARCHAR(255) NULL,
  document_url VARCHAR(500) NOT NULL,

  status ENUM('pending','approved','rejected') DEFAULT 'pending',

  rejection_reason VARCHAR(500) NULL,

  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,

  PRIMARY KEY (id),

  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
