const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");
const postRequestUpdateRank = require("../modules/post-request-update-rank");
const onlyUniques = require("../modules/only-uniques");
const onlyUniques2 = require("../modules/only-uniques2");

const router = express.Router();

router.post("/:id", rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  const currentBest = req.body.currentBest;
  const currentWorst = req.body.currentWorst;
  let currentMiddle1 = null;
  let currentMiddle2 = null;
  for (let randomGameInstance of req.body.randomGames) {
    if (
      randomGameInstance.id !== currentBest &&
      randomGameInstance.id !== currentWorst
    ) {
      if (currentMiddle1 === null) {
        currentMiddle1 = randomGameInstance.id;
      } else {
        currentMiddle2 = randomGameInstance.id;
      }
    }
  }
  try {
    await client.query("BEGIN");
    let resultsArray = await client.query(
      `SELECT game_id, better_game_id FROM results
    WHERE list_id = $1;`,
      [req.params.id]
    );
    let betterThanCurrentBest = [];
    let betterThanCurrentMiddle1 = [];
    let betterThanCurrentMiddle2 = [];
    let betterThanCurrentWorst = [];
    let currentBestIsBetterThan = [];
    let currentMiddle1IsBetterThan = [];
    let currentMiddle2IsBetterThan = [];
    let currentWorstIsBetterThan = [];
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
    //[...new Set(array1.concat(array2))]
    // I have currentBestIsBetterThan
    // I want to add anything that is not in the list from other arrays.
    let addForCurrentBest = onlyUniques2(
      currentBestIsBetterThan,
      currentMiddle1IsBetterThan
        .concat(currentMiddle2IsBetterThan)
        .concat(currentWorstIsBetterThan)
        .concat([currentMiddle1, currentMiddle2, currentWorst])
    );
    // onlyUniques(
    //   currentMiddle1IsBetterThan
    //     .concat(currentMiddle2IsBetterThan)
    //     .concat(currentWorstIsBetterThan)
    // ).forEach((x) => {
    //   if (!currentBestIsBetterThan.includes(x)) {
    //     addForCurrentBest.push(x);
    //   }
    // });

    let addForCurrentMiddle1Worse = onlyUniques2(
      betterThanCurrentMiddle1,
      betterThanCurrentBest.push(currentBest)
    );
    // betterThanCurrentBest.forEach((x) => {
    //   if (!betterThanCurrentMiddle1.includes(x)) {
    //     addForCurrentMiddle1Worse.push(x);
    //   }
    // });

    let addForCurrentMiddle1Better = onlyUniques2(
      currentMiddle1IsBetterThan,
      currentWorstIsBetterThan.push(currentWorst)
    );
    // currentWorstIsBetterThan.forEach((x) => {
    //   if (!currentMiddle1IsBetterThan.includes(x)) {
    //     addForCurrentMiddle1Better.push(x);
    //   }
    // });

    let addForCurrentMiddle2Worse = onlyUniques2(
      betterThanCurrentMiddle2,
      betterThanCurrentBest.push(currentBest)
    );
    // betterThanCurrentBest.forEach((x) => {
    //   if (!betterThanCurrentMiddle2.includes(x)) {
    //     addForCurrentMiddle2Worse.push(x);
    //   }
    // });

    let addForCurrentMiddle2Better = onlyUniques2(
      currentMiddle2IsBetterThan,
      currentWorstIsBetterThan.push(currentWorst)
    );
    // currentWorstIsBetterThan.forEach((x) => {
    //   if (!currentMiddle2IsBetterThan.includes(x)) {
    //     addForCurrentMiddle2Better.push(x);
    //   }
    // });

    // addForCurrentWorst = onlyUniques2(
    //   ,
    //   addForCurrentWorst.concat([currentBest, currentMiddle1, currentMiddle2])
    // );
    
    // = [
    //   ...new Set(
    //     currentMiddle1IsBetterThan
    //       .concat(currentMiddle2IsBetterThan)
    //       .concat(currentMiddle2IsBetterThan)
    //       .concat(currentWorstIsBetterThan)
    //   ),
    // ];
    // onlyUniques(
    //   betterThanCurrentBest
    //     .concat(betterThanCurrentMiddle1)
    //     .concat(betterThanCurrentMiddle2)
    // ).forEach((x) => {
    //   if (!betterThanCurrentWorst.includes(x)) {
    //     addForCurrentWorst.push(x);
    //   }
    // });

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
