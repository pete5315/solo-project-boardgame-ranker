import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AddedGames from "../AddedGames/AddedGames";

function AddGames() {
  let dispatch = useDispatch();
  const [newGameName, setNewGameName] = useState("");
  let listNumber = useSelector(store => store.currentList);

  console.log(listNumber);

  useEffect(() => {
    checkIfInList();
  }, []);

  function checkIfInList() {
    if (listNumber) {
      console.log(listNumber)
      dispatch({type: 'GET_GAMES'})
      return
    } else {
        dispatch({type: 'SET_NEW_LIST'});
    }
  }

  function submitTheData(event) {
    event.preventDefault();
    console.log(newGameName);

    dispatch({
      type: "ADD_GAME",
      payload: {newGame: newGameName, id:listNumber}
    });
    setNewGameName("");
  }

  return (
    <div>
      <form onSubmit={(e) => submitTheData(e)}>
        <label>Game name</label>
        <input
          value={newGameName}
          type="text"
          onChange={(e) => setNewGameName(e.target.value)}
          required
        />
        <input type="submit" value="Submit"></input>
      </form>
      <AddedGames />
    </div>
  );
}

export default AddGames;
