import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* updateFinishedList(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    console.log("alter final list", action.payload);
    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    yield axios.put(`/api/editfinishedlist/${action.payload.currentList}/${action.payload.id1}/${action.payload.id2}`, config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'GET_RANKED_LIST', payload: action.payload.currentList });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* updateFinsihedListSaga() {
  yield takeLatest('UPDATE_RANKED_LIST', updateFinishedList);
}

export default updateFinsihedListSaga;
