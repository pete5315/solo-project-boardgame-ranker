import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function UserListItem(props) {
  console.log(props.i);
  let dispatch = useDispatch();

  return (
    <tr key={props.i} >
      <td>{props.i+1}</td>
      <td>{props.listItem}</td>
      <td>
        <Link to="/inputs">
          <div>link</div>
        </Link>
      </td>
    </tr>
  );
}

export default UserListItem;
