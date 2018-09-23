type t = {
  x: int,
  y: int,
  z: int,
};

let make = (x, y, z) => {x, y, z};

let fill = x => make(x, x, x);

let zero = fill(0);

let one = fill(1);

let asArray = vec => Array.map(Functions.toDecimal, [|vec.x, vec.y, vec.z|]);
