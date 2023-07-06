import axios from 'axios';
import { useSelector } from 'react-redux';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* newGame(action) {
  if (action.payload===null) {
    action.payload=1;
  }
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
    yield axios.post('/api/addgame/', {newGame: action.payload.newGame, id: action.payload.id, url: action.payload.url, thumbnail: action.payload.thumbnail}, config);
    yield put ({type:'GET_GAMES', payload:{id: action.payload.id}});
    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in


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
    let games = yield axios.get('/api/addgame/'+action.payload.id, config);
    console.log(games);
    let sendGames = []
    for (let x of games.data) {
      console.log(x);
      sendGames.push({name: x.name, id:x.id, url:x.url, thumbnail: x.thumbnail});
    }
    console.log(sendGames);
    yield put ({type: 'SET_GAMES', payload: sendGames}); 

  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* newGameSaga() {
  console.log('hello from add_game saga'),
  yield takeLatest('ADD_GAME', newGame);
  yield takeLatest('GET_GAMES', getGames);
}

export default newGameSaga;
