import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* sendCurrentRank(action) {
  console.log(action.payload);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const result = yield axios.post(
      `/api/updaterank/${action.payload.listID}`,
      {
        currentBest: action.payload.best,
        currentWorst: action.payload.worst,
        randomGames: action.payload.randomGames,
      },
      config
    );
    console.log(result);
    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    // yield axios.post('/api/updaterank/', {newGame: action.payload.newGame, id: action.payload.id[0].id}, config);
    // yield put ({type:'GET_GAMES', payload:action.payload.id[0].id});
    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "UNSET_RANK" });
    yield put({
      type: "GET_RANDOM_GAMES",
      payload: {
        currentList: {id: action.payload.listID},
        callbackHistory: action.payload.callbackHistory,
      },
    });
  } catch (error) {
    console.log("User get request failed", error);
  }
}


function* sendCurrentRankSaga() {
  yield takeLatest("SEND_CURRENT_RANK", sendCurrentRank);
}

export default sendCurrentRankSaga;
