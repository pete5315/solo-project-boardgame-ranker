const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.put("/:id/:better/:worse", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  console.log(
    "editfinishedlist",
    req.params.id,
    req.params.better,
    req.params.worse
  );
  try {
    await client.query("BEGIN");
    //swap the game_id and better_game_id for the input
    await client.query(
      `UPDATE results SET better_game_id = ${req.params.better}, game_id = ${req.params.worse} WHERE list_id = ${req.params.id} AND better_game_id = ${req.params.worse} AND game_id = ${req.params.better};`
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
