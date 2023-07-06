const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.delete("/:id", rejectUnauthenticated, (req, res) => {
  if (req.params.id === null) {
    req.params.id = 1;
  }
  console.log("get reqparams15", req.params.id);
  pool
    .query(
      `DELETE FROM list
      WHERE id= $1;
      `,
      [req.params.id]
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});
module.exports = router;
