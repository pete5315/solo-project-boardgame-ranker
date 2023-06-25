const games = (state = [], action) => {
  console.log(action.payload)
  switch (action.type) {
    case 'SET_GAMES':
      return [...action.payload];
    case 'UNSET_GAMES':
      return null;
    default:
      return state;
  }
};

export default games;