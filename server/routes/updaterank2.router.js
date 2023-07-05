const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");
const postRequestUpdateRank = require("../modules/post-request-update-rank");
const onlyUniques = require("../modules/only-uniques");

const router = express.Router();



router.post("/:id", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  // console.log("params id", req.params.id);
  // console.log("req body", req.body);
  // console.log("req user", req.user);
  const currentBest = req.body.currentBest;
  // console.log("currentBest", currentBest);
  const currentWorst = req.body.currentWorst;
  console.log("21", req.body.randomGames);
  console.log("currentWorst", currentWorst);
  let currentMiddle1 = null;
  let currentMiddle2 = null;
  let newResultsArray = [];
  for (let randomGameInstance of req.body.randomGames) {
    if (
      randomGameInstance.id !== currentBest &&
      randomGameInstance.id !== currentWorst
    ) {
      if (currentMiddle1 === null) {
        currentMiddle1 = randomGameInstance.id;
        // console.log("currentMiddle1", currentMiddle1);
      } else {
        currentMiddle2 = randomGameInstance.id;
        // console.log("currentMiddle2", currentMiddle2);
      }
    }
  }
  console.log("CM1, CM2", currentMiddle1, currentMiddle2);
  // pool.query(
  //   `INSERT INTO matchup (game_id1, game_id2, game_id3, game_id4, list_id) VALUES ($1, $2, $3, $4, $5);`,
  //   [currentBest, currentWorst, currentMiddle1, currentMiddle2, req.params.id]
  // );
  try {
    await client.query("BEGIN");
    let resultsArray = await client.query(
      `SELECT game_id, better_game_id FROM results
    WHERE list_id = $1;`,
      [req.params.id]
    );
    console.log("results array", resultsArray.rows);

    let betterThanCurrentBest = [];
    let betterThanCurrentMiddle1 = [];
    let betterThanCurrentMiddle2 = [];
    let betterThanCurrentWorst = [];
    let currentBestIsBetterThan = [];
    let currentMiddle1IsBetterThan = [];
    let currentMiddle2IsBetterThan = [];
    let currentWorstIsBetterThan = [];
    let addForCurrentBest = [];
    let addForCurrentMiddle1Better = [];
    let addForCurrentMiddle1Worse = [];
    let addForCurrentMiddle2Better = [];
    let addForCurrentMiddle2Worse = [];
    let addForCurrentWorst = [];
    if (resultsArray.rows.length > 0) {
      for (let result of resultsArray.rows) {
        if (result.game_id === currentBest) {
          betterThanCurrentBest.push(result.better_game_id);
        }
        if (result.game_id === currentMiddle1) {
          betterThanCurrentMiddle1.push(result.better_game_id);
        }
        if (result.game_id === currentMiddle2) {
          betterThanCurrentMiddle2.push(result.better_game_id);
        }
        if (result.game_id === currentWorst) {
          betterThanCurrentWorst.push(result.better_game_id);
        }
        if (result.better_game_id === currentBest) {
          currentBestIsBetterThan.push(result.game_id);
        }
        if (result.better_game_id === currentMiddle1) {
          currentMiddle1IsBetterThan.push(result.game_id);
        }
        if (result.better_game_id === currentMiddle2) {
          currentMiddle2 && currentMiddle2IsBetterThan.push(result.game_id);
        }
        if (result.better_game_id === currentWorst) {
          currentWorstIsBetterThan.push(result.game_id);
        }
      }
    }

    onlyUniques(
      currentMiddle1IsBetterThan
        .concat(currentMiddle2IsBetterThan)
        .concat(currentWorstIsBetterThan)
    ).forEach((x) => {
      if (!currentBestIsBetterThan.includes(x)) {
        addForCurrentBest.push(x);
      }
    });

    betterThanCurrentBest.forEach((x) => {
      if (!betterThanCurrentMiddle1.includes(x)) {
        addForCurrentMiddle1Worse.push(x);
      }
    });
    currentWorstIsBetterThan.forEach((x) => {
      if (!currentMiddle1IsBetterThan.includes(x)) {
        addForCurrentMiddle1Better.push(x);
      }
    });

    betterThanCurrentBest.forEach((x) => {
      if (!betterThanCurrentMiddle2.includes(x)) {
        addForCurrentMiddle2Worse.push(x);
      }
    });
    currentWorstIsBetterThan.forEach((x) => {
      if (!currentMiddle2IsBetterThan.includes(x)) {
        addForCurrentMiddle2Better.push(x);
      }
    });

    onlyUniques(
      betterThanCurrentBest
        .concat(betterThanCurrentMiddle1)
        .concat(betterThanCurrentMiddle2)
    ).forEach((x) => {
      if (!betterThanCurrentWorst.includes(x)) {
        addForCurrentWorst.push(x);
      }
    });

    console.log(
      "139",
      addForCurrentBest,
      addForCurrentMiddle1Better,
      addForCurrentMiddle1Worse,
      addForCurrentMiddle2Better,
      addForCurrentMiddle2Worse,
      addForCurrentWorst
    );

    await postRequestUpdateRank(
      addForCurrentBest
        .concat(currentMiddle1)
        .concat(currentMiddle2)
        .concat(currentWorst),
      currentBest,
      req.params.id,
      true
    );
    await postRequestUpdateRank(
      addForCurrentMiddle1Better.concat(currentWorst),
      currentMiddle1,
      req.params.id,
      true
    );
    await postRequestUpdateRank(
      addForCurrentMiddle1Worse,
      currentMiddle1,
      req.params.id,
      false
    );
    await postRequestUpdateRank(
      addForCurrentMiddle2Better.concat(currentWorst),
      currentMiddle2,
      req.params.id,
      true
    );
    await postRequestUpdateRank(
      addForCurrentMiddle1Worse,
      currentMiddle1,
      req.params.id,
      false
    );
    await postRequestUpdateRank(
      addForCurrentWorst,
      currentWorst,
      req.params.id,
      false
    );

    // console.log("CWISBT 78", currentWorstIsBetterThan);
    // console.log("CM2ISBT 78", currentMiddle2IsBetterThan);
    // console.log("CM1ISBT 78", currentMiddle1IsBetterThan);
    // awaityieldbetterThanCurrentBest = onlyUniques(betterThanCurrentBest);
    // betterThanCurrentMiddle1 = onlyUniques(betterThanCurrentMiddle1);
    // betterThanCurrentMiddle2 = onlyUniques(betterThanCurrentMiddle2);
    // betterThanCurrentWorst = onlyUniques(betterThanCurrentWorst);
    // currentMiddle1IsBetterThan = onlyUniques(currentMiddle2IsBetterThan);
    // currentMiddle2IsBetterThan = onlyUniques(betterThanCurrentMiddle1);
    // currentWorstIsBetterThan = onlyUniques(currentWorstIsBetterThan);
    // console.log(
    //   "only uniques",
    //   betterThanCurrentBest,
    //   betterThanCurrentMiddle1,
    //   betterThanCurrentMiddle2,
    //   betterThanCurrentWorst,
    //   currentMiddle1IsBetterThan,
    //   currentMiddle2IsBetterThan,
    //   currentWorstIsBetterThan
    // );

    // if (betterThanCurrentBest.length > 0) {
    //   for (let game of betterThanCurrentBest) {
    //     if (!betterThanCurrentMiddle1.includes(game)) {
    //       console.log("107", currentMiddle1, game);
    //       newResultsArray.push([currentMiddle1, game, req.params.id]);
    //     }
    //     if (!betterThanCurrentMiddle2.includes(game)) {
    //       console.log("111", currentMiddle2, game);
    //       newResultsArray.push([currentMiddle2, game, req.params.id]);
    //     }
    //     if (!betterThanCurrentWorst.includes(game)) {
    //       console.log("115", currentWorst, game);
    //       newResultsArray.push([currentWorst, game, req.params.id]);
    //     }
    //   }
    // }
    // if (betterThanCurrentMiddle1.length > 0) {
    //   for (let game of betterThanCurrentMiddle1) {
    //     if (!betterThanCurrentWorst.includes(game)) {
    //       console.log("123", currentWorst, game);
    //       newResultsArray.push([currentWorst, game, req.params.id]);
    //     }
    //   }
    // }
    // if (betterThanCurrentMiddle2.length > 0) {
    //   console.log(betterThanCurrentMiddle2);
    //   for (let game of betterThanCurrentMiddle2) {
    //     if (!betterThanCurrentWorst.includes(game)) {
    //       console.log("132", currentWorst, game);
    //       newResultsArray.push([currentWorst, game, req.params.id]);
    //     }
    //   }
    // }
    // if (currentMiddle1) {
    //   console.log("currentmiddle1", currentMiddle1);
    //   console.log("139", currentMiddle1, currentBest, currentWorst);
    //   newResultsArray.push([currentMiddle1, currentBest, req.params.id]);
    //   newResultsArray.push([currentWorst, currentMiddle1, req.params.id]);
    // }
    // if (currentMiddle2) {
    //   console.log("currentmiddle2", currentMiddle2);
    //   console.log("145", currentMiddle2, currentBest, currentWorst);
    //   newResultsArray.push([currentMiddle2, currentBest, req.params.id]);
    //   newResultsArray.push([currentWorst, currentMiddle2, req.params.id]);
    // }
    // // await client.query(
    // //   `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
    // //   [currentWorst, currentBest, req.params.id]
    // // );
    // console.log(postRequestUpdateRank);
    // console.log("154", currentWorst, currentBest);
    // newResultsArray.push([currentWorst, currentBest, req.params.id]);
    // resultsArray = await client.query(
    //   `SELECT game_id, better_game_id FROM results
    // WHERE list_id = $1;`,
    //   [req.params.id]
    // );
    // console.log(resultsArray.rows);
    // //for each id in the currentmidle1isbetterthan array, i want to check if those ids have a relationship with currentBest
    // resultsArray.rows.forEach((x) => {
    //   if (currentMiddle1IsBetterThan.length > 0) {
    //     console.log("cm1ibt", currentMiddle1IsBetterThan);
    //     for (let worseGame of currentMiddle1IsBetterThan) {
    //       if (
    //         !(
    //           x.better_game_id === currentBest &&
    //           x.game_id === worseGame.game_id
    //         )
    //       ) {
    //         console.log("172", worseGame, currentBest);
    //         newResultsArray.push([worseGame, currentBest, req.params.id]);
    //       }
    //     }
    //   }
    //   if (currentMiddle2IsBetterThan.length > 0) {
    //     for (let worseGame of currentMiddle2IsBetterThan) {
    //       console.log("worsegame", worseGame);
    //       if (
    //         !(
    //           x.better_game_id === currentBest &&
    //           x.game_id === worseGame.game_id
    //         )
    //       ) {
    //         console.log("190", worseGame, currentBest);
    //         newResultsArray.push([worseGame, currentBest, req.params.id]);
    //       }
    //     }
    //   }
    //   if (currentWorstIsBetterThan.length > 0) {
    //     for (let worseGame of currentWorstIsBetterThan) {
    //       if (
    //         !(
    //           x.better_game_id === currentBest &&
    //           x.game_id === worseGame.game_id
    //         )
    //       ) {
    //         console.log("207", worseGame, currentBest);
    //         newResultsArray.push([worseGame, currentBest, req.params.id]);
    //       }
    //       if (
    //         !(
    //           x.better_game_id === currentMiddle1 &&
    //           x.game_id === worseGame.game_id
    //         )
    //       ) {
    //         console.log("220", worseGame, currentMiddle1);
    //         newResultsArray.push([worseGame, currentMiddle1, req.params.id]);
    //       }
    //       if (
    //         !(
    //           x.better_game_id === currentMiddle2 &&
    //           x.game_id === worseGame.game_id
    //         )
    //       ) {
    //         console.log("233", worseGame, currentBest);
    //         newResultsArray.push([worseGame, currentBest, req.params.id]);
    //       }
    //     }
    //   }
    // });
    // console.log("newresultsarray", newResultsArray);
    // newResultsArray = onlyUniques(newResultsArray);
    // console.log("newresultsarray", newResultsArray);
    // await postRequestUpdateRank(newResultsArray);
    await client.query("COMMIT");
    res.sendStatus(200);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error POST /api/randomgames", error);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

module.exports = router;
