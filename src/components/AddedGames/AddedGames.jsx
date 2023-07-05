import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GamesListItem from "../GamesListItem/GamesListItem"

function AddedGames() {
  let listNumber = useSelector((store) => store.currentList);
  const games = useSelector((store) => store.games);

  if (games && !games[0]) {
    return
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
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