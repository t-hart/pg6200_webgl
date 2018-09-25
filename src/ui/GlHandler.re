[@bs.module "../models"] external defaultProgram: string = "";

type shaderKey = string;

type state = Types.renderData;

type action =
  | SelectShader(Types.modelName, shaderKey)
  | SelectModel(Types.modelName)
  | KeyPress(Webapi.Dom.KeyboardEvent.t)
  | SetScale(int)
  | SetRotation(Vector.t(int))
  | SetCamera(Movement.t)
  | Render;

let modelToRenderArgs = (model: Types.model, programName) =>
  AbstractTypes.renderArg(
    ~objData=model.objData,
    ~program=StringMap.find(programName, model.programs),
    ~texture=model.texture,
  );

let globalOptsToAbstract = (opts: Types.globalOptions) =>
  AbstractTypes.globalOptions(
    ~scale=opts.scale->Utils.toDecimal,
    ~rotation=opts.rotation->Vector.asArray,
  );

let getRenderArg = (models, programs, modelName) =>
  Belt.Option.flatMap(modelName, x =>
    switch (StringMap.get(x, models), StringMap.get(x, programs)) {
    | (Some(model), Some(programName)) =>
      Some(modelToRenderArgs(model, programName))
    | _ => None
    }
  );

let handleCameraUpdate = (mvmt, camera: Types.camera) => {
  open Movement;
  let (vec, axis, fill) =
    switch (mvmt) {
    | Translation(axis) => (
        camera.position,
        axis,
        (position => {...camera, position}),
      )
    | Rotation(axis) => (
        camera.rotation,
        axis,
        (rotation => {...camera, rotation}),
      )
    };
  camera.velocity |> Input.move(axis) |> Vector.addSome(vec) |> fill;
};

let reducer = (action, state: state) =>
  switch (action) {
  | Render =>
    ReasonReact.SideEffects(
      (
        _ =>
          getRenderArg(state.models, state.selectedPrograms, state.model)
          |> state.renderFunc(_, state.globalOptions->globalOptsToAbstract)
      ),
    )

  | KeyPress(e) =>
    switch (Input.getMovement(Webapi.Dom.KeyboardEvent.code(e))) {
    | Some(mvmt) =>
      ReasonReact.SideEffects((self => self.send(SetCamera(mvmt))))
    | None => ReasonReact.NoUpdate
    }

  | SetCamera(mvmt) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        globalOptions: {
          ...state.globalOptions,
          camera: handleCameraUpdate(mvmt, state.globalOptions.camera),
        },
      },
      (self => self.send(Render)),
    )

  | SelectModel(name) =>
    let nextState =
      switch (state.model) {
      | Some(n) when n === name => {...state, model: None}
      | _ =>
        let selectedPrograms =
          StringMap.update(
            name,
            Belt.Option.getWithDefault(_, defaultProgram),
            state.selectedPrograms,
          );
        {...state, model: Some(name), selectedPrograms};
      };
    ReasonReact.UpdateWithSideEffects(
      nextState,
      (self => self.send(Render)),
    );

  | SetRotation(rotation) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        globalOptions: {
          ...state.globalOptions,
          rotation,
        },
      },
      (self => self.send(Render)),
    )

  | SetScale(v) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        globalOptions: {
          ...state.globalOptions,
          scale: v,
        },
      },
      (self => self.send(Render)),
    )

  | SelectShader(modelName, programName) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        selectedPrograms:
          StringMap.add(modelName, programName, state.selectedPrograms),
      },
      (self => self.send(Render)),
    )
  };

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

let globalOptControls = (send, opts: Types.globalOptions) =>
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

let fieldsets = (send, data): array(Types.fieldset) => [|
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
let make = (~data, _children) => {
  ...component,
  initialState: () => data,
  reducer,
  didMount: self => Event.addKeyboardListener(handleKey(self.send)),
  willUnmount: self => Event.removeKeyboardListener(handleKey(self.send)),
  render: self =>
    <> <Controls contents={fieldsets(self.send, self.state)} /> </>,
};
