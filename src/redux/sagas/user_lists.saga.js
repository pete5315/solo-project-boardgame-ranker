import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUserLists() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/userlist/', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER_LIST', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* setListIncomplete() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    // yield axios.post(`/api/userlist/incomplete/${action.payload.id}`, data, config);
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* userListsSaga() {
  yield takeLatest('FETCH_USER_LISTS', fetchUserLists);
  yield takeLatest('SET_LIST_INCOMPLETE', setListIncomplete);
}

export default userListsSaga;
