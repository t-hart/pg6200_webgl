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

[@bs.module "../objs"] external models : Js.Dict.t(modelData) = "default";
[@bs.val] external alert : string => unit = "";
[@bs.module "../index"]
external render : (webGlRenderingContext, modelData) => unit = "";
[@bs.module "../index"] external initGL : webGlRenderingContext => unit = "";
[@bs.module "../index"]
external getGlContext : string => Js.Nullable.t(webGlRenderingContext) = "";

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

let isSelected = (name, optionModel) =>
  switch (optionModel) {
  | Some(a) when a.name === name => true
  | _ => false
  };

type state =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type action =
  | SetModel(model)
  | InitGl(option(webGlRenderingContext));

let component = ReasonReact.reducerComponent("App");

let reducer = (action, state) =>
  switch (action) {
  | InitGl(optionGl) =>
    switch (optionGl) {
    | Some(gl) =>
      ReasonReact.UpdateWithSideEffects(
        Ready({models, renderFunc: render(gl), model: None}),
        (_ => initGL(gl)),
      )
    | None =>
      ReasonReact.Update(
        Error(
          "Unable to initialize GL: Couldn't find the rendering context.",
        ),
      )
    }
  | SetModel((model: model)) =>
    switch (state) {
    | Ready(data) =>
      ReasonReact.UpdateWithSideEffects(
        Ready({...data, model: Some(model)}),
        (_ => data.renderFunc(model.data)),
      )
    | _ =>
      let errormsg = "The rendering context is not available, but you tried to select a model. Something's gone wrong somewhere.";
      ReasonReact.UpdateWithSideEffects(
        Error(errormsg),
        (_ => alert(errormsg)),
      );
    }
  };

let make = (~canvasId, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer,
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
              switch (self.state) {
              | Ready(data) =>
                ReasonReact.array(
                  data.models
                  |> Js.Dict.entries
                  |> Array.map(((name, modelData)) => {
                       let selected = isSelected(name, data.model);
                       <button
                         key=name
                         className=(selected ? "active" : "")
                         disabled=selected
                         onClick=(
                           _ => self.send(SetModel({name, data: modelData}))
                         )>
                         (ReasonReact.string(name))
                       </button>;
                     }),
                )
              | _ => ReasonReact.null
              }
            )
          </div>
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};
