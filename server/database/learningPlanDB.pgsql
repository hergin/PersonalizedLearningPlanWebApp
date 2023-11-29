DROP TABLE IF EXISTS ACCOUNT CASCADE;
CREATE TABLE ACCOUNT(
    email TEXT PRIMARY KEY,
    username TEXT,
    account_password TEXT,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
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
    description TEXT,
    completion_percent INT,
    email TEXT,
    FOREIGN KEY (email) REFERENCES ACCOUNT(email)
        ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS GOAL CASCADE;
CREATE TABLE GOAL(
    goal_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    completion_perc BOOLEAN,
    module_id SERIAL,
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
