[@bs.deriving abstract]
type renderingContext = {
  canvas: string,
  drawingBufferHeight: int,
  drawingBufferWidth: int,
};

[@bs.deriving abstract]
type texture =
  | ();

[@bs.deriving abstract]
type program =
  | ();
