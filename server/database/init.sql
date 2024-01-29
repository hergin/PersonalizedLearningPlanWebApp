SELECT 'CREATE DATABASE learningplan'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'learningplan')\gexec
\c learningplan;
\i learningplan_tables.sql;
\i learningplan_functions.sql;
