import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* newList(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    let response = yield axios.get('/api/newlist/', config);
    response=response.data[0]
    yield put({ type: 'SET_CURRENT_LIST', payload: {id: response, completed: false }});
    yield put({ type: 'UNSET_RANDOM_GAMES', payload: response });
    yield put({ type: 'UNSET_GAMES', payload: response });
    yield action.payload.callbackHistory.push('/inputs')
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* newListSaga() {
  yield takeLatest('SET_NEW_LIST', newList);
}

export default newListSaga;
