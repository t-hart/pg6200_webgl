open Utils;
[@bs.module "../models"] external defaultProgram: string = "";

type shaderKey = string;
type programName = string;
type modelName = string;

type state = {
  model: option(modelName),
  models: StringMap.t(Model.t),
  selectedPrograms: StringMap.t(programName),
  clear: unit => unit,
  renderFunc: (AbstractTypes.renderArg, AbstractTypes.globalOptions) => unit,
  globalOptions: GlobalOptions.t,
};

type action =
  | SelectShader(modelName, shaderKey)
  | SelectModel(modelName)
  | KeyPress(Webapi.Dom.KeyboardEvent.t)
  | SetScale(int)
  | SetRotation(Vector.t(int))
  | SetCamera(Movement.t)
  | Render;

let getRenderArg = (models, programs, name) =>
  Model.toRenderArgs(
    StringMap.find(name, models),
    StringMap.find(name, programs),
  );

let handleCameraUpdate = (mvmt, camera: Camera.t) => {
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
      switch (state.model) {
      | Some(name) => (
          _ =>
            getRenderArg(state.models, state.selectedPrograms, name)
            |> state.renderFunc(
                 _,
                 state.globalOptions->GlobalOptions.toAbstract,
               )
        )
      | None => (_ => state.clear())
      },
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
            default(defaultProgram),
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
