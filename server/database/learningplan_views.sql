CREATE OR REPLACE VIEW GOAL_WITH_TAG AS
SELECT * FROM GOAL g LEFT JOIN TAG t USING(tag_id);

CREATE OR REPLACE VIEW PUBLIC_USER_DATA AS
SELECT a.id as account_id, p.profile_id as profile_id, p.username as username
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id JOIN ACCOUNT_SETTINGS s ON s.account_id = a.id
WHERE s.allow_coach_invitations IS TRUE;

CREATE OR REPLACE VIEW INVITE_DATA AS
SELECT i.id as id, i.sender_id as sender_id, i.recipient_id as recipient_id, r.email as recipient_email, s.email as sender_email, rp.username as recipient_username, rs.username as sender_username
FROM INVITATION i JOIN ACCOUNT r ON i.recipient_id = r.id JOIN ACCOUNT s ON i.sender_id = s.id JOIN PROFILE rp ON rp.account_id = r.id JOIN PROFILE rs ON rs.account_id = s.id;

CREATE OR REPLACE VIEW UNDERSTUDY_DATA AS
SELECT a.id as account_id, p.profile_id as profile_id, p.username as username, a.coach_id as coach_id
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id;

CREATE OR REPLACE VIEW MESSAGE_DATA AS
SELECT m.id as id, m.content as content, m.date as date, m.last_edited as last_edited, m.recipient_id as recipient_id, m.sender_id as sender_id, p.username as username, p.profile_picture as profile_picture
FROM MESSAGE m JOIN ACCOUNT a ON a.id = m.sender_id JOIN PROFILE p ON a.id = p.account_id;

CREATE OR REPLACE VIEW USER_DATA AS
SELECT a.id as account_id, a.email as email, p.profile_id as profile_id, p.username as username
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id;

