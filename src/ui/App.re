let canvasId = "reCanvas";
let component = ReasonReact.statelessComponent("App");

let make = _children => {
  ...component,
  render: _ =>
    <div className="app">
      <div className="page-header">
        <h1> {ReasonReact.string("PG6200 graphics programming")} </h1>
      </div>
      <main> <MainContent canvasId /> </main>
      <footer> <h3> {ReasonReact.string("Thomas Hartmann")} </h3> </footer>
    </div>,
};
