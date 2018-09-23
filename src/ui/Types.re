open Functions;

type fieldset = {
  disabled: bool,
  content: ReasonReact.reactElement,
  legend: string,
};

type vector3 = {
  x: int,
  y: int,
  z: int,
};

let vec = (x, y, z) => {x, y, z};

let vecRepeating = x => vec(x, x, x);

let zeroVector = vecRepeating(0);

let oneVector = vecRepeating(1);

let vector3AsArray = vec => Array.map(toDecimal, [|vec.x, vec.y, vec.z|]);

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

/* let keys = map => StringMap.fold((k, _, acc) => [k, ...acc], map, []); */
let keys = map => StringMap.bindings(map) |> List.map(((k, _)) => k);

let entries = map =>
  StringMap.fold((k, v, acc) => [(k, v), ...acc], map, []);

type model = {
  objData: AbstractTypes.objData,
  programs: StringMap.t(AbstractTypes.webGlProgram),
  texture: option(AbstractTypes.webGlTexture),
};

let modelFromAbstract = abstract => {
  objData: abstract->AbstractTypes.objDataGet,
  programs: abstract->AbstractTypes.programsGet |> toMap,
  texture: abstract->AbstractTypes.textureGet,
};

let modelToRenderArgs = (model, programName) =>
  AbstractTypes.renderArg(
    ~objData=model.objData,
    ~program=StringMap.find(programName, model.programs),
    ~texture=model.texture,
  );

type programName = string;
type modelName = string;

type camera = {
  position: vector3,
  rotation: vector3,
};

type globalOptions = {
  scale: int,
  rotation: vector3,
  camera,
};

let globalOptsToAbstract = opts =>
  AbstractTypes.globalOptions(
    ~scale=opts.scale->toDecimal,
    ~rotation=opts.rotation->vector3AsArray,
  );

type renderData = {
  model: option(modelName),
  models: StringMap.t(model),
  selectedPrograms: StringMap.t(programName),
  renderFunc:
    (option(AbstractTypes.renderArg), AbstractTypes.globalOptions) => unit,
  globalOptions,
};
