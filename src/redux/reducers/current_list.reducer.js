const currentList = (state = null, action) => {
  console.log(action);
  switch (action.type) {
    case 'SET_CURRENT_LIST':
      return action.payload;
    case 'UNSET_CURRENT_LIST':
      return null;
    default:
      return state;
  }
};

export default currentList;
