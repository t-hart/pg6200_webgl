[@bs.deriving abstract]
type objData = {
  v: array(float),
  vt: array(float),
  vn: array(float),
  f: array(float),
  colors: array(float),
  min: array(float),
  max: array(float),
};

[@bs.deriving abstract]
type webGlRenderingContext = {
  canvas: string,
  drawingBufferHeight: int,
  drawingBufferWidth: int,
};

[@bs.deriving abstract]
type webGlTexture =
  | ();

[@bs.deriving abstract]
type webGlProgram =
  | ();

[@bs.deriving abstract]
type renderArg = {
  objData,
  program: webGlProgram,
  texture: option(webGlTexture),
};

[@bs.deriving abstract]
type model = {
  objData,
  programs: Js.Dict.t(webGlProgram),
  texture: option(webGlTexture),
};

[@bs.deriving abstract]
type globalOptions = {
  scale: float,
  rotation: array(float),
};

[@bs.deriving abstract]
type camera = {
  position: array(float),
  rotation: array(float),
};

[@bs.deriving abstract]
type drawArgs =
  | ();
