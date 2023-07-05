const bggProcessing = (state = null, action) => {
  console.log(action);
  switch (action.type) {
    case 'SET_BGG_PROCESSING':
      return action.payload;
    case 'UNSET_BGG_PROCESSING':
      return null;
    default:
      return state;
  }
};

export default bggProcessing;
