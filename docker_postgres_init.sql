CREATE USER person WITH PASSWORD 'person' CREATEDB;
CREATE DATABASE person
    WITH
    OWNER = person
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;