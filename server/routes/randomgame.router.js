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
  .query(`SELECT games_array, data_array FROM lists WHERE id = $1;`, [req.params.id])
  .then((results) => {
    let games=(results.rows[0].games_array)
    let data=(results.rows[0].data_array)
    console.log("games", games);
    console.log("data", data)
    let returnedGames=[]
    let returnedGamesNumber=[]
    for(let i=0; i<4; i++) {
      let rn=Math.floor(Math.random() * games.length); //rn is randomNumber
      console.log(rn, games[rn], returnedGames)
      if(!(returnedGamesNumber.includes(rn))) {
        console.log("added ", games[rn])
        returnedGames.push({name: games[rn], id:rn});
        returnedGamesNumber.push(rn);
        console.log(returnedGamesNumber)
      } else {
        i--;
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
