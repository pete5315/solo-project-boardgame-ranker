function onlyUniques2(comparisonArray, inputsArray) {
  addedValues = [
    ...new Set(
      comparisonArray
        .concat(inputsArray)
    ),
  ].filter(check => comparisonArray.includes(check));
  return addedValues;
}
module.exports = onlyUniques2;
