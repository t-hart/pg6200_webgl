include GlHandlerImports;

type programName = string;
type modelName = string;

type state = {
  models: StringMap.t(Model.t),
  architecture,
  cam: Camera.t,
  clear: unit => unit,
  rafId: option(Webapi.rafId),
  previousTime: float,
  nextTime: float,
  keys: StringMap.t((Camera.t, float) => Camera.t),
  gl: WebGl.renderingContext,
  aspect: float,
  lightPosition: Vector.t(int),
};

let initialState = glRenderingContext => {
  models:
    getModels(glRenderingContext)
    |> StringMap.fromJsDict
    |> StringMap.map(Model.fromAbstract),
  architecture: getArchitecture(glRenderingContext),
  clear: () => drawEmptyScene(glRenderingContext),
  rafId: None,
  previousTime: 0.0,
  nextTime: 0.0,
  cam: Camera.create(),
  keys: StringMap.empty,
  gl: glRenderingContext,
  aspect: getAspect(glRenderingContext),
  lightPosition: Vector.make(1, 1, 1),
};

let shouldLoop = state =>
  StringMap.exists((_, x) => Model.isRotating(x), state.models)
  || !StringMap.is_empty(state.keys);
