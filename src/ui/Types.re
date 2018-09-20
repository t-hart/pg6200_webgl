let debug = a => {
  Js.log(a);
  a;
};

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

module StringMap =
  Map.Make({
    type t = string;
    let compare = compare;
  });

let toMap = jsDict =>
  jsDict
  |> Js.Dict.entries
  |> Array.fold_left(
       (acc, (key, value)) => StringMap.add(key, value, acc),
       StringMap.empty,
     );

let get = (key, map) =>
  StringMap.exists((k, _) => k === key, map) ?
    StringMap.find(key, map)->Some : None;

let update = (key, f, map) => StringMap.add(key, get(key, map)->f, map);

let keys = map => StringMap.fold((k, _, acc) => [k, ...acc], map, []);

let entries = map =>
  StringMap.fold((k, v, acc) => [(k, v), ...acc], map, []);

[@bs.deriving abstract]
type model = {
  objData,
  programs: Js.Dict.t(webGlProgram),
  texture: option(webGlTexture),
};

type modelRe = {
  objData,
  programs: StringMap.t(webGlProgram),
  texture: option(webGlTexture),
};

let modelToModelRe = model => {
  objData: model->objDataGet,
  programs: model->programsGet |> toMap,
  texture: model->textureGet,
};

let modelToRenderArgs = (model, programName) =>
  renderArg(
    ~objData=model.objData,
    ~program=StringMap.find(programName, model.programs),
    ~texture=model.texture,
  );

type programName = string;
type modelName = string;

type renderData = {
  model: option(modelName),
  models: StringMap.t(modelRe),
  selectedPrograms: StringMap.t(programName),
  renderFunc: option(renderArg) => unit,
};
