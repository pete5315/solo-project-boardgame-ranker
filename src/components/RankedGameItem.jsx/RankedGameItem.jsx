import { useDispatch, useSelector } from "react-redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import "./RankedGameItem.css";

function RankedGamesItem(props) {
  console.log(props.i);
  let dispatch = useDispatch();
  const currentList = useSelector((store) => store.currentList);

  function handleUp() {
    console.log(props.finishedList[props.i]);
    dispatch({
      type: "UPDATE_RANKED_LIST",
      payload: {
        id1: props.finishedList[props.i].id,
        id2: props.finishedList[props.i - 1].id,
        currentList,
      },
    });
    return;
  }

  function handleDown() {
    dispatch({
      type: "UPDATE_RANKED_LIST",
      payload: {
        id1: props.finishedList[props.i + 1].id,
        id2: props.finishedList[props.i].id,
        currentList,
      },
    });
  }

  return (
    <tr key={props.i}>
      <td>{props.i + 1}</td>
      <td>
        <img className="image" src={props.listItem.thumbnail} />
      </td>
      <td>{props.listItem.name}</td>
      <td>
        {props.i === 0 ? (
          <div></div>
        ) : (
          <IconButton onClick={handleUp} size="small">
            <ArrowUpwardIcon >MOVE UP</ArrowUpwardIcon>
          </IconButton>
        )}
      </td>
      <td>
        {props.i === props.finishedList.length - 1 ? (
          <div></div>
        ) : (
          <IconButton size="small">
            <ArrowDownwardIcon onClick={handleDown}>
              MOVE DOWN
            </ArrowDownwardIcon>
          </IconButton>
        )}
      </td>
    </tr>
  );
}

export default RankedGamesItem;
