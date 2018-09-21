open Types;
[@bs.module "../models"] external defaultProgram: string = "";
[@bs.val] external alert: string => unit = "";
[@bs.module "../index"]
external render: (webGlRenderingContext, option(renderArg)) => unit = "";
[@bs.module "../index"] external initGL: webGlRenderingContext => unit = "";
[@bs.module "../index"]
external getGlContext: string => Js.Nullable.t(webGlRenderingContext) = "";
[@bs.module "../models"]
external getModels: webGlRenderingContext => Js.Dict.t(model) = "default";

let toOption = Js.Nullable.toOption;

let const = (a, _) => a;

let isSelected = (name, optionString) =>
  switch (optionString) {
  | Some(a) when a === name => true
  | _ => false
  };

let toButtonArray = (xs, isActive, disabled, onClick) =>
  xs
  |> keys
  |> List.fast_sort(compare)
  |> List.map(key =>
       <button
         key
         className={key->isActive ? "active" : ""}
         disabled={disabled(key)}
         onClick={_ => onClick(key)}>
         {ReasonReact.string(key)}
       </button>
     )
  |> Array.of_list
  |> ReasonReact.array;

type state =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type shaderKey = string;
type modelName = string;

type action =
  | InitGl(option(webGlRenderingContext))
  | SelectShader(modelName, shaderKey)
  | SelectModel(modelName)
  | Render;

let component = ReasonReact.reducerComponent("Main content");

let getRenderArg = (models, programs, modelName) =>
  Belt.Option.flatMap(modelName, x =>
    switch (get(x, models), get(x, programs)) {
    | (Some(model), Some(programName)) =>
      Some(modelToRenderArgs(model, programName))
    | _ => None
    }
  );

let reducer = (action, state) =>
  switch (action, state) {
  | (Render, Ready(data)) =>
    ReasonReact.SideEffects(
      (
        _ =>
          getRenderArg(data.models, data.selectedPrograms, data.model)
          |> data.renderFunc
      ),
    )
  | (Render, Uninitialized | Error(_)) => ReasonReact.NoUpdate

  | (InitGl(optionGl), _) =>
    switch (optionGl) {
    | Some(gl) =>
      ReasonReact.UpdateWithSideEffects(
        Ready({
          models: getModels(gl) |> toMap |> StringMap.map(modelToModelRe),
          renderFunc: render(gl),
          model: None,
          selectedPrograms: StringMap.empty,
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
        let selectedPrograms =
          update(
            name,
            Belt.Option.getWithDefault(_, defaultProgram),
            data.selectedPrograms,
          );
        Ready({...data, model: Some(name), selectedPrograms});
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

  | (SelectShader(modelName, programName), Ready(data)) =>
    ReasonReact.UpdateWithSideEffects(
      Ready({
        ...data,
        selectedPrograms:
          StringMap.add(modelName, programName, data.selectedPrograms),
      }),
      (self => self.send(Render)),
    )
  | (SelectShader(_, _), Uninitialized | Error(_)) => ReasonReact.NoUpdate
  };

let modelButtons = (send, data) =>
  toButtonArray(
    data.models,
    x =>
      Belt.Option.map(data.model, m => m === x)
      ->Belt.Option.getWithDefault(false),
    false->const,
    x => SelectModel(x) |> send,
  );

let shaderButtons = (send, data) =>
  switch (data.model) {
  | Some(name) =>
    let selectedProgram = key =>
      key === StringMap.find(name, data.selectedPrograms);
    toButtonArray(
      StringMap.find(name, data.models).programs,
      selectedProgram,
      selectedProgram,
      x =>
      SelectShader(name, x)->send
    );
  | None =>
    <button className="span-all alert" disabled=true>
      {ReasonReact.string("Please select a model first")}
    </button>
  };

let make = (~canvasId, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer,
  didMount: self => self.send(InitGl(getGlContext(canvasId) |> toOption)),
  render: self =>
    <div className="content">
      <canvas id=canvasId className="canvas" width="640" height="480" />
      {
        switch (self.state) {
        | Ready(data) =>
          <Controls
            models={modelButtons(self.send, data)}
            shaders={shaderButtons(self.send, data)}
            disableShaders={data.model === None}
          />
        | Uninitialized
        | Error(_) => ReasonReact.null
        }
      }
    </div>,
};
