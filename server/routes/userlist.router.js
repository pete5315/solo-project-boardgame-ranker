const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  console.log("get user lists 13");
  pool
    .query(
      `SELECT list.*, COUNT(game_junction.game_id) AS length FROM list FULL JOIN game_junction ON game_junction.list_id=list.id WHERE user_id = $1 GROUP BY list.id;`,
      [req.user.id]
    )

    // console.log([sqlText])

    .then((results) => {
      console.log(results.rows);
      res.send(results.rows);
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});

module.exports = router;
