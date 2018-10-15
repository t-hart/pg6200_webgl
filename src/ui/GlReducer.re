open Utils;
include GlHandlerModel;

type shaderKey = string;

type action =
  | SelectShader(modelName, shaderKey)
  | SelectModel(modelName)
  | KeyDown(Webapi.Dom.KeyboardEvent.t)
  | KeyUp(Webapi.Dom.KeyboardEvent.t)
  | SetScale(int)
  | SetRotation(Vector.t(int))
  | SetRafId(option(Webapi.rafId))
  | PrepareRender
  | Render(DrawArgs.abstract, GlobalOptions.t, bool, float);

let getRenderArgs = (models, programs, name) =>
  Model.toRenderArgs(
    StringMap.find(name, models),
    StringMap.find(name, programs),
  );

let handleKeyPress = state =>
  fun
  | Some(keys) =>
    ReasonReact.UpdateWithSideEffects(
      {...state, keys},
      (self => self.send(PrepareRender)),
    )
  | None => ReasonReact.NoUpdate;

let cancelAnimation =
  fun
  | Some(id) => Webapi.cancelAnimationFrame(id)
  | None => ();

let reducer = (action, state: state) =>
  switch (action) {
  | Render(drawArgs, globalOptions, shouldLoop, currentTime) =>
    let delta = currentTime -. state.nextTime;
    let deltaClamped = delta > 0.1 ? 0.03344409800000392 : delta;
    let cam =
      StringMap.fold(
        (_, f, acc) => f(acc, deltaClamped),
        state.keys,
        state.cam,
      );
    let opts = globalOptions->GlobalOptions.toAbstract(cam);
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        nextTime: currentTime,
        previousTime: state.nextTime,
        cam,
        globalOptions,
      },
      (
        self => {
          drawScene(drawArgs, opts, state.nextTime);
          shouldLoop ?
            Webapi.requestCancellableAnimationFrame(x =>
              self.send(
                Render(drawArgs, globalOptions, shouldLoop, x *. 0.001),
              )
            )
            ->Some
            ->SetRafId
            |> self.send :
            self.send(SetRafId(None));
        }
      ),
    );

  | PrepareRender =>
    let (nextState, sideEffects) =
      switch (state.model) {
      | Some(name) =>
        let drawArgs =
          StringMap.add(
            name,
            getRenderArgs(state.models, state.selectedPrograms, name)
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
                  state.globalOptions,
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

  | KeyDown(e) => Input.keyDown(state.keys, e) |> handleKeyPress(state)

  | KeyUp(e) => Input.keyUp(state.keys, e) |> handleKeyPress(state)

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
