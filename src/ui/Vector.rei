type t('a) = {
  x: 'a,
  y: 'a,
  z: 'a,
};

let make: ('a, 'a, 'a) => t('a);

let fill: 'a => t('a);

let x: 'a => t(option('a));

let y: 'a => t(option('a));

let z: 'a => t(option('a));

let update: (t('a), t(option('a))) => t('a);

let map: ('a => 'b, t('a)) => t('b);

let toArray: t('a) => array('a);

let toList: t('a) => list('a);

let toString: t('a) => string;

let zero: t(int);

let one: t(int);

let add: (t(int), t(int)) => t(int);

let addSome: (t(int), t(option(int))) => t(int);

let toFloatArray: t(int) => array(float);

let isZero: t(int) => bool;
