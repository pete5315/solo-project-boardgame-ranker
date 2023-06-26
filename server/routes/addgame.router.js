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
  if (req.body.id === null) {
    req.body.id = 1;
  }
  console.log("add game data: ", req.body);
  pool
    .query(
      `SELECT name, url FROM game
    JOIN game_junction ON game_junction.game_id=game.id
    JOIN list ON list_id=$1;`,
      [req.body.id]
    )
    .then((results1) => {
      console.log(results1.rows);
      // console.log(oldArray);
      // if (oldArray === null) {
      //   oldArray = [req.body.newGame];
      //   console.log(oldArray);
      // } else {
      //   oldArray.push(req.body.newGame);
      // }
      pool
        .query(
          `INSERT INTO game (name, url)
          VALUES ($1, $2)
          RETURNING id;
          `,
          [req.body.newGame, null]
        )
        .then((results2) => {
          pool
            .query(
              `INSERT INTO game_junction (list_id, game_id)
            VALUES ($1, $2)
            RETURNING id;
            `,
              [req.body.id, results2.rows[0].id]
            )
            .then((results2) => {
              pool
                .query(
                  `SELECT name, url FROM game
              JOIN game_junction ON game_junction.game_id=game.id
              JOIN list ON list_id=$1;`,
                  [req.body.id]
                )
                .then((results3) =>
                  res.send({ rows: results3.rows, id: req.body })
                )
                .catch((error) => {
                  console.log("error at line 56"), error;
                });
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
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});

router.get("/:id", rejectUnauthenticated, (req, res) => {
  if (req.params.id === null) {
    req.params.id = 1;
  }
  console.log("get reqparams", req.params.id);
  pool
    .query(
      `SELECT name, url FROM game
      JOIN game_junction ON game_junction.game_id=game.id
      WHERE game_junction.list_id=$1;`,
      [req.params.id]
    )
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
