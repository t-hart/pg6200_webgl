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
        <legend> (ReasonReact.string("Models")) </legend>
        <div className="buttons">
          (
            ReasonReact.array(
              data.models
              |> entries
              |> List.sort(compare)
              |> List.map(((name, modelData)) =>
                   <button
                     key=name
                     className=(isSelected(name, data.model) ? "active" : "")
                     onClick=(_ => modelSelect(name, modelData))>
                     (ReasonReact.string(name))
                   </button>
                 )
              |> Array.of_list,
            )
          )
        </div>
      </fieldset>
      <fieldset disabled=(data.model === None)>
        <legend> (ReasonReact.string("Shaders")) </legend>
        <div className="buttons">
          (
            switch (data.model) {
            | None =>
              <button className="span-all" disabled=true>
                (ReasonReact.string("Please select a model first"))
              </button>
            | Some(m) =>
              ReasonReact.array(
                Option.default(
                  Array.of_list([
                    <button
                      key="unique" className="span-all alert" disabled=true>
                      (ReasonReact.string("This model has no shaders"))
                    </button>,
                  ]),
                  m
                  |> get(data.modelCache)
                  |> Option.map(x => x.shaders)
                  |> Option.map(keys)
                  |> Option.map(List.fast_sort(compare))
                  |> Option.map(
                       List.map(key =>
                         <button key> (ReasonReact.string(key)) </button>
                       ),
                     )
                  |> Option.map(Array.of_list),
                ),
              )
            }
          )
        </div>
      </fieldset>
    </div>,
};
