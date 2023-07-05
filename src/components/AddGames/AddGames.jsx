import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AddedGames from "../AddedGames/AddedGames";
import { Link } from "react-router-dom";
import './AddGames.css'

function AddGames() {
  let dispatch = useDispatch();
  const [newGameName, setNewGameName] = useState("");
  const [bggName, setBGGName] = useState("");
  let listNumber = useSelector((store) => store.currentList);
  let bggProcessing = useSelector((store) => store.bggProcessing);

  useEffect(() => {
    checkIfInList();
    dispatch({ type: "SET_CURRENT_STEP", payload: 0 });
  }, []);

  function checkIfInList() {
    if (listNumber) {
      console.log(listNumber);
      dispatch({ type: "GET_GAMES", payload: { id: listNumber } });
      return;
    } else {
      dispatch({ type: "SET_NEW_LIST" });
    }
  }

  function getBGG(event) {
    event.preventDefault();
      dispatch({
        type: "GET_BGG",
      payload: { bgg: bggName, id: listNumber },
    
  });
      
  }

  function submitTheData(event) {
    event.preventDefault();
    console.log(listNumber);
    if (listNumber === null) {
      listNumber = 1;
    }

    dispatch({
      type: "ADD_GAME",
      payload: { newGame: newGameName, id: listNumber, url: null },
    });
    setNewGameName("");
  }

  return (
    <div>
      <div className="flex-container">
        <div>
          {" "}
          <form onSubmit={(e) => getBGG(e)}>
            <label>BGG username</label>
            <input
              value={bggName}
              type="text"
              onChange={(e) => setBGGName(e.target.value)}
              required
            />
            <input type="submit" value="Submit"></input>
          </form>
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
        </div>
        <div>
          {" "}
          <Link to="rank">
            <button>Start ranking</button>
          </Link>
        </div>
      </div>
      <AddedGames />
    </div>
  );
}

export default AddGames;
