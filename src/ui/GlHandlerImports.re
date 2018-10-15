[@bs.module "../models"] external defaultProgram: string = "";

[@bs.module "../index"]
external getDrawArgs:
  (WebGl.renderingContext, RenderArgs.abstract) => DrawArgs.abstract =
  "";

[@bs.module "../models"]
external getModels: WebGl.renderingContext => Js.Dict.t(Model.abstract) =
  "default";

[@bs.module "../renderUtils"]
external drawScene: (DrawArgs.abstract, GlobalOptions.abstract, float) => unit =
  "";

[@bs.module "../renderUtils"]
external setViewport: (WebGl.renderingContext, int, int) => unit = "";

[@bs.module "../index"]
external renderBlank: WebGl.renderingContext => unit = "";
