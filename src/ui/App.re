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

type state = {
  model: option(model),
  models: Js.Dict.t(modelData),
  renderFunc: option(modelData => unit),
};

let isSelected = (key, optionModel) =>
  switch (optionModel) {
  | Some(a) when a.name === key => true
  | _ => false
  };

type action =
  | SetModel(model)
  | SetRenderFunc(modelData => unit);

let initialState = () => {model: None, models, renderFunc: None};
let component = ReasonReact.reducerComponent("App");

let make = _children => {
  ...component,
  initialState,
  reducer: (action, state) =>
    switch (action) {
    | SetRenderFunc(renderFunc) =>
      ReasonReact.Update({...state, renderFunc: Some(renderFunc)})
    | SetModel(model) =>
      ReasonReact.UpdateWithSideEffects(
        {...state, model: Some(model)},
        (
          self =>
            switch (self.state.renderFunc, self.state.model) {
            | (Some(f), Some(m)) =>
              Js.log(
                "We have rendering function, and we have the model:" ++ m.name,
              );
              f(m.data);
            | (None, _) =>
              alert("We don't have a renderFunc. Something's gone wrong.")
            | (_, None) =>
              alert("We don't have a model. How did this happen?")
            }
        ),
      )
    },
  didMount: self =>
    switch (getGlContext(canvasId) |> toOption) {
    | Some(gl) => self.send(SetRenderFunc(render(gl)))
    | None =>
      alert("Unable to initialize GL: Couldn't find the rendering context.")
    },
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
