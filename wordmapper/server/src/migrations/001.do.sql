SET client_min_messages TO WARNING;

CREATE TABLE user_account (
	id serial PRIMARY KEY,
	email text not null UNIQUE,
	password text,
	active boolean not null default true,
	created timestamp default current_timestamp
);

CREATE TABLE user_admin (
	email text not null PRIMARY KEY,
	created timestamp default current_timestamp
);

CREATE TABLE page (
	id serial PRIMARY KEY,
	url text not null UNIQUE,
	created timestamp default current_timestamp
);

CREATE TABLE source (
	id serial PRIMARY KEY,
	hash char(40) not null UNIQUE,
	normalized text,
	original text,
	created timestamp default current_timestamp
);

CREATE TABLE page_source (
	id serial PRIMARY KEY,
	page_id integer not null REFERENCES page(id) ON DELETE CASCADE,
	source_id integer not null REFERENCES source(id) ON DELETE CASCADE,
	version integer not null default 1 CONSTRAINT version_check CHECK (version > 0),
	created timestamp default current_timestamp
);

CREATE TABLE alignment (
	id serial PRIMARY KEY,
	user_id integer REFERENCES user_account(id) ON DELETE CASCADE,
	comment text,
	created timestamp default current_timestamp,
	updated timestamp
);

CREATE TABLE word (
	id serial PRIMARY KEY,
	alignment_id integer not null REFERENCES alignment(id) ON DELETE CASCADE,
	source_id integer not null REFERENCES source(id) ON DELETE RESTRICT,
	word_index integer not null CONSTRAINT index_check CHECK (word_index >= 0),
	word_value text not null
);

CREATE OR REPLACE VIEW user_account_view AS 
SELECT 
	u.*, 
	(CASE WHEN a.email IS NOT NULL THEN TRUE ELSE FALSE END) AS is_admin
FROM user_account u
LEFT OUTER JOIN (SELECT email FROM user_admin) a ON (u.email = a.email);
