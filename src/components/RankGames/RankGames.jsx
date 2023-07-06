import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/";
import Grid from "@mui/material/Grid";
import FlipCard from "../FlipCard/FlipCard";
import "./RankGames.css";
import CircularProgress from "@mui/material/CircularProgress";
import CircularWithValueLabel from "./CircularProgressTracker";

function RankGames() {
  let dispatch = useDispatch();
  const randomGames = useSelector((store) => store.randomGames);
  const currentList = useSelector((store) => store.currentList);
  const progress = useSelector((store) => store.progress);
  const callbackHistory = useHistory();

  useEffect(() => {
    getARandomGame();
    // dispatch({ type: "SET_CURRENT_STEP", payload: 2 });
  }, []);

  function getARandomGame() {
    console.log(currentList);
    dispatch({
      type: "GET_RANDOM_GAMES",
      payload: { currentList, callbackHistory },
      listID: currentList,
    });
  }
  console.log("random games", randomGames);
  return (
    <div>
      <Grid direction="row" container spacing={1} className="absoluteGrid" sx={{p: 0}}>
        <Grid container item sx={{p: 0}}>
          {randomGames &&
            randomGames.map((game, i) =>
              i % 2 == 0 ? <FlipCard game={game} i={i} /> : <></>
            )}
        </Grid>
        <CircularWithValueLabel progress={progress && progress.data*100} />
        <Grid container item sx={{p: 0}}>
          {randomGames &&
            randomGames.map((game, i) =>
              i % 2 == 1 ? <FlipCard game={game} i={i} column={1} /> : <></>
            )}
        </Grid>
      </Grid>
    </div>
  );
}

export default RankGames;
