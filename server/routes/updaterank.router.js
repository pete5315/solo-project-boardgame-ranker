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
  console.log("req.body", req.body);
  console.log(req.params.id, "req.params.id")
  const listID=req.params.id;
  let currentGames = [];
  let currentBest = req.body.currentBest;
  let currentWorst = req.body.currentWorst;
  let currentMiddle1 = null;
  let currentMiddle2 = -1;
  for (let x of req.body.randomGames) {
    if (x.id !== currentBest && x.id !== currentWorst) {
      if (currentMiddle1 === null) {
        currentMiddle1 = x.id;
        console.log("currentmiddle2",currentMiddle1)
      } else {
        currentMiddle2 = x.id;
        console.log("currentmiddle2", currentMiddle2)
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
      console.log("x",x, currentBest);
      await client.query(
        `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${x}, ${currentBest}, ${listID});`
      );
    }
    console.log("line 21", updatesNeeded);
    console.log(currentWorst, currentMiddle1, "worstmiddle1")
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${currentWorst}, ${currentMiddle1}, ${listID});`
    );
    console.log(currentWorst, currentMiddle2, "worstmiddle2")
    await client.query(
      `INSERT INTO results (game_id, better_game_id, list_id) VALUES (${currentWorst}, ${currentMiddle2}, ${listID});`
    );
    await client.query("COMMIT");
    console.log('finished updating');
    res.sendStatus(201);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error POST /api/randomgames", error);
    res.sendStatus(500);
  } finally {
    console.log('finally')
    client.release();
    console.log('finally2')
  }
});

module.exports = router;

