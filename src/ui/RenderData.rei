type programName = string;
type modelName = string;

type t = {
  model: option(modelName),
  models: StringMap.t(Model.t),
  selectedPrograms: StringMap.t(programName),
  renderFunc:
    (option(AbstractTypes.renderArg), AbstractTypes.globalOptions) => unit,
  globalOptions: GlobalOptions.t,
};
