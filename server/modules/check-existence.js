const pool = require("../modules/pool");

async function checkExistence(input1, input2, input3) {
  console.log("check existence", input1, input2, input3);
  let client = pool.connect()
  try {
    await client.query("BEGIN");

    const matching = await client.query(
      `SELECT COUNT(*) FROM results WHERE game_id=${input1} AND better_game_id=${input2} AND list_id=${input3};`
    );
    console.log(matching);
    await client.query("COMMIT");
    if (matching === 0) {
      return true;
    } else {
      return false;
    }

  } catch (error) {
    await client.query("ROLLBACK");
    console.log("error", error)
  } finally {
    client.release();
  }
}
module.exports = checkExistence;
