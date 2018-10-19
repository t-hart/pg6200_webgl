[@bs.module "../models"] external defaultProgram: string = "";

[@bs.module "../drawArgs"]
external create:
  (WebGl.renderingContext, RenderArgs.abstract) => DrawArgs.abstract =
  "create";

[@bs.module "../models"]
external getModels: WebGl.renderingContext => Js.Dict.t(Model.abstract) =
  "default";

[@bs.module "../renderUtils"]
external drawScene: (DrawArgs.abstract, GlobalOptions.abstract, float) => unit =
  "";

[@bs.module "../renderUtils"]
external setViewport: (WebGl.renderingContext, int, int) => unit = "";

[@bs.module "../renderUtils"]
external drawEmptyScene: WebGl.renderingContext => unit = "";
