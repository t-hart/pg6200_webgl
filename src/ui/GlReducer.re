open Utils;
include GlHandlerModel;

type shaderKey = string;

type action =
  | SelectShader(modelName, shaderKey)
  | SelectModel(modelName)
  | KeyPress(Webapi.Dom.KeyboardEvent.t)
  | SetScale(int)
  | SetRotation(Vector.t(int))
  | SetCamera(Movement.t, int => int)
  | SetRafId(option(Webapi.rafId))
  | PrepareRender
  | Render(DrawArgs.abstract, GlobalOptions.abstract, bool, float);

let getRenderArg = (models, programs, name) =>
  Model.toRenderArgs(
    StringMap.find(name, models),
    StringMap.find(name, programs),
  );

let cancelAnimation =
  fun
  | Some(id) => Webapi.cancelAnimationFrame(id)
  | None => ();

let handleCameraUpdate = (mvmt, f, camera: Camera.t) => {
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
  camera.velocity |> f |> Input.move(axis) |> Vector.addSome(vec) |> fill;
};

let reducer = (action, state: state) =>
  switch (action) {
  | Render(drawArgs, opts, shouldLoop, currentTime) =>
    ReasonReact.UpdateWithSideEffects(
      {...state, nextTime: currentTime, previousTime: state.nextTime},
      (
        self => {
          drawScene(drawArgs, opts, state.nextTime);
          shouldLoop ?
            Webapi.requestCancellableAnimationFrame(x =>
              self.send(Render(drawArgs, opts, shouldLoop, x *. 0.001))
            )
            ->Some
            ->SetRafId
            |> self.send :
            self.send(SetRafId(None));
        }
      ),
    )

  | PrepareRender =>
    let (nextState, sideEffects) =
      switch (state.model) {
      | Some(name) =>
        let drawArgs =
          StringMap.add(
            name,
            getRenderArg(state.models, state.selectedPrograms, name)
            |> state.getDrawArgs,
            state.drawArgs,
          );

        (
          {...state, drawArgs},
          (
            send =>
              send(
                Render(
                  name->StringMap.find(drawArgs),
                  state.globalOptions |> GlobalOptions.toAbstract,
                  shouldLoop(state),
                  state.nextTime,
                ),
              )
          ),
        );
      | None => (state, (_ => state.clear()))
      };
    ReasonReact.UpdateWithSideEffects(
      nextState,
      (
        self => {
          cancelAnimation(state.rafId);
          self.send(SetRafId(None));
          sideEffects(self.send);
        }
      ),
    );

  | KeyPress(e) =>
    switch (Input.getMovement(Webapi.Dom.KeyboardEvent.code(e))) {
    | Some((mvmt, f)) =>
      ReasonReact.SideEffects((self => self.send(SetCamera(mvmt, f))))
    | None => ReasonReact.NoUpdate
    }

  | SetCamera(mvmt, f) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        globalOptions: {
          ...state.globalOptions,
          camera: handleCameraUpdate(mvmt, f, state.globalOptions.camera),
        },
      },
      (self => self.send(PrepareRender)),
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
      (self => self.send(PrepareRender)),
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
      (self => self.send(PrepareRender)),
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
      (self => self.send(PrepareRender)),
    )

  | SetRafId(id) => ReasonReact.Update({...state, rafId: id})

  | SelectShader(modelName, programName) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        selectedPrograms:
          StringMap.add(modelName, programName, state.selectedPrograms),
      },
      (self => self.send(PrepareRender)),
    )
  };
