import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import finishedList from "../../redux/reducers/finished_list.reducer";

function RankedGamesItem(props) {
  console.log(props.i);
  let dispatch = useDispatch();
  const currentList = useSelector((store) => store.currentList);

  function handleUp() {
    console.log(props.finishedList[props.i]);
    dispatch({type: 'UPDATE_RANKED_LIST', payload: {id1: props.finishedList[props.i].id, id2: props.finishedList[(props.i-1)].id, currentList}})
    return
  }

  function handleDown() {

    dispatch({type: 'UPDATE_RANKED_LIST', payload: {id1: props.finishedList[props.i], id2: props.finishedList[(props.i+1)], currentList}})
  }

  return (
    <tr key={props.i} >
      <td>{props.i+1}</td>
      <td>{props.listItem.name}</td>
      <td>
        {(props.i===0 ? <div></div> : <button onClick={handleUp}>MOVE UP</button>)}
      </td>
      <td>
      {(props.i===props.finishedList.length-1 ? <div></div> : <button onClick={handleDown}>MOVE DOWN</button>)}
      </td>
    </tr>
  );
}

export default RankedGamesItem;
