open Utils;
include GlHandlerModel;

type shaderKey = string;

type action =
  | ClickModel(modelName)
  | KeyDown(Webapi.Dom.KeyboardEvent.t)
  | KeyUp(Webapi.Dom.KeyboardEvent.t)
  | SelectShader(modelName, shaderKey)
  | SetScale(modelName, int)
  | SetOrientation(modelName, Vector.t(int))
  | SetPosition(modelName, Vector.t(int))
  | SetRafId(option(Webapi.rafId))
  | PrepareRender
  | Render(array(Model.abstract), array(int), bool, float)
  | SetAspect(float)
  | SetLightDirection(Vector.t(int))
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
  | Render(models, light, shouldLoop, currentTime) =>
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
            state.architecture,
            models,
            cam,
            state.aspect,
            light,
            state.nextTime,
          );
          shouldLoop ?
            Webapi.requestCancellableAnimationFrame(x =>
              self.send(Render(models, light, shouldLoop, x *. 0.001))
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
    let sideEffects = {
      let models =
        models |> StringMap.map(Model.toAbstract) |> StringMap.toArray;
      (
        send =>
          send(
            Render(
              models,
              Vector.toArray(state.lightDirection),
              shouldLoop(state),
              state.nextTime,
            ),
          )
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

  | SetPosition(modelName, position) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        models:
          StringMap.update(
            modelName,
            mapOption(Model.setPosition(position)),
            state.models,
          ),
      },
      (self => self.send(PrepareRender)),
    )

  | SetLightDirection(lightDirection) =>
    ReasonReact.UpdateWithSideEffects(
      {...state, lightDirection},
      (self => self.send(PrepareRender)),
    )

  | SetOrientation(modelName, orientation) =>
    ReasonReact.UpdateWithSideEffects(
      {
        ...state,
        models:
          StringMap.update(
            modelName,
            mapOption(Model.setOrientation(orientation)),
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
      reset(state),
      (
        self => {
          cancelAnimation(state.rafId);
          self.send(SetRafId(None));
          self.send(PrepareRender);
        }
      ),
    )
  };
