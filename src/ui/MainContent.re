open Types;
open MainReducer;

/* index */

[@bs.module "../index"]
external renderBlank: AbstractTypes.webGlRenderingContext => unit = "";

[@bs.module "../index"]
external getGlContext:
  string => Js.Nullable.t(AbstractTypes.webGlRenderingContext) =
  "";

/* models */

let isSelected = (name, optionString) =>
  switch (optionString) {
  | Some(a) when a === name => true
  | _ => false
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
