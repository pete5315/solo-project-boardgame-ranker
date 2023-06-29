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
  let currentBest = req.body.currentBest;
  let currentWorst = req.body.currentWorst;
  const listID = req.params.id;
  console.log(currentBest, currentWorst, "bestworst");
  console.log(req.params.id, "req.params.id");
  let currentGames = [];
  let currentMiddle1 = null;
  let currentMiddle2 = null;
  for (let randomGameInstance of req.body.randomGames) {
    if (
      randomGameInstance.id !== currentBest &&
      randomGameInstance.id !== currentWorst
    ) {
      if (currentMiddle1 === null) {
        currentMiddle1 = randomGameInstance.id;
      } else {
        currentMiddle2 = randomGameInstance.id;
      }
    }
    console.log(
      "currentBest",
      currentBest,
      "currentMiddle1",
      currentMiddle1,
      "currentMiddle2",
      currentMiddle2,
      "currentWorst",
      currentWorst
    );
  }
  let updatesNeeded = [currentMiddle1, currentMiddle2, currentWorst];
  let resultsArray;
  try {
    await client.query("BEGIN");
    resultsArray = await client.query(
      `SELECT game_id, better_game_id FROM results
  WHERE list_id = $1;`,
      [req.params.id]
    );
    //need current better thans for the current best
    let currentBestResultsArray = await client.query(
      `SELECT better_game_id FROM results
      WHERE list_id = $1 AND game_id=$2;`,
      [req.params.id, currentBest]
    );
    console.log("resultsarray!!!!", resultsArray);
    resultsArray = resultsArray.rows;
    currentBestResultsArray = currentBestResultsArray.rows;
    //need current better thans for the middle1
    let currentMiddle1ResultsArray = await client.query(
      `SELECT better_game_id FROM results
      WHERE list_id = $1 AND game_id=$2;`,
      [req.params.id, currentMiddle1]
    );
    currentMiddle1ResultsArray = currentMiddle1ResultsArray.rows;
    //need current better thans for the middle2
    let currentMiddle2ResultsArray = await client.query(
      `SELECT better_game_id FROM results
      WHERE list_id = $1 AND game_id=$2;`,
      [req.params.id, currentMiddle2]
    );
    currentMiddle2ResultsArray = currentMiddle2ResultsArray.rows;
    console.log(
      "currentbestarray",
      currentBestResultsArray,
      "currentMiddle1ResultsArray",
      currentMiddle1ResultsArray,
      "currentMiddle2ResultsArray",
      currentMiddle2ResultsArray
    );
    await client.query("COMMIT");
  } catch (error) {
    // await client.query("ROLLBACK");
    console.log("Error POST /api/randomgames", error);
    res.sendStatus(201);
  } finally {
    client.release();
  }
  currentGames.push(currentBest);
  for (let updateNeededInstance of updatesNeeded) {
    if (updateNeededInstance !== null) {
      for (let resultInstance of resultsArray) {
        pool.query(
          `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${updateNeededInstance}, ${resultInstance.better_game_id}, ${listID});`
        );
        pool.query(
          `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${updateNeededInstance}, ${currentBest}, ${listID});`
        );
      }
    }
  }
  if (currentMiddle1 !== null) {
    pool.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${currentWorst}, ${currentMiddle1}, ${listID});`
    );
  }

  if (currentMiddle2 !== null) {
    pool.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${currentWorst}, ${currentMiddle2}, ${listID});`
    );
  }
  res.sendStatus(201);
});

module.exports = router;
