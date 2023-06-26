import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function GameCard(props) {
  let dispatch = useDispatch();
  const currentRank = useSelector((store) => store.currentRank);
  const randomGames = useSelector((store) => store.randomGames);
  const currentList = useSelector((store) => store.currentList);
  function setBest() {
    console.log(props.game.id);
    if (currentRank.worst === null) {
      dispatch({
        type: "SET_CURRENT_RANK",
        payload: { ...currentRank, best: props.game.id, randomGames, listID: 4 },
      });
    } else {
      console.log("we have a current worst");
      dispatch({
        type: "SEND_CURRENT_RANK",
        payload: { ...currentRank, best: props.game.id, randomGames },
      });
    }
  }
  function setWorst() {
    console.log(props.game.id);
    if (!(currentRank.best === null)) {
      console.log("we have a current worst");
      dispatch({
        type: "SEND_CURRENT_RANK",
        payload: { ...currentRank, worst: props.game.id },
      });
    } else {
      dispatch({ type: "SET_CURRENT_RANK", payload: { worst: props.game.id } });
    }
  } // console.log("Best is ", best, " and worst is ", worst);
  return (
    <li key={props.i}>
      {props.game.name}
      <button onClick={setBest}>best</button>
      <button onClick={setWorst}>worst</button>
      {/* <button onClick={removeGame}>trash</button> */}
    </li>
  );
}

export default GameCard;
