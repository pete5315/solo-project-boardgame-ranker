const progress = (state = null, action) => {
  switch (action.type) {
    case 'SET_PROGRESS':
          return action.payload;
    case 'UNSET_CURRENT_LIST':
      return null;
    default:
      return state;
  }
};

export default progress;
