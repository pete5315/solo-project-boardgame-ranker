const randomGames = (state = [], action) => {
  switch (action.type) {
    case 'SET_RANDOM_GAMES':
      return [...action.payload];
    case 'UNSET_RANDOM_GAMES':
      return null;
    default:
      return state;
  }
};

export default randomGames;