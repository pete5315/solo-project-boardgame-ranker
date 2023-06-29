const finishedList = (state = [], action) => {
  console.log(action);
  switch (action.type) {
    case 'SET_FINISHED_LIST':
      return [...action.payload];
    case 'UNSET_FINISHED_LIST':
      return null;
    default:
      return state;
  }
};

export default finishedList;