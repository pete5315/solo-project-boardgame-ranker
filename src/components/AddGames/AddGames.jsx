import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AddedGames from "../AddedGames/AddedGames";
import { Link } from 'react-router-dom';

function AddGames() {
  let dispatch = useDispatch();
  const [newGameName, setNewGameName] = useState("");
  let listNumber = useSelector(store => store.currentList);

  useEffect(() => {
    checkIfInList();
  }, []);

  function checkIfInList() {
    if (listNumber) {
      console.log(listNumber)
      dispatch({type: 'GET_GAMES', payload: {id:listNumber}})
      return
    } else {
        dispatch({type: 'SET_NEW_LIST'});
    }
  }

  function submitTheData(event) {
    event.preventDefault();
    console.log(listNumber);
    if (listNumber===null) {
      listNumber=1;
    }
  

    dispatch({
      type: "ADD_GAME",
      payload: {newGame: newGameName, id:listNumber}
    });
    setNewGameName("");
  }

  return (
    <div>
      <form onSubmit={(e) => submitTheData(e)}>
        <Link to='rank'><button>Start ranking</button></Link>
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
