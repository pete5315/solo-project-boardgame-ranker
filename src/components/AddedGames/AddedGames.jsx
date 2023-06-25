import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GamesListItem from "../GamesListItem/GamesListItem"

function AddedGames() {
  useEffect(() => {
    getGamesLists();
  }, []);

  let dispatch = useDispatch();

  const games = useSelector((store) => store.games);
  function getGamesLists() {
    // dispatch({
    //   type: "FETCH_GAMES_LISTS",
    // });
  }

  if (games && !games[0]) {
    return
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Game name</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game, i) => <GamesListItem game={game} i={i}/>)} 
      </tbody>
    </table>
  );
}

export default AddedGames