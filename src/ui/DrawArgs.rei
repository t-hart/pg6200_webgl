[@bs.deriving abstract]
type abstract =
  | ();

[@bs.module "../drawArgs"]
external create: (WebGl.renderingContext, RenderArgs.abstract) => abstract =
  "create";
