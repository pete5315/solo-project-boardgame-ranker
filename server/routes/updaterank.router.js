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

  try {
    await client.query("BEGIN");
    let resultsArray = await client.query(
      `SELECT game_id, better_game_id FROM results
  WHERE list_id = $1;`,
      [req.params.id]
    );
    resultsArray = resultsArray.rows;
    console.log("resultsarray!!!!", resultsArray);
    //need current better thans for the current best
    //need current better thans for the middle1
    //need current better thans for the middle2

    currentGames.push(currentBest);
    for (let updateNeededInstance of updatesNeeded) {
      if (updateNeededInstance !== null) {
        for (let resultInstance of resultsArray) {
          console.log(
            "resultInstance.game_id is",
            resultInstance.game_id,
            "compared to currentBest.id",
            currentBest
          );
          if (resultInstance.game_id === currentBest) {
            console.log("found that it's better!", resultInstance);
            await client.query(
              `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${updateNeededInstance}, ${resultInstance.better_game_id}, ${listID});`
            );
          }
        }
        await client.query(
          `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${updateNeededInstance}, ${currentBest}, ${listID});`
        );
      }
    }
    if (currentMiddle1 !== null) {
      await client.query(
        `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${currentWorst}, ${currentMiddle1}, ${listID});`
      );
    }
    if (currentMiddle2 !== null) {
      await client.query(
        `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${currentWorst}, ${currentMiddle2}, ${listID});`
      );
    }
    await client.query("COMMIT");
    res.sendStatus(201);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error POST /api/randomgames", error);
    res.sendStatus(201);
  } finally {
    client.release();
  }
});

module.exports = router;
