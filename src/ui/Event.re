let registration = (f, handler) =>
  f(handler, Webapi.Dom.Document.asEventTarget(Webapi.Dom.document));

let addKeyboardListener =
  registration(Webapi.Dom.EventTarget.addKeyDownEventListener);

let removeKeyboardListener =
  registration(Webapi.Dom.EventTarget.removeKeyDownEventListener);

let value = event => event->ReactEvent.Form.target##value;
