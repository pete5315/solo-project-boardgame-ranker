import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/";
import GameCard from "../GameCard/GameCard";

function RankGames() {
  let dispatch = useDispatch();
  const currentList = useSelector((store) => store.currentList);
  const randomGames = useSelector((store) => store.randomGames);
  const callbackHistory=useHistory();

  useEffect(() => {
    getARandomGame();
  }, []);

  function getARandomGame() {
    console.log(currentList);
    dispatch({
      type: "GET_RANDOM_GAMES",
      payload: { currentList, callbackHistory },
      listID: currentList
    });
  }
  console.log("random games", randomGames);
  return (
    <div>
      <button onClick={getARandomGame}>Click for random games</button>
      <ul>
        {randomGames &&
          randomGames.map((game, i) => <GameCard game={game} i={i} />)}
      </ul>
    </div>
  );
}

export default RankGames;
