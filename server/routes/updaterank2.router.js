const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.post("/:id", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  console.log("params id", req.params.id);
  console.log("req body", req.body);
  console.log("req user", req.user);
  const currentBest = req.body.currentBest;
  console.log("currentBest", currentBest);
  const currentWorst = req.body.currentWorst;
  console.log("currentWorst", currentWorst);
  let currentMiddle1 = null;
  let currentMiddle2;
  for (let randomGameInstance of req.body.randomGames) {
    if (
      randomGameInstance.id !== currentBest &&
      randomGameInstance.id !== currentWorst
    ) {
      if (currentMiddle1 === null) {
        currentMiddle1 = randomGameInstance.id;
        console.log("currentMiddle1", currentMiddle1);
      } else {
        currentMiddle2 = randomGameInstance.id;
        console.log("currentMiddle2", currentMiddle2);
      }
    }
  }
  try {
    await client.query("BEGIN");
    let resultsArray = await client.query(
      `SELECT game_id, better_game_id FROM results
    WHERE list_id = $1;`,
      [req.params.id]
    );
    console.log("results array", resultsArray.rows);

    let betterThanCurrentBest = [];
    let betterThanCurrentMiddle1 = [];
    let betterThanCurrentMiddle2 = [];
    let betterThanCurrentWorst = [];
    if (resultsArray.length > 0) {
      for (let result of resultsArray) {
        console.log(result);
        if (result.game_id === currentBest) {
          betterThanCurrentBest.push(result.better_game_id);
        }
        if (result.game_id === currentMiddle1) {
          betterThanCurrentMiddle1.push(result.better_game_id);
        }
        if (result.game_id === currentMiddle2) {
          betterThanCurrentMiddle2.push(result.better_game_id);
        }
        if (result.game_id === currentWorst) {
          betterThanCurrentWorst.push(result.better_game_id);
        }
      }
    }
    let uniqueIDs = [];
    betterThanCurrentBest.forEach((x) => {
      if (!uniqueIDs.includes(x)) {
        uniqueIDs.push(x);
        console.log("failure");
      }
    });
    betterThanCurrentBest = uniqueIDs;
    uniqueIDs = [];
    betterThanCurrentMiddle1.forEach((x) => {
      if (!uniqueIDs.includes(x)) {
        uniqueIDs.push(x);
        console.log("failure");
      }
    });
    betterThanCurrentMiddle1 = uniqueIDs;
    uniqueIDs = [];
    betterThanCurrentMiddle2.forEach((x) => {
      if (!uniqueIDs.includes(x)) {
        uniqueIDs.push(x);
        console.log("failure");
      }
    });
    betterThanCurrentMiddle2 = uniqueIDs;
    uniqueIDs = [];
    betterThanCurrentWorst.forEach((x) => {
      if (!uniqueIDs.includes(x)) {
        uniqueIDs.push(x);
        console.log("failure");
      }
    });
    betterThanCurrentWorst = uniqueIDs;
    if (betterThanCurrentBest.length > 0) {
      for (let game of betterThanCurrentBest) {
        if (!betterThanCurrentMiddle1.includes(game.game_id)) {
          await client.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [currentMiddle1, game.game_id, req.params.id]
          );
        }
        if (!betterThanCurrentMiddle2.includes(game.game_id)) {
          await client.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [currentMiddle2, game.game_id, req.params.id]
          );
        }
        if (!betterThanCurrentWorst.includes(game.game_id)) {
          await client.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [currentWorst, game.game_id, req.params.id]
          );
        }
      }
    }
    if (betterThanCurrentBest.length > 0) {
      for (let game of betterThanCurrentMiddle1) {
        if (!betterThanCurrentWorst.includes(game.game_id)) {
          await client.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [currentWorst, game.game_id, req.params.id]
          );
        }
      }
    }
    if (betterThanCurrentBest.length > 0) {
      for (let game of betterThanCurrentMiddle2) {
        if (!betterThanCurrentWorst.includes(game.game_id)) {
          await client.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [currentWorst, game.game_id, req.params.id]
          );
        }
      }
    }
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
      [currentMiddle1, currentBest, req.params.id]
    );
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
      [currentMiddle2, currentBest, req.params.id]
    );
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
      [currentWorst, currentBest, req.params.id]
    );
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
      [currentWorst, currentMiddle1, req.params.id]
    );
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
      [currentWorst, currentMiddle2, req.params.id]
    );
    await client.query("COMMIT");
    res.sendStatus(200);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error POST /api/randomgames", error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

module.exports = router;
