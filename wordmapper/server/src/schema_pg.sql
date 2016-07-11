-----------------------------------------------------------------------
-- PSQL SETTINGS
SET client_min_messages TO WARNING;

-----------------------------------------------------------------------
-- CREATE TABLES
DROP TABLE IF EXISTS user_account CASCADE;
CREATE TABLE user_account (
	id serial PRIMARY KEY,
	email text not null UNIQUE,
	password text,
  active boolean not null default true,
	created timestamp default current_timestamp
);

DROP TABLE IF EXISTS user_admin CASCADE;
CREATE TABLE user_admin (
  email text not null PRIMARY KEY,
  created timestamp default current_timestamp
);

DROP TABLE IF EXISTS page CASCADE;
CREATE TABLE page (
	id serial PRIMARY KEY,
	url text not null,
	created timestamp default current_timestamp
);

DROP TABLE IF EXISTS source CASCADE;
CREATE TABLE source (
	id serial PRIMARY KEY,
	hash char(40) not null UNIQUE,
	normalized text,
	original text,
	created timestamp default current_timestamp
);

DROP TABLE IF EXISTS page_source CASCADE;
CREATE TABLE page_source (
	id serial PRIMARY KEY,
	page_id integer not null REFERENCES page(id) ON DELETE CASCADE,
	source_id integer not null REFERENCES source(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS alignment CASCADE;
CREATE TABLE alignment (
	id serial PRIMARY KEY,
	user_id integer REFERENCES user_account(id) ON DELETE CASCADE,
	comment text,
	created timestamp default current_timestamp,
	updated timestamp
);

DROP TABLE IF EXISTS word CASCADE;
CREATE TABLE word (
	id serial PRIMARY KEY,
	alignment_id integer not null REFERENCES alignment(id) ON DELETE CASCADE,
  source_hash integer not null REFERENCES source(hash) ON DELETE RESTRICT,
	word_index integer not null CONSTRAINT index_check CHECK (word_index >= 0),
  word_value text not null
);

