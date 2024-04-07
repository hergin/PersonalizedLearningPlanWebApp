SELECT 'CREATE DATABASE learningplan'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'learningplan')\gexec

-- You need to be in this directory to run this script properly, otherwise it will fail to load the files.
\c learningplan;
\i learningPlan_tables.sql;
\i learningplan_views.sql;
\i learningplan_procedures.sql;
\i learningplan_triggers.sql;
