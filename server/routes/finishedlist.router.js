const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/:id", rejectUnauthenticated, (req, res) => {
  console.log("get finished list for user: ", req.user.id);
  const queryText = `SELECT game.name, game_junction.id, COALESCE(COUNT(results.game_id), 0) AS count FROM game LEFT JOIN game_junction ON game.id=game_junction.game_id LEFT JOIN results on results.game_id=game_junction.id AND results.list_id=game_junction.list_id WHERE game_junction.list_id=$1 GROUP BY game.name, game_junction.id ORDER BY count ASC;`;
  pool
    .query(queryText, [req.params.id])
    .then((results) => {
      console.log(results.rows);
      results = results.rows;
      let resultArray = [];
      if (results.length) {
        for (let i=0; i<results.length; i++) {
          result=results[i];
          resultArray.push({name: result.name, id: result.id});
          console.log(resultArray);
        }
      }
      res.send(resultArray);
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});

module.exports = router;
