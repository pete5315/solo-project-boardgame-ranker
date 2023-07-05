const currentList = (state = null, action) => {
  switch (action.type) {
    case 'SET_CURRENT_LIST':
      let update=action.payload;
      if (action.payload.length===1) { //initial list gets set as an array, need it to be an int
        update=update[0]

      }
          return update;
    case 'UNSET_CURRENT_LIST':
      return null;
    default:
      return state;
  }
};

export default currentList;
