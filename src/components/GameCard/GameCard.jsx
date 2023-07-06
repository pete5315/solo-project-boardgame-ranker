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

  function setBest() {
    console.log(props.game.id);
    setDOMBest(true);
    setFlip(!flip);
    if (currentRank.worst === null) {
      dispatch({
        type: "SET_CURRENT_RANK",
        payload: {
          ...currentRank,
          best: props.game.id,
          randomGames,
          listID: currentList,
        },
      });
    } else {
      console.log("we have a current worst");
      dispatch({
        type: "SEND_CURRENT_RANK",
        payload: {
          ...currentRank,
          best: props.game.id,
          randomGames,
          listID: currentList,
          callbackHistory,
        },
      });
    }
  }
  function setWorst() {
    console.log(props.game.id);
    setDOMWorst(true);
    setFlip(!flip);
    if (!(currentRank.best === null)) {
      console.log("we have a current worst");
      dispatch({
        type: "SEND_CURRENT_RANK",
        payload: {
          ...currentRank,
          worst: props.game.id,
          listID: currentList,
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
          listID: currentList,
        },
      });
    }
  }
  function removeGame() {
    dispatch({
      type: "DELETE_GAME",
      payload: {
        game: props.game,
        listID: currentList,
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
            best
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
            worst
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
