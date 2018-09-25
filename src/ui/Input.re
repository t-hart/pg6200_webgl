open Movement;

module Map =
  MapUtils.Make({
    type t = axis;
    let compare = compare;
  });

let keycodeMovementMap =
  [
    ("KeyE", Translation(Z)),
    ("KeyD", Translation(Z)),
    ("KeyS", Translation(X)),
    ("KeyF", Translation(X)),
    ("KeyW", Translation(Y)),
    ("KeyR", Translation(Y)),
    ("KeyJ", Rotation(Z)),
    ("KeyL", Rotation(Z)),
    ("KeyI", Rotation(X)),
    ("KeyK", Rotation(X)),
    ("KeyU", Rotation(Y)),
    ("KeyO", Rotation(Y)),
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
