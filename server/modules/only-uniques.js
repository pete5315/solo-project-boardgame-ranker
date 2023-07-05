function onlyUniques(input1) {
  let uniqueIDs = [];
  console.log("input1", input1);
  input1.forEach((x) => {
    console.log(x);
    // if (x.length === 3) {
    //   if (uniqueIDs.length > 0) {
    //     let push = true;
    //     for (let i=0; i<uniqueIDs.length; i++) {
    //       if (uniqueIDs[i][0] === x[0]) {
    //         console.log("step 1");
    //         if (uniqueIDs[i][1] === x[1]) {
    //           console.log("step 2");
    //           if (uniqueIDs[i][2] == x[2]) {
    //             console.log("step 3");
    //             push = false;
    //             i=uniqueIDs.length;
    //           }
    //         }
    //       }
    //     }
    //     console.log(push);
    //     push && uniqueIDs.push(x);
    //     push && console.log("pushed!", x);
    //   } else {
    //     uniqueIDs.push(x);
    //   }
    // } else {
      if (!uniqueIDs.includes(x)) {
        uniqueIDs.push(x);
      }
    // }
  });
  console.log("uniqueids", uniqueIDs);
  return uniqueIDs;
}
module.exports = onlyUniques;
