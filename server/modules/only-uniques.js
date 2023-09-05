function onlyUniques(input1) {
  let uniqueIDs = [];
  console.log("input1", input1);
  input1.forEach((x) => {
    if (!uniqueIDs.includes(x)) {
      uniqueIDs.push(x);
    }
  });
  console.log("uniqueids", uniqueIDs);
  return uniqueIDs;
}
module.exports = onlyUniques;
