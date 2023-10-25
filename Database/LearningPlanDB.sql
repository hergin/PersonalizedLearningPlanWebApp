USE DATABASE LearningPlan;

CREATE TABLE ACCOUNT(
    account_id INT AUTO_INCREMENT,
    username TEXT,
    `password` TEXT,
    email TEXT,
);

CREATE TABLE PROFILE(
    profile_id INT AUTO_INCREMENT;
    firstName TEXT,
    lastName TEXT,
    profilePicture IMAGE,
    jobTitle TEXT,
    bio TEXT,
    account_id INT,
    FOREIGN KEY account_id REFERENCES ACCOUNT(account_id),
);

CREATE TABLE DASHBOARD(
    dashboard_id INT AUTO_INCREMENT,
    profile_id INT,
    learningPlan_id INT,
    FOREIGN KEY profile_id REFERENCES `PROFILE`(profile_id),
    FOREIGN KEY learningPlan_id REFERENCES LEARNING_PLAN(learningPlan_id),
);

CREATE TABLE LEARNING_PLAN(
    leanringPlan_id INT AUTO_INCREMENT,
    module_id INT,
    -- Personal Check
    goal TEXT,
    FOREIGN KEY module_id REFERENCES MODULE(module_id), 
);

CREATE TABLE MODULE(
    module_id INT AUTO_INCREMENT,
    module_name TEXT, 
    completion_percent INT,
    -- Goals to complete the module.
    sub_goals TEXT[],
);
