let component = ReasonReact.statelessComponent("SpanButton");

let make = (~text, ~className, ~onClick, _children) => {
  ...component,
  render: _self =>
    <button className onClick>
      <span className="button-span"> {ReasonReact.string(text)} </span>
    </button>,
};
