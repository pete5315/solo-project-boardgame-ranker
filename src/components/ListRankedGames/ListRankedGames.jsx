import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RankedGameItem from "../RankedGameItem.jsx/RankedGameItem";
import "./ListRankedGames.css"

function ListRankedGames() {
  const finishedList = useSelector((store) => store.finishedList);
  const currentList = useSelector((store) => store.currentList);

  const dispatch = useDispatch();


  finishedList && console.log(finishedList);

  useEffect(() => {
    getRankedList();
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
  }, []);

  function getRankedList() {
    dispatch({
      type: "GET_RANKED_LIST",
      payload: currentList,
    });
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {finishedList && finishedList.map((list, i) => <RankedGameItem listItem={list} i={i} finishedList={finishedList} />)}
      </tbody>
    </table>
  );
}

export default ListRankedGames;
