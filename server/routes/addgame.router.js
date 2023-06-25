const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.post("/", rejectUnauthenticated, (req, res) => {
  console.log("add game data: ", req.body);
  pool
    .query(`SELECT games_array FROM lists WHERE id = $1;`, [req.body.id])
    .then((results) => {
      let oldArray=results.rows[0].games_array
      console.log(oldArray);
      if(oldArray===null) {
        oldArray=[req.body.newGame];
        console.log(oldArray)
      } else {
        oldArray.push(req.body.newGame)
      }
      pool
        .query(`UPDATE lists SET games_array = $1 WHERE id = $2 RETURNING games_array;`, [oldArray, req.body.id])
        .then((results) => {
          console.log(results.rows);
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log("SERVER SIDE ERROR", err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  pool
  .query(`SELECT games_array FROM lists WHERE id = $1;`, [req.params.id])
  .then((results) => {
    console.log(results.rows)
    res.send(results.rows)
  })
  .catch((err) => {
    console.log("SERVER SIDE ERROR", err);
    res.sendStatus(500);
  });

})
module.exports = router;
