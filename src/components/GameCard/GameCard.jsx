import { useState } from "react";

function GameCard(props) {
  console.log("Best is ", best, " and worst is ", worst)
  return (
    <li  key={props.i}>
      {props.game}
      <button onClick={() => setBest} >best</button>
      <button onClick={setWorst} >worst</button>
      <button onClick={removeGame} >trash</button>
    </li>
  );
}

export default GameCard;
