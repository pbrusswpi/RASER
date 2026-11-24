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

ALTER TABLE rubric
  MODIFY status ENUM('draft','published','deprecated') NOT NULL DEFAULT 'draft',
  ADD deprecated_at DATETIME NULL,
  ADD replaced_by CHAR(36) NULL;

CREATE TABLE journal (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  status ENUM('active','withdrawn') NOT NULL DEFAULT 'active');

CREATE TABLE journal_rubric (
  journal_id CHAR(36) NOT NULL,
  rubric_id CHAR(36) NOT NULL,
  PRIMARY KEY (journal_id, rubric_id),
  FOREIGN KEY (journal_id) REFERENCES journal(id) ON DELETE CASCADE,
  FOREIGN KEY (rubric_id) REFERENCES rubric(id));

CREATE TABLE issue (
  id CHAR(36) PRIMARY KEY,
  journal_id CHAR(36) NOT NULL,
  volume INT NOT NULL,
  number INT NOT NULL,
  UNIQUE (journal_id, volume, number),
  FOREIGN KEY (journal_id) REFERENCES journal(id) ON DELETE CASCADE);

CREATE TABLE paper (
  id CHAR(36) PRIMARY KEY,
  issue_id CHAR(36) NOT NULL,
  title VARCHAR(300) NOT NULL,
  authors VARCHAR(300) NOT NULL,
  rubric_id CHAR(36) NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issue(id) ON DELETE CASCADE,
  FOREIGN KEY (rubric_id) REFERENCES rubric(id));