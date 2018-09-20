open Types;

let isSelected = (name, optionString) =>
  switch (optionString) {
  | Some(a) when a === name => true
  | _ => false
  };

let component = ReasonReact.statelessComponent("Controls");

let make = (~data, ~modelSelect, ~shaderSelect, _children) => {
  ...component,
  render: _self =>
    <div className="button-grid">
      <fieldset>
        <legend> {ReasonReact.string("Models")} </legend>
        <div className="buttons">
          {
            ReasonReact.array(
              data.models
              |> keys
              |> List.fast_sort(compare)
              |> List.map(name =>
                   <button
                     key=name
                     className={isSelected(name, data.model) ? "active" : ""}
                     onClick={_ => modelSelect(name)}>
                     {ReasonReact.string(name)}
                   </button>
                 )
              |> Array.of_list,
            )
          }
        </div>
      </fieldset>
      <fieldset disabled={data.model === None}>
        <legend> {ReasonReact.string("Shaders")} </legend>
        <div className="buttons">
          {
            switch (data.model) {
            | Some(name) =>
              switch (
                get(name, data.models),
                get(name, data.selectedPrograms),
              ) {
              | (Some(model), Some(programName)) =>
                ReasonReact.array(
                  model->programsGet->Js.Dict.keys
                  /* model.programs->keys */
                  |> (
                    x =>
                      {
                        Array.fast_sort(compare, x);
                        x;
                      }
                      |> Array.map(key =>
                           <button
                             onClick={_ => shaderSelect(key, name)}
                             key
                             disabled={programName === key}
                             className={programName === key ? "active" : ""}>
                             {ReasonReact.string(key)}
                           </button>
                         )
                  ),
                )
              | (_, _) =>
                <button className="span-all alert" disabled=true>
                  {
                    ReasonReact.string(
                      "Unable to find data for this model in the cache. Something's gone wrong somewhere.",
                    )
                  }
                </button>
              }
            | None =>
              <button className="span-all alert" disabled=true>
                {ReasonReact.string("Please select a model first")}
              </button>
            }
          }
        </div>
      </fieldset>
    </div>,
};
