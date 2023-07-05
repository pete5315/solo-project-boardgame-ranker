import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function UserListItem({ list }) {
  let dispatch=useDispatch();

  function setCurrentList() {
    dispatch({
      type: 'SET_CURRENT_LIST',
      payload: list.id
    })
  }

  return (
  <tr key={list.id}  onClick={setCurrentList} >
    <td><Link to="/inputs"><div>{list.completed ? "Complete" : "Incomplete"}</div></Link></td>
    <td>{list.length && list.length}</td>
    <td>{list.date}</td>
  </tr>)
}

export default UserListItem;
