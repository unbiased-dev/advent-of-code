// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

type RulesMap = Record<string, Set<string>>;

const isValidUpdate = (update: string, rulesMap: RulesMap): boolean => {
  return update.split(",").every((page, index, array) => {
    const subArr = new Set(array.slice(0, index));
    return Array.from(rulesMap[page]).every(
      (rulePage) => !subArr.has(rulePage)
    );
  });
};

const part1 = () => {
  const res = input.trim().split("\n\n");
  const rules = res[0].split("\n");
  const rulesMap = rules.reduce((acc: RulesMap, cur) => {
    const [left, right] = cur.split("|");
    if (!acc[left]) acc[left] = new Set();
    acc[left].add(right);
    return acc;
  }, {});
  const updates = res[1].split("\n");
  const validUpdates: string[] = [];
  updates.forEach((update) => {
    if (isValidUpdate(update, rulesMap)) validUpdates.push(update);
  });
  const totalMiddles = validUpdates.reduce((acc, cur) => {
    const curAsArr = cur.split(",");
    acc += Number(curAsArr[Math.floor(curAsArr.length / 2)]);
    return acc;
  }, 0);

  console.log(totalMiddles);
};

const part2 = () => {
  const res = input.trim().split("\n\n");
  const rules = res[0].split("\n");
  const rulesMap = rules.reduce((acc: RulesMap, cur) => {
    const [left, right] = cur.split("|");
    if (!acc[left]) acc[left] = new Set();
    acc[left].add(right);
    return acc;
  }, {});
  const updates = res[1].split("\n");
  const validUpdates: string[] = [];
  const invalidUpdates: string[] = [];
  updates.forEach((update) => {
    if (isValidUpdate(update, rulesMap)) validUpdates.push(update);
    else invalidUpdates.push(update);
  });
  const sortedInvalidUpdates = invalidUpdates.map((invalidUpdate) => {
    return invalidUpdate
      .split(",")
      .sort((a, b) => (rulesMap[a].has(b) ? -1 : 0))
      .join(",");
  });
  const totalMiddlesOfInvalid = sortedInvalidUpdates.reduce((acc, cur) => {
    const curAsArr = cur.split(",");
    acc += Number(curAsArr[Math.floor(curAsArr.length / 2)]);
    return acc;
  }, 0);

  console.log(totalMiddlesOfInvalid);
};

// run
// part1();
// part2();
