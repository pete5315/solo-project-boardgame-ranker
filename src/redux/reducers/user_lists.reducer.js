const userListsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_LIST':
      return action.payload;
    case 'UNSET_USER_LIST':
      return {};
    default:
      return state;
  }
};

export default userListsReducer;
