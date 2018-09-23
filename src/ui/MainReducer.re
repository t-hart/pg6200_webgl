open Types;

[@bs.val] external alert: string => unit = "";

[@bs.module "../models"] external defaultProgram: string = "";

[@bs.module "../models"]
external getModels:
  AbstractTypes.webGlRenderingContext => Js.Dict.t(AbstractTypes.model) =
  "default";

[@bs.module "../index"]
external render:
  (
    AbstractTypes.webGlRenderingContext,
    option(AbstractTypes.renderArg),
    AbstractTypes.globalOptions
  ) =>
  unit =
  "";

type state =
  | Uninitialized
  | Error(string)
  | Ready(renderData);

type shaderKey = string;
type modelName = string;

let getRenderArg = (models, programs, modelName) =>
  Belt.Option.flatMap(modelName, x =>
    switch (StringMap.get(x, models), StringMap.get(x, programs)) {
    | (Some(model), Some(programName)) =>
      Some(Functions.modelToRenderArgs(model, programName))
    | _ => None
    }
  );

type action =
  | InitGl(option(AbstractTypes.webGlRenderingContext))
  | SelectShader(modelName, shaderKey)
  | SelectModel(modelName)
  | SetScale(int)
  | SetRotation(Vector.t(int))
  | Render;

let reducer = (action, state) =>
  switch (action, state) {
  | (Render, Ready(data)) =>
    ReasonReact.SideEffects(
      (
        _ =>
          getRenderArg(data.models, data.selectedPrograms, data.model)
          |> data.renderFunc(
               _,
               data.globalOptions->Functions.globalOptsToAbstract,
             )
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
            |> StringMap.map(Functions.modelFromAbstract),
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
