open Types;
[@bs.module "../objs"] external models : Js.Dict.t(modelData) = "default";
[@bs.module "../shaders"]
external availableShaders : modelData => Js.Dict.t(shaderSet) = "";
[@bs.module "../shaders"] external defaultShader : string = "";
[@bs.val] external alert : string => unit = "";
[@bs.module "../index"]
external render : (webGlRenderingContext, option(modelData)) => unit = "";
[@bs.module "../index"] external initGL : webGlRenderingContext => unit = "";
[@bs.module "../index"]
external getGlContext : string => Js.Nullable.t(webGlRenderingContext) = "";

let toOption = Js.Nullable.toOption;

type state =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type action =
  | InitGl(option(webGlRenderingContext))
  | SelectShader(string)
  | SelectModel(string, modelData)
  | DeselectModel;

let component = ReasonReact.reducerComponent("App");

let reducer = (action, state) =>
  switch (action) {
  | InitGl(optionGl) =>
    switch (optionGl) {
    | Some(gl) =>
      ReasonReact.UpdateWithSideEffects(
        Ready({
          models: models |> toMap,
          renderFunc: render(gl),
          model: None,
          modelCache: StringMap.empty,
        }),
        (_ => initGL(gl)),
      )
    | None =>
      ReasonReact.Update(
        Error(
          "Unable to initialize GL: Couldn't find the rendering context.",
        ),
      )
    }
  | SelectModel(name, modelData) =>
    switch (state) {
    | Ready(data) =>
      let (nextState, model) =
        switch (data.model) {
        | Some(n) when n === name => (Ready({...data, model: None}), None)
        | _ =>
          let model = {
            name,
            data: modelData,
            shaders: availableShaders(modelData) |> toMap,
            currentShader: defaultShader,
          };
          let modelCache =
            update(name, Belt.Option.getWithDefault(_, model), data.modelCache);
          (
            Ready({...data, model: Some(name), modelCache}),
            Some(modelData),
          );
        };
      ReasonReact.UpdateWithSideEffects(
        nextState,
        (_ => data.renderFunc(model)),
      );
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
          (
            switch (self.state) {
            | Ready(data) =>
              <Controls
                data
                selectedModel=data.model
                modelSelect=(
                  (name, modelData) =>
                    self.send(SelectModel(name, modelData))
                )
                shaderSelect=(name => self.send(SelectShader(name)))
              />
            | _ => ReasonReact.null
            }
          )
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};
