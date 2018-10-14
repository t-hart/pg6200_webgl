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
external tiltUp: Camera.abstractNew => Camera.abstractNew = "";
[@bs.module "../camera"]
external tiltDown: Camera.abstractNew => Camera.abstractNew = "";

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

let update = (camera, e) =>
  e->Webapi.Dom.KeyboardEvent.code->StringMap.get(_, keyCodeToMovement)
  |> (
    fun
    | Some(f) => f(camera)
    | None => camera
  );
