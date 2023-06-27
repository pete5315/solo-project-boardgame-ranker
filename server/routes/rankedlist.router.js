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
  console.log("get ranked list for user: ", req.user.id);
  const queryText = `SELECT name, count() FROM "results" WHERE games_array is NULL RETURNING id`;
  pool
    .query(queryText)
    .then((results1) => {
      console.log(results1)
      const secondQueryText = `INSERT INTO "lists" (user_id)
      VALUES ($1) RETURNING id`;
        pool
        .query(secondQueryText, [req.user.id])
        .then((results) => {
          console.log(results.rows);
          res.send(results.rows);
        })
        .catch((err) => {
          console.log("SERVER SIDE ERROR", err);
        });
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});

module.exports = router;
