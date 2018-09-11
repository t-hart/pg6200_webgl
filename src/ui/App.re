[@bs.module "../index"] external renderTo : string => unit = "";
[@bs.module "../objs"] external models : Js.Dict.t(string) = "default";
[@bs.module "../objs"] external keys : list(string) = "";

Js.log(models);
Js.log(keys);

let canvasId = "reCanvas";

let modelButton = text =>
  <button key=text> (ReasonReact.string(text)) </button>;
let buttons = Array.of_list(List.map(modelButton, keys));

Js.log(buttons);

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
          <div className="buttons">
            (ReasonReact.array(buttons))
            <button> (ReasonReact.string("Load me!")) </button>
            <button className="active">
              (ReasonReact.string("I am active!"))
            </button>
          </div>
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};
