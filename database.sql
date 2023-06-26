-- database name: boardgame_ranker

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "list" (
	"id" SERIAL PRIMARY KEY,
	"date" DATE DEFAULT Now(),
	"completed" BOOLEAN DEFAULT FALSE,
	"user_id" INTEGER REFERENCES "user"
);

CREATE TABLE "game" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (1000) NOT NULL,
	"url" VARCHAR (1000)
);

CREATE TABLE "game_junction" (
	"id" SERIAL PRIMARY KEY,
	"list_id" INTEGER REFERENCES "list",
	"game_id" INTEGER REFERENCES "game"
);

CREATE TABLE "matchup" (
	"id" SERIAL PRIMARY KEY,
	"date" DATE DEFAULT Now(),
	"game_id1" INTEGER REFERENCES "game",
	"game_id2" INTEGER REFERENCES "game",
	"game_id3" INTEGER REFERENCES "game",
	"game_id4" INTEGER REFERENCES "game"
);

CREATE TABLE "decision" (
	"id" SERIAL PRIMARY KEY,
	"best_id" INTEGER REFERENCES "game",
	"worst_id" INTEGER REFERENCES "game",
	"matchup_id" INTEGER REFERENCES "matchup",
	"list_id" INTEGER REFERENCES "list"
);

CREATE TABLE "data" (
	"id" SERIAL PRIMARY KEY,
	"list_id" INTEGER REFERENCES "user",
	"game_id" INTEGER REFERENCES "user",
	"better_game_id" INTEGER REFERENCES "user"
);