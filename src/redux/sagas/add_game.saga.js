import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* newGame(action) {
  console.log(action.payload)
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    yield axios.post('/api/addgame/', {newGame: action.payload.newGame, id: action.payload.id[0].id}, config);
    yield put ({type:'GET_GAMES', payload:action.payload.id[0].id});
    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in


    // yield put({ type: 'SET_CURRENT_LIST', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* getGames(action) {
  console.log(action.payload);
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    let games = yield axios.get('/api/addgame/'+action.payload, config);
    games = (games.data[0].games_array);
    console.log(games);
    yield put ({type: 'SET_GAMES', payload: games}); 

  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* newGameSaga() {
  yield takeLatest('ADD_GAME', newGame);
  yield takeLatest('GET_GAMES', getGames);
}

export default newGameSaga;
