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
  lightDirection: Vector.t(int),
  lightShader,
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
  cam: Camera.create(glRenderingContext),
  keys: StringMap.empty,
  gl: glRenderingContext,
  aspect: getAspect(glRenderingContext),
  lightDirection: Vector.make(1, 2, 5),
  lightShader: getLightShader(glRenderingContext),
};

let reset = state => {
  ...state,
  models: StringMap.map(Model.reset, state.models),
  previousTime: 0.0,
  nextTime: 0.0,
  cam: Camera.create(state.gl),
  keys: StringMap.empty,
  lightDirection: Vector.make(1, 5, 4),
};

let shouldLoop = state =>
  StringMap.exists((_, x) => Model.isRotating(x), state.models)
  || !StringMap.is_empty(state.keys);
