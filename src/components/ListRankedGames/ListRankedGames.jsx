import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RankedGameItem from "../RankedGameItem/RankedGameItem";

function ListRankedGames() {
  const finishedList = useSelector((store) => store.finishedList);
  const currentList = useSelector((store) => store.currentList);

  const dispatch = useDispatch();

  useEffect(() => {
    getRankedList();
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
          <th>head1</th>
          <th>head1</th>
          <th>head1</th>
          <th>head1</th>
        </tr>
      </thead>
      <tbody>
        {finishedList && finishedList.map((list, i) => <RankedGameItem listItem={list} i={i} />)}
      </tbody>
    </table>
  );
}

export default ListRankedGames;
