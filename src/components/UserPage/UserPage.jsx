import React from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useDispatch, useSelector} from 'react-redux';
import UserLists from '../UserLists/UserLists'
import { useHistory } from 'react-router-dom/';

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const callbackHistory=useHistory();
  let dispatch=useDispatch();
  function newList() {
    dispatch({
      type:"SET_NEW_LIST",
      payload: { callbackHistory },
    })
  }

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <button onClick={newList}>Create a new list!</button>
      <UserLists />
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
