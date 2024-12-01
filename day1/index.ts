// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

// solve part 1
const part1 = () => {
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
};

// solve part 2
const part2 = () => {
  const [left, rightMap] = input
    .trim()
    .split("\n")
    .map((line) => line.split(/\s+/))
    .reduce(
      (acc, cur: string[]) => {
        acc[0].push(Number(cur[0]));
        if (acc[1][Number(cur[1])] === undefined) {
          acc[1][Number(cur[1])] = 0;
        }
        acc[1][Number(cur[1])] += 1;
        return acc;
      },
      [[], {}] as [number[], Record<number, number>]
    );

  const total = left.reduce((acc, cur) => {
    const count = rightMap[cur] ?? 0;
    acc += cur * count;
    return acc;
  }, 0);

  console.log(total);
};

// run
// part1();
// part2();
