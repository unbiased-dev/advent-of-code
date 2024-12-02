// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

const isSafeArr = (arr: number[]) => {
  // check the first two to see trend
  let trend: "inc" | "dec" | undefined;
  const diffOfFirstTwo = Math.abs(arr[0] - arr[1]);
  if (arr[0] < arr[1] && diffOfFirstTwo >= 1 && diffOfFirstTwo <= 3)
    trend = "inc";
  if (arr[0] > arr[1] && diffOfFirstTwo >= 1 && diffOfFirstTwo <= 3)
    trend = "dec";
  // it's not safe/sorted so we can skip
  if (trend === undefined) return false;
  return arr.every((val, index, arr) => {
    if (index === arr.length - 1) return true;
    const diff = val - arr[index + 1];
    if (diff < -3 || diff > 3 || diff === 0) return false;
    if (trend === "inc" && diff <= -1 && diff >= -3) return true;
    if (trend === "dec" && diff >= 1 && diff <= 3) return true;
    return false;
  });
};

// solve part 1
const part1 = () => {
  // parse input
  const total = input
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map(Number))
    .reduce((acc, cur) => {
      const isSafe = isSafeArr(cur);
      if (isSafe) acc = acc + 1;
      return acc;
    }, 0);
  console.log(total);
};

// solve part 2
const part2 = () => {
  // parse input
  const total = input
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map(Number))
    .reduce((acc, cur) => {
      const isSafe = isSafeArr(cur);
      if (isSafe) {
        acc = acc + 1;
      } else {
        for (let i = 0; i < cur.length; i++) {
          const newArr = [...cur];
          newArr.splice(i, 1);
          if (isSafeArr(newArr)) {
            acc = acc + 1;
            break;
          }
        }
      }
      return acc;
    }, 0);
  console.log(total);
};

// run
// part1();
// part2();
