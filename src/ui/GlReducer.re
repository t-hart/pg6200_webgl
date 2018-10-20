open Utils;
include GlHandlerModel;

type shaderKey = string;

type action =
  | ClickModel(modelName)
  | KeyDown(Webapi.Dom.KeyboardEvent.t)
  | KeyUp(Webapi.Dom.KeyboardEvent.t)
  | SelectShader(modelName, shaderKey)
  | SetScale(modelName, int)
  | SetRotation(modelName, Vector.t(int))
  | SetRafId(option(Webapi.rafId))
  | PrepareRender
  | Render(array(ModelOptions.abstract), bool, float)
  | SetAspect(float)
  | Reset;

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

let reducer = (action, state) =>
  switch (action) {
  | Render(modelOptions, shouldLoop, currentTime) =>
    let delta = currentTime -. state.nextTime;
    let deltaClamped = delta > 0.1 ? 0.03344409800000392 : delta;
    let cam =
      StringMap.fold(
        (_, f, acc) => f(acc, deltaClamped),
        state.keys,
        state.cam,
      );
    ReasonReact.UpdateWithSideEffects(
      {...state, nextTime: currentTime, previousTime: state.nextTime, cam},
      (
        self => {
          drawScene(
            state.gl,
            modelOptions,
            cam,
            state.aspect,
            state.nextTime,
          );
          shouldLoop ?
            Webapi.requestCancellableAnimationFrame(x =>
              self.send(Render(modelOptions, shouldLoop, x *. 0.001))
            )
            ->Some
            ->SetRafId
            |> self.send :
            self.send(SetRafId(None));
        }
      ),
    );

  | PrepareRender =>
    let models =
      StringMap.filter((_, x) => Model.shouldRender(x), state.models);
    let sideEffects =
      StringMap.is_empty(models) ?
        (_ => state.clear()) :
        {
          let modelOptions =
            models |> StringMap.map(Model.toAbstract) |> StringMap.toArray;
          (
            send =>
              send(Render(modelOptions, shouldLoop(state), state.nextTime))
          );
        };
    ReasonReact.SideEffects(
      (
        self => {
          cancelAnimation(state.rafId);
          self.send(SetRafId(None));
          sideEffects(self.send);
        }
      ),
    );

  | SelectShader(modelName, drawArgs) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        models:
          StringMap.update(
            modelName,
            mapOption(Model.changeDrawArgs(drawArgs)),
            state.models,
          ),
      },
      (self => self.send(PrepareRender)),
    )

  | KeyDown(e) => Input.keyDown(state.keys, e) |> handleKeyPress(state)

  | KeyUp(e) => Input.keyUp(state.keys, e) |> handleKeyPress(state)

  | ClickModel(name) =>
    let models =
      StringMap.update(
        name,
        mapOption(Model.toggleSelectedState),
        state.models,
      );
    ReasonReact.UpdateWithSideEffects(
      {...state, models},
      (self => self.send(PrepareRender)),
    );

  | SetRotation(modelName, rotation) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        models:
          StringMap.update(
            modelName,
            mapOption(Model.setRotation(rotation)),
            state.models,
          ),
      },
      (self => self.send(PrepareRender)),
    )

  | SetScale(modelName, scale) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        models:
          StringMap.update(
            modelName,
            mapOption(Model.setScale(scale)),
            state.models,
          ),
      },
      (self => self.send(PrepareRender)),
    )

  | SetRafId(id) => ReasonReact.Update({...state, rafId: id})

  | SetAspect(aspect) =>
    ReasonReact.UpdateWithSideEffects(
      {...state, aspect},
      (self => self.send(PrepareRender)),
    )

  | Reset =>
    ReasonReact.UpdateWithSideEffects(
      initialState(state.gl),
      (
        self => {
          cancelAnimation(state.rafId);
          self.send(SetRafId(None));
          self.send(PrepareRender);
        }
      ),
    )
  };
