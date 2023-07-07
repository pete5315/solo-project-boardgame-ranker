import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./GameCard.css";

function GameCard(props) {
  let dispatch = useDispatch();
  const currentRank = useSelector((store) => store.currentRank);
  const randomGames = useSelector((store) => store.randomGames);
  const currentList = useSelector((store) => store.currentList);
  const [best, setDOMBest] = useState(false);
  const [worst, setDOMWorst] = useState(false);
  const callbackHistory = useHistory();
  const [flip, setFlip] = useState(false);
  const currentBest = currentRank.best;
  const currentWorst = currentRank.worst;

  function setBest() {
    console.log(props.game.id);
    if (currentBest === props.game.id) {
      dispatch({ type: "UNSET_BEST" });
    } else {
      setDOMBest(true);
      setFlip(!flip);
      if (currentRank.worst === null) {
        dispatch({
          type: "SET_CURRENT_RANK",
          payload: {
            ...currentRank,
            best: props.game.id,
            randomGames,
            listID: currentList.id,
          },
        });
      } else {
        console.log("we have a current best");
        dispatch({
          type: "SEND_CURRENT_RANK",
          payload: {
            ...currentRank,
            best: props.game.id,
            randomGames,
            listID: currentList.id,
            callbackHistory,
          },
        });
      }
    }
  }
  function setWorst() {
    console.log(props.game.id);
    if (currentWorst === props.game.id) {
      dispatch({ type: "UNSET_WORST" });
    } else {
      setDOMWorst(true);
      setFlip(!flip);
      if (!(currentRank.best === null)) {
        console.log("we have a current worst");
        dispatch({
          type: "SEND_CURRENT_RANK",
          payload: {
            ...currentRank,
            worst: props.game.id,
            listID: currentList.id,
            callbackHistory,
          },
        });
      } else {
        dispatch({
          type: "SET_CURRENT_RANK",
          payload: {
            ...currentRank,
            worst: props.game.id,
            randomGames,
            callbackHistory,
            listID: currentList.id,
          },
        });
      }
    }
  }
  function removeGame() {
    dispatch({
      type: "DELETE_GAME",
      payload: {
        game: props.game,
        listID: currentList.id,
        id: props.game.id,
        getRandom: true,
      },
    });
  }

  return (
    <Grid item padding={2} className="absoluteGrid" sx={{ p: 0 }}>
      <div></div>
      <Card
        elevation={5}
        sx={{
          minWidth: 350,
          minHeight: 350,
          maxWidth: 350,
          maxHeight: 350,
          p: 2,
          my: 0.5,
          backgroundColor:
            currentBest === props.game.id
              ? "rgb(153, 255, 153)"
              : currentWorst === props.game.id
              ? "rgb(255, 141, 141)"
              : "white",
        }}
        key={props.i}
        className="mainCard"
      >
        <CardActions>
          <Button
            variant="contained"
            sx={{
              width: 330,
              backgroundColor: "green",
              "&:hover": {
                width: 330,
                backgroundColor: "rgb(0, 108, 0)",
              },
            }}
            onClick={setBest}
          >
            {currentBest===props.game.id ? 'undo' : 'best'}
          </Button>
        </CardActions>
        <CardMedia
          component={"img"}
          sx={{
            height: 375,
            objectFit: "contain",
          }}
          alt={props.game.name}
          image={props.game.url}
          style={{ maxHeight: 180 }}
        />
        <CardContent>
          <Typography>{props.game.name}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            sx={{
              width: 330,
              backgroundColor: "rgb(220, 0, 0)",
              "&:hover": {
                width: 330,
                backgroundColor: "rgb(200, 0, 0)",
              },
            }}
            onClick={setWorst}
          >
            {currentWorst===props.game.id ? 'undo' : 'worst'}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "grey",
              "&:hover": {
                backgroundColor: "rgb(108, 108, 108)",
              },
            }}
            onClick={removeGame}
          >
            <DeleteIcon></DeleteIcon>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default GameCard;
