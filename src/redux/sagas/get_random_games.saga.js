import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { Redirect } from "react-router-dom/cjs/react-router-dom";

// worker Saga: will be fired on "FETCH_USER" actions
function* randomGames(action) {
  console.log(action);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const games = yield axios.get(
      `/api/randomgames/${action.payload.currentList}`,
      config
    );
    // yield put ({type:'GET_GAMES', payload:action.payload.id[0].id});
    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    console.log("games data", games.data);
    console.log(action.payload);

    if (games.data[0] === "complete") {
      console.log("COMPLETE COMPLETE");
      action.payload.callbackHistory.push("/list");
    }
    yield put({ type: "SET_RANDOM_GAMES", payload: games.data });
    yield put({
      type: "GET_PROGRESS",
      payload: { currentList: action.payload.currentList },
    });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* getProgress(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    let progress = yield axios.get(
      `/api/randomgames/percent/${action.payload.currentList}`,
      config
    );
    yield put({ type: "SET_PROGRESS", payload: progress });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* randomGamesSaga() {
  yield takeLatest("GET_RANDOM_GAMES", randomGames);
  yield takeLatest("GET_PROGRESS", getProgress);
}

export default randomGamesSaga;
