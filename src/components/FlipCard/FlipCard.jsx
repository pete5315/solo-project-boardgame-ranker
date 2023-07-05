import { useState } from "react";
import GameCard from "../GameCard/GameCard";
import "./FlipCard.css";

function FlipCard({game, i}) {
  const [flip, setFlip] = useState(false);

  return (
    <div>
      {/* <div onClick={() => setFlip(!flip)}> */}
        <div>
          {/* {flip ? <div>flipped</div> : <></>} */}
          <GameCard game={game} i={i} flip={flip} />
        </div>
      </div>
    // </div>
  );
}

export default FlipCard;
