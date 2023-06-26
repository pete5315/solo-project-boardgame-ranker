const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.post("/:id", rejectUnauthenticated, (req, res) => {
  console.log(req.body);
  let currentGames = [];
  let currentBest = req.body.currentBest;
  let currentWorst = req.body.currentWorst;
  for (let entry of req.body.randomGames) {
    currentGames.push(entry.id);
  }
  console.log(currentGames);
  let newDataArray = [];

  pool
    .query(`SELECT data_array FROM lists WHERE id = $1;`, [req.params.id])
    .then((results) => {
      console.log(results.rows);
      let newDatum = [];
      let i = 0;
      for (let data of results.rows[0].data_array) {
        console.log("data", data);
        console.log("data_array", results.rows[0].data_array);
        console.log("i", i);
        if (currentGames.includes(i)) {
          if (currentBest === i) {
            console.log("best!")
            if (newDatum.length > 0) {
              newDatum.push(data);
            }
          } else if (currentWorst === i) {
            console.log("worst!")
            if (newDatum.length > 0) {
              newDatum.push(data);
            }
            for (let x of currentGames) {
              console.log("x",x)
              if (!(x === i)) {
                newDatum.push(x);
              }
            }
          } else {
            console.log("middle!");
            newDatum.push(currentBest);
          }
        } else {
          console.log("not included");
          if (newDatum.length > 0) {
            newDatum.push(data);
          }
        }
        newDataArray.push(newDatum);
        newDatum=[];
        i++;
        console.log(newDataArray);
      }
      let returnedGames = [];
      res.send(returnedGames);
    })
    .catch((err) => {
      console.log("SERVER SIDE ERROR", err);
      res.sendStatus(500);
    });
});
module.exports = router;
