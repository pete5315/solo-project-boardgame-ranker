import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function UserListItem({ list }) {
  console.log(list);
  console.log("list.games_array",list.games_array);
  let dispatch=useDispatch();

  function setCurrentList() {
    console.log(list.id);
    dispatch({
      type: 'SET_CURRENT_LIST',
      payload: list.id
    })
  }

  return (
  <tr key={list.id}  onClick={setCurrentList} >
    <td>{list.date}</td>
    <td>{list.games_array && list.games_array.length}</td>
    <td>{list.completed ? "Complete" : "Incomplete"}</td>
    <td><Link to="/inputs"><div>link</div></Link></td>
  </tr>)
}

export default UserListItem;
