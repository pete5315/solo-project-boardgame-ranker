const currentStep = (state = [], action) => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return action.payload;
    case 'UNSET_CURRENT_STEP':
      return null;
    default:
      return state;
  }
};

export default currentStep;