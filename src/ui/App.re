[@bs.deriving abstract]
type modelData = {
  v: array(float),
  vt: array(float),
  vn: array(float),
  f: array(float),
  colors: array(float),
  min: array(float),
  max: array(float),
};
[@bs.deriving abstract]
type webGlRenderingContext = {
  canvas: string,
  drawingBufferHeight: int,
  drawingBufferWidth: int,
};
[@bs.val] external alert : string => unit = "";
[@bs.module "../index"]
external render : (webGlRenderingContext, modelData) => unit = "";
[@bs.module "../index"]
external getGlContext : string => Js.Nullable.t(webGlRenderingContext) = "";
[@bs.module "../objs"] external models : Js.Dict.t(modelData) = "default";

let canvasId = "reCanvas";
let toOption = Js.Nullable.toOption;

type model = {
  name: string,
  data: modelData,
};

type renderData = {
  models: Js.Dict.t(modelData),
  model: option(model),
  renderFunc: modelData => unit,
};

type glState =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type _state = {glState};

let isSelected = (key, optionModel) =>
  switch (optionModel) {
  | Some(a) when a.name === key => true
  | _ => false
  };

type action =
  | SetModel(model)
  | InitGl(option(webGlRenderingContext));

let initialState = () => {glState: Uninitialized};
let component = ReasonReact.reducerComponent("App");

let make = _children => {
  ...component,
  initialState,
  reducer: (action, state) =>
    switch (action) {
    | InitGl(optionGl) =>
      switch (optionGl) {
      | Some(gl) =>
        ReasonReact.Update({
          ...state,
          glState: Ready({models, renderFunc: render(gl), model: None}),
        })
      | None =>
        ReasonReact.Update(
          Error(
            "Unable to initialize GL: Couldn't find the rendering context.",
          ),
        )
      }
    | SetModel(model) =>
      switch (state) {
      | Ready(data) =>
        ReasonReact.UpdateWithSideEffects(
          Ready({...data, model}),
          (_ => data.renderFunc(model)),
        )
      | _ =>
        ReasonReact.SideEffects(
          (
            _ =>
              alert(
                "The rendering context is not available. Something's gone wrong somewhere.",
              )
          ),
        )
      }
    },
  didMount: self => self.send(InitGl(getGlContext(canvasId) |> toOption)),
  render: self =>
    <div className="app">
      <div className="page-header">
        <h1> (ReasonReact.string("PG6200 graphics programming")) </h1>
      </div>
      <main>
        <div className="content">
          <canvas id=canvasId className="canvas" width="640" height="480" />
          <div className="buttons">
            (
              ReasonReact.array(
                models
                |> Js.Dict.entries
                |> Array.map(((key, data)) => {
                     let selected = isSelected(key, self.state.model);

                     <button
                       key
                       className=(selected ? "active" : "")
                       disabled=selected
                       onClick=(
                         _event => self.send(SetModel({name: key, data}))
                       )>
                       (ReasonReact.string(key))
                     </button>;
                   }),
              )
            )
          </div>
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};
