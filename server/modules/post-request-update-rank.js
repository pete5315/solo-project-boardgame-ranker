const pool = require("./pool");

async function postRequestUpdateRank(input1, input2, input3, input4) {
  console.log("check existence", input1);
  try {
    // if (input4.length > 0) {
    //   for (x of input4) {
    // if (input1 === x.game_id && input2 === x.better_game_id) {
    //       console.log(x.game_id, x.better_game_id, input1, input2);
    //       return;
    //     }
    //   }
    // }
    for (let x of input1) {
      if (x !== null && input2 !== null) {
        if (input4) {
          console.log("tracking", x, input2);
          await pool.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [x, input2, input3]
          );
        } else {
          await pool.query(
            `INSERT INTO results (game_id, better_game_id, list_id) VALUES ($1, $2, $3);`,
            [input2, x, input3]
          );
        }
      }
    }
    // input4.push({game_id: input1, better_game_id: input2});
    // return input4
  } catch (error) {
    console.log("error", error);
  } finally {
    // client.release();
  }
}
module.exports = postRequestUpdateRank;
