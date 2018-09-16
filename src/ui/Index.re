open Types;
[@bs.module "../objs"] external models: Js.Dict.t(modelData) = "default";
let canvasId = "reCanvas";
ReactDOMRe.renderToElementWithId(
  <App canvasId models={models |> toMap} />,
  "reason-app",
);
