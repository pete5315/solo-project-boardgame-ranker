const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.get("/:id", rejectUnauthenticated, (req, res) => {
  console.log(req.params.id)
  pool
  .query(`SELECT games_array FROM lists WHERE id = $1;`, [req.params.id])
  .then((results) => {
    let games=(results.rows[0].games_array)
    console.log(games);
    let returnedGames=[]
    for(let i=0; i<4; i) {
      let randomNumber=Math.floor(Math.random() * games.length);
      if(!returnedGames.includes(games[randomNumber])) {
        console.log("added ", games[randomNumber])
        returnedGames.push(games[randomNumber]);
        i++;
      }
    }
    res.send(returnedGames);
  })
  .catch((err) => {
    console.log("SERVER SIDE ERROR", err);
    res.sendStatus(500);
  });

})
module.exports = router;
