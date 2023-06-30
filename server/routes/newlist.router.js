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
  console.log("get new list for user: ", req.user.id);
        pool
        .query(`INSERT INTO "list" (user_id)
        VALUES (${req.user.id}) RETURNING id`)
        .then((results) => {
          console.log("results.rows", results.rows[0].id);
          res.send([results.rows[0].id]);
        })
        .catch((err) => {
          res.sendStatus(500);
          console.log("SERVER SIDE ERROR", err);
        });
});

module.exports = router;
