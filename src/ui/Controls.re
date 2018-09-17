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
              switch (get(name, data.modelCache)) {
              | Some(model) =>
                ReasonReact.array(
                  model.shaders->keys
                  |> List.fast_sort(compare)
                  |> List.map(key =>
                       <button
                         onClick={_ => shaderSelect(key, name)}
                         key
                         disabled={model.shader === key}
                         className={model.shader === key ? "active" : ""}>
                         {ReasonReact.string(key)}
                       </button>
                     )
                  |> Array.of_list,
                )
              | None =>
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
