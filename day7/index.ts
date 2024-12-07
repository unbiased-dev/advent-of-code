// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

const part1 = () => {
  console.time("part1");
  const solution = input
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
    })
    .reduce((acc, cur) => {
      const [target, nums] = cur;
      const maxPermutationsAsBitString = Array.from({ length: nums.length - 1 })
        .fill(1)
        .join("");
      const maxPermutations = parseInt(maxPermutationsAsBitString, 2);

      let isSolvable = false;

      for (let i = 0; i <= maxPermutations; i++) {
        // get the current permutation as a bit string
        const currentPermutationAsBitString = (i >>> 0)
          .toString(2)
          .padStart(maxPermutationsAsBitString.length, "0");
        const totalForThisPermutation = nums.reduce((total, n, index) => {
          const operation =
            currentPermutationAsBitString[index - 1] === "0" ? "+" : "*";
          if (index === 0) {
            total = n;
            return total;
          }
          return eval(`${total} ${operation} ${n}`);
        }, 0);
        if (totalForThisPermutation === target) {
          isSolvable = true;
          break;
        }
      }
      if (isSolvable) {
        acc += target;
      }
      return acc;
    }, 0);
  console.timeEnd("part1");

  console.log(solution);
};

const part2 = () => {
  console.time("part2");
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
  // first run part1 to identify all solvable with 2 operations
  // and keep track of the solvable line indexes (in case targets are not unique)
  const solvableIndexes: Set<number> = new Set();
  const _solutionPart1 = parsed.reduce((acc, cur, lineIndex) => {
    const [target, nums] = cur;
    const maxPermutationsAsBitString = Array.from({ length: nums.length - 1 })
      .fill(1)
      .join("");
    const maxPermutations = parseInt(maxPermutationsAsBitString, 2);

    let isSolvable = false;

    for (let i = 0; i <= maxPermutations; i++) {
      // get the current permutation as a bit string
      const currentPermutationAsBitString = (i >>> 0)
        .toString(2)
        .padStart(maxPermutationsAsBitString.length, "0");
      const totalForThisPermutation = nums.reduce((total, n, index) => {
        const operation =
          currentPermutationAsBitString[index - 1] === "0" ? "+" : "*";
        if (index === 0) {
          total = n;
          return total;
        }
        return eval(`${total} ${operation} ${n}`);
      }, 0);
      if (totalForThisPermutation === target) {
        isSolvable = true;
        solvableIndexes.add(lineIndex);
        break;
      }
    }
    if (isSolvable) {
      acc += target;
    }
    return acc;
  }, 0);
  const solution = parsed.reduce((acc, cur, lineIndex) => {
    const [target, nums] = cur;
    if (solvableIndexes.has(lineIndex)) {
      // if the line was solved as part1, immediately add it to the solution
      // instead of running part2 algorithm for 3 operations
      return (acc += target);
    }
    const maxPermutationsAs3String = Array.from({ length: nums.length - 1 })
      .fill(2)
      .join("");
    const maxPermutations = parseInt(maxPermutationsAs3String, 3);

    let isSolvable = false;

    for (let i = 0; i <= maxPermutations; i++) {
      // get the current permutation as a bit string
      const currentPermutationAsBitString = (i >>> 0)
        .toString(3)
        .padStart(maxPermutationsAs3String.length, "0");
      const totalForThisPermutation = nums.reduce((total, n, index) => {
        let operationElem = currentPermutationAsBitString[index - 1];
        if (operationElem === "0") {
          operationElem = "+";
        } else if (operationElem === "1") {
          operationElem = "*";
        } else if (operationElem === "2") {
          operationElem = "||";
        }
        if (index === 0) {
          total = n;
          return total;
        }
        if (["+", "*"].includes(operationElem)) {
          return eval(`${total} ${operationElem} ${n}`);
        } else if (operationElem === "||") {
          return parseInt(`${total}${n}`, 10);
        }
      }, 0);
      if (totalForThisPermutation === target) {
        isSolvable = true;
        break;
      }
    }
    if (isSolvable) {
      acc += target;
    }
    return acc;
  }, 0);
  console.timeEnd("part2");

  console.log(solution);
};

// part1();
part2();
