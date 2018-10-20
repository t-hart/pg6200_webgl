let component = ReasonReact.statelessComponent("Controls");

let rec map = contents =>
  contents
  |> Array.map((x: Fieldset.t) => {
       open Fieldset;
       let (legend, content) =
         switch (x) {
         | Branch(b) => (b.legend, <div> {map(b.children)} </div>)
         | Leaf(l) => (
             l.legend,
             <div className="controls"> {l.content} </div>,
           )
         };
       <fieldset key=legend>
         <legend> {ReasonReact.string(legend)} </legend>
         content
       </fieldset>;
     })
  |> ReasonReact.array;

let make = (~contents, _children) => {
  ...component,
  render: _self => <div className="controls-grid"> {map(contents)} </div>,
};
