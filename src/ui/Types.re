[@bs.deriving abstract]
type modelData = {
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
type shaderSet = {
  vertex: string,
  fragment: string,
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

let get = (map, key) =>
  StringMap.exists((k, _) => k === key, map) ?
    StringMap.find(key, map) |. Some : None;

let update = (key, f, map) => StringMap.add(key, get(map, key) |> f, map);

let keys = map => StringMap.fold((k, _, acc) => [k, ...acc], map, []);

let entries = map =>
  StringMap.fold((k, v, acc) => [(k, v), ...acc], map, []);

module Option = {
  let default = (defaultVal, opt) =>
    switch (opt) {
    | Some(x) => x
    | None => defaultVal
    };

  let map = (f, opt) =>
    switch (opt) {
    | Some(x) => Some(f(x))
    | None => None
    };
};

type model = {
  name: string,
  data: modelData,
  shaders: StringMap.t(shaderSet),
  currentShader: string,
};

type renderData = {
  models: StringMap.t(modelData),
  model: option(string),
  renderFunc: option(modelData) => unit,
  modelCache: StringMap.t(model),
};
