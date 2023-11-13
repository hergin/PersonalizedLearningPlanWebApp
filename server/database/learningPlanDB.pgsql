DROP TABLE IF EXISTS ACCOUNT CASCADE;
CREATE TABLE ACCOUNT(
    email TEXT PRIMARY KEY,
    username TEXT,
    account_password TEXT
);

DROP TABLE IF EXISTS PROFILE CASCADE;
CREATE TABLE PROFILE(
    profile_id SERIAL PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    profilePicture TEXT,
    jobTitle TEXT,
    bio TEXT,
    email TEXT,
    FOREIGN KEY (email) REFERENCES ACCOUNT(email)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS MODULE CASCADE;
CREATE TABLE MODULE(
    module_id SERIAL PRIMARY KEY,
    module_name TEXT, 
    completion_percent INT,
    -- Goals to complete the module.
    sub_goals TEXT,
    email TEXT,
    FOREIGN KEY (email) REFERENCES ACCOUNT(email)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS LEARNING_PLAN CASCADE;
CREATE TABLE LEARNING_PLAN(
    learningPlan_id SERIAL PRIMARY KEY,
    -- Personal Check
    goal TEXT
);

DROP TABLE IF EXISTS DASHBOARD CASCADE;
CREATE TABLE DASHBOARD(
    dashboard_id SERIAL PRIMARY KEY,
    profile_id INT,
    learningPlan_id INT,
    FOREIGN KEY (profile_id) REFERENCES PROFILE(profile_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (learningPlan_id) REFERENCES LEARNING_PLAN(learningPlan_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);
