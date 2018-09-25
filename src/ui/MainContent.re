open Types;
include MainReducer;

/* index */

[@bs.module "../index"]
external renderBlank: AbstractTypes.webGlRenderingContext => unit = "";

[@bs.module "../index"]
external getGlContext:
  string => Js.Nullable.t(AbstractTypes.webGlRenderingContext) =
  "";

let isSelected = name =>
  fun
  | Some(a) when a === name => true
  | _ => false;

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

let ifSome = content =>
  fun
  | Some(x) => content(x)
  | None => selectModel;

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
  ->ifSome(_, data.model);

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

let rotationSliders = (send, rotation) =>
  List.map2(
    (f, a) =>
      rangeSlider(string_of_int(a), event =>
        send(
          event
          ->Event.value
          ->int_of_string
          ->(v => SetRotation(Vector.update(rotation, f(v)))),
        )
      ),
    [Vector.x, Vector.y, Vector.z],
    Vector.toList(rotation),
  )
  |> Array.of_list;

let globalOptControls = (send, opts) =>
  <>
    <fieldset className="span-all no-pad-h">
      <legend> {ReasonReact.string("Scale")} </legend>
      {
        rangeSlider(opts.scale->string_of_int, event =>
          send(event->Event.value->int_of_string->SetScale)
        )
      }
    </fieldset>
    <fieldset className="span-all no-pad-h">
      <legend> {ReasonReact.string("Rotation (X, Y, Z)")} </legend>
      <div className="controls">
        ...{rotationSliders(send, opts.rotation)}
      </div>
    </fieldset>
  </>;

let handleKey = (send, e) => KeyPress(e)->send;

let fieldsets = (send, data) => [|
  {disabled: false, content: modelButtons(send, data), legend: "Models"},
  {
    disabled: data.model === None,
    content: shaderButtons(send, data),
    legend: "Shaders",
  },
  {
    disabled: false,
    content: globalOptControls(send, data.globalOptions),
    legend: "Transforms",
  },
|];

let component = ReasonReact.reducerComponent("Main content");
let make = (~canvasId, _children) => {
  ...component,
  initialState: () => Uninitialized,
  reducer,
  didMount: self => {
    Event.addKeyboardListener(handleKey(self.send));
    self.send(InitGl(getGlContext(canvasId) |> Utils.toOption));
  },
  willUnmount: self => Event.removeKeyboardListener(handleKey(self.send)),
  render: self =>
    <div className="content">
      <canvas id=canvasId className="canvas" width="640" height="480" />
      {
        switch (self.state) {
        | Ready(data) => <Controls contents={fieldsets(self.send, data)} />
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
