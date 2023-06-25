function UserListItem({ list }) {
  console.log(list);
  console.log("list.games_array",list.games_array);
  
  return (
  <tr key={list.id}>
    <td>{list.date}</td>
    <td>{list.games_array && list.games_array.length}</td>
    <td>{list.completed ? "Complete" : "Incomplete"}</td>
    <td><div>link</div></td>
  </tr>)
}

export default UserListItem;
