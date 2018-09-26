open GlReducer;

[@bs.module "../index"]
external renderBlank: AbstractTypes.webGlRenderingContext => unit = "";

[@bs.module "../index"]
external render:
  (
    AbstractTypes.webGlRenderingContext,
    AbstractTypes.renderArg,
    AbstractTypes.globalOptions
  ) =>
  unit =
  "";

[@bs.module "../models"]
external getModels:
  AbstractTypes.webGlRenderingContext => Js.Dict.t(AbstractTypes.model) =
  "default";

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

let modelButtons = (send, data: state) =>
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

let shaderButtons = (send, data: state) =>
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

let globalOptControls = (send, opts: GlobalOptions.t) =>
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

let fieldsets = (send, data): array(Fieldset.t) => [|
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

let component = ReasonReact.reducerComponent("GL Handler");
let make = (~glRenderingContext, _children) => {
  ...component,
  initialState: () => {
    models:
      getModels(glRenderingContext)
      |> StringMap.fromJsDict
      |> StringMap.map(Model.fromAbstract),
    renderFunc: render(glRenderingContext),
    clear: () => renderBlank(glRenderingContext),
    model: None,
    selectedPrograms: StringMap.empty,
    globalOptions: {
      scale: 100,
      rotation: Vector.fill(100),
      camera: {
        position: Vector.zero,
        rotation: Vector.zero,
        velocity: 1,
      },
    },
  },
  reducer,
  didMount: self => {
    Event.addKeyboardListener(handleKey(self.send));
    self.send(Render);
  },
  willUnmount: self => Event.removeKeyboardListener(handleKey(self.send)),
  render: self =>
    <>
      <div className="grid-2-cols full-width">
        <fieldset>
          <legend> {ReasonReact.string("Position")} </legend>
          {
            ReasonReact.string(
              Vector.toString(self.state.globalOptions.camera.position),
            )
          }
        </fieldset>
        <fieldset>
          <legend> {ReasonReact.string("Rotation")} </legend>
          {
            ReasonReact.string(
              Vector.toString(self.state.globalOptions.camera.rotation),
            )
          }
        </fieldset>
      </div>
      <Controls contents={fieldsets(self.send, self.state)} />
    </>,
};
