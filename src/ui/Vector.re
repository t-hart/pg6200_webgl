type t('a) = {
  x: 'a,
  y: 'a,
  z: 'a,
};

let make = (x, y, z) => {x, y, z};

let fill = x => make(x, x, x);

let zero = fill(0);

let one = fill(1);

let asArray = vec => Array.map(Utils.toDecimal, [|vec.x, vec.y, vec.z|]);

let x = a => make(Some(a), None, None);

let y = a => make(None, Some(a), None);

let z = a => make(None, None, Some(a));

let update = (original: t('a), opt: t(option('a))) => {
  x: Belt.Option.getWithDefault(opt.x, original.x),
  y: Belt.Option.getWithDefault(opt.y, original.y),
  z: Belt.Option.getWithDefault(opt.z, original.z),
};

let map = (f, v) => {x: f(v.x), y: f(v.y), z: f(v.z)};

let toArray = v => [|v.x, v.y, v.z|];

let toList = v => [v.x, v.y, v.z];
