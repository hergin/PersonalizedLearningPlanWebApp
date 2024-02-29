CREATE OR REPLACE VIEW GOAL_WITH_TAG AS
SELECT * FROM GOAL g JOIN TAG t USING(tag_id);

CREATE OR REPLACE VIEW PUBLIC_USER_DATA AS
SELECT a.id as account_id, p.profile_id as profile_id, p.username as username
FROM ACCOUNT a JOIN PROFILE p ON a.id = p.account_id JOIN ACCOUNT_SETTINGS s ON s.account_id = a.id
WHERE s.allow_coach_invitations IS TRUE;

CREATE OR REPLACE VIEW INVITE_DATA AS
SELECT i.id as id, i.sender_id as sender_id, i.recipient_id as recipient_id, r.email as recipient_email, s.email as sender_email, rp.username as recipient_username, rs.username as sender_username
FROM INVITATION i JOIN ACCOUNT r ON i.recipient_id = r.id JOIN ACCOUNT s ON i.sender_id = s.id JOIN PROFILE rp ON rp.account_id = r.id JOIN PROFILE rs ON rs.account_id = s.id;
