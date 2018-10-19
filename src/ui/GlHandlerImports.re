[@bs.module "../models"] external defaultProgram: string = "";

[@bs.module "../models"]
external getModels: WebGl.renderingContext => Js.Dict.t(Model.abstract) =
  "default";

[@bs.module "../renderUtils"]
external drawScene: (ModelOptions.abstract, Camera.t, float) => unit = "";

[@bs.module "../glUtils"]
external setViewport: (WebGl.renderingContext, int, int) => unit = "";

[@bs.module "../renderUtils"]
external drawEmptyScene: WebGl.renderingContext => unit = "";
