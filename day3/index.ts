// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

const part1 = () => {
  // parse input
  const total = Array.from(
    input
      .trim()
      .replaceAll("\n", "")
      .matchAll(/mul\(\d{1,3},\d{1,3}\)/g)
  )
    .map((match) =>
      Array.from(match[0].matchAll(/\d{1,3}/g).map((m) => Number(m[0])))
    )
    .reduce((acc, cur) => {
      acc = acc + cur[0] * cur[1];
      return acc;
    }, 0);
  console.log(total);
};

const part2 = () => {
  // parse input
  const muls = Array.from(
    input
      .trim()
      .replaceAll("\n", "")
      .matchAll(/mul\(\d{1,3},\d{1,3}\)/g)
  ).map((match) => ({
    type: "mul",
    mul: Array.from(match[0].matchAll(/\d{1,3}/g).map((m) => Number(m[0]))),
    index: match.index,
  }));

  type Mul = (typeof muls)[number];

  const dos = Array.from(
    input
      .trim()
      .replaceAll("\n", "")
      .matchAll(/do\(\)/g)
  ).map((match) => ({ type: "do", index: match.index }));

  type Dos = (typeof dos)[number];

  const donts = Array.from(
    input
      .trim()
      .replaceAll("\n", "")
      .matchAll(/don't\(\)/g)
  ).map((match) => ({ type: "dont", index: match.index }));

  type Donts = (typeof donts)[number];

  type AllTogether = Mul | Dos | Donts;

  const allTogetherArr: AllTogether[] = [...muls, ...dos, ...donts];

  // sort by index
  allTogetherArr.sort((a, b) => a.index - b.index);

  const isMul = (val: AllTogether): val is Mul => val.type === "mul";
  const isDo = (val: AllTogether): val is Dos => val.type === "do";
  const isDont = (val: AllTogether): val is Donts => val.type === "dont";

  const { total } = allTogetherArr.reduce(
    (acc, cur) => {
      if (isMul(cur) && acc.do) {
        acc.total = acc.total + cur.mul[0] * cur.mul[1];
      }
      if (isDo(cur)) {
        acc.do = true;
      }
      if (isDont(cur)) {
        acc.do = false;
      }
      return acc;
    },
    {
      do: true,
      total: 0,
    }
  );
  console.log(total);
};

const part2butBetter = () => {
  // parse input
  const matches = input
    .trim()
    .replaceAll("\n", "")
    .matchAll(/mul\((\d{1,3},\d{1,3})\)|don't\(\)|do\(\)/g);

  let go = true;
  let total = 0;
  matches.forEach((match) => {
    if (match[0] === "don't()") go = false;
    if (match[0] === "do()") go = true;
    if (match[0].startsWith("mul(") && go === true) {
      const [a, b] = match[1].split(",").map(Number);
      total += a * b;
    }
  });

  console.log(total);
};

// run
// part1();
// part2();
// part2butBetter();
