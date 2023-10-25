USE DATABASE LearningPlan;

CREATE TABLE ACCOUNT(
    username TEXT,
    `password` TEXT,
    email TEXT,
);

CREATE TABLE PROFILE(
    firstName TEXT,
    lastName TEXT,
    profilePicture IMAGE,
    jobTitle TEXT,
    bio TEXT,
);
