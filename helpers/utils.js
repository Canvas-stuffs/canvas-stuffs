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
  let sortedArray = [...arr].sort((a, b) => a - b);

  let minDiff = Number.MAX_VALUE;
  let minDiffAreaIdxs = [];

  for (let i = 0; i < n - 1; i++) {
    let currentDiff = Math.abs(sortedArray[i + 1] - sortedArray[i]);
    if (currentDiff < minDiff) {
      minDiff = currentDiff;

      const firstMinDiffAreaIdx = arr.findIndex((el) => el == sortedArray[i]);
      const secondMinDiffAreaIdx = arr.findIndex(
        (el) => el == sortedArray[i + 1]
      );

      minDiffAreaIdxs = [firstMinDiffAreaIdx, secondMinDiffAreaIdx];
    }
    return minDiffAreaIdxs;
  }
}

function toggleCursorStyle() {
  document.getElementById("canvas").toggleAttribute("is-drawing");
}

export { getRandomColor, findSmallestAreaDiffValues, toggleCursorStyle };
