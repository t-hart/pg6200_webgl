[@bs.module "../camera"]
external moveForward: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external moveBackward: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external moveUp: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external moveDown: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external moveLeft: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external moveRight: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external rollLeft: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external rollRight: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external turnRight: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external turnLeft: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external flipBack: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external flipForward: Camera.abstractNew => Camera.abstractNew = "";

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

let keyCodeToMovement =
  [
    ("KeyE", moveForward),
    ("KeyD", moveBackward),
    ("KeyS", moveLeft),
    ("KeyF", moveRight),
    ("KeyW", moveDown),
    ("KeyR", moveUp),
    ("KeyJ", turnLeft),
    ("KeyL", turnRight),
    ("KeyI", flipBack),
    ("KeyK", flipForward),
    ("KeyU", rollLeft),
    ("KeyO", rollRight),
  ]
  |> StringMap.fromList;

let update = (camera, e) =>
  e->Webapi.Dom.KeyboardEvent.code->StringMap.get(_, keyCodeToMovement)
  |> (
    fun
    | Some(f) => f(camera)
    | None => camera
  );
