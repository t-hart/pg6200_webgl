[@bs.module "../camera"]
external moveForward: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"]
external moveBackward: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external moveUp: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external moveDown: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external moveLeft: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"]
external moveRight: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external rollLeft: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"]
external rollRight: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"]
external turnRight: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external turnLeft: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external tiltUp: (Camera.t, float) => Camera.t = "";
[@bs.module "../camera"] external tiltDown: (Camera.t, float) => Camera.t = "";

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
    ("KeyI", tiltUp),
    ("KeyK", tiltDown),
    ("KeyU", rollLeft),
    ("KeyO", rollRight),
  ]
  |> StringMap.fromList;

let keyDown = (keys, e) => {
  let keyCode = e->Webapi.Dom.KeyboardEvent.code;
  StringMap.get(keyCode, keyCodeToMovement)
  |> (
    fun
    | Some(f) when !StringMap.exists((k, _) => k === keyCode, keys) =>
      Some(StringMap.add(keyCode, f, keys))
    | _ => None
  );
};

let keyUp = (keys, e) => {
  let keyCode = e->Webapi.Dom.KeyboardEvent.code;
  StringMap.exists((k, _) => k === keyCode, keys) ?
    Some(StringMap.remove(Webapi.Dom.KeyboardEvent.code(e), keys)) : None;
};
