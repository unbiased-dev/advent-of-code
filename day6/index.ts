// read input file
const input = await Bun.file(import.meta.dir + "/input.txt").text();

const goUp = (x: number, y: number): [number, number] => [x - 1, y];
const goRight = (x: number, y: number): [number, number] => [x, y + 1];
const goDown = (x: number, y: number): [number, number] => [x + 1, y];
const goLeft = (x: number, y: number): [number, number] => [x, y - 1];

const part1 = () => {
  const map = input.trim().split("\n");
  let position: [number, number] = [0, 0];
  let orientation: "up" | "down" | "left" | "right" = "up";
  const tiles = new Set<string>();
  // find start position
  map.forEach((line, index) => {
    const guard = line.indexOf("^");
    if (guard > 0) {
      tiles.add(`${index}-${guard}`);
      position = [index, guard];
    }
  });
  let isOutOfBounds: boolean = false;
  while (!isOutOfBounds) {
    const originalPosition = [...position] as [number, number];
    // move to next tile according to orientation
    if (orientation === "up") {
      position = goUp(...position);
    } else if (orientation === "right") {
      position = goRight(...position);
    } else if (orientation === "down") {
      position = goDown(...position);
    } else if (orientation === "left") {
      position = goLeft(...position);
    }
    // if new position is a wall "#"
    // switch orientation by 90deg
    // and restore position
    if (map[position[0]]?.[position[1]] === "#") {
      position = originalPosition;
      if (orientation === "up") {
        orientation = "right";
      } else if (orientation === "right") {
        orientation = "down";
      } else if (orientation === "down") {
        orientation = "left";
      } else if (orientation === "left") {
        orientation = "up";
      }
      continue;
    }
    // if it's not a wall, check if we are out of bounds
    if (map[position[0]]?.[position[1]] === undefined) {
      isOutOfBounds = true;
      continue;
    }
    // if it's not a wall or out of bounds
    // continue and write our position to the tiles set
    tiles.add(`${position[0]}-${position[1]}`);
  }
  console.log(tiles.size);
};

const checkIfCanGetOut = (
  map: string[],
  startPosition: [number, number]
): boolean => {
  // this keeps track of us hitting walls, in x-y-orientation format
  const tiles = new Map<string, number>();
  // current position
  let position = [...startPosition] as [number, number];
  // current orientation
  let orientation: "up" | "down" | "left" | "right" = "up";
  // are we out of bounds?
  let isOutOfBounds: boolean = false;
  while (!isOutOfBounds) {
    const originalPosition = [...position] as [number, number];
    // move to next tile according to orientation
    if (orientation === "up") {
      position = goUp(...position);
    } else if (orientation === "right") {
      position = goRight(...position);
    } else if (orientation === "down") {
      position = goDown(...position);
    } else if (orientation === "left") {
      position = goLeft(...position);
    }
    // if new position is a wall "#"
    if (map[position[0]]?.[position[1]] === "#") {
      const positionHash = `${position[0]}-${position[1]}-${orientation}`;
      // before continuing with rotation, check if we were already at this wall for this orientation
      // if we've been at this wall with this orientation more than one time, it means we are in a loop
      // because same orientation and same wall is going to result in the same path traversal each time
      // if we were not already at this wall, just add it to the tiles set
      const tile = tiles.get(positionHash);
      if (tile) {
        if (tile > 1) {
          // this means we were already here once, so we are in a loop
          // break out of the while loop and up return true
          break;
        } else {
          tiles.set(positionHash, tile + 1);
        }
      } else {
        tiles.set(positionHash, 1);
      }
      // now that we added the wall to the set, continue traversing as normal
      // switch orientation by 90deg
      // and restore position
      position = originalPosition;
      if (orientation === "up") {
        orientation = "right";
      } else if (orientation === "right") {
        orientation = "down";
      } else if (orientation === "down") {
        orientation = "left";
      } else if (orientation === "left") {
        orientation = "up";
      }
      continue;
    }
    // if it's not a wall, check if we are out of bounds
    if (map[position[0]]?.[position[1]] === undefined) {
      isOutOfBounds = true;
      continue;
    }
    // if it's not a wall or out of bounds do nothing
  }

  return isOutOfBounds;
};

const part2 = () => {
  const map = input.trim().split("\n");
  let startPosition: [number, number] = [0, 0];
  let counter = 0;
  // find start position
  map.forEach((line, index) => {
    const guard = line.indexOf("^");
    if (guard > 0) {
      startPosition = [index, guard];
    }
  });
  for (let i = 0; i < map.length; i++) {
    const line = map[i];
    for (let j = 0; j < line.length; j++) {
      const mapCopy = [...map];
      const tmp = mapCopy[i][j];
      // if already a wall ignore
      if (tmp === "#") continue;
      // if guard is there, ignore
      if (tmp === "^") continue;
      // put a test wall
      mapCopy[i] =
        mapCopy[i].substring(0, j) + "#" + mapCopy[i].substring(j + 1);
      // attempt to get out of maze
      const gotOut = checkIfCanGetOut(mapCopy, startPosition);
      // if got out, ignore run
      if (gotOut) continue;
      // else, counter go up
      counter += 1;
    }
  }
  console.log(counter);
};

// part1();
// part2();
