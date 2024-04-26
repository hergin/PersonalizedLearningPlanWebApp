SELECT 'CREATE DATABASE learningplan'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'learningplan')\gexec
\c learningplan;

DROP TYPE IF EXISTS SITE_ROLE CASCADE;
CREATE TYPE SITE_ROLE AS ENUM ('admin', 'coach', 'basic');

DROP TABLE IF EXISTS ACCOUNT CASCADE;
CREATE TABLE ACCOUNT(
    id SERIAL PRIMARY KEY,
    email VARCHAR(300) UNIQUE NOT NULL,
    account_password TEXT NOT NULL,
    refresh_token TEXT,
    coach_id INT,
    site_role SITE_ROLE DEFAULT 'basic',
    CONSTRAINT valid_email 
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

DROP TABLE IF EXISTS PROFILE CASCADE;
CREATE TABLE PROFILE(
    profile_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    job_title VARCHAR(50),
    bio VARCHAR(500),
    account_id INT UNIQUE NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS ACCOUNT_SETTINGS CASCADE;
CREATE TABLE ACCOUNT_SETTINGS(
    id SERIAL PRIMARY KEY,
    receive_emails BOOLEAN DEFAULT TRUE,
    allow_coach_invitations BOOLEAN DEFAULT TRUE,
    account_id INT UNIQUE NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS TAG CASCADE;
CREATE TABLE TAG(
    tag_id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS MODULE CASCADE;
CREATE TABLE MODULE(
    module_id SERIAL PRIMARY KEY,
    module_name TEXT,
    description TEXT,
    completion_percent INT DEFAULT 100,
    account_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TYPE IF EXISTS GOAL_TYPE CASCADE;
CREATE TYPE GOAL_TYPE AS ENUM ('todo', 'daily', 'weekly', 'monthly', 'yearly');

DROP TABLE IF EXISTS GOAL CASCADE;
CREATE TABLE GOAL(
    goal_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    goal_type GOAL_TYPE NOT NULL,
    is_complete BOOLEAN DEFAULT 'false',
    module_id INT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    completion_time TIMESTAMP WITH TIME ZONE,
    expiration TIMESTAMP WITH TIME ZONE,
    parent_goal INT,
    feedback TEXT,
    tag_id INT,
    FOREIGN KEY (module_id) REFERENCES MODULE(module_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES TAG(tag_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS INVITATION CASCADE;
CREATE TABLE INVITATION(
    id SERIAL PRIMARY KEY,
    recipient_id INT NOT NULL,
    sender_id INT NOT NULL,
    FOREIGN KEY (recipient_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS MESSAGE CASCADE;
CREATE TABLE MESSAGE(
    id SERIAL PRIMARY KEY,
    content TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_edited TIMESTAMP WITH TIME ZONE,
    recipient_id INT NOT NULL,
    sender_id INT NOT NULL,
    FOREIGN KEY (recipient_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES ACCOUNT(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- This will eliminate the possibility that the account id will match a status code and cause issues.
ALTER SEQUENCE IF EXISTS ACCOUNT_id_seq RESTART WITH 1000;

CREATE OR REPLACE VIEW GOAL_WITH_TAG AS
SELECT * FROM GOAL g LEFT JOIN TAG t USING(tag_id);

CREATE OR REPLACE VIEW COACH_DATA AS
SELECT a.id as account_id, p.profile_id as profile_id, p.username as username
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id JOIN ACCOUNT_SETTINGS s ON s.account_id = a.id
WHERE s.allow_coach_invitations IS TRUE AND a.site_role = 'coach';

CREATE OR REPLACE VIEW INVITE_DATA AS
SELECT i.id as id, i.sender_id as sender_id, i.recipient_id as recipient_id, r.email as recipient_email, s.email as sender_email, rp.username as recipient_username, rs.username as sender_username
FROM INVITATION i JOIN ACCOUNT r ON i.recipient_id = r.id JOIN ACCOUNT s ON i.sender_id = s.id JOIN PROFILE rp ON rp.account_id = r.id JOIN PROFILE rs ON rs.account_id = s.id;

CREATE OR REPLACE VIEW UNDERSTUDY_DATA AS
SELECT a.id as account_id, p.profile_id as profile_id, p.username as username, a.coach_id as coach_id
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id;

CREATE OR REPLACE VIEW MESSAGE_DATA AS
SELECT m.id as id, m.content as content, m.date as date, m.last_edited as last_edited, m.recipient_id as recipient_id, m.sender_id as sender_id, p.username as username
FROM MESSAGE m JOIN ACCOUNT a ON a.id = m.sender_id JOIN PROFILE p ON a.id = p.account_id;

CREATE OR REPLACE VIEW USER_DATA AS
SELECT a.id as account_id, a.email as email, a.site_role as role, p.profile_id as profile_id, p.username as username
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id;

CREATE OR REPLACE PROCEDURE update_is_complete()
AS $$
    BEGIN
        UPDATE GOAL
        SET is_complete = (CURRENT_TIMESTAMP < expiration)
        WHERE expiration IS NOT NULL;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE PROCEDURE update_module_completion()
AS $$
    DECLARE row RECORD;
    DECLARE num_of_goals DECIMAL;
    DECLARE num_of_completed_goals DECIMAL;

    BEGIN
        FOR row IN SELECT * FROM MODULE LOOP
            SELECT COUNT(*) FROM GOAL INTO num_of_goals WHERE module_id = row.module_id;
            SELECT COUNT(*) FROM GOAL INTO num_of_completed_goals WHERE module_id = row.module_id AND is_complete IS TRUE;

            IF num_of_goals > 0 THEN
                UPDATE MODULE m
                SET completion_percent = num_of_completed_goals / num_of_goals * 100
                WHERE m.module_id = row.module_id;
            ELSE
                UPDATE MODULE m
                SET completion_percent = 100
                WHERE m.module_id = row.module_id;
            END IF;
        END LOOP;
    END;
$$ LANGUAGE PLPGSQL;

-- Checks to see if the goal's completion has expired before returning the data.
-- You must use this function to parse a goal otherwise it might be inaccurate.
CREATE OR REPLACE FUNCTION get_goal(id INT)
RETURNS GOAL_WITH_TAG AS $$
    BEGIN
        CALL update_is_complete();
        CALL update_module_completion();

        RETURN (SELECT * FROM GOAL_WITH_TAG WHERE goal_id = get_goal.id);
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_goals(id INT)
RETURNS SETOF GOAL_WITH_TAG AS $$    
    BEGIN
        CALL update_is_complete();
        CALL update_module_completion();
        RETURN QUERY SELECT * FROM GOAL_WITH_TAG WHERE module_id = get_goals.id;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_child_goals(id INT)
RETURNS SETOF goal_with_tag AS $$
    BEGIN
        CALL update_is_complete();
        CALL update_module_completion();

        RETURN QUERY SELECT * FROM goal_with_tag
                     WHERE parent_goal = get_child_goals.id;
    END;
$$ LANGUAGE PLPGSQL;

-- Automatically create the account settings row when an account is created.
CREATE OR REPLACE FUNCTION create_new_user()
RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO ACCOUNT_SETTINGS(account_id) VALUES (NEW.id);
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER trigger_create_new_user
AFTER INSERT ON ACCOUNT FOR EACH ROW
EXECUTE FUNCTION create_new_user();

-- Automatically create a new Dashboard when a profile is created.
CREATE OR REPLACE FUNCTION create_new_profile()
RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO DASHBOARD(profile_id) VALUES (NEW.profile_id);
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER trigger_create_new_profile
AFTER INSERT ON PROFILE FOR EACH ROW
EXECUTE FUNCTION create_new_profile();

-- Automatically update module's completion percent when data is inserted or updated from Goal.
CREATE OR REPLACE FUNCTION calculate_new_module_completion()
RETURNS TRIGGER AS $$
    BEGIN
        CALL update_module_completion();
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER trigger_calculate_new_module_completion
AFTER INSERT OR UPDATE OF is_complete OR DELETE ON GOAL FOR EACH ROW
EXECUTE FUNCTION calculate_new_module_completion();

-- Automatically set last edited with current timestamp if message content has an update.
CREATE OR REPLACE FUNCTION set_last_edited()
RETURNS TRIGGER AS $$
    BEGIN
        NEW.last_edited := CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER trigger_set_last_edited
AFTER UPDATE OF content ON MESSAGE FOR EACH ROW
EXECUTE FUNCTION set_last_edited();

-- Automatically set a completion time and then a expiration date based on the GoalType given after is_complete is set to true.
CREATE OR REPLACE FUNCTION set_goal_timestamps()
RETURNS TRIGGER AS $$
    DECLARE
        new_expiration TIMESTAMP WITH TIME ZONE;
    BEGIN
        IF NEW.is_complete IS TRUE THEN
            NEW.completion_time := CURRENT_TIMESTAMP;
            IF NEW.goal_type != 'todo' THEN
                CASE
                    WHEN NEW.goal_type = 'daily'::GOAL_TYPE THEN new_expiration := CURRENT_TIMESTAMP + INTERVAL '24 hours';
                    WHEN NEW.goal_type = 'weekly'::GOAL_TYPE THEN new_expiration := CURRENT_TIMESTAMP + INTERVAL '1 week';
                    WHEN NEW.goal_type = 'monthly'::GOAL_TYPE THEN new_expiration := CURRENT_TIMESTAMP + INTERVAL '1 month';
                    WHEN NEW.goal_type = 'yearly'::GOAL_TYPE THEN new_expiration := CURRENT_TIMESTAMP + INTERVAL '1 year';
                    ELSE RAISE NOTICE 'Unknown Goal Type.';
                END CASE;
                NEW.expiration := new_expiration;
            END IF;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER trigger_set_expiration
AFTER UPDATE OF is_complete ON GOAL FOR EACH ROW
EXECUTE FUNCTION set_goal_timestamps();

-- Automatically delete sub goals when their parent goal is deleted.
CREATE OR REPLACE FUNCTION delete_sub_goals()
RETURNS TRIGGER AS $$
    BEGIN
        DELETE FROM GOAL WHERE parent_goal = OLD.goal_id;
        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER trigger_delete_sub_goals
AFTER DELETE ON GOAL FOR EACH ROW
EXECUTE FUNCTION delete_sub_goals();
