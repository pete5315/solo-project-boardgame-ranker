const currentRank = (state = {best: null, worst: null}, action) => {
  console.log(state, action.payload)
  switch (action.type) {
    case 'SET_CURRENT_RANK':
      return {...state, ...action.payload};
    case 'UNSET_RANK':
      return null;
    default:
      return state;
  }
};

export default currentRank;
