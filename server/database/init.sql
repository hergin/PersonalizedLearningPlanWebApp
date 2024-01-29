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

DROP TABLE IF EXISTS GOAL CASCADE;
DROP TYPE IF EXISTS GOAL_TYPE;
CREATE TYPE GOAL_TYPE AS ENUM ('todo', 'daily');
CREATE TABLE GOAL(
    goal_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    goal_type GOAL_TYPE NOT NULL,
    is_complete BOOLEAN,
    module_id SERIAL,
    due_date TIMESTAMP,
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
        IF NEW.expiration IS NOT NULL THEN
            NEW.is_complete = CURRENT_TIMESTAMP < NEW.expiration;
        END IF;

        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql';

-- This will trigger update goal completion after every update query.
CREATE OR REPLACE TRIGGER trigger_update_goal_completion
AFTER INSERT OR UPDATE ON GOAL FOR EACH ROW
EXECUTE FUNCTION update_goal_completion();

ALTER TABLE GOAL ENABLE TRIGGER trigger_update_goal_completion;

-- Checks to see if the goal's completion has expired before returning the data.
-- You must use this function to parse a goal otherwise it might be inaccurate.
CREATE OR REPLACE FUNCTION get_goal(id INT)
RETURNS GOAL AS $$
    UPDATE GOAL g
    SET is_complete = CURRENT_TIMESTAMP < g.expiration
    WHERE g.expiration IS NOT NULL;

    SELECT * FROM GOAL g
    WHERE g.goal_id = get_goal.id;
$$ LANGUAGE SQL SECURITY definer;

CREATE OR REPLACE FUNCTION get_goals(id INT)
RETURNS SETOF GOAL AS $$
    #print_strict_params ON
    DECLARE num_of_goals DECIMAL;
    DECLARE num_of_completed_goals DECIMAL;
    
    BEGIN
        UPDATE GOAL g
        SET is_complete = CURRENT_TIMESTAMP < g.expiration
        WHERE g.expiration IS NOT NULL;

        SELECT COUNT(*) FROM GOAL WHERE module_id = get_goals.id INTO STRICT num_of_goals;
        SELECT COUNT(*) FROM GOAL WHERE module_id = get_goals.id AND is_complete IS TRUE INTO STRICT num_of_completed_goals;
        
        IF num_of_goals > 0 THEN
            UPDATE MODULE m
            SET completion_percent = num_of_completed_goals / num_of_goals * 100
            WHERE m.module_id = get_goals.id;
        END IF;

        RETURN QUERY SELECT * FROM GOAL g WHERE g.module_id = get_goals.id;
    END;
$$ LANGUAGE 'plpgsql';

DROP TABLE IF EXISTS DASHBOARD CASCADE;
CREATE TABLE DASHBOARD(
    dashboard_id SERIAL PRIMARY KEY,
    profile_id SERIAL NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES PROFILE(profile_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
