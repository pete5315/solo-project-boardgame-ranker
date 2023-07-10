import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import NavStepper from "../NavStepper/NavStepper";
import { useDispatch, useSelector } from "react-redux";


function Nav() {
  const user = useSelector((store) => store.user);
  let dispatch=useDispatch();
  return (
    <div className="nav">
      <div>
        <Link to="/home">
          <h2 className="nav-title">Boardgame Ranker</h2>
        </Link>
      </div>
      <div>
      {user.id && (<NavStepper />)}
      </div>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <div>
            <Link className="navLink" to="/about">
              About Page
            </Link>
            <Link className="navLink" to="/login">
              Login / Register
            </Link>
          </div>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/user">
              Home
            </Link>
            {/* <Link className="navLink" to="/inputs">
              Inputs
            </Link>
            <Link className="navLink" to="/rank">
              Rank
            </Link>
            <Link className="navLink" to="/list">
              List
            </Link> */}
            <Link className="navLink" to="/about">
              About Page
            </Link>
            <button
              className="navLink button"
              onClick={() => dispatch({ type: "LOGOUT" })}
            >
              Log Out
            </button>
          </>
        )}

        {/* <Link className="navLink" to="/about">
          About
        </Link> */}
      </div>
      
    </div>
    
  );
}

export default Nav;
