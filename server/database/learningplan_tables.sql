DROP TABLE IF EXISTS ACCOUNT CASCADE;
CREATE TABLE ACCOUNT(
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    account_password TEXT NOT NULL,
    refresh_token TEXT,
    CONSTRAINT valid_email 
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

DROP TABLE IF EXISTS ACCOUNT_SETTINGS CASCADE;
CREATE TABLE ACCOUNT_SETTINGS(
    id SERIAL PRIMARY KEY,
    receive_emails BOOLEAN DEFAULT TRUE,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS TAG CASCADE;
CREATE TABLE TAG(
    id SERIAL PRIMARY KEY,
    name TEXT,
    color TEXT,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT valid_hex_code
    CHECK (color IS NULL OR COLOR ~* '^#[a-f0-9]{2}[a-f0-9]{2}[a-f0-9]{2}$')
);

DROP TABLE IF EXISTS PROFILE CASCADE;
CREATE TABLE PROFILE(
    profile_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_picture TEXT,
    job_title TEXT,
    bio TEXT,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS MODULE CASCADE;
CREATE TABLE MODULE(
    module_id SERIAL PRIMARY KEY,
    module_name TEXT,
    description TEXT,
    completion_percent INT,
    account_id INT,
    coach_id INT,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS GOAL CASCADE;
DROP TYPE IF EXISTS GOAL_TYPE;
CREATE TYPE GOAL_TYPE AS ENUM ('todo', 'daily');
CREATE TABLE GOAL(
    goal_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    goal_type GOAL_TYPE NOT NULL,
    is_complete BOOLEAN,
    module_id INT,
    due_date TIMESTAMP WITH TIME ZONE,
    completion_time TIMESTAMP WITH TIME ZONE,
    expiration TIMESTAMP WITH TIME ZONE,
    parent_goal INT,
    feedback TEXT,
    tag_id INT,
    FOREIGN KEY (module_id) REFERENCES MODULE(module_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES TAG(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS DASHBOARD CASCADE;
CREATE TABLE DASHBOARD(
    dashboard_id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES PROFILE(profile_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
