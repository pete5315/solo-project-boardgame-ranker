import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserListItem from "../UserListItem/UserListItem";

function UserLists() {
  useEffect(() => {
    getUserLists();
  }, []);

  let dispatch = useDispatch();

  const lists = useSelector((store) => store.userLists);
  function getUserLists() {
    dispatch({
      type: "FETCH_USER_LISTS",
    });
  }

  if (!lists[0]) {
    return
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th># of games</th>
          <th>List modified</th>
        </tr>
      </thead>
      <tbody>
        {lists && lists.map((list) => <UserListItem list={list} />)} 
        
      </tbody>
    </table>
  );
}

export default UserLists;
