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
RETURNS goal_with_tag AS $$
    BEGIN
        CALL update_is_complete();

        RETURN (SELECT * FROM goal_with_tag WHERE goal_id = get_goal.id);
    END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_goals(id INT)
RETURNS SETOF goal_with_tag AS $$    
    BEGIN
        CALL update_is_complete();
        CALL update_module_completion();

        RETURN QUERY SELECT * FROM goal_with_tag
                     WHERE module_id = get_goals.id;
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

CREATE OR REPLACE FUNCTION create_new_user()
RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO ACCOUNT_SETTINGS(account_id) 
        VALUES (NEW.id);

        RETURN NEW;
    END;
$$ LANGUAGE PLPGSQL;

-- Automatically create the account settings row when an account is created.
CREATE OR REPLACE TRIGGER trigger_create_new_user
AFTER INSERT ON ACCOUNT FOR EACH ROW
EXECUTE FUNCTION create_new_user();
