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
