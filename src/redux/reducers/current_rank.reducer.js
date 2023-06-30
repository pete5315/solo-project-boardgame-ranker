const currentRank = (state = { best: null, worst: null }, action) => {
  switch (action.type) {
    case "SET_CURRENT_RANK":
      return { ...state, ...action.payload };
    case "UNSET_RANK":
      return { best: null, worst: null };
    case "UNSET_BEST":
      return { ...state, best: null };
    case "UNSET_WORST":
      return { ...state, worst: null };
    default:
      return state;
  }
};

export default currentRank;
