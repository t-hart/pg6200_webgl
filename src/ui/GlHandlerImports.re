[@bs.module "../models"] external defaultProgram: string = "";

[@bs.module "../index"]
external getDrawArgs:
  (AbstractTypes.webGlRenderingContext, AbstractTypes.renderArg) =>
  AbstractTypes.drawArgs =
  "";

[@bs.module "../models"]
external getModels:
  AbstractTypes.webGlRenderingContext => Js.Dict.t(AbstractTypes.model) =
  "default";

[@bs.module "../index"]
external render:
  (
    AbstractTypes.webGlRenderingContext,
    AbstractTypes.renderArg,
    AbstractTypes.globalOptions
  ) =>
  unit =
  "";

[@bs.module "../renderUtils"]
external drawScene:
  (AbstractTypes.drawArgs, float, AbstractTypes.globalOptions) => unit =
  "";

[@bs.module "../index"]
external renderBlank: AbstractTypes.webGlRenderingContext => unit = "";
