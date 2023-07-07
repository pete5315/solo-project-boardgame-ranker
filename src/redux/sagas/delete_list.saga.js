import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

function* deleteList(action) {
  console.log(action.payload);
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    yield axios.delete("/api/deletelist/" + action.payload.id, config);
    yield put({ type: "FETCH_USER_LISTS" });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* deleteListSaga() {
  yield takeLatest("DELETE_LIST", deleteList);
}

export default deleteListSaga;
