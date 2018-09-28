let getMovement: string => option((Movement.t, int => int));

let move: (Movement.axis, int) => Vector.t(option(int));

let update:
  (Camera.abstractNew, Webapi.Dom.KeyboardEvent.t) => Camera.abstractNew;
