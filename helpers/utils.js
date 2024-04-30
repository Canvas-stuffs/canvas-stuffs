function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function findSmallestAreaDiffValues(arr) {
  let n = arr.length;
  let arrCopy = [...arr];
  let sortedArray = arrCopy.sort((a, b) => a - b);
  console.log("sorted array: ", sortedArray);
  console.log("simple array: ", arr);
  let minDiff = Number.MAX_VALUE;
  let minsValue = [];

  for (let i = 0; i < n - 1; i++) {
    let diff = Math.abs(sortedArray[i + 1] - sortedArray[i]);
    if (diff < minDiff) {
      minDiff = diff;

      const min1 = arr.findIndex((el) => el == sortedArray[i]);
      const min2 = arr.findIndex((el) => el == sortedArray[i + 1]);

      // console.log("sorted array i: ", sortedArray[i]);
      // console.log("sorted array i+1: ", sortedArray[i + 1]);
      // console.log("simple array in if: ", arr);

      console.log("min1 and min2: ", min1, "===", min2);

      minsValue = [min1, min2];
    }
    return minsValue;
  }
}
export { getRandomColor, findSmallestAreaDiffValues };
