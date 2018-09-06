[@bs.module "../index"] external renderTo : string => unit = "renderTo";
let component = ReasonReact.statelessComponent("App");

let canvasId = "reCanvas";

let make = _children => {
  ...component,
  didMount: _self => renderTo(canvasId),
  render: _self =>
    <div className="app">
      <div className="page-header">
        <h1> (ReasonReact.string("PG6200 graphics programming")) </h1>
      </div>
      <main>
        <div className="content">
          <canvas id=canvasId className="canvas" width="640" height="480" />
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};