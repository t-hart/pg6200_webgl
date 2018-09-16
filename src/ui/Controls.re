open Types;

let isSelected = (name, optionString) =>
  switch (optionString) {
  | Some(a) when a === name => true
  | _ => false
  };

let component = ReasonReact.statelessComponent("Controls");

let make = (~data, ~selectedModel, ~modelSelect, ~shaderSelect, _children) => {
  ...component,
  render: self =>
    <div className="button-grid">
      <fieldset>
        <legend> {ReasonReact.string("Models")} </legend>
        <div className="buttons">
          {
            ReasonReact.array(
              data.models
              |> entries
              |> List.sort(compare)
              |> List.map(((name, modelData)) =>
                   <button
                     key=name
                     className={isSelected(name, data.model) ? "active" : ""}
                     onClick={_ => modelSelect(name, modelData)}>
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
            | Some(m) =>
              switch (get(m, data.modelCache)) {
              | Some(data) =>
                ReasonReact.array(
                  data->(x => x.shaders)->keys
                  |> List.fast_sort(compare)
                  |> List.map(key =>
                       <button key> {ReasonReact.string(key)} </button>
                     )
                  |> Array.of_list,
                )
              | None =>
                <button
                  key="no-shaders" className="span-all alert" disabled=true>
                  {
                    ReasonReact.string(
                      "Unable to find data for this model in the cache. Something's gone wrong somewhere.",
                    )
                  }
                </button>
              }
            | None =>
              <button className="span-all" disabled=true>
                {ReasonReact.string("Please select a model first")}
              </button>
            }
          }
        </div>
      </fieldset>
    </div>,
};
