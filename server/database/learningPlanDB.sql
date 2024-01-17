DROP TABLE IF EXISTS ACCOUNT CASCADE;
CREATE TABLE ACCOUNT(
    email TEXT PRIMARY KEY,
    account_password TEXT NOT NULL,
    refresh_token TEXT,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
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
    email TEXT NOT NULL,
    FOREIGN KEY (email) REFERENCES ACCOUNT(email)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS MODULE CASCADE;
CREATE TABLE MODULE(
    module_id SERIAL PRIMARY KEY,
    module_name TEXT,
    description TEXT,
    completion_percent INT,
    email TEXT,
    FOREIGN KEY (email) REFERENCES ACCOUNT(email)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Repeatable Goals should be possible
-- We need
--  - Time of completion.
--  - An algorithm to determine when the completion expires.
DROP TABLE IF EXISTS GOAL CASCADE;
CREATE TABLE GOAL(
    goal_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    is_complete BOOLEAN,
    module_id SERIAL,
    sub_goals INT[],
    FOREIGN KEY (module_id) REFERENCES MODULE(module_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS DASHBOARD CASCADE;
CREATE TABLE DASHBOARD(
    dashboard_id SERIAL PRIMARY KEY,
    profile_id INT,
    FOREIGN KEY (profile_id) REFERENCES PROFILE(profile_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
