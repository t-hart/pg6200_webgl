type programName = string;
type modelName = string;

type fieldset = {
  disabled: bool,
  content: ReasonReact.reactElement,
  legend: string,
};

type model = {
  objData: AbstractTypes.objData,
  programs: StringMap.t(AbstractTypes.webGlProgram),
  texture: option(AbstractTypes.webGlTexture),
};

type camera = {
  position: Vector.t(int),
  rotation: Vector.t(int),
  velocity: int,
};

type globalOptions = {
  scale: int,
  rotation: Vector.t(int),
  camera,
};

type renderData = {
  model: option(modelName),
  models: StringMap.t(model),
  selectedPrograms: StringMap.t(programName),
  renderFunc:
    (option(AbstractTypes.renderArg), AbstractTypes.globalOptions) => unit,
  globalOptions,
};
