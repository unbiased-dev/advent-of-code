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
            if (target === 292) console.log(total);
            return total;
          }
          if (target === 292) console.log(eval(`${total} ${operation} ${n}`));
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

part1();
