[@bs.module "../index"]
external renderBlank: AbstractTypes.webGlRenderingContext => unit = "";
[@bs.module "../index"]
external getGlContext:
  string => Js.Nullable.t(AbstractTypes.webGlRenderingContext) =
  "";

[@bs.module "../models"]
external getModels:
  AbstractTypes.webGlRenderingContext => Js.Dict.t(AbstractTypes.model) =
  "default";
[@bs.module "../index"]
external render:
  (
    AbstractTypes.webGlRenderingContext,
    option(AbstractTypes.renderArg),
    AbstractTypes.globalOptions
  ) =>
  unit =
  "";

let modelFromAbstract = abstract: Types.model =>
  AbstractTypes.{
    objData: abstract->objDataGet,
    programs: abstract->programsGet |> StringMap.fromJsDict,
    texture: abstract->textureGet,
  };

type state =
  | Uninitialized
  | Error(string)
  | Ready(Types.renderData);

type action =
  | InitGl(option(AbstractTypes.webGlRenderingContext));

let component = ReasonReact.reducerComponent("Main content");
let make = (~canvasId, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer: (action, state) =>
    switch (action, state) {
    | (InitGl(optionGl), _) =>
      switch (optionGl) {
      | Some(gl) =>
        ReasonReact.Update(
          Ready({
            models:
              getModels(gl)
              |> StringMap.fromJsDict
              |> StringMap.map(modelFromAbstract),
            renderFunc: render(gl),
            model: None,
            selectedPrograms: StringMap.empty,
            globalOptions: {
              scale: 100,
              rotation: Vector.fill(100),
              camera: {
                position: Vector.zero,
                rotation: Vector.zero,
                velocity: 1,
              },
            },
          }),
        )
      | None =>
        ReasonReact.Update(
          Error(
            "Unable to initialize GL: Couldn't find the rendering context.",
          ),
        )
      }
    },
  didMount: self =>
    self.send(InitGl(getGlContext(canvasId) |> Utils.toOption)),
  render: self =>
    <div className="content">
      <canvas id=canvasId className="canvas" width="640" height="480" />
      {
        switch (self.state) {
        | Ready(data) => <GlHandler data />
        | Uninitialized => ReasonReact.null
        | Error(e) =>
          <div className="alert">
            <h1 className="alert text-center">
              {ReasonReact.string("An error occurred:")}
            </h1>
            <p> {ReasonReact.string(e)} </p>
          </div>
        }
      }
    </div>,
};
