open Types;
let component = ReasonReact.statelessComponent("Controls");

let map = contents =>
  contents
  |> Array.map(x =>
       <fieldset key={x.legend} disabled={x.disabled}>
         <legend> {ReasonReact.string(x.legend)} </legend>
         <div className="buttons"> {x.content} </div>
       </fieldset>
     )
  |> ReasonReact.array;

let make = (~contents: array(fieldset), _children) => {
  ...component,
  render: _self => <div className="button-grid"> {map(contents)} </div>,
};
