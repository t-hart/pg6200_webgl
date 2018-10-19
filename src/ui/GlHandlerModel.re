include GlHandlerImports;

type programName = string;

type modelName = string;

type state = {
  model: option(modelName),
  models: StringMap.t(Model.t),
  selectedPrograms: StringMap.t(programName),
  clear: unit => unit,
  createDrawArgs: RenderArgs.abstract => DrawArgs.abstract,
  modelOptions: ModelOptions.t,
  rafId: option(Webapi.rafId),
  previousTime: float,
  nextTime: float,
  drawArgs: StringMap.t(DrawArgs.abstract),
  cam: Camera.t,
  keys: StringMap.t((Camera.t, float) => Camera.t),
  gl: WebGl.renderingContext,
};

let initialState = glRenderingContext => {
  models:
    getModels(glRenderingContext)
    |> StringMap.fromJsDict
    |> StringMap.map(Model.fromAbstract),
  clear: () => drawEmptyScene(glRenderingContext),
  model: None,
  createDrawArgs: DrawArgs.create(glRenderingContext),
  selectedPrograms: StringMap.empty,
  drawArgs: StringMap.empty,
  modelOptions: {
    scale: 100,
    /* rotation: Vector.make(0, 100, 0), */
    rotation: Vector.make(0, 0, 0),
  },
  rafId: None,
  previousTime: 0.0,
  nextTime: 0.0,
  cam: Camera.create(),
  keys: StringMap.empty,
  gl: glRenderingContext,
};

let shouldLoop = state =>
  state.modelOptions.rotation != Vector.zero
  || !StringMap.is_empty(state.keys);
