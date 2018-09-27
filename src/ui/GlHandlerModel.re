include GlHandlerImports;

type programName = string;

type modelName = string;

type state = {
  model: option(modelName),
  models: StringMap.t(Model.t),
  selectedPrograms: StringMap.t(programName),
  clear: unit => unit,
  getDrawArgs: RenderArgs.abstract => DrawArgs.abstract,
  globalOptions: GlobalOptions.t,
  rafId: option(Webapi.rafId),
  previousTime: float,
  nextTime: float,
  drawArgs: StringMap.t(DrawArgs.abstract),
};

let initialState = glRenderingContext => {
  models:
    getModels(glRenderingContext)
    |> StringMap.fromJsDict
    |> StringMap.map(Model.fromAbstract),
  clear: () => renderBlank(glRenderingContext),
  model: None,
  getDrawArgs: getDrawArgs(glRenderingContext),
  selectedPrograms: StringMap.empty,
  drawArgs: StringMap.empty,
  globalOptions: {
    scale: 100,
    rotation: Vector.make(0, 100, 0),
    camera: {
      position: Vector.zero,
      rotation: Vector.zero,
      velocity: 1,
    },
  },
  rafId: None,
  previousTime: 0.0,
  nextTime: 0.0,
};

let shouldLoop = state => state.globalOptions.rotation != Vector.zero;
