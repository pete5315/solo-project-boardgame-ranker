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
    let gamesLength = gamesArray.length;
    let returnedGamesNumber = [-1];
    let skippedGames = [];

    console.log(
      "results length",
      resultsArray.length,
      "games length",
      gamesLength
    );
    let returnedGames = [];
    //check if complete
    console.log(((gamesLength + 1) / 2) * gamesLength)
    if (((gamesLength - 1) / 2) * gamesLength === resultsArray.length) {
      returnedGames.push("complete");
    } else {
      //if not complete
      let n = 4; //set up the number of games per page to its default
      let l = 0; //stop infinite loops
      for (let i = 0; i < n; i++) {
        let rn = Math.floor(Math.random() * gamesArray.length); //rn is randomNumber
        let currentGame = gamesArray[rn];
        console.log("current game", currentGame);
        let skip = 0;
        //check if the default is too high and set it to compare to 1 or 2 instead of 3 and skip if it's already the best
        if (i === 0) {
          let nCheck = await client.query(
            `SELECT COUNT(results.game_id) FROM results
          WHERE (better_game_id = $1 OR game_id = $1) AND list_id = $2;`,
            [currentGame.id, req.params.id]
          );
          nCheck = nCheck.rows[0].count;
          console.log("gamesArray.length-1-nCheck", gamesLength - 1 - nCheck);
          if (gamesLength - 1 - nCheck <= 0) {
            skippedGames.push(currentGame.id);
            skip = -1;
          } else if (gamesLength - 1 - nCheck < 4) {
            if (n > gamesLength - nCheck) {
              n = gamesLength - nCheck;
            }
          }

        }
        if (skippedGames.length===gamesArray.length) {
          i=n+1;
          console.log("HEY LOOK OVER HERE HEY HEY HEY")
        }        console.log("skipped games", skippedGames);
        console.log("line 71", rn, currentGame, returnedGames);
        console.log("l", l);
        if (!skippedGames.includes(currentGame.id)) {
          for (let j = 0; j < resultsArray.length; j++) {
            let x = resultsArray[j];
            // console.log(x, currentGame);
            for (let i = 0; i < returnedGames.length; i++) {
              let alreadyAddedGame = returnedGames[i];
              if (alreadyAddedGame.id === x.game_id) {
                if (currentGame.id === x.better_game_id) {
                  console.log(
                    "skipped!",
                    currentGame.name,
                    x,
                    alreadyAddedGame
                  );
                  skip = -1;
                  skippedGames.push(currentGame.id);
                  j = resultsArray.length;
                }
              } else {
                for (let k = 0; k < returnedGames.length; k++) {
                  let alreadyAddedGame = returnedGames[k];
                  if (currentGame.id === x.game_id) {
                    if (alreadyAddedGame.id === x.better_game_id) {
                      console.log("skipped!", currentGame.name);
                      skip = -1;
                      skippedGames.push(currentGame.id);
                      j = resultsArray.length;
                    }
                  }
                }
              }
            }
          }
        } else {
          console.log("we skipped a game");
          skip = -1;
        }
        let skipCheck;
        if (skip === -1) {
          skipCheck = -1;
        } else {
          skipCheck = currentGame.id;
        }
        if (!returnedGamesNumber.includes(skipCheck)) {
          console.log("line 108", skipCheck);
          console.log("added ", currentGame.name);
          returnedGames.push({ name: currentGame.name, id: currentGame.id });
          returnedGamesNumber.push(currentGame.id);
          skippedGames.push(currentGame.id);
          let gameArray1 = await client.query(
            `SELECT results.better_game_id FROM results WHERE results.list_id=$1 AND results.game_id=$2;`,
            [req.params.id, currentGame.id]
          );
          gameArray1 = gameArray1.rows;
          for (let x of gameArray1) {
            console.log(
              "for ",
              currentGame.name,
              "better games are ",
              x.better_game_id
            );
            skippedGames.push(x.better_game_id);
          }
          
          let gameArray2 = await client.query(
            `SELECT results.game_id FROM results WHERE results.list_id=$1 AND results.better_game_id=$2;`,
            [req.params.id, currentGame.id]
          );
          gameArray2 = gameArray2.rows;
          console.log(gameArray2)
          for (let x of gameArray2) {
            console.log(
              "for ",
              currentGame.name,
              "worse games are ",
              x.game_id
            );
            skippedGames.push(x.game_id);
          }
          console.log(returnedGamesNumber);
          console.log(returnedGames);
          skippedGames=[...new Set(skippedGames)];
          console.log("line 155, skipped games", skippedGames)
          l++;
        } else {
          console.log(
            "we skipped adding a game",
            currentGame.name,
            returnedGames
          );
          i--;
          l++;
          if (l > 1000) {
            i++;
          }
          console.log(l);
        }
      }
    }

    // await Promise.all(
    //   returnedGames.map((game) => {
    //     const insertLineItemText = `INSERT INTO "line_item" ("order_id", "pizza_id", "quantity") VALUES ($1, $2, $3)`;//enter into matchups and decisions
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
});
module.exports = router;
