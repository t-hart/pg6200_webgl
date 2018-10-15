[@bs.val] external document: Webapi.Dom.Element.t = "";
[@bs.module "../renderUtils"]
external setViewport: (WebGl.renderingContext, int, int) => unit = "";
[@bs.module "../index"]
external getGlContext: string => Js.Nullable.t(WebGl.renderingContext) = "";

type canvasDimensions = {
  width: int,
  height: int,
};

type glState =
  | Uninitialized
  | Error(string)
  | Ready(WebGl.renderingContext, Webapi.Dom.Element.t);

type state = {
  canvasDimensions,
  glState,
};

type action =
  | InitGl(option(WebGl.renderingContext))
  | SetCanvasDimensions;

let dimensions = element => (
  Webapi.Dom.Element.clientWidth(element),
  Webapi.Dom.Element.clientHeight(element),
);

let component = ReasonReact.reducerComponent("Main content");
let make = (~canvasId, _children) => {
  ...component,
  initialState: () => {
    canvasDimensions: {
      width: 0,
      height: 0,
    },
    glState: Uninitialized,
  },
  reducer: (action, state) =>
    switch (action, state) {
    | (InitGl(optionGl), _) =>
      switch (
        optionGl,
        Webapi.Dom.Element.querySelector("#" ++ canvasId, document),
      ) {
      | (Some(gl), Some(canvas)) =>
        ReasonReact.UpdateWithSideEffects(
          {...state, glState: Ready(gl, canvas)},
          (self => self.send(SetCanvasDimensions)),
        )
      | _ =>
        ReasonReact.Update({
          ...state,
          glState:
            Error(
              "Unable to initialize GL: Couldn't find the rendering context.",
            ),
        })
      }
    | (SetCanvasDimensions, state) =>
      switch (state.glState) {
      | Ready(gl, canvas) =>
        let (width, height) = dimensions(canvas);
        ReasonReact.UpdateWithSideEffects(
          {
            ...state,
            canvasDimensions: {
              width,
              height,
            },
          },
          (_ => setViewport(gl, width, height)),
        );
      | Error(_)
      | Uninitialized => ReasonReact.NoUpdate
      }
    },
  didMount: self => {
    Event.addResizeListener(_ => self.send(SetCanvasDimensions));
    self.send(InitGl(getGlContext(canvasId) |> Utils.toOption));
  },
  willUnmount: self =>
    Event.removeResizeListener(_ => self.send(SetCanvasDimensions)),
  render: self =>
    <div className="content">
      <canvas
        id=canvasId
        className="canvas"
        width={self.state.canvasDimensions.width |> string_of_int}
        height={self.state.canvasDimensions.height |> string_of_int}
      />
      {
        switch (self.state.glState) {
        | Ready(glRenderingContext, _) => <GlHandler glRenderingContext />
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
