let registration = (f, event, handler) =>
  f(event, handler, Webapi.Dom.Document.asEventTarget(Webapi.Dom.document));

let addListener = registration(Webapi.Dom.EventTarget.addEventListener);

let removeListener = registration(Webapi.Dom.EventTarget.removeEventListener);

let addKeyboardListener = addListener("keypress");

let removeKeyboardListener = removeListener("keypress");

let value = event => event->ReactEvent.Form.target##value;
