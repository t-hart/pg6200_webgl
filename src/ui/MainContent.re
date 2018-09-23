open Types;
open Functions;
[@bs.val] external alert: string => unit = "";

/* index */

[@bs.module "../index"]
external render:
  (
    AbstractTypes.webGlRenderingContext,
    option(AbstractTypes.renderArg),
    AbstractTypes.globalOptions
  ) =>
  unit =
  "";

[@bs.module "../index"]
external renderBlank: AbstractTypes.webGlRenderingContext => unit = "";

[@bs.module "../index"]
external getGlContext:
  string => Js.Nullable.t(AbstractTypes.webGlRenderingContext) =
  "";

/* models */

[@bs.module "../models"] external defaultProgram: string = "";

[@bs.module "../models"]
external getModels:
  AbstractTypes.webGlRenderingContext => Js.Dict.t(AbstractTypes.model) =
  "default";

let isSelected = (name, optionString) =>
  switch (optionString) {
  | Some(a) when a === name => true
  | _ => false
  };

type state =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type shaderKey = string;
type modelName = string;

type action =
  | InitGl(option(AbstractTypes.webGlRenderingContext))
  | SelectShader(modelName, shaderKey)
  | SelectModel(modelName)
  | SetScale(int)
  | SetRotation(Vector.t(int))
  | Render;

let getRenderArg = (models, programs, modelName) =>
  Belt.Option.flatMap(modelName, x =>
    switch (StringMap.get(x, models), StringMap.get(x, programs)) {
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
          |> data.renderFunc(_, data.globalOptions->globalOptsToAbstract)
      ),
    )

  | (InitGl(optionGl), _) =>
    switch (optionGl) {
    | Some(gl) =>
      ReasonReact.UpdateWithSideEffects(
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
            },
          },
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
          StringMap.update(
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

  | (SetRotation(rotation), Ready(data)) =>
    ReasonReact.UpdateWithSideEffects(
      Ready({
        ...data,
        globalOptions: {
          ...data.globalOptions,
          rotation,
        },
      }),
      (self => self.send(Render)),
    )

  | (SetScale(v), Ready(data)) =>
    ReasonReact.UpdateWithSideEffects(
      Ready({
        ...data,
        globalOptions: {
          ...data.globalOptions,
          scale: v,
        },
      }),
      (self => self.send(Render)),
    )

  | (SelectShader(modelName, programName), Ready(data)) =>
    ReasonReact.UpdateWithSideEffects(
      Ready({
        ...data,
        selectedPrograms:
          StringMap.add(modelName, programName, data.selectedPrograms),
      }),
      (self => self.send(Render)),
    )

  | (SelectShader(_, _), Uninitialized | Error(_))
  | (SetScale(_), Uninitialized | Error(_))
  | (SetRotation(_), Uninitialized | Error(_))
  | (Render, Uninitialized | Error(_)) => ReasonReact.NoUpdate
  };

let elementArray = (toElement, xs) =>
  xs
  ->StringMap.keys
  ->List.fast_sort(compare, _)
  ->List.map(toElement, _)
  ->Array.of_list
  ->ReasonReact.array;

let modelButtons = (send, data) =>
  elementArray(
    key =>
      <button
        key
        className={isSelected(key, data.model) ? "active" : ""}
        onClick={_ => key->SelectModel->send}>
        {ReasonReact.string(key)}
      </button>,
    data.models,
  );

let selectModel =
  <div className="span-all alert button-style" disabled=true>
    {ReasonReact.string("Please select a model first")}
  </div>;

let ifSome = (opt, content) =>
  switch (opt) {
  | Some(x) => content(x)
  | None => selectModel
  };

let shaderButtons = (send, data) =>
  (
    name => {
      let selectedProgram = key =>
        key === StringMap.find(name, data.selectedPrograms);
      elementArray(
        key =>
          <button
            key
            className={key->selectedProgram ? "active" : ""}
            disabled=key->selectedProgram
            onClick={_ => SelectShader(name, key)->send}>
            {ReasonReact.string(key)}
          </button>,
        StringMap.find(name, data.models).programs,
      );
    }
  )
  |> ifSome(data.model);

let rangeSlider = (value, onChange) =>
  <input
    className="button-style"
    type_="range"
    min=0
    max="200"
    value
    step=1.0
    onChange
  />;

let scaleRotation = (send, data) =>
  <>
    <fieldset className="span-all no-pad-h">
      <legend> {ReasonReact.string("Scale")} </legend>
      {
        rangeSlider(data.globalOptions.scale->string_of_int, event =>
          send(event->Event.value->int_of_string->SetScale)
        )
      }
    </fieldset>
    <fieldset className="span-all no-pad-h">
      <legend> {ReasonReact.string("Rotation (X, Y, Z)")} </legend>
      <div className="controls">
        ...{
             List.map2(
               (f, a) =>
                 rangeSlider(string_of_int(a), event =>
                   send(
                     event
                     ->Event.value
                     ->int_of_string
                     ->(
                         v =>
                           SetRotation(
                             Vector.update(
                               data.globalOptions.rotation,
                               f(v),
                             ),
                           )
                       ),
                   )
                 ),
               [Vector.x, Vector.y, Vector.z],
               Vector.toList(data.globalOptions.rotation),
             )
             |> Array.of_list
           }
      </div>
    </fieldset>
  </>;

let handleKey = e => Js.log2("Key pressed", e);

let fieldsets = (send, data) => [|
  {disabled: false, content: modelButtons(send, data), legend: "Models"},
  {
    disabled: data.model === None,
    content: shaderButtons(send, data),
    legend: "Shaders",
  },
  {
    disabled: false,
    content: scaleRotation(send, data),
    legend: "Transforms",
  },
|];

let component = ReasonReact.reducerComponent("Main content");
let make = (~canvasId, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer,
  didMount: self => {
    Event.addKeyboardListener(handleKey);
    self.send(InitGl(getGlContext(canvasId) |> Utils.toOption));
  },
  willUnmount: _ => Event.removeKeyboardListener(handleKey),
  render: self =>
    <div className="content">
      <canvas id=canvasId className="canvas" width="640" height="480" />
      {
        switch (self.state) {
        | Ready(data) => <Controls contents={fieldsets(self.send, data)} />
        | Uninitialized
        | Error(_) => ReasonReact.null
        }
      }
    </div>,
};
