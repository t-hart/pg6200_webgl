[@bs.module "../index"] external renderTo : string => unit = "";
[@bs.module "../objs"] external bunny : unit => Js.Promise.t(string) = "";
let component = ReasonReact.statelessComponent("App");

let canvasId = "reCanvas";
let load = (promise, _event, _self) =>
  promise()
  |> Js.Promise.then_(x => {
       Js.log(x);
       Js.Promise.resolve(x);
     })
  |> ignore;
/* let render = renderTo(canvasId) */

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
            <button onClick=(self.handle(load(bunny)))>
              (ReasonReact.string("Load me!"))
            </button>
            <button className="active">
              (ReasonReact.string("I am active!"))
            </button>
          </div>
        </div>
      </main>
      <footer> <h3> (ReasonReact.string("Thomas Hartmann")) </h3> </footer>
    </div>,
};
