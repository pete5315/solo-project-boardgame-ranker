const pool = require("./pool");

async function postRequestUpdateRank(input1, input2, input3, input4) {
  console.log("check existence", input1);
  try {
    for (let x of input1) {
      if (x !== null && input2 !== null) {
        if (input4) {
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
  } catch (error) {
    console.log("error", error);
  } finally {
    // client.release();
  }
}
module.exports = postRequestUpdateRank;
