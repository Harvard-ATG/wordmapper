DROP TABLE IF EXISTS user_account CASCADE;
CREATE TABLE user_account (
	id serial PRIMARY KEY,
	email text not null,
	password text,
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
	hash char(40) not null,
	content text,
	created timestamp default current_timestamp
);

DROP TABLE IF EXISTS page_source CASCADE;
CREATE TABLE page_source (
	id serial PRIMARY KEY,
	page_id integer not null REFERENCES page(id),
	source_id integer not null REFERENCES source(id)
);

DROP TABLE IF EXISTS alignment CASCADE;
CREATE TABLE alignment (
	id serial PRIMARY KEY,
	user_id integer REFERENCES user_account(id),
	comment text,
	created timestamp default current_timestamp,
	updated timestamp
);

DROP TABLE IF EXISTS word CASCADE;
CREATE TABLE word (
	id serial PRIMARY KEY,
	value text not null,
	index integer not null,
	source_id integer not null REFERENCES source(id)
);

DROP TABLE IF EXISTS alignment_word CASCADE;
CREATE TABLE alignment_word (
	id serial PRIMARY KEY,
	alignment_id integer not null REFERENCES alignment(id),
	word_id integer not null REFERENCES word(id)
);
