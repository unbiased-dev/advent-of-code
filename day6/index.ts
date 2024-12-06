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
): [boolean, Set<string>] => {
  // this keeps track of us hitting walls, in x-y-orientation format
  const tiles = new Map<string, number>();
  // this keeps track of regular paths we have taken
  const paths = new Set<string>();
  // immediately add the start position to the paths set
  paths.add(`${startPosition[0]}-${startPosition[1]}`);
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
    // if it's not a wall or out of bounds just add it to the paths set
    paths.add(`${position[0]}-${position[1]}`);
  }

  return [isOutOfBounds, paths];
};

const part2 = () => {
  console.time("part2");
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
  // do a dry run to get the basic paths
  const [, paths] = checkIfCanGetOut(map, startPosition);
  // based on the paths, do a loop and add walls
  // and check if we can get out
  Array.from(paths).forEach((path) => {
    const mapCopy = [...map];
    const [x, y] = path.split("-").map((n) => parseInt(n));
    // if we are at the start position, don't add a wall on top of the guard
    if (x === startPosition[0] && y === startPosition[1]) return;
    // put a test wall
    mapCopy[x] = mapCopy[x].substring(0, y) + "#" + mapCopy[x].substring(y + 1);
    // attempt to get out of maze
    const [gotOut] = checkIfCanGetOut(mapCopy, startPosition);
    // if got out, ignore run
    if (gotOut) return;
    // else, counter go up
    counter += 1;
  });
  console.timeEnd("part2");
  console.log(counter);
};

// part1();
part2();
