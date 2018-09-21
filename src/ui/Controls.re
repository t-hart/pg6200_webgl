let component = ReasonReact.statelessComponent("Controls");

let make = (~models, ~shaders, ~disableShaders, _children) => {
  ...component,
  render: _self =>
    <div className="button-grid">
      <fieldset>
        <legend> {ReasonReact.string("Models")} </legend>
        <div className="buttons"> models </div>
      </fieldset>
      <fieldset disabled=disableShaders>
        <legend> {ReasonReact.string("Shaders")} </legend>
        <div className="buttons"> shaders </div>
      </fieldset>
    </div>,
};
