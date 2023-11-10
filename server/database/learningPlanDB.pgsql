CREATE TABLE IF NOT EXISTS ACCOUNT(
    account_id SERIAL PRIMARY KEY,
    username TEXT,
    account_password TEXT,
    email TEXT
);

CREATE TABLE IF NOT EXISTS PROFILE(
    profile_id SERIAL PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    profilePicture TEXT,
    jobTitle TEXT,
    bio TEXT,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES ACCOUNT(account_id)
);

CREATE TABLE IF NOT EXISTS MODULE(
    module_id SERIAL PRIMARY KEY,
    module_name TEXT, 
    completion_percent INT,
    -- Goals to complete the module.
    sub_goals TEXT[]
);

CREATE TABLE IF NOT EXISTS LEARNING_PLAN(
    learningPlan_id SERIAL PRIMARY KEY,
    module_id INT,
    -- Personal Check
    goal TEXT,
    FOREIGN KEY (module_id) REFERENCES MODULE(module_id)
);

CREATE TABLE IF NOT EXISTS DASHBOARD(
    dashboard_id SERIAL PRIMARY KEY,
    profile_id INT,
    learningPlan_id INT,
    FOREIGN KEY (profile_id) REFERENCES PROFILE(profile_id),
    FOREIGN KEY (learningPlan_id) REFERENCES LEARNING_PLAN(learningPlan_id)
);
