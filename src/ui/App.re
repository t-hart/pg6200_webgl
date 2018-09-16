open Types;
[@bs.module "../shaders"]
external availableShaders: modelData => Js.Dict.t(shaderSet) = "";
[@bs.module "../shaders"] external defaultShader: string = "";
[@bs.val] external alert: string => unit = "";
[@bs.module "../index"]
external render:
  (webGlRenderingContext, option(modelData), option(shaderSet)) => unit =
  "";
[@bs.module "../index"] external initGL: webGlRenderingContext => unit = "";
[@bs.module "../index"]
external getGlContext: string => Js.Nullable.t(webGlRenderingContext) = "";

let toOption = Js.Nullable.toOption;

let const = (a, _) => a;

type state =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type shaderKey = string;
type modelKey = string;

type action =
  | InitGl(option(webGlRenderingContext), StringMap.t(modelData))
  | SelectShader(shaderKey, modelKey)
  | SelectModel(modelKey)
  | Render;

let component = ReasonReact.reducerComponent("App");

let render' = (models, f, model: option(model)) =>
  switch (model) {
  | Some(m) => f(get(m.name, models), get(m.shader, m.shaders))
  | None => f(None, None)
  };

let reducer = (action, state) =>
  switch (action, state) {
  | (Render, Ready(data)) =>
    ReasonReact.SideEffects(
      (
        _ =>
          Belt.Option.flatMap(data.model, get(_, data.modelCache))
          |> data.renderFunc
      ),
    )
  | (Render, Uninitialized | Error(_)) => ReasonReact.NoUpdate

  | (InitGl(optionGl, models), _) =>
    switch (optionGl) {
    | Some(gl) =>
      ReasonReact.UpdateWithSideEffects(
        Ready({
          models,
          renderFunc: render'(models, render(gl)),
          model: None,
          modelCache: StringMap.empty,
        }),
        (self => self.send(Render)),
      )
    | None =>
      ReasonReact.Update(
        Error(
          "Unable to initialize GL: Couldn't find the rendering context.",
        ),
      )
    }

  | (SelectModel(name), Ready(data)) =>
    let nextState =
      switch (data.model) {
      | Some(n) when n === name => Ready({...data, model: None})
      | _ =>
        let model = {
          name,
          shaders:
            availableShaders(StringMap.find(name, data.models)) |> toMap,
          shader: defaultShader,
        };
        let modelCache =
          update(
            name,
            Belt.Option.getWithDefault(_, model),
            data.modelCache,
          );
        Ready({...data, model: Some(name), modelCache});
      };
    ReasonReact.UpdateWithSideEffects(
      nextState,
      (self => self.send(Render)),
    );
  | (SelectModel(_), Uninitialized | Error(_)) =>
    let errormsg = "The rendering context is not available, but you tried to select a model. Something's gone wrong somewhere.";
    ReasonReact.UpdateWithSideEffects(
      Error(errormsg),
      (_ => alert(errormsg)),
    );

  | (SelectShader(shader, modelKey), Ready(data)) =>
    ReasonReact.UpdateWithSideEffects(
      Ready({
        ...data,
        modelCache:
          update(
            modelKey,
            {...StringMap.find(modelKey, data.modelCache), shader}->const,
            data.modelCache,
          ),
      }),
      (self => self.send(Render)),
    )
  | (SelectShader(_, _), Uninitialized | Error(_)) => ReasonReact.NoUpdate
  };

let make = (~canvasId, ~models, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer,
  didMount: self =>
    self.send(InitGl(getGlContext(canvasId) |> toOption, models)),
  render: self =>
    <div className="app">
      <div className="page-header">
        <h1> {ReasonReact.string("PG6200 graphics programming")} </h1>
      </div>
      <main>
        <div className="content">
          <canvas id=canvasId className="canvas" width="640" height="480" />
          {
            switch (self.state) {
            | Ready(data) =>
              <Controls
                data
                selectedModel={data.model}
                modelSelect=(name => self.send(SelectModel(name)))
                shaderSelect=(
                  (shaderKey, modelKey) =>
                    self.send(SelectShader(shaderKey, modelKey))
                )
              />
            | _ => ReasonReact.null
            }
          }
        </div>
      </main>
      <footer> <h3> {ReasonReact.string("Thomas Hartmann")} </h3> </footer>
    </div>,
};
