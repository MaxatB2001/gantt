CREATE USER gantt WITH PASSWORD 'gantt' CREATEDB;
CREATE DATABASE gantt
    WITH
    OWNER = gantt
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;