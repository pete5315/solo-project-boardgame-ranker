import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import userLists from './user_lists.reducer'
import currentList from './current_list.reducer';
import games from './games.reducer';
import randomGames from './random_games.reducer'
import currentRank from './current_rank.reducer';
import finishedList from './finished_list.reducer';
import bggProcessing from './bgg_processing.reducer';
import progress from './progress.reducer';
import currentStep from './current_step.reducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  userLists,
  currentList,
  games,
  randomGames,
  currentRank,
  finishedList,
  bggProcessing,
  progress,
  currentStep,
});

export default rootReducer;
