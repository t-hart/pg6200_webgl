open Movement;
open Utils;

module Map =
  MapUtils.Make({
    type t = axis;
    let compare = compare;
  });

let negate = a => - a;

let keycodeMovementMap =
  [
    ("KeyE", (Translation(Z), id)),
    ("KeyD", (Translation(Z), negate)),
    ("KeyS", (Translation(X), id)),
    ("KeyF", (Translation(X), negate)),
    ("KeyW", (Translation(Y), id)),
    ("KeyR", (Translation(Y), negate)),
    ("KeyJ", (Rotation(Z), id)),
    ("KeyL", (Rotation(Z), negate)),
    ("KeyI", (Rotation(X), id)),
    ("KeyK", (Rotation(X), negate)),
    ("KeyU", (Rotation(Y), id)),
    ("KeyO", (Rotation(Y), negate)),
  ]
  |> StringMap.fromList;

let axisFunctionMap =
  [
    (X, Vector.x: int => Vector.t(option(int))),
    (Y, Vector.y),
    (Z, Vector.z),
  ]
  |> Map.fromList;

let move = axis => Map.find(axis, axisFunctionMap);

let getMovement = keyCode => StringMap.get(keyCode, keycodeMovementMap);
