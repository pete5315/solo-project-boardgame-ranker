const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

router.get("/:id", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  console.log(req.params.id);
  try {
    await client.query("BEGIN");
    let resultsArray = await client.query(
      `SELECT game_id, better_game_id FROM results
    WHERE list_id = $1;`,
      [req.params.id]
    );
    console.log("line 21");
    let gamesArray = await client.query(
      `SELECT game.id, game.name FROM game JOIN game_junction ON game_junction.game_id=game.id WHERE game_junction.list_id=$1;`,
      [req.params.id]
    );

    resultsArray = resultsArray.rows;
    gamesArray = gamesArray.rows;

    console.log("games array", gamesArray);
    console.log("results array", resultsArray);

    let returnedGames = [];
    let returnedGamesNumber = [-1];

    for (let i = 0; i < 4; i++) {
      let rn = Math.floor(Math.random() * gamesArray.length); //rn is randomNumber
      let currentGame = gamesArray[rn];
      console.log(rn, currentGame, returnedGames);
      let skip = 0;
      for (let j = 0; j < resultsArray.length; j++) {
        let x = resultsArray[j];
        console.log(x, currentGame);
        for (let alreadyAddedGame of returnedGames) {
          console.log(
            "alreadyadded",
            alreadyAddedGame,
            "x.better",
            x.better_game_id
          );
          if (alreadyAddedGame.id === x.game_id) {
            if (currentGame.id === x.better_game_id) {
              console.log("skipped!", currentGame.name);
              skip = -1;
            }
          }
        }
      }
      if (skip === -1) {
        rn = -1;
      }
      if (!returnedGamesNumber.includes(rn)) {
        console.log("line 51", rn);
        console.log("added ", currentGame.name);
        returnedGames.push({ name: currentGame.name, id: currentGame.id });
        returnedGamesNumber.push(rn);
        console.log(returnedGamesNumber);
        console.log(returnedGames);
      } else {
        i--;
      }
    }

    // await Promise.all(
    //   returnedGames.map((game) => {
    //     const insertLineItemText = `INSERT INTO "line_item" ("order_id", "pizza_id", "quantity") VALUES ($1, $2, $3)`;
    //     const insertLineItemValues = [orderId, pizza.id, pizza.quantity];
    //     return client.query(insertLineItemText, insertLineItemValues);
    //   })
    // )
    await client.query("COMMIT");
    res.send(returnedGames);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error POST /api/randomgames", error);
    res.sendStatus(500);
  } finally {
    client.release();
  }

  //   pool
  //     .query(
  //       `SELECT game_id, better_game_id FROM results
  //   WHERE list_id = $1;`,
  //       [req.params.id]
  //     )
  //     .then((results) => {
  //       console.log(results);
  //       let games = results.rows[0];
  //       let data = results.rows[0];
  //       console.log("games", games);
  //       console.log("data", data);
  //       let returnedGames = [];
  //       let returnedGamesNumber = [];
  //       for (let i = 0; i < 4; i++) {
  //         let rn = Math.floor(Math.random() * games.length); //rn is randomNumber
  //         console.log(rn, games[rn], returnedGames);
  //         if (!returnedGamesNumber.includes(rn)) {
  //           console.log("added ", games[rn]);
  //           returnedGames.push({ name: games[rn], id: rn });
  //           returnedGamesNumber.push(rn);
  //           console.log(returnedGamesNumber);
  //         } else {
  //           i--;
  //         }
  //       }
  //       res.send(returnedGames);
  //     })
  //     .catch((err) => {
  //       console.log("SERVER SIDE ERROR", err);
  //       res.sendStatus(500);
  //     });
});
module.exports = router;
