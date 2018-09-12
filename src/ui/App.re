[@bs.module "../index"] external renderTo : string => unit = "";
[@bs.module "../objs"] external keys : array(string) = "";

let canvasId = "reCanvas";

let buttons =
  Array.map(
    text => <button key=text> (ReasonReact.string(text)) </button>,
    keys,
  );

let component = ReasonReact.statelessComponent("App");

let make = _children => {
  ...component,
  didMount: _self => renderTo(canvasId),
  render: self =>
    <div className="app">
      <div className="page-header">
        <h1> (ReasonReact.string("PG6200 graphics programming")) </h1>
      </div>
      <main>
        <div className="content">
          <canvas id=canvasId className="canvas" width="640" height="480" />
          <div className="buttons"> (ReasonReact.array(buttons)) </div>
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};
