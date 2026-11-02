CREATE TABLE rubric (
id CHAR(36) PRIMARY KEY,
name VARCHAR(200) NOT NULL,
low_threshold INT NOT NULL,
high_threshold INT NOT NULL,
status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
published_at DATETIME NULL
);

CREATE TABLE question (
id CHAR(36) PRIMARY KEY,
rubric_id CHAR(36) NOT NULL,
section VARCHAR(40) NOT NULL,
text TEXT NOT NULL,
exp5 TEXT, exp4 TEXT, exp3 TEXT, exp2 TEXT, exp1 TEXT,
FOREIGN KEY (rubric_id) REFERENCES rubric(id) ON DELETE CASCADE
);