open Utils;

type t('a) = {
  x: 'a,
  y: 'a,
  z: 'a,
};

let make = (x, y, z) => {x, y, z};

let fill = x => make(x, x, x);

let zero = fill(0);

let one = fill(1);

let toFloatArray = vec => Array.map(toDecimal, [|vec.x, vec.y, vec.z|]);

let toFloatArray4D = (vec, w) =>
  Array.map(toDecimal, [|vec.x, vec.y, vec.z, w|]);

let x = a => make(Some(a), None, None);

let y = a => make(None, Some(a), None);

let z = a => make(None, None, Some(a));

let update = (original: t('a), opt: t(option('a))) => {
  x: opt.x |> default(original.x),
  y: opt.y |> default(original.y),
  z: opt.z |> default(original.z),
};

let isZero = v => v.x === 0 && v.y === 0 && v.z === 0;

let toString = ({x, y, z}: t('a)) => {j|[ $x, $y, $z ]|j};

let map = (f, v) => {x: f(v.x), y: f(v.y), z: f(v.z)};

let toArray = v => [|v.x, v.y, v.z|];

let toList = v => [v.x, v.y, v.z];

let add = (v, u) => {x: v.x + u.x, y: v.y + u.y, z: v.z + u.z};

let addSome = (v, u) => {
  x: v.x + (u.x |> default(0)),
  y: v.y + (u.y |> default(0)),
  z: v.z + (u.z |> default(0)),
};
