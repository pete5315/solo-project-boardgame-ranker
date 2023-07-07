const listComplete = (state = null, action) => {
  switch (action.type) {
    case 'SET_LIST_COMPLETE':
          return action.payload;
    case 'UNSET_LIST_COMPLETE':
      return null;
    default:
      return state;
  }
};

export default listComplete;
