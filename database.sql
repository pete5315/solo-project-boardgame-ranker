CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "lists" (
	"id" SERIAL PRIMARY KEY,
	"date" DATE,
	"completed" BOOLEAN DEFAULT FALSE,
	"decisions_array" VARCHAR[] null,
	"data_array" VARCHAR[] null,
	"games_array" VARCHAR[] null,
	"matchups_array" VARCHAR[] null,
	"user_id" INTEGER REFERENCES users
);