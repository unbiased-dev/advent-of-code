// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

const checkVertical = (lines: string[], i: number, j: number) => {
  const up = [
    lines[i][j],
    lines[i - 1]?.[j],
    lines[i - 2]?.[j],
    lines[i - 3]?.[j],
  ].join("");
  const down = [
    lines[i][j],
    lines[i + 1]?.[j],
    lines[i + 2]?.[j],
    lines[i + 3]?.[j],
  ].join("");
  const found = [];
  if (up === "XMAS") found.push(`${i}-${j}-up`);
  if (down === "XMAS") found.push(`${i}-${j}-down`);
  return found;
};

const checkHorizontal = (lines: string[], i: number, j: number) => {
  const left = [
    lines[i][j],
    lines[i][j - 1],
    lines[i][j - 2],
    lines[i][j - 3],
  ].join("");
  const right = [
    lines[i][j],
    lines[i][j + 1],
    lines[i][j + 2],
    lines[i][j + 3],
  ].join("");
  const found = [];
  if (left === "XMAS") found.push(`${i}-${j}-left`);
  if (right === "XMAS") found.push(`${i}-${j}-right`);
  return found;
};

const checkDiagonal = (lines: string[], i: number, j: number) => {
  const upLeft = [
    lines[i][j],
    lines[i - 1]?.[j - 1],
    lines[i - 2]?.[j - 2],
    lines[i - 3]?.[j - 3],
  ].join("");
  const downLeft = [
    lines[i][j],
    lines[i + 1]?.[j - 1],
    lines[i + 2]?.[j - 2],
    lines[i + 3]?.[j - 3],
  ].join("");
  const upRight = [
    lines[i][j],
    lines[i - 1]?.[j + 1],
    lines[i - 2]?.[j + 2],
    lines[i - 3]?.[j + 3],
  ].join("");
  const downRight = [
    lines[i][j],
    lines[i + 1]?.[j + 1],
    lines[i + 2]?.[j + 2],
    lines[i + 3]?.[j + 3],
  ].join("");
  const found = [];
  if (upLeft === "XMAS") found.push(`${i}-${j}-up-left`);
  if (downLeft === "XMAS") found.push(`${i}-${j}-down-left`);
  if (upRight === "XMAS") found.push(`${i}-${j}-up-right`);
  if (downRight === "XMAS") found.push(`${i}-${j}-down-right`);
  return found;
};

const part1 = () => {
  // parse input
  const lines = input.trim().split("\n");

  // "x-y-direction"
  const words = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const vertical = checkVertical(lines, i, j);
      vertical.forEach((i) => words.add(i));
      const horizontal = checkHorizontal(lines, i, j);
      horizontal.forEach((i) => words.add(i));
      const diagonal = checkDiagonal(lines, i, j);
      diagonal.forEach((i) => words.add(i));
    }
  }
  console.log(Array.from(words).length);
};

const checkCross = (lines: string[], i: number, j: number) => {
  const topLeftToBottomRight = [
    lines[i - 1]?.[j - 1],
    lines[i][j],
    lines[i + 1]?.[j + 1],
  ].join("");

  const topRightToBottomLeft = [
    lines[i - 1]?.[j + 1],
    lines[i][j],
    lines[i + 1]?.[j - 1],
  ].join("");

  let hasValidCross = false;

  if (
    (topLeftToBottomRight === "MAS" || topLeftToBottomRight === "SAM") &&
    (topRightToBottomLeft === "MAS" || topRightToBottomLeft === "SAM")
  ) {
    hasValidCross = true;
  }

  return hasValidCross;
};

const part2 = () => {
  // parse input
  const lines = input.trim().split("\n");

  let total = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === "A") {
        const hasCross = checkCross(lines, i, j);
        if (hasCross) total += 1;
      }
    }
  }

  console.log(total);
};

// run
// part1();
// part2();
