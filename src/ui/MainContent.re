[@bs.module "../index"]
external getGlContext: string => Js.Nullable.t(WebGl.renderingContext) = "";

type state =
  | Uninitialized
  | Error(string)
  | Ready(WebGl.renderingContext);

type action =
  | InitGl(option(WebGl.renderingContext));

let component = ReasonReact.reducerComponent("Main content");
let make = (~canvasId, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer: (action, state) =>
    switch (action, state) {
    | (InitGl(optionGl), _) =>
      switch (optionGl) {
      | Some(gl) => ReasonReact.Update(Ready(gl))
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
        | Ready(glRenderingContext) => <GlHandler glRenderingContext />
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
