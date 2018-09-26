include GlHandlerImports;

type programName = string;

type modelName = string;

type state = {
  model: option(modelName),
  models: StringMap.t(Model.t),
  selectedPrograms: StringMap.t(programName),
  clear: unit => unit,
  renderFunc: (AbstractTypes.renderArg, AbstractTypes.globalOptions) => unit,
  getDrawArgs: AbstractTypes.renderArg => AbstractTypes.drawArgs,
  globalOptions: GlobalOptions.t,
  rafId: option(Webapi.rafId),
  modelRotation: float,
  previousTime: float,
  nextTime: float,
  drawArgs: StringMap.t(AbstractTypes.drawArgs),
};

let initialState = glRenderingContext => {
  models:
    getModels(glRenderingContext)
    |> StringMap.fromJsDict
    |> StringMap.map(Model.fromAbstract),
  renderFunc: render(glRenderingContext),
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
  modelRotation: 0.8,
  previousTime: 0.0,
  nextTime: 0.0,
};
