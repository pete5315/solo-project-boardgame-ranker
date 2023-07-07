-- database name: boardgame_ranker

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username character varying(80) NOT NULL UNIQUE,
    password character varying(1000) NOT NULL
);

CREATE TABLE list (
    id SERIAL PRIMARY KEY,
    date date DEFAULT now(),
    completed boolean DEFAULT false,
    user_id integer REFERENCES "user"(id)
);

CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    name character varying(1000) NOT NULL,
    url character varying(1000),
    thumbnail character varying(1000)
);

CREATE TABLE game_junction (
    id SERIAL PRIMARY KEY,
    list_id integer REFERENCES list(id) ON DELETE CASCADE,
    game_id integer REFERENCES game(id) ON DELETE CASCADE
);

CREATE TABLE matchup (
    id SERIAL PRIMARY KEY,
    date date DEFAULT now(),
    game_id1 integer REFERENCES game(id),
    game_id2 integer REFERENCES game(id),
    game_id3 integer REFERENCES game(id),
    game_id4 integer REFERENCES game(id),
    list_id integer REFERENCES list(id) ON DELETE CASCADE
);

CREATE TABLE decision (
    id SERIAL PRIMARY KEY,
    best_id integer REFERENCES game(id),
    worst_id integer REFERENCES game(id),
    matchup_id integer REFERENCES matchup(id),
    list_id integer REFERENCES list(id)
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    list_id integer REFERENCES list(id),
    game_id integer REFERENCES game_junction(id) ON DELETE CASCADE,
    better_game_id integer REFERENCES game_junction(id) ON DELETE CASCADE
);