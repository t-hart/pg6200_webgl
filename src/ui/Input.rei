let keyDown:
  (StringMap.t((Camera.t, float) => Camera.t), Webapi.Dom.KeyboardEvent.t) =>
  option(StringMap.t((Camera.t, float) => Camera.t));

let keyUp:
  (StringMap.t((Camera.t, float) => Camera.t), Webapi.Dom.KeyboardEvent.t) =>
  option(StringMap.t((Camera.t, float) => Camera.t));
