import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* deleteGame(action) {
  console.log(action.payload);
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.delete('/api/deletegame/'+action.payload.id, config);
    yield put ({type: 'GET_RANDOM_GAMES', payload: {currentList: action.payload.listID, callbackHistory: action.payload.callbackHistory}})

  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* deleteGameSaga() {
  yield takeLatest('DELETE_GAME', deleteGame);
}

export default deleteGameSaga;
