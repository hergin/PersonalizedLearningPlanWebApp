SELECT 'CREATE DATABASE learningplan'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'learningplan')\gexec
\c learningplan;

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
-- We need:
--  - Time of completion.
--  - An algorithm to determine when the completion expires.
DROP TABLE IF EXISTS GOAL CASCADE;
CREATE TABLE GOAL(
    goal_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    is_complete BOOLEAN,
    module_id SERIAL,
    completion_time TIMESTAMP,
    expiration TIMESTAMP,
    parent_goal INT,
    FOREIGN KEY (module_id) REFERENCES MODULE(module_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- This will update every goal's completion status.
CREATE OR REPLACE FUNCTION update_goal_completion()
RETURNS TRIGGER AS $$
    BEGIN
        IF OLD.expiration IS NOT NULL THEN
            NEW.is_complete = CURRENT_TIMESTAMP < OLD.expiration;
            RETURN NEW;
        ELSE
            RETURN NULL;
        END IF;
    END;
$$ language 'plpgsql';

-- This will trigger update goal completion after every update query.
CREATE TRIGGER trigger_update_goal_completion
AFTER INSERT OR UPDATE ON GOAL FOR EACH ROW
EXECUTE PROCEDURE update_goal_completion();

-- Checks to see if the goal's completion has expired before returning the data.
-- You must use this function to parse a goal otherwise it might be inaccurate.
CREATE OR REPLACE FUNCTION get_goal(id int)
RETURNS GOAL AS $$
    UPDATE GOAL g
    SET is_complete = CURRENT_TIMESTAMP < g.expiration
    WHERE g.expiration IS NOT NULL;

    SELECT * FROM GOAL g
    WHERE g.goal_id = get_goal.id;
$$ language sql security definer;

CREATE OR REPLACE FUNCTION get_goals(id int)
RETURNS GOAL AS $$
    UPDATE GOAL g
    SET is_complete = CURRENT_TIMESTAMP < g.expiration
    WHERE g.expiration IS NOT NULL;

    SELECT * FROM GOAL g
    WHERE g.module_id = get_goals.id;
$$ language sql security definer;

DROP TABLE IF EXISTS DASHBOARD CASCADE;
CREATE TABLE DASHBOARD(
    dashboard_id SERIAL PRIMARY KEY,
    profile_id INT,
    FOREIGN KEY (profile_id) REFERENCES PROFILE(profile_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
