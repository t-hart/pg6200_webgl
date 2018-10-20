[@bs.module "../models"]
external getModels: WebGl.renderingContext => Js.Dict.t(Model.abstract) =
  "default";

type aspect = float;
[@bs.module "../renderUtils"]
external drawScene:
  (
    WebGl.renderingContext,
    array(ModelOptions.abstract),
    Camera.t,
    aspect,
    float
  ) =>
  unit =
  "";

[@bs.module "../glUtils"]
external getAspect: WebGl.renderingContext => aspect = "";

[@bs.module "../glUtils"]
external setViewport: (WebGl.renderingContext, int, int) => unit = "";

[@bs.module "../renderUtils"]
external drawEmptyScene: WebGl.renderingContext => unit = "";
