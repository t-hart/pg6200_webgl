include GlHandlerImports;

type programName = string;
type modelName = string;

type state = {
  models: StringMap.t(Model.t),
  room: DrawArgs.abstract,
  cam: Camera.t,
  clear: unit => unit,
  rafId: option(Webapi.rafId),
  previousTime: float,
  nextTime: float,
  keys: StringMap.t((Camera.t, float) => Camera.t),
  gl: WebGl.renderingContext,
  aspect: float,
};

let initialState = glRenderingContext => {
  models:
    getModels(glRenderingContext)
    |> StringMap.fromJsDict
    |> StringMap.map(Model.fromAbstract),
  room: getRoom(glRenderingContext),
  clear: () => drawEmptyScene(glRenderingContext),
  rafId: None,
  previousTime: 0.0,
  nextTime: 0.0,
  cam: Camera.create(),
  keys: StringMap.empty,
  gl: glRenderingContext,
  aspect: getAspect(glRenderingContext),
};

let shouldLoop = state =>
  StringMap.exists((_, x) => Model.isRotating(x), state.models)
  || !StringMap.is_empty(state.keys);
