let component = ReasonReact.statelessComponent("Footer");

let make = _children => {
  ...component,
  render: _self =>
    <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>,
};
