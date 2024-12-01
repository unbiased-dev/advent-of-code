// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

// parse input
const [left, right] = input
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/))
  .reduce(
    (acc, cur: string[]) => {
      acc[0].push(cur[0]);
      acc[1].push(cur[1]);
      return acc;
    },
    [[], []] as string[][]
  )
  .map((arr) => arr.sort());

// find the difference
const diff = left.reduce((acc, cur, i) => {
  acc += Math.abs(Number(cur) - Number(right[i]));
  return acc;
}, 0);

// print result
console.log(diff);
