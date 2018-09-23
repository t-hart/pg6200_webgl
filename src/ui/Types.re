open Functions;

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

let modelFromAbstract = abstract =>
  AbstractTypes.{
    objData: abstract->objDataGet,
    programs: abstract->programsGet |> StringMap.fromJsDict,
    texture: abstract->textureGet,
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
  position: Vector.t,
  rotation: Vector.t,
};

type globalOptions = {
  scale: int,
  rotation: Vector.t,
  camera,
};

let globalOptsToAbstract = opts =>
  AbstractTypes.globalOptions(
    ~scale=opts.scale->toDecimal,
    ~rotation=opts.rotation->Vector.asArray,
  );

type renderData = {
  model: option(modelName),
  models: StringMap.t(model),
  selectedPrograms: StringMap.t(programName),
  renderFunc:
    (option(AbstractTypes.renderArg), AbstractTypes.globalOptions) => unit,
  globalOptions,
};
