SELECT 'CREATE DATABASE learningplan'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'learningplan')\gexec
\c learningplan;
\i learningPlan_tables.sql;
\i learningplan_functions.sql;
