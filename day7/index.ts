// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

const checkIfSolvable = (
  target: number,
  nums: number[],
  map: Map<number, string[]>,
  radix: 2 | 3
) => {
  const allPermutationsForThisLength = map.get(nums.length)!;
  let isSolvable = false;
  for (let i = 0; i < allPermutationsForThisLength.length; i++) {
    // test against each permutation
    const currentPermutationToTestAgainst = allPermutationsForThisLength[i];
    let totalForThisPermutation = 0;
    for (let j = 0; j < nums.length; j++) {
      let operation = currentPermutationToTestAgainst[j - 1];
      if (radix === 2) {
        operation = operation === "0" ? "+" : "*";
      } else if (radix === 3) {
        if (operation === "0") {
          operation = "+";
        } else if (operation === "1") {
          operation = "*";
        } else if (operation === "2") {
          operation = "||";
        }
      }
      if (j === 0) {
        totalForThisPermutation = nums[j];
        continue;
      }
      if (operation === "+") {
        totalForThisPermutation += nums[j];
      }
      if (operation === "*") {
        totalForThisPermutation *= nums[j];
      }
      if (operation === "||") {
        totalForThisPermutation = parseInt(
          `${totalForThisPermutation}${nums[j]}`,
          10
        );
      }
      // if at any point the total is over the target, break out of the loop
      if (totalForThisPermutation > target) {
        break;
      }
    }
    if (totalForThisPermutation === target) {
      isSolvable = true;
      break;
    }
  }
  return isSolvable;
};

const part1and2 = () => {
  console.time("part1and2");
  const parsed = input
    .trim()
    .split("\n")
    .map((line) => line.split(":"))
    .map(([left, right]): [number, number[]] => {
      return [
        parseInt(left),
        right
          .trim()
          .split(" ")
          .map((n) => parseInt(n)),
      ];
    });
  // pre compute all permutations for the highest number of nums
  // find the largest number of nums first
  const largestNums = parsed.reduce((acc, cur) => {
    const [_target, nums] = cur;
    if (nums.length > acc) {
      return nums.length;
    }
    return acc;
  }, 0);

  const mapForRadix2 = new Map<number, string[]>();
  const mapForRadix3 = new Map<number, string[]>();

  for (let i = 0; i < largestNums; i++) {
    // for each length of nums, find all permutations
    // and store them in a map with the key being the lenth of nums
    // and the value being the permutations in a string array
    const largestNumsAsRadix2String = "1".repeat(i);
    const largestNumsAsRadix3String = "2".repeat(i);
    const largestNumsInRadix2AsInt = parseInt(largestNumsAsRadix2String, 2);
    const largestNumsInRadix3AsInt = parseInt(largestNumsAsRadix3String, 3);
    mapForRadix2.set(i + 1, []);
    mapForRadix3.set(i + 1, []);
    for (let j = 0; j <= largestNumsInRadix2AsInt; j++) {
      const currentPermutationAsString = (j >>> 0)
        .toString(2)
        .padStart(largestNumsAsRadix2String.length, "0");
      mapForRadix2.get(i + 1)?.push(currentPermutationAsString);
    }
    for (let j = 0; j <= largestNumsInRadix3AsInt; j++) {
      const currentPermutationAsString = (j >>> 0)
        .toString(3)
        .padStart(largestNumsAsRadix3String.length, "0");
      mapForRadix3.get(i + 1)?.push(currentPermutationAsString);
    }
  }

  // first run part1 to identify all solvable with 2 operations
  // and keep track of the solvable line indexes (in case targets are not unique)
  const solvableIndexes: Set<number> = new Set();
  const solutionPart1 = parsed.reduce((acc, cur, lineIndex) => {
    const [target, nums] = cur;
    if (checkIfSolvable(target, nums, mapForRadix2, 2)) {
      acc += target;
      solvableIndexes.add(lineIndex);
    }
    return acc;
  }, 0);
  const solutionPart2 = parsed.reduce((acc, cur, lineIndex) => {
    const [target, nums] = cur;
    // if the line was solved as part1, immediately add it to the solution
    // instead of running part2 algorithm for 3 operations
    if (solvableIndexes.has(lineIndex)) {
      acc += target;
      return acc;
    }
    if (checkIfSolvable(target, nums, mapForRadix3, 3)) {
      acc += target;
      solvableIndexes.add(lineIndex);
    }
    return acc;
  }, 0);

  console.log(solutionPart1);
  console.log(solutionPart2);

  console.timeEnd("part1and2");
};

part1and2();
