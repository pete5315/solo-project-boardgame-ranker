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
  console.log(req.body);
  let currentGames = [];
  let currentBest = req.body.currentBest;
  let currentWorst = req.body.currentWorst;
  let currentMiddle1 = null;
  let currentMiddle2 = -1;
  for (let x of req.body.randomGames) {
    if (x.id !== currentBest && x.id !== currentWorst) {
      if (currentMiddle1 === null) {
        currentMiddle1 = x.id;
      } else {
        currentMiddle2 = x.id;
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
  currentGames.push(currentBest);
  let updatesNeeded = [currentMiddle1, currentMiddle2, currentWorst];
  try {
    await client.query("BEGIN");
    for (let x of updatesNeeded) {
      await client.query(
        `INSERT INTO results (game_id, better_game_id) VALUES ($1, $2);`,
        [x, currentBest]
      );
    }
    console.log("line 21");
    await client.query(
      `INSERT INTO results (game_id, better_game_id) VALUES ($1, $2);`,
      [currentWorst, currentMiddle1]
    );
    await client.query(
      `INSERT INTO results (game_id, better_game_id) VALUES ($1, $2);`,
      [currentWorst, currentMiddle2]
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

